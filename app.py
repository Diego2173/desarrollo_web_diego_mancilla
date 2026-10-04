from flask import Flask, abort, jsonify, request, render_template, redirect, url_for, session

from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import random
import hashlib
import filetype
import os
import uuid


from utils import validation as val
from database import db

UPLOAD_FOLDER = "static/uploads"

app = Flask(__name__)
app.secret_key = "secret_key"   
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 200 * 1024 * 1024

"""
Consider that the fields are:
VOLUNTARIOS   = ["name", "lastname", "email", "phone_code", "phone", "region", "comuna", "address"]
AVISTAMIENTOS = ["voluntario", "ave", "bird_name", "region", "comuna", "address", "date", "time", "description"]
"""

# -%-%-%- Portada -%-%-%-
@app.route("/")
def ave_del_dia(today=None):
    if today is None datetime.now().date() else today
    
    seed     = today.year * 10000 + today.month * 100 + today.day
    position = random.Random(seed).randint(1, db.count_aves_con_registro())
    ave      = db.get_ave_con_registro(position)
    
    if ave is None:
        return None
    return {"ave": ave, "registro": db.get_registro_reciente_de_ave(ave.id)}

def last_avistamientos(n=2):
    return db.get_last_avistamientos(n)

def index_last_avistamientos():
    return render_template("index.html", 
                           last=last_avistamientos(2), 
                           ave_dia=ave_del_dia(),
                           ok=request.args.get("ok")
                           )
    
# -%-%-%- API JSON para comunas -%-%-%-
@app.route("/api/comunas/<int:rid>")
def api_comunas(rid):
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in db.get_comunas(rid)])
 
# -%-%-%- VOLUNTARIO -%-%-%-
@app.route("/voluntarios", methods=["GET", "POST"])
def new_voluntario():
    if request.method == "GET":
        return render_template("form/form_voluntarios.html",
                               regiones=db.get_regiones(),
                               errores={},
                               datos={}
                               )
 
    form    = request.form
    errores = {}
 
    if not val.validate_field(form.get("name"), val.TEXT_RE, 2, 32):
        errores["name"] = "Nombre inválido (2–32 letras)."
        
    if not val.validate_field(form.get("lastname"), val.TEXT_RE, 2, 32):
        errores["lastname"] = "Apellido inválido (2–32 letras)."
        
    if not val.validate_field(form.get("email"), val.EMAIL_RE, 10, 64):
        errores["email"] = "Email inválido (10–64 caracteres)."
        
    if not val.validate_type(form.get("select-phone-code")):
        errores["select-phone-code"] = "Selecciona un código telefónico."
    if not val.validate_field(form.get("phone"), val.PHONE_RE, 8, 15):
        errores["phone"] = "Teléfono inválido (8–15 dígitos)."
        
    if not val.validate_type(form.get("select-region")):
        errores["select-region"] = "Selecciona una región."
    if not val.validate_type(form.get("select-comuna")):
        errores["select-comuna"] = "Selecciona una comuna."
    if not val.validate_field(form.get("address"), val.ADDR_RE, 1, 100):
        errores["address"] = "Dirección inválida (1–100 caracteres)."
 
    telefono = f"{form.get('select-phone-code','')} {form.get('phone','').strip()}".strip()

    if errores:
        return render_template("form/form_voluntarios.html",
                               regiones=db.get_regiones(),
                               errores=errores, 
                               datos=form
                               ), 400
 
    nombre = f"{form['name'].strip()} {form['lastname'].strip()}"
    vid = db.create_voluntario(nombre, form["email"].strip(), telefono, int(form["select-comuna"]))
    if vid is None:
        return render_template("form/form_voluntarios.html",
                               regiones=db.get_regiones(),
                               errores={"db": "Error al guardar en la BD. Intenta de nuevo."},
                               datos=form
                               ), 500
 
    return redirect(url_for("voluntario_exito", vid=vid))
 
@app.route("/voluntarios/<int:vid>/exito")
def voluntario_exito(vid):
    v = db.get_voluntario(vid)
    if v is None:
        abort(404)
    return render_template("successful/successfulRegistrationVoluntarios.html", voluntario=v)
 
