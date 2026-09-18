"""Pega sobre el PNG de la tarjeta un QR con módulos de un número ENTERO de
píxeles. Si el módulo cae en 9,79 px, unos salen de 9 y otros de 10, y el
lector falla justo al reducir la imagen. En el PDF no hace falta: ahí el QR
va en vectorial y lo rasteriza la impresora."""
import json, qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image

URL = "https://tommyrg04.github.io/Para-ti/emil/nosotros/"
import sys
SAL = sys.argv[1] if len(sys.argv) > 1 else "qr-tarjeta"
caja = json.load(open("caja-qr.json"))

qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=0, box_size=1)
qr.add_data(URL); qr.make(fit=True)
n = qr.modules_count
modulo = caja["w"] // n                      # px enteros por módulo
lado = modulo * n

img = qr.make_image(fill_color=(14, 12, 10), back_color=(255, 255, 255)).convert("RGB")
img = img.resize((lado, lado), Image.NEAREST)

tarjeta = Image.open(SAL + ".png").convert("RGB")
# se centra en el hueco: el sobrante se suma a la zona tranquila, que ya es blanca
off = (caja["x"] + (caja["w"] - lado) // 2, caja["y"] + (caja["h"] - lado) // 2)
tarjeta.paste(img, off)
tarjeta.save(SAL + ".png")

mm = lado / (tarjeta.width / 55)
print(f"módulos: {n}x{n} | módulo: {modulo} px exactos ({mm/n:.3f} mm) | QR: {lado} px = {mm:.1f} mm")
print(f"tarjeta: {tarjeta.width}x{tarjeta.height} px (55x80 mm a 300 ppp)")
