from flask import Flask, abort, jsonify, request, render_template, redirect, url_for, session
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

import os, random, hashlib, filetype, uuid

from utils import validation as val
from database import db

app = Flask(__name__)
app.secret_key = "secret_key"   
app.config["UPLOAD_FOLDER"] = os.path.join(app.root_path, "static", "uploads")
app.config["MAX_CONTENT_LENGTH"] = 200 * 1024 * 1024


# -%-%-%- Sesión del voluntario -%-%-%-
# En la cookie solo se guarda el id del voluntario ("voluntario_id"); el resto se lee de la BD.
@app.context_processor
def inject_voluntario_actual():
    vid = session.get("voluntario_id")
    if vid is None:
        return {"voluntario_actual": None}
    v = db.get_voluntario(vid)
    if v is None:                       # el voluntario ya no existe en la BD
        session.pop("voluntario_id", None)
    return {"voluntario_actual": v}

@app.route("/olvidar")
def olvidar():
    session.pop("voluntario_id", None)
    return redirect(url_for("index"))

# -%-%-%- Portada -%-%-%-
def ave_del_dia(today=None):
    
    today = today or datetime.now().date()
    n     = db.count_aves_con_registro()
    if not n:
        return None
    
    seed     = today.year * 10000 + today.month * 100 + today.day
    position = random.Random(seed).randint(1, n) if n > 0 else None
    ave      = db.get_ave_con_registro(position)
    
    if ave is None:
        return None
    return {"ave": ave, "registro": db.get_registro_reciente_de_ave(ave.id)}
 
def last_avistamientos(n=2):
    return db.get_last_avistamientos(n)
 
@app.route("/")
def index():
    return render_template("index.html", 
                           last=last_avistamientos(2), 
                           ave_dia=ave_del_dia(),
                           ok=request.args.get("ok")
                           )
    
# -%-%-%- API JSON para comunas -%-%-%-
@app.route("/api/comunas/<int:rid>")
def api_comunas(rid):
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in db.get_comuna(rid)])
 
# -%-%-%- VOLUNTARIO -%-%-%-
# -------- GET --------
@app.route("/voluntarios", methods=["GET"])
def new_voluntario():
    return render_template("form/form_voluntarios.html",
                           regiones = db.get_region(),
                           errores = {}, datos = {}
                           )
 
# -------- POST --------
@app.route("/voluntarios", methods=["POST"])
def create_voluntario():
    form    = request.form
    errores = {}
    
    name = form.get("name")
    if not val.validate_field(name, val.TEXT_RE, 2, 32):
        errores["name"] = "Nombre inválido (2–32 letras)."
        
    lastname = form.get("lastname")
    if not val.validate_field(lastname, val.TEXT_RE, 2, 32):
        errores["lastname"] = "Apellido inválido (2–32 letras)."
    
    email = form.get("email")
    if not val.validate_field(email, val.EMAIL_RE, 10, 64):
        errores["email"] = "Email inválido (10–64 caracteres)."
    
    phone_code   = form.get("select-phone-code")
    phone_number = form.get("phone")
    if not val.validate_type(phone_code):
        errores["select-phone-code"] = "Selecciona un código telefónico."
    if not val.validate_field(phone_number, val.PHONE_RE, 8, 15):
        errores["phone"] = "Teléfono inválido (8–15 dígitos)."
    elif "select-phone-code" not in errores and not val.validate_phone_total(phone_code, phone_number):
        errores["phone"] = "Código y número juntos no pueden superar los 15 caracteres."
    
    region = form.get("select-region")
    comuna = form.get("select-comuna")
    address = form.get("address")
    if not val.validate_type(region):
        errores["select-region"] = "Selecciona una región."
    if not val.validate_type(comuna):
        errores["select-comuna"] = "Selecciona una comuna."
    if not val.validate_field(address, val.ADDR_RE, 1, 100):
        errores["address"] = "Dirección inválida (1–100 caracteres)."
 
    if errores:
        return render_template("form/form_voluntarios.html",
                               regiones = db.get_region(),
                               errores = errores, datos = form
                               ), 400
 
    full_name = f"{name.strip()} {lastname.strip()}"
    email     = email.strip()
    phone     = f"{phone_code.strip()} {phone_number.strip()}"
    comuna_id = int(form["select-comuna"])
    
    vid = db.create_voluntario(full_name, email, phone, comuna_id)
    if vid is None:
        return render_template("form/form_voluntarios.html",
                               regiones=db.get_region(),
                               errores={"db": "Error al guardar en la BD. Intenta de nuevo."}, datos=form
                               ), 500
    
    # Recordar a voluntario (recién ingresado)
    session["voluntario_id"] = vid
    session.permanent = True
    return redirect(url_for("voluntario_exito", vid=vid))
 
