# plantillas — animaciones florales

Cuatro páginas de regalo, una por persona. **Cada persona solo conoce su propia ruta.**
No existe un índice en la raíz que las enlace: es a propósito.

---

## Rutas y URLs

| Persona | Archivo | URL pública | Estado |
|---|---|---|---|
| emil    | `/emil/index.html`    | https://tommyrg04.github.io/plantillas/emil/    | ✅ lista |
| emil (corazón) | `/emil/corazon/index.html` | https://tommyrg04.github.io/plantillas/emil/corazon/ | ✅ lista |
| imanol  | `/imanol/index.html`  | https://tommyrg04.github.io/plantillas/imanol/  | ⛔ pendiente (archivo aún no está en el repo) |
| clarett | `/clarett/index.html` | https://tommyrg04.github.io/plantillas/clarett/ | ⛔ pendiente (archivo aún no está en el repo) |
| mama    | `/mama/index.html`    | https://tommyrg04.github.io/plantillas/mama/    | ⛔ pendiente (archivo aún no está en el repo) |

Como cada carpeta tiene `index.html`, la URL funciona sin escribir el nombre del archivo.

### Activar GitHub Pages (una sola vez)

0. **El repo tiene que ser público.** En repos privados, Pages exige plan de pago
   (GitHub Pro/Team) y muestra un aviso de cobro.
   Settings → General → abajo del todo, *Danger Zone* → **Change repository visibility**
   → *Change to public*.
1. Repo → **Settings** → **Pages** (menú izquierdo).
2. **Source**: `Deploy from a branch`.
3. **Branch**: `main` — **Folder**: `/ (root)` → **Save**.
4. Esperar 1–2 min. La primera publicación tarda; las siguientes son casi inmediatas
   (30–60 s tras cada push).

No hace falta Vercel ni ningún build: son archivos estáticos puros.

**Consecuencia de ser público:** cualquiera que llegue al repo ve las cuatro carpetas
y sus mensajes. La regla de "cada persona solo conoce su ruta" aplica a los *links* que
repartes, no al repo. Nadie va a tropezarse con él por casualidad, pero no es secreto.

---

## Qué contiene cada página

### emil — vertical (iPhone)
Jardín nocturno azul. Fondo `radial-gradient` en tonos petróleo.

- **120 estrellas** (divs) titilando, distribuidas en el 72 % superior.
- **16 luciérnagas** que ascienden en diagonal.
- **90 briznas de hierba** dibujadas con `stroke-dasharray`.
- **6 plantas** sobre tallos curvos (`path` con Bézier):
  - 2 **hortensias** (laterales, x≈46 y x≈362): domo de 68 flores en 3 capas
    (22 de fondo oscuro + 30 medias + 16 frontales) repartidas con espiral de
    Fibonacci; cada flor son 4 sépalos ovalados solapados.
  - 2 **lirios azules** y 2 **lirios blancos**: 3 tépalos externos + 3 internos
    con pecas, 6 estambres con antera y pistilo.
- **Aura** de respiración detrás de cada flor y **5 chispas** por flor que suben en bucle.
- Mensaje arriba, "te quiero" y firma **Para: Emil / De: T**.
- `viewBox="0 0 400 560"`, `preserveAspectRatio="xMidYMax slice"` (el suelo siempre pegado abajo).

### emil / corazón — vertical (iPhone), **interactiva**
Corazón de polvo de luz rojo sobre negro puro. **No arranca sola: hay que tocar.**

- Pantalla inicial: una brasa roja latiendo + la pista «toca la luz» (`<button>` a pantalla
  completa, así también funciona con teclado).
- Al tocar: la brasa estalla en 54 chispas hacia fuera y, de ahí, **~640 partículas
  llegan volando** desde fuera de pantalla y se ensamblan en el corazón.
  - 340 en el contorno (170 por mitad, repartidas a distancia igual con
    `getPointAtLength` sobre una guía invisible que luego se borra).
  - 300 de relleno, repartidas por muestreo por rechazo con un test de
    punto-en-polígono contra la silueta — así no se forma la costura vertical que
    salía al repartirlas por ángulo.
- Solo ~30 % de las partículas siguen titilando después de llegar: recorta mucho el
  repintado por frame sin que se note.
- **No hay ninguna luz de fondo ni aura central**: el fondo es `#000` plano y toda la
  luz sale de los gradientes radiales de las propias partículas.
- Contador que sube desbocado bajo el rótulo «Como crece mi amor por ti»
  (`requestAnimationFrame`, +1.400–4.200 por frame, no se detiene nunca).
- Firma **Para: Emil / De: Tom**.

### imanol, clarett, mama
Pendientes de subir. `clarett` será **horizontal (PC)**, las otras dos verticales.

---

## Secuencia de tiempos — emil

Entrada completa: **≈0 → 10 s**. Después todo queda en bucle.

