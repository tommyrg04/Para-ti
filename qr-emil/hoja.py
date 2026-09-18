"""Hoja A4 con 9 tarjetas y marcas de corte, a partir del PNG ya verificado."""
from PIL import Image, ImageDraw

PPP = 300
A4 = (round(210/25.4*PPP), round(297/25.4*PPP))     # 2480 x 3508
t = Image.open("qr-tarjeta.png").convert("RGB")
COLS, FILAS, HUECO = 3, 3, 46

hoja = Image.new("RGB", A4, "white")
d = ImageDraw.Draw(hoja)
mx = (A4[0] - COLS*t.width  - (COLS-1)*HUECO) // 2
my = (A4[1] - FILAS*t.height - (FILAS-1)*HUECO) // 2

for f in range(FILAS):
    for c in range(COLS):
        x = mx + c*(t.width + HUECO); y = my + f*(t.height + HUECO)
        hoja.paste(t, (x, y))
        # marcas de corte: cuatro esquinas, fuera de la tarjeta
        for ex, ey in ((x, y), (x+t.width, y), (x, y+t.height), (x+t.width, y+t.height)):
            sx = -1 if ex == x else 1
            sy = -1 if ey == y else 1
            d.line([(ex + sx*8, ey), (ex + sx*26, ey)], fill=(150,150,150), width=2)
            d.line([(ex, ey + sy*8), (ex, ey + sy*26)], fill=(150,150,150), width=2)

hoja.save("qr-hoja-a4.png", optimize=True)
hoja.save("qr-hoja-a4.pdf", resolution=PPP)
print(f"hoja A4 {A4[0]}x{A4[1]} px con {COLS*FILAS} tarjetas de 55x80 mm, margen {mx/PPP*25.4:.0f} mm")