@app.route("/voluntarios/<int:vid>/exito")
def voluntario_exito(vid):
    v = db.get_voluntario(vid)
    if v is None:
        abort(404)
    return render_template("successful/successfulRegistrationVoluntarios.html", voluntario=v)
 
# -%-%-%- AVISTAMIENTO -%-%-%-
# -------- GET --------
@app.route("/avistamientos/nuevo", methods=["GET"])
def new_avistamiento():
    return render_template("form/form_aves.html",
                           regiones = db.get_region(), aves = db.get_ave(), voluntarios = db.get_voluntarios(),
                           preseleccion = request.args.get("voluntario_id") or session.get("voluntario_id"),
                           errores={}, datos={}
                           )
 
# -------- POST --------
@app.route("/avistamientos/nuevo", methods=["POST"])
def create_avistamiento():
    form    = request.form
    files   = [f for f in request.files.getlist("file") if f and f.filename]
    errores = {}
    
    voluntario_id = form.get("voluntario_id")
    if not val.validate_type(voluntario_id):
        errores["voluntario_id"] = "Selecciona un voluntario."
        
    ave_id = form.get("ave_id")
    if not val.validate_type(ave_id):
        errores["ave_id"] = "Selecciona un ave."
    
    region = form.get("select-region")
    comuna = form.get("select-comuna")
    address = form.get("address")
    if not val.validate_type(region):
        errores["select-region"] = "Selecciona una región."
    if not val.validate_type(comuna):
        errores["select-comuna"] = "Selecciona una comuna."
    if not val.validate_field(address, val.ADDR_RE, 1, 100):
        errores["address"] = "Dirección inválida (1–100 caracteres)."
    
    date = form.get("date")
    time = form.get("time")
    if not val.validate_date(date, time):
        errores["date"] = "Fecha u hora inválida (no futura, no mayor a 5 años)."
    
    if not val.validate_files(files):
        errores["file"] = "Adjunta al menos un archivo válido (imagen o video, ≤ 20 MB, máx. 10)."
    
    description = form.get("description")
    if not val.validate_field(description, val.ADDR_RE, 0, 500, allow_empty=True):
        errores["description"] = "Descripción inválida (máx. 500)."
 
    if errores:
        return render_template("form/form_aves.html",
                               regiones = db.get_region(), aves = db.get_ave(), voluntarios = db.get_voluntarios(),
                               preseleccion = form.get("voluntario_id"),
                               errores = errores, 
                               datos = form
                               ), 400
 
    # Verificar FKs
    try:
        voluntario_id = int(voluntario_id)
        ave_id        = int(ave_id)
        region_id     = int(region)
        comuna_id     = int(comuna)
    except (ValueError, TypeError):
        return redirect(url_for("new_avistamiento"))
 
    if db.get_voluntario(voluntario_id) is None:
        return render_template("form/form_aves.html",
                               regiones = db.get_region(), aves = db.get_ave(), voluntarios = db.get_voluntarios(),
                               errores = {"voluntario_id": "Voluntario no existe."},
                               datos = form), 400
 
    ave = next((a for a in db.get_ave() if a.id == ave_id), None)
    if ave is None:
        return render_template("form/form_aves.html",
                               regiones = db.get_region(), aves = db.get_ave(), voluntarios = db.get_voluntarios(),
                               errores = {"ave_id": "Ave no existe."},
                               datos = form), 400
 
    comuna = next((c for c in db.get_comuna(region_id) if c.id == comuna_id), None)
    if comuna is None:
        return render_template("form/form_aves.html",
                               regiones = db.get_region(), aves = db.get_ave(), voluntarios = db.get_voluntarios(),
                               errores = {"select-comuna": "Comuna no válida."},
                               datos = form), 400
 
    region = next(r for r in db.get_region() if r.id == region_id)
    lugar  = f"{form['address'].strip()}, {comuna.nombre}, {region.nombre}"
    if len(lugar) > 200:
        lugar = lugar[:200]
 
    fecha_hora = datetime.strptime(f"{form['date']} {form['time']}", "%Y-%m-%d %H:%M")
    
    description = form.get("description", "").strip() or None
    aid = db.create_avistamiento(voluntario_id, ave_id, fecha_hora, lugar, description)  
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
 
