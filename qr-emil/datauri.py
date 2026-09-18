"""Genera el QR como bitmap de módulos exactos y lo incrusta en tarjeta.html.

Va primero en la cadena. El QR NO se dibuja con vectores: al medir 35 mm entre
41 módulos, cada módulo cae en 0,854 mm y el rasterizador redondea unos bordes
a un píxel y otros a otro. Con el bitmap el grid es exacto y el PDF se lee
igual a 150, 300, 600 y 1200 ppp.
"""
import base64, io, re, qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image

URL = "https://tommyrg04.github.io/Para-ti/emil/nosotros/"
MODULO = 24                      # px por módulo dentro del bitmap incrustado

qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=0, box_size=1)
qr.add_data(URL); qr.make(fit=True)
n = qr.modules_count
img = (qr.make_image(fill_color=(14, 12, 10), back_color=(255, 255, 255))
         .convert("RGB").resize((n*MODULO, n*MODULO), Image.NEAREST))

buf = io.BytesIO(); img.save(buf, "PNG", optimize=True)
uri = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

html = open("tarjeta.html", encoding="utf-8").read()
html, cambios = re.subn(r'(<img id="q1" alt="QR" src=")[^"]*(")', lambda m: m.group(1) + uri + m.group(2), html)
assert cambios == 1, f"esperaba un solo <img id=q1>, encontré {cambios}"
open("tarjeta.html", "w", encoding="utf-8").write(html)

print(f"QR v{qr.version}, {n}x{n} módulos, corrección H -> {img.width}px incrustados ({len(uri)/1024:.0f} KB)")
