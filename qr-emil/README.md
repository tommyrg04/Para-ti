# Tarjeta con QR — para Emil

Una tarjeta de **55 × 80 mm** con tulipanes, para imprimir y meter dentro de una carta.
El QR lleva a `https://tommyrg04.github.io/Para-ti/emil/nosotros/`.

Hay **dos versiones**: a color y en blanco y negro para láser.

| Archivo | Qué es |
|---|---|
| `qr-tarjeta.pdf` / `-bn.pdf` | la tarjeta al tamaño exacto — **estos son los de imprimir** |
| `qr-tarjeta.png` / `-bn.png` | la misma, 650×947 px (300 ppp), para mandar por chat |
| `qr-hoja-a4.pdf` / `-bn.pdf` | una A4 con 9 tarjetas y marcas de corte |
| `qr-hoja-a4.png` / `-bn.png` | la hoja en imagen |
| `tarjeta.html` / `tarjeta-bn.html` | los diseños; se abren con doble clic |
| `tulipanes.js` | tulipanes a color: degradados y pétalos superpuestos |
| `tulipanes-bn.js` | tulipanes a línea, al modo del linograbado |

### La de blanco y negro

Ni un gris de relleno: en láser un gris se convierte en trama y ensucia el dibujo. El
tono sale de alternar flores **macizas** y de **contorno**, y la profundidad de adelgazar
la línea, no de rebajar la tinta. El marco va cerrado y `render.js` comprueba que ningún
tulipán lo cruce ni se meta en el panel del QR o en los textos.

La copa va en **un solo contorno**, no en tres pétalos girados: un tulipán es ancho abajo
y cerrado arriba, y al girar pétalos sueltos salía una flor de loto abierta.

## Las dos reglas que hacen que se lea

1. **Nada encima del QR ni de su margen.** Los tulipanes van detrás y alrededor. El
   panel blanco deja 4,5 mm de zona tranquila por lado en la de color y 4 mm en la de
   blanco y negro — 5,3 y 5,1 módulos, cuando la norma pide 4. Si se mueve un tulipán
   encima del panel, deja de escanear.
2. **El QR va en bitmap, no en vectores.** Con 41 módulos en 35 mm cada módulo mide
   0,854 mm: al rasterizar, unos bordes se redondean a un píxel y otros a otro, los
   módulos salen desiguales y el lector falla justo al reducir la imagen. Incrustado
   como bitmap de 24 px por módulo, el grid es exacto. Y como el navegador vuelve a
   escalarlo al tamaño de la tarjeta, en el PNG final se esconde y se pega encima el
   QR con un número **entero** de píxeles por módulo (`pegar_qr.py`). Sin ese paso el
   código no se lee: está comprobado, no es precaución.

Corrección de errores **H** (aguanta un 30 % de daño), versión 6, 41×41 módulos,
0,85 mm por módulo a tamaño real.

## Regenerar

```
python3 datauri.py                    # mete el QR en tarjeta.html
node render.js tarjeta                # PDF y PNG de la de color
python3 pegar_qr.py qr-tarjeta        # pega el QR de píxeles exactos
python3 hoja.py     qr-tarjeta        # arma la A4 de 9
python3 prueba.py   qr-tarjeta        # la escanea

node render.js tarjeta-bn             # lo mismo para la de blanco y negro
python3 pegar_qr.py qr-tarjeta-bn
python3 hoja.py     qr-tarjeta-bn
python3 prueba.py   qr-tarjeta-bn

python3 prueba_pdf.py                 # escanea los dos PDF a 150, 300, 600 y 1200 ppp
```

`prueba.py` lo lee en el PNG tal cual, simulando fotos de móvil a distintas
distancias y simulando la tarjeta impresa a 45, 38, 32 y 28 mm. El suelo está en unos
3,6 px por módulo en la foto: por debajo de eso ya no lee, que es una foto donde la
tarjeta entera ocupa menos de 300 px.
