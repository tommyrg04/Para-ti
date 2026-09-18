/* ============================================================
   Tulipanes en blanco y negro, al modo del linograbado.
   Ni un gris de relleno: en láser un gris se convierte en trama
   y ensucia. El tono sale de macizo contra contorno.
   ============================================================ */
const NS = 'http://www.w3.org/2000/svg';
const el = (t, a) => { const n = document.createElementNS(NS, t); for (const k in (a||{})) if (a[k]!=null) n.setAttribute(k, a[k]); return n; };
const G = (a, h) => { const g = el('g', a); (h||[]).forEach(x => x && g.appendChild(x)); return g; };

let _s = 21;
const az = () => { _s = (_s * 9301 + 49297) % 233280; return _s / 233280; };

/* La copa entera en un solo contorno, no tres pétalos girados.
   Un tulipán es ANCHO ABAJO y cerrado arriba, con tres puntas juntas;
   al girar pétalos sueltos salía una flor de loto abierta. */
const COPA =
  'M0,0 C-8,-1 -14.2,-7 -15.6,-18 C-16.8,-28 -15.4,-37 -12.2,-44 ' +   // lado izquierdo, ancho abajo
  'C-11.2,-46.2 -9.4,-46 -8.8,-43.4 C-8.2,-40.6 -7.4,-37.4 -6.2,-35 ' + // punta izquierda y valle
  'C-4.8,-39.6 -2.8,-44 0,-47 ' +                                        // punta central
  'C2.8,-44 4.8,-39.6 6.2,-35 ' +
  'C7.4,-37.4 8.2,-40.6 8.8,-43.4 C9.4,-46 11.2,-46.2 12.2,-44 ' +
  'C15.4,-37 16.8,-28 15.6,-18 C14.2,-7 8,-1 0,0 Z';

/* las dos juntas entre pétalos, que bajan desde los valles */
const JUNTA_I = 'M-6.2,-34 C-7.6,-26 -7.4,-14 -5,-3';
const JUNTA_D = 'M 6.2,-34 C 7.6,-26 7.4,-14 5,-3';

/* hoja larga y ancha, de las que envuelven el tallo */
function hoja(lado, largo) {
  const a = largo * .50;
  return `M0,${largo*.06} C${lado*-a*.70},${largo*.26} ${lado*-a*1.14},${largo*.58} ${lado*-a*1.18},${largo*1.04}`
       + ` C${lado*-a*.42},${largo*.78} ${lado*-a*.10},${largo*.44} 0,${largo*.30} Z`;
}

function tulipan(defs, o) {
  const { x, y, s = 1, rot = 0, alto = 30, macizo = true, grosor = 1, hojas = true } = o;
  const w = grosor / s;                        // el trazo no debe encoger con la flor
  const g = G({ transform:`translate(${x},${y}) rotate(${rot}) scale(${s})` });
  const tinta = macizo ? '#000' : '#fff';
  const traza = (d, k, color) => el('path', { d, fill:'none', stroke: color || '#000',
    'stroke-width': w * (k || 1), 'stroke-linecap':'round' });

  g.appendChild(traza(`M0,-3 C 1.6,${alto*.34} 1,${alto*.68} 0,${alto}`, macizo ? 1.9 : 1.15));

  if (hojas) {
    [[-1, alto * 1.02], [1, alto * .88]].forEach(([lado, largo]) => {
      g.appendChild(el('path', { d: hoja(lado, largo), fill: tinta, stroke:'#000',
        'stroke-width': w * .9, 'stroke-linejoin':'round' }));
      if (macizo)   // nervio en blanco: sin él la hoja maciza es una mancha
        g.appendChild(traza(`M0,${largo*.20} C${lado*-largo*.16},${largo*.40} ${lado*-largo*.36},${largo*.66} ${lado*-largo*.44},${largo*.90}`, .7, '#fff'));
    });
  }

  g.appendChild(el('path', { d: COPA, fill: tinta, stroke:'#000', 'stroke-width': w, 'stroke-linejoin':'round' }));
  const juntas = macizo ? '#fff' : '#000';
  g.appendChild(traza(JUNTA_I, macizo ? .95 : .6, juntas));
  g.appendChild(traza(JUNTA_D, macizo ? .95 : .6, juntas));
  return g;
}

/* campo del fondo: contorno y trazo finísimo. En blanco y negro la
   profundidad se hace adelgazando la línea, no rebajando la tinta. */
function campo(defs, ancho, altoLienzo, n) {
  const g = G({});
  for (let i = 0; i < n; i++)
    g.appendChild(tulipan(defs, {
      x: az() * ancho, y: altoLienzo * (.10 + az() * .88),
      s: .30 + az() * .22, rot: -14 + az() * 28,
      macizo: false, grosor: .34, hojas: az() > .5,
    }));
  return g;
}
