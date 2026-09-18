# Tarjeta con QR — para Emil

Una tarjeta de **55 × 80 mm** con tulipanes, para imprimir y meter dentro de una carta.
El QR lleva a `https://tommyrg04.github.io/Para-ti/emil/nosotros/`.

| Archivo | Qué es |
|---|---|
| `qr-tarjeta.pdf` | la tarjeta al tamaño exacto — **este es el que hay que imprimir** |
| `qr-tarjeta.png` | la misma, 650×947 px (300 ppp), para mandar por chat |
| `qr-hoja-a4.pdf` | una A4 con 9 tarjetas y marcas de corte |
| `qr-hoja-a4.png` | la hoja en imagen |
| `tarjeta.html` | el diseño; se abre con doble clic |
| `tulipanes.js` | los tulipanes en SVG (3 pétalos, tallo y dos hojas) |

## Las dos reglas que hacen que se lea

1. **Nada encima del QR ni de su margen.** Los tulipanes van detrás y alrededor; el
   panel blanco de 44 mm deja 4,5 mm de zona tranquila por lado (5,3 módulos, cuando
   la norma pide 4). Si se mueve un tulipán encima del panel, deja de escanear.
2. **El QR va en bitmap, no en vectores.** Con 41 módulos en 35 mm cada módulo mide
   0,854 mm: al rasterizar, unos bordes se redondean a un píxel y otros a otro, los
   módulos salen desiguales y el lector falla justo al reducir la imagen. Incrustado
   como bitmap de 24 px por módulo, el grid es exacto. En el PNG final se pega encima
   otra vez con 10 px por módulo clavados (`pegar_qr.py`).

Corrección de errores **H** (aguanta un 30 % de daño), versión 6, 41×41 módulos,
0,85 mm por módulo a tamaño real.

## Regenerar

```
python3 datauri.py     # mete el QR en tarjeta.html
node render.js         # saca el PDF (vectorial) y el PNG
python3 pegar_qr.py    # pega el QR de píxeles exactos sobre el PNG
python3 hoja.py        # arma la A4 de 9
python3 prueba.py      # lo escanea y avisa si algo dejó de leerse
```

`prueba.py` lo lee en el PNG tal cual, simulando fotos de móvil a distintas
distancias y simulando la tarjeta impresa a 45, 38, 32 y 28 mm. El suelo está en unos
3,6 px por módulo en la foto: por debajo de eso ya no lee, que es una foto donde la
tarjeta entera ocupa menos de 300 px.
