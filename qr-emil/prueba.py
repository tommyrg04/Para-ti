import cv2, numpy as np
ESPERADO = "https://tommyrg04.github.io/Para-ti/emil/nosotros/"

import sys
SAL = sys.argv[1] if len(sys.argv) > 1 else "qr-tarjeta"
img = cv2.imread(SAL + ".png", cv2.IMREAD_COLOR)
print("PNG:", img.shape[1], "x", img.shape[0], "px  (55x80 mm a 300 ppp)")

def leer(m):
    ok, t, _, _ = cv2.QRCodeDetector().detectAndDecodeMulti(m)
    return bool(ok) and len(t) > 0 and t[0] == ESPERADO

print("\n1) PNG tal cual            :", leer(img))

print("\n2) simulando una foto con el móvil (desenfoque + ruido + JPEG):")
for ancho in (1000, 700, 500, 380, 300, 240):
    alto = round(ancho * img.shape[0] / img.shape[1])
    m = cv2.resize(img, (ancho, alto), interpolation=cv2.INTER_AREA)
    m = cv2.GaussianBlur(m, (3, 3), 0.8)                       # enfoque imperfecto
    ruido = np.random.default_rng(3).normal(0, 4, m.shape)
    m = np.clip(m.astype(np.float32) + ruido, 0, 255).astype(np.uint8)
    _, buf = cv2.imencode(".jpg", m, [cv2.IMWRITE_JPEG_QUALITY, 72])
    m = cv2.imdecode(buf, cv2.IMREAD_COLOR)
    px_mod = (ancho * 34 / 55) / 41
    print(f"   tarjeta a {ancho:4d} px de ancho  ->  {px_mod:4.1f} px por módulo  ->  lee: {leer(m)}")

print("\n3) impresa aún más pequeña (se recorta la tarjeta a otro tamaño físico):")
for mm in (55, 45, 38, 32, 28):
    # a 300 ppp reales de impresión, cuántos px tendría el módulo
    px_mod_300 = (mm * 34 / 55) / 41 * (300 / 25.4)
    ancho = round(mm * 300 / 25.4)
    m = cv2.resize(img, (ancho, round(ancho * img.shape[0] / img.shape[1])), interpolation=cv2.INTER_AREA)
    m = cv2.GaussianBlur(m, (3, 3), 0.9)
    print(f"   tarjeta de {mm} mm -> módulo {mm*34/55/41:.2f} mm ({px_mod_300:.1f} px a 300 ppp) -> lee: {leer(m)}")
