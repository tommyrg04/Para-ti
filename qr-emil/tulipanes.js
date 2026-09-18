/* ============================================================
   Tulipanes en SVG. Sin filtros: el volumen sale de degradados
   y de solapar pétalos, que es lo que aguanta bien impreso.
   ============================================================ */
const NS = 'http://www.w3.org/2000/svg';
const el = (t, a) => { const n = document.createElementNS(NS, t); for (const k in (a||{})) if (a[k]!=null) n.setAttribute(k, a[k]); return n; };
const G = (a, h) => { const g = el('g', a); (h||[]).forEach(x => x && g.appendChild(x)); return g; };

/* semilla fija: el ramo debe salir igual en cada render */
let _s = 21;
const az = () => { _s = (_s * 9301 + 49297) % 233280; return _s / 233280; };

/* un pétalo: base en 0,0 y punta arriba, más ancho en el tercio alto */
const PETALO = 'M0,0 C-12,-11 -14.5,-31 -6.5,-43 C-2.5,-48.5 2.5,-48.5 6.5,-43 C14.5,-31 12,-11 0,0 Z';
/* el de dentro, más estrecho, para que el capullo no se vea plano */
const PETALO_INT = 'M0,-1 C-8,-12 -9.5,-30 -4.5,-40 C-1.5,-45 1.5,-45 4.5,-40 C9.5,-30 8,-12 0,-1 Z';

let _id = 0;
function degradado(defs, arriba, abajo) {
  const id = 'dg' + (++_id);
  const lg = el('linearGradient', { id, x1:0, y1:1, x2:0, y2:0 });
  lg.appendChild(el('stop', { offset:'0%',  'stop-color': abajo }));
  lg.appendChild(el('stop', { offset:'62%', 'stop-color': arriba }));
  lg.appendChild(el('stop', { offset:'100%','stop-color': arriba }));
  defs.appendChild(lg);
  return `url(#${id})`;
}

/* un tulipán completo: flor de 3 pétalos, tallo y dos hojas largas */
function tulipan(defs, o) {
  const { x, y, s = 1, rot = 0, alto = 62, claro, oscuro, verde, verdeOsc, op = 1, hojas = true } = o;
  const relleno = degradado(defs, claro, oscuro);
  const g = G({ transform:`translate(${x},${y}) rotate(${rot}) scale(${s})`, opacity: op });

  if (hojas) {
    const h = G({});
    h.appendChild(el('path', { d:`M0,${alto*.30} C-19,${alto*.45} -27,${alto*.78} -21,${alto*1.06} C-11,${alto*.80} -4,${alto*.56} 0,${alto*.42} Z`, fill: verde }));
    h.appendChild(el('path', { d:`M0,${alto*.40} C 17,${alto*.54} 24,${alto*.84} 19,${alto*1.10} C 10,${alto*.86} 4,${alto*.64} 0,${alto*.52} Z`, fill: verdeOsc }));
    g.appendChild(h);
  }
  g.appendChild(el('path', { d:`M0,-2 C 2,${alto*.32} 1,${alto*.66} 0,${alto}`, fill:'none', stroke: verdeOsc, 'stroke-width':3.1, 'stroke-linecap':'round' }));

  // pétalos: los dos laterales por detrás, el central encima
  g.appendChild(el('path', { d: PETALO, fill: relleno, transform:'rotate(-17) translate(-1,1)', opacity:.9 }));
  g.appendChild(el('path', { d: PETALO, fill: relleno, transform:'rotate(17) translate(1,1)',  opacity:.9 }));
  g.appendChild(el('path', { d: PETALO, fill: relleno }));
  g.appendChild(el('path', { d: PETALO_INT, fill: claro, opacity:.45 }));
  return g;
}

/* campo tenue del fondo: los mismos tulipanes, apagados y sin hojas */
function campo(defs, ancho, altoLienzo, n, color) {
  const g = G({});
  for (let i = 0; i < n; i++) {
    const s = .34 + az() * .26;
    g.appendChild(tulipan(defs, {
      x: az() * ancho, y: altoLienzo * (.08 + az() * .92), s,
      rot: -16 + az() * 32, claro: color, oscuro: color,
      verde: color, verdeOsc: color, op: .085 + az() * .05,
    }));
  }
  return g;
}
