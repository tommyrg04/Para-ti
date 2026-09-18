# Portadas de carpetas — Unidad de Legalizaciones

Cuatro portadas A4 en blanco y negro para imprimir (láser, sin tramas ni grises
que se ensucien): **01 TRABAJADAS · 02 PENDIENTES · 03 RETENIDAS · 04 DOCUMENTOS**.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `portadas.html` | las cuatro hojas; se abre con doble clic, sin servidor |
| `kit.js` | los trazos a mano: óvalo, subrayado, cheque, flecha, pegatina, banda, casillas, firma |
| `render.js` | exporta los PNG y el PDF con Playwright |
| `portada-h1..h4.png` | cada portada a 2480×3508 px (A4 a 300 ppp) |
| `portadas.pdf` | las cuatro, una por página A4 |
| `fuentes/` | Bricolage Grotesque, Geist Mono y Nothing You Could Do |

## Cómo funciona

- Todo se dibuja en SVG generado por JS; no hay dependencias ni build.
- El trazo a mano usa una semilla fija (`_s = 7` en `kit.js`), así que el temblor
  sale **igual en cada render**. Si la cambias, cambia el dibujo entero.
- La palabra grande se mide con `measureText` antes de dibujar el óvalo: el radio
  horizontal se calcula para que la elipse siga libre **a la altura de las mayúsculas**,
  no solo en el centro. Sin esa corrección el trazo corta las letras de los extremos.
- El tamaño de letra es uno solo para las cuatro: el mayor que deja el óvalo de la
  palabra más larga dentro del margen.

## Regenerar

```
npm install playwright        # o usa el Chromium que ya tengas
node render.js
```

`render.js` además comprueba solo: que ninguna pieza se salga del margen de 78 px y
que ninguna choque con otra. Si algo falla lo lista en `prob`; con el diseño actual
sale vacío.
