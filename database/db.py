from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Text
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
    id             = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo   = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey("avistamiento.id"), nullable=False)
    avistamiento   = relationship("Avistamiento", back_populates="registros")

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
        
def count_avistamientos():
    session = SessionLocal()
    try:
        return session.query(Avistamiento).count()
    finally:
        session.close()

def get_avistamientos_paginados(page=1, per_page=5):
    offset = (page - 1) * per_page
    session = SessionLocal()
    try:
        return (_con_relaciones(session.query(Avistamiento))
                .order_by(Avistamiento.fecha_hora.desc(), Avistamiento.id.desc())
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