# -%-%-%- AVISTAMIENTO -%-%-%-
@app.route("/avistamientos/nuevo", methods=["GET", "POST"])
def new_avistamiento():
    if request.method == "GET":
        return render_template("form/form_aves.html",
                               regiones=db.get_regiones(),
                               aves=db.get_aves(),
                               voluntarios=db.get_voluntarios(),
                               preseleccion=request.args.get("voluntario_id"),
                               errores={}, 
                               datos={}
                               )
 
    form    = request.form
    files   = [f for f in request.files.getlist("file") if f and f.filename]
    errores = {}
 
    if not val.validate_type(form.get("voluntario_id")):
        errores["voluntario_id"] = "Selecciona un voluntario."
        
    if not val.validate_type(form.get("ave_id")):
        errores["ave_id"] = "Selecciona un ave."
        
    if not val.validate_type(form.get("select-region")):
        errores["select-region"] = "Selecciona una región."
    if not val.validate_type(form.get("select-comuna")):
        errores["select-comuna"] = "Selecciona una comuna."
    if not val.validate_field(form.get("address"), val.ADDR_RE, 1, 100):
        errores["address"] = "Dirección inválida (1–100)."
        
    if not val.validate_date(form.get("date"), form.get("time")):
        errores["date"] = "Fecha u hora inválida (no futura, no mayor a 5 años)."
        
    if not val.validate_files(files):
        errores["file"] = "Adjunta al menos un archivo válido (imagen o video, ≤ 20 MB, máx. 10)."
        
    if not val.validate_field(form.get("description"), val.ADDR_RE, 0, 500, allow_empty=True):
        errores["description"] = "Descripción inválida (máx. 500)."
 
    if errores:
        return render_template("form/form_aves.html",
                               regiones=db.get_regiones(),
                               aves=db.get_aves(),
                               voluntarios=db.get_voluntarios(),
                               preseleccion=form.get("voluntario_id"),
                               errores=errores, 
                               datos=form
                               ), 400
 
    # Verificar FKs (TEC-5)
    try:
        voluntario_id = int(form["voluntario_id"])
        ave_id        = int(form["ave_id"])
        region_id     = int(form["select-region"])
        comuna_id     = int(form["select-comuna"])
    except (ValueError, TypeError):
        return redirect(url_for("new_avistamiento"))
 
    if db.get_voluntario(voluntario_id) is None:
        return render_template("form/form_aves.html",
                               regiones=db.get_regiones(), aves=db.get_aves(),
                               voluntarios=db.get_voluntarios(),
                               errores={"voluntario_id": "Voluntario no existe."},
                               datos=form), 400
 
    ave = next((a for a in db.get_aves() if a.id == ave_id), None)
    if ave is None:
        return render_template("form/form_aves.html",
                               regiones=db.get_regiones(), aves=db.get_aves(),
                               voluntarios=db.get_voluntarios(),
                               errores={"ave_id": "Ave no existe."},
                               datos=form), 400
 
    comuna = next((c for c in db.get_comunas(region_id) if c.id == comuna_id), None)
    if comuna is None:
        return render_template("form/form_aves.html",
                               regiones=db.get_regiones(), aves=db.get_aves(),
                               voluntarios=db.get_voluntarios(),
                               errores={"select-comuna": "Comuna no válida."},
                               datos=form), 400
 
    region = next(r for r in db.get_regiones() if r.id == region_id)
    lugar  = f"{form['address'].strip()}, {comuna.nombre}, {region.nombre}"
    if len(lugar) > 200:
        lugar = lugar[:200]
 
    fecha_hora = datetime.strptime(f"{form['date']} {form['time']}", "%Y-%m-%d %H:%M")
 
    aid = db.create_avistamiento(
        voluntario_id, ave_id, fecha_hora, lugar,
        form.get("description", "").strip() or None)
    if aid is None:
        abort(500)
 
    # Guardar archivos con nombre seguro + uuid
    for f in files:
        guess = filetype.guess(f)
        f.stream.seek(0)
        ext   = guess.extension if guess else "bin"
        safe  = secure_filename(f.filename)
        nuevo = f"{hashlib.sha256(safe.encode()).hexdigest()[:16]}_{uuid.uuid4().hex}.{ext}"
        f.save(os.path.join(app.config["UPLOAD_FOLDER"], nuevo))
        db.create_registro(aid, f"uploads/{nuevo}", safe)
 
    return redirect(url_for("avistamiento_exito", aid=aid))
 
@app.route("/avistamiento/<int:vid>/exito")
def avistamiento_exito(aid):
    a = db.get_aves(aid)
    if aid is None:
        abort(404)
    return render_template("successful/successfulRegistrationAves.html", aves=a)

# -%-%-%- LISTADO -%-%-%-
PER_PAGE = 5
 
@app.route("/avistamientos")
def listado():
    try:
        page = max(1, int(request.args.get("page", 1)))
    except ValueError:
        page = 1
    
    total = db.count_avistamientos()
    total_pages = max(1, (total + PER_PAGE - 1) // PER_PAGE)
    if page > total_pages:
        page = total_pages
    avistamientos = db.get_avistamientos_paginados(page, PER_PAGE)
    return render_template("listadoAves/listadoAves.html",
                           avistamientos=avistamientos,
                           page=page, 
                           total_pages=total_pages
                           )
 
@app.route("/avistamientos/<int:aid>")
def detalle(aid):
    a = db.get_avistamiento(aid)
    if a is None:
        abort(404)
    page = max(1, request.args.get("page", 1, type=int))
    return render_template("listadoAves/detalle.html", a=a, page=page)
 
@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas/estadisticas.html")
 
if __name__ == "__main__": 
    app.run(debug=True)