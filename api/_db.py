"""
Conexión reutilizable a la base de datos Postgres (Supabase/Neon).
Cada endpoint en /api la importa así:  from _db import get_connection
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def get_connection():
    """
    Abre una conexión nueva a Postgres usando la variable de entorno
    DATABASE_URL (la configuras en local en .env y en Vercel como
    variable de entorno del proyecto — nunca hardcodeada aquí).
    """
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("Falta la variable de entorno DATABASE_URL")

    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)
