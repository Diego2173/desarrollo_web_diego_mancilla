from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Text, func, distinct, or_
from sqlalchemy.orm import sessionmaker, declarative_base, relationship,  joinedload, selectinload

DB_HOST = "localhost"
DB_PORT = 3306
DB_NAME = "tarea2"
DB_USER = "cc5002"
DB_PASS = "programacionweb"

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

EXTENSION_VIDEO = ("mp4", "mov")

# --- Models ---
# Model for Region:
class Region(Base):
    __tablename__ = "region"
    id     = Column(Integer, primary_key=True, autoincrement=True)
    nombre  = Column(String(200), nullable=False)
    comunas = relationship("Comuna", back_populates="region")

# Model for Comuna:
class Comuna(Base):
    __tablename__ = "comuna"
    id          = Column(Integer, primary_key=True, autoincrement=True)
    nombre      = Column(String(200), nullable=False)
    region_id   = Column(Integer, ForeignKey("region.id"), nullable=False)
    region      = relationship("Region", back_populates="comunas")
    voluntarios = relationship("Voluntario", back_populates="comuna")

# Model for Voluntario:
class Voluntario(Base):
    __tablename__ = "voluntario"
    id             = Column(Integer, primary_key=True, autoincrement=True)
    nombre         = Column(String(255), nullable=False)
    email          = Column(String(80),  nullable=False)
    telefono       = Column(String(15),  nullable=False)
    fecha_registro = Column(DateTime,    nullable=False)
    comuna_id      = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    comuna         = relationship("Comuna", back_populates="voluntarios")
    avistamientos  = relationship("Avistamiento", back_populates="voluntario")


# Model for Ave:
class Ave(Base):
    __tablename__ = "ave"
    id            = Column(Integer, primary_key=True, autoincrement=True)
    nombre        = Column(String(80), nullable=False)
    avistamientos = relationship("Avistamiento", back_populates="ave")


# Model for Avistamiento:
class Avistamiento(Base):
    __tablename__ = "avistamiento"
    id            = Column(Integer, primary_key=True, autoincrement=True)
    voluntario_id = Column(Integer, ForeignKey("voluntario.id"), nullable=False)
    ave_id        = Column(Integer, ForeignKey("ave.id"),  nullable=False)
    fecha_hora    = Column(DateTime, nullable=False)
    lugar         = Column(String(200), nullable=False)
    descripcion   = Column(Text(500), nullable=True)
    voluntario    = relationship("Voluntario", back_populates="avistamientos")
    ave           = relationship("Ave", back_populates="avistamientos")
    registros     = relationship("Registro", back_populates="avistamiento")


# Model for Registro:
class Registro(Base):
    __tablename__ = "registro"
    id              = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo    = Column(String(300), nullable=False)
    nombre_archivo  = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey("avistamiento.id"), nullable=False)
    avistamiento    = relationship("Avistamiento", back_populates="registros")

    @property
    def es_video(self):
        return self.ruta_archivo.lower().rsplit(".", 1)[-1] in ("mp4", "mov")

# --- Database Functions ---
# ------ get Functions ------
def get_regiones():
    session = SessionLocal()
    try:
        return session.query(Region).order_by(Region.nombre).all()
    finally:
        session.close()

def get_comunas(region_id):
    session = SessionLocal()
    try:
        return (session.query(Comuna)
                       .filter(Comuna.region_id == region_id)
                       .order_by(Comuna.nombre).all())
    finally:
        session.close()

def get_aves():
    session = SessionLocal()
    try:
        return session.query(Ave).order_by(Ave.nombre).all()
    finally:
        session.close()

def get_voluntarios():
    session = SessionLocal()
    try:
        return session.query(Voluntario).order_by(Voluntario.nombre).all()
    finally:
        session.close()

def get_voluntario(id_):
    session = SessionLocal()
    try:
        return session.get(Voluntario, id_)
    finally:
        session.close()

# ------ create Functions ------
def create_voluntario(nombre, email, telefono, comuna_id):
    session = SessionLocal()
    try:
        v = Voluntario(nombre=nombre, email=email, telefono=telefono,
                       comuna_id=comuna_id, fecha_registro=datetime.now())
        session.add(v)
        session.commit()
        session.refresh(v)
        return v.id
    except Exception:
        session.rollback()
        return None
    finally:
        session.close()

