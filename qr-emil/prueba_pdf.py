"""Rasteriza el PDF como lo haría una impresora y lo escanea."""
import sys, cv2, pypdfium2 as pdfium
E = "https://tommyrg04.github.io/Para-ti/emil/nosotros/"
for nombre in (sys.argv[1:] or ["qr-tarjeta.pdf", "qr-tarjeta-bn.pdf"]):
    print(nombre)
    pg = pdfium.PdfDocument(nombre)[0]
    w, h = pg.get_size()
    print(f"  página: {w/72*25.4:.1f} x {h/72*25.4:.1f} mm")
    for ppp in (150, 300, 600, 1200):
        m = cv2.cvtColor(pg.render(scale=ppp/72).to_numpy(), cv2.COLOR_RGB2BGR)
        ok, t, _, _ = cv2.QRCodeDetector().detectAndDecodeMulti(m)
        print(f"  {ppp:4d} ppp ({m.shape[1]}x{m.shape[0]}) -> lee:", bool(ok) and len(t) > 0 and t[0] == E)
