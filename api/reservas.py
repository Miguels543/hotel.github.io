"""
Endpoint: /api/reservas
GET  -> lista las reservas
POST -> crea una nueva reserva
"""
from http.server import BaseHTTPRequestHandler
import json
from _db import get_connection


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, huesped_nombre, habitacion_id,
                           fecha_entrada, fecha_salida, estado
                    FROM reservas
                    ORDER BY fecha_entrada DESC
                """)
                reservas = cur.fetchall()
            self._responder(200, reservas)
        except Exception as e:
            self._responder(500, {"error": str(e)})
        finally:
            conn.close()

    def do_POST(self):
        largo = int(self.headers.get("Content-Length", 0))
        cuerpo = json.loads(self.rfile.read(largo) or "{}")

        requeridos = ["huesped_nombre", "habitacion_id", "fecha_entrada", "fecha_salida"]
        faltantes = [campo for campo in requeridos if campo not in cuerpo]
        if faltantes:
            self._responder(400, {"error": f"Faltan campos: {', '.join(faltantes)}"})
            return

        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO reservas (huesped_nombre, habitacion_id, fecha_entrada, fecha_salida, estado)
                    VALUES (%s, %s, %s, %s, 'pendiente')
                    RETURNING id
                """, (
                    cuerpo["huesped_nombre"],
                    cuerpo["habitacion_id"],
                    cuerpo["fecha_entrada"],
                    cuerpo["fecha_salida"],
                ))
                nueva_id = cur.fetchone()["id"]
                conn.commit()
            self._responder(201, {"id": nueva_id, "mensaje": "Reserva creada"})
        except Exception as e:
            conn.rollback()
            self._responder(500, {"error": str(e)})
        finally:
            conn.close()

    def _responder(self, status, data):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode())
