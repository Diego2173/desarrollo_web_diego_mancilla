import pymysql
from db import Base, engine

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

conn = pymysql.connect(
    host="localhost", user="cc5002", password="programacionweb",
    database="tarea2", charset="utf8mb4"
)

def execute_file(route):
    with open(route, encoding="utf-8") as f:
        sentences = [s.strip() for s in f.read().split(";") if s.strip()]
    with conn.cursor() as cur:
        for s in sentences:
            cur.execute(s)
    conn.commit()

execute_file("database/region-comuna.sql")
execute_file("database/aves.sql")
conn.close()