| t (s) | Qué pasa |
|---|---|
| 0.0 | Estrellas empiezan a titilar (bucle 5 s, delay aleatorio 0–5 s) |
| 0.0 | Luciérnagas (bucle 13 s, delay aleatorio 0–13 s) |
| 0.0 – 1.0 | La hierba se dibuja (cada brizna 1.4–2.2 s, delay aleatorio) |
| 0.0 – 0.7 | Los 6 tallos se dibujan (2.4 s c/u, delay `idx × 0.14`) |
| 1.2 – 2.8 | Hojas se despliegan (`f.d − 0.9` y `f.d − 0.6`, duración 1.2 s) |
| **2.1** | Abre el **lirio blanco central** (el primero) |
| 2.5 | Abre el lirio azul izquierdo |
| 2.75 | Abre el lirio blanco derecho |
| 2.9 | Abre el lirio azul derecho |
| 3.1 | Abre la hortensia izquierda |
| 3.4 | Abre la hortensia derecha |
| **3.6** | Aparece el **mensaje** (fade 3 s) |
| **5.6** | Emerge **"te quiero"** (2.6 s, sube 18 px) |
| **7.6** | Aparece la **firma** (2.4 s) → termina ≈10 s |

Desglose interno de cada flor, relativo a su `d` (delay base de la tabla):

- **Lirio**: aura `+0` · tépalos externos `+0 / +0.1 / +0.2` (2.1 s) ·
  tépalos internos `+0.35 / +0.46 / +0.57` · garganta `+1.1` ·
  6 estambres `+1.25 … +1.5` · pistilo `+1.35`.
- **Hortensia**: aura `+0` · capa de fondo `+0 … +0.9` · capa media `+0.25 … +1.15` ·
  capa frontal `+0.5 … +1.4` (dentro de cada capa el retraso crece con el radio:
  abren del centro hacia afuera) · volumen/domo `+1.2`.
- **Chispas**: arrancan en `d + 1.8 + rnd(0–4)`, bucle de 4.5 s.

Bucles permanentes: `mecer` 8–10 s (tallos), `respirar` 6 s (auras),
`titilar` 5 s, `flotar` 13 s, `subirChispa` 4.5 s.

## Secuencia de tiempos — emil / corazón

Todo cuenta desde el **toque**, no desde la carga.

| t (s) | Qué pasa |
|---|---|
| 0.0 | Estalla la brasa: 54 chispas salen disparadas (1.1 s) |
| 0.35 – 2.45 | Las partículas del contorno llegan volando, de la punta de abajo hacia arriba por las dos mitades a la vez (cada una tarda 1.5 s en aterrizar) |
| 1.2 – 3.1 | Llegan las partículas del relleno, del centro hacia afuera |
| ~3.9 | El corazón empieza a latir (bucle 2.4 s, `scale` hasta 1.085 con doble golpe) |
| 4.4 | Empiezan a subir las brasas (bucle 6.5 s) |
| **4.6** | Línea 1 del mensaje |
| **5.7** | Línea 2 |
| **6.8** | Línea 3 |
| **8.0** | Aparece «Como crece mi amor por ti» |
| **8.2** | El contador se dispara y ya no para |
| **9.4** | Firma |

---

## Reglas técnicas (respetar en TODO cambio)

1. **HTML + CSS + SVG puro.** Sin frameworks, sin build, sin dependencias, sin CDN.
   Cada archivo debe funcionar abriéndolo directo con doble clic.
2. Las **flores e insectos se generan por JS** creando nodos SVG (`createElementNS`);
   las **animaciones son CSS** (`@keyframes`), nunca `requestAnimationFrame` por frame.
3. **Nada de filtros SVG pesados** (`feGaussianBlur`, `feDropShadow`) sobre grupos
   grandes: matan el rendimiento. La profundidad se logra con **opacidad y escala**.
4. `will-change:transform` en todo lo que anima en bucle.
   **Animar solo `transform` y `opacity`** (nada de `left/top/width/filter`).
5. Incluir siempre el bloque `@media (prefers-reduced-motion: reduce)` que congela
   la escena en su estado final.
6. **emil, imanol y mama son verticales para iPhone**: `100svh`,
   `env(safe-area-inset-*)`, `<meta viewport ... viewport-fit=cover>`.
   **clarett es horizontal para PC.**
7. Objetivo **60 fps en iPhone**. Si algo se arrastra: **reducir cantidad de nodos**
   antes que quitar detalle visual de las flores del primer plano.
8. **No cambiar los textos de los mensajes ni las firmas sin preguntar antes.**

### Deuda técnica conocida (emil)

La página aún usa `filter:url(#glow)` / `url(#glowSuave)` en el grupo de tépalos
internos del lirio, en la capa de fondo de la hortensia (22 nodos), en cada antera
y en las 30 chispas en bucle. Va contra la regla 3 y es el primer sospechoso si en
el iPhone no llega a 60 fps. Sustituible por halo con `radialGradient` + opacidad.

---

## Flujo de trabajo

Cada ajuste: cambio → commit en español → push a `main` → GitHub Pages republica solo.