@app.route("/avistamiento/<int:aid>/exito")
def avistamiento_exito(aid):
    a = db.get_avistamiento(aid)
    if a is None:
        abort(404)
    return render_template("successful/successfulRegistrationAves.html", aves=a.ave)
 
# -%-%-%- Listado -%-%-%-
PER_PAGE = 5
 
def leer_params_listado():
    page      = max(1, request.args.get("page", 1, type=int))
    ave_id    = request.args.get("ave", type=int)
    orden     = request.args.get("orden", "fecha")
    direccion = request.args.get("dir", "desc")
    if orden not in db.ORDEN_COLUMNAS:
        orden = "fecha"
    if direccion not in ("asc", "desc"):
        direccion = "desc"
    return page, ave_id, orden, direccion
 
@app.route("/avistamientos")
def listado():
    page, ave_id, orden, direccion = leer_params_listado()
    total = db.count_avistamientos()
    total_pages = max(1, (total + PER_PAGE - 1) // PER_PAGE)
    if page > total_pages:
        page = total_pages
    avistamientos = db.get_avistamientos_paginados(page, PER_PAGE, ave_id, orden, direccion)
    return render_template("listadoAves/listadoAves.html",
                           avistamientos = avistamientos,
                           aves = db.get_ave(),
                           page = page,
                           total_pages = total_pages,
                           ave_id = ave_id,
                           orden = orden,
                           direccion = direccion
                           )
 
@app.route("/avistamientos/<int:aid>")
def detalle(aid):
    a = db.get_avistamiento(aid)
    if a is None:
        abort(404)
    page, ave_id, orden, direccion = leer_params_listado()
    return render_template("listadoAves/detalle.html",
                           a = a,
                           page = page, 
                           ave_id = ave_id,
                           orden = orden,
                           direccion = direccion
                           )
 
# -%-%-%- Comentarios -%-%-%-
# -------- GET --------
@app.route("/avistamientos/<int:aid>/comentarios", methods=["GET"])
def list_comentarios(aid):
    if db.get_avistamiento(aid) is None:
        return jsonify({"ok": False, "errores": {"avistamiento": "El avistamiento no existe."}}), 404
 
    return jsonify(
        [{"nombre": c.nombre,
          "texto":  c.texto,
          "fecha":  c.fecha.strftime("%d-%m-%Y %H:%M")
          }
          for c in db.get_comentario(aid)])
 
# -------- POST --------
@app.route("/avistamientos/<int:aid>/comentarios", methods=["POST"])
def create_comentario(aid):
    if db.get_avistamiento(aid) is None:
        return jsonify({"ok": False, "errores": {"avistamiento": "El avistamiento no existe."}}), 404
 
    nombre  = request.form.get("nombre")
    texto   = request.form.get("texto")
    errores = {}
    if not val.validate_field(nombre, val.COMMENT_NAME_RE, 3, 50):
        errores["nombre"] = "Nombre inválido (3–50 caracteres, una sola línea)."
    if not val.validate_field(texto, val.COMMENT_TEXT_RE, 5, 300):
        errores["texto"] = "Comentario inválido (5–300 caracteres)."
 
    if errores:
        return jsonify({"ok": False, "errores": errores}), 400
 
    cid = db.create_comentario(aid, nombre.strip(), texto.strip())
    if cid is None:
        return jsonify({"ok": False, "errores": {"db": "Error al guardar en la BD. Intenta de nuevo."}}), 500
 
    return jsonify({"ok": True})
 
 
@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas/estadisticas.html")

# Rutas para los indicadores
@app.route("/api/estadisticas/indicadores")
def api_indicadores():
    return jsonify({
        "voluntarios": db.count_voluntarios(),
        "avistamientos": db.count_avistamientos()
        })

# Rutas para los gráficos
@app.route("/api/estadisticas/avistamientos-por-dia")
def api_avistamientos_por_dia():
    return jsonify(
        [{"fecha": str(dia), "total": total} for dia, total in db.count_avistamientos_por_dia()]
        )
@app.route("/api/estadisticas/avistamientos-por-ave")
def api_avistamientos_por_ave():
    return jsonify(
        [{"ave": ave, "total": total} for ave, total in db.count_avistamientos_por_ave()]
        )
 
@app.route("/api/estadisticas/voluntarios-por-comuna")
def api_voluntarios_por_comuna():
    return jsonify(
        [{"comuna": comuna, "total": total} for comuna, total in db.count_voluntarios_por_comuna()]
        )
 
if __name__ == "__main__": 
    app.run(debug=True)