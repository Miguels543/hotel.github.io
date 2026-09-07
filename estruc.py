"""
Muestra el árbol de carpetas y archivos de un proyecto.
Uso: python estructura_proyecto.py [ruta]
Si no pasas ruta, usa la carpeta actual.
"""
import os
import sys

IGNORAR = {".git", "node_modules", "__pycache__", ".vscode"}


def imprimir_arbol(ruta, prefijo=""):
    try:
        elementos = sorted(os.listdir(ruta))
    except PermissionError:
        return

    elementos = [e for e in elementos if e not in IGNORAR]

    for i, nombre in enumerate(elementos):
        es_ultimo = (i == len(elementos) - 1)
        ruta_completa = os.path.join(ruta, nombre)
        conector = "└── " if es_ultimo else "├── "
        print(prefijo + conector + nombre)

        if os.path.isdir(ruta_completa):
            extension = "    " if es_ultimo else "│   "
            imprimir_arbol(ruta_completa, prefijo + extension)


if __name__ == "__main__":
    ruta_base = sys.argv[1] if len(sys.argv) > 1 else "."
    print(os.path.basename(os.path.abspath(ruta_base)) + "/")
    imprimir_arbol(ruta_base)