def create_avistamiento(voluntario_id, ave_id, fecha_hora, lugar, descripcion):
    session = SessionLocal()
    try:
        a = Avistamiento(voluntario_id=voluntario_id, ave_id=ave_id,
                         fecha_hora=fecha_hora, lugar=lugar,
                         descripcion=descripcion or None)
        session.add(a)
        session.commit()
        session.refresh(a)
        return a.id
    except Exception:
        session.rollback()
        return None
    finally:
        session.close()

def create_registro(avistamiento_id, ruta_archivo, nombre_archivo):
    session = SessionLocal()
    try:
        r = Registro(avistamiento_id=avistamiento_id,
                     ruta_archivo=ruta_archivo,
                     nombre_archivo=nombre_archivo)
        session.add(r)
        session.commit()
        return True
    except Exception:
        session.rollback()
        return False
    finally:
        session.close()

# ------ Functions for data displaying -----

def _con_relaciones(query):
    return query.options(joinedload(Avistamiento.ave),
                         joinedload(Avistamiento.voluntario),
                         selectinload(Avistamiento.registros))

def get_last_avistamientos(n=2):
    session = SessionLocal()
    try:
        return (_con_relaciones(session.query(Avistamiento))
                .order_by(Avistamiento.id.desc())
                .limit(n).all())
    finally:
        session.close()

ORDEN_COLUMNAS = {"fecha": Avistamiento.fecha_hora,
                  "lugar": Avistamiento.lugar,
                  "ave":   Ave.nombre}

def count_avistamientos(ave_id=None):
    session = SessionLocal()
    try:
        q = session.query(Avistamiento)
        if ave_id:
            q = q.filter(Avistamiento.ave_id == ave_id)
        return q.count()
    finally:
        session.close()

def get_avistamientos_paginados(page=1, per_page=5, ave_id=None, orden="fecha", direccion="desc"):
    offset = (page - 1) * per_page
    session = SessionLocal()
    try:
        q = _con_relaciones(session.query(Avistamiento))
        if ave_id:
            q = q.filter(Avistamiento.ave_id == ave_id)
        if orden == "ave":
            q = q.join(Ave, Avistamiento.ave_id == Ave.id)
        col = ORDEN_COLUMNAS[orden]
        col = col.asc() if direccion == "asc" else col.desc()
        return (q.order_by(col, Avistamiento.id.desc())
                 .limit(per_page).offset(offset).all())
    finally:
        session.close()

def get_avistamiento(id_):
    session = SessionLocal()
    try:
        return (_con_relaciones(session.query(Avistamiento))
                .filter(Avistamiento.id == id_).one_or_none())

    finally:
        session.close()
        
# ------ Ave del día ------
# Note that aves_con_registro gets an ave that has at least a file asociated
def count_aves_con_registro():
    session = SessionLocal()
    try:
        return (session.query(func.count(distinct(Ave.id)))
                .join(Avistamiento, Avistamiento.ave_id == Ave.id)
                .join(Registro, Registro.avistamiento_id == Avistamiento.id)
                .scalar())
    finally:
        session.close()

# Ave with position k in 1 to n aves obtained by the ordering of aves_con_registro by name 
def get_ave_con_registro(position):
    session = SessionLocal()
    try:
        return (session.query(Ave)
                .join(Avistamiento, Avistamiento.ave_id == Ave.id)
                .join(Registro, Registro.avistamiento_id == Avistamiento.id)
                .distinct()
                .order_by(Ave.nombre, Ave.id)
                .offset(position - 1).limit(1)
                .first())
    finally:
        session.close()

# Gets newer register
def get_registro_reciente_de_ave(ave_id):
    session = SessionLocal()
    try:
        base = (session.query(Registro)
                .join(Avistamiento, Registro.avistamiento_id == Avistamiento.id)
                .filter(Avistamiento.ave_id == ave_id))
        is_video = or_(*[Registro.ruta_archivo.ilike(f"%.{e}") for e in EXTENSION_VIDEO])
        foto = base.filter(~is_video).order_by(Registro.id.desc()).first()
        return foto or base.order_by(Registro.id.desc()).first()
    finally:
        session.close()