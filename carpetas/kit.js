/* ============================================================
   Kit "MARCADOR" — tipografía grande + un solo gesto a mano.
   Todo negro sobre blanco, línea limpia: láser B/N sin problemas.
   ============================================================ */
const NS = 'http://www.w3.org/2000/svg';
const el = (t, a) => { const n = document.createElementNS(NS, t); for (const k in (a||{})) if (a[k]!=null) n.setAttribute(k, a[k]); return n; };
const G = (attrs, hijos) => { const g = el('g', attrs); (hijos||[]).forEach(h => h && g.appendChild(h)); return g; };
const L = (w, op) => ({ fill:'none', stroke:'#000', 'stroke-width': w, 'stroke-linecap':'round',
                        'stroke-linejoin':'round', opacity: op == null ? 1 : op });

/* semilla fija: el trazo debe salir igual en cada render, no cambiar solo */
let _s = 7;
const az = () => { _s = (_s * 9301 + 49297) % 233280; return _s / 233280; };
const jitter = (n) => (az() - .5) * n;

/* ---------- círculo a mano alzada ----------
   Dos pasadas con arranque distinto y un pelín de temblor: es lo que
   distingue un trazo humano de una elipse perfecta. */
function circuloAmano(cx, cy, rx, ry, grosor) {
  const g = G({});
  for (let p = 0; p < 2; p++) {
    const ini = -0.4 + p * 0.25, fin = ini + Math.PI * 2 + 0.55;
    const ex = rx * (1 + p * .022), ey = ry * (1 + p * .03);
    let d = '';
    for (let t = ini; t <= fin; t += 0.07) {
      const k = 1 + Math.sin(t * 3 + p) * .012;
      const x = cx + Math.cos(t) * ex * k + jitter(5);
      const y = cy + Math.sin(t) * ey * k + jitter(5);
      d += (d ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
    }
    g.appendChild(el('path', Object.assign({ d }, L(grosor - p * 2.4, p ? .3 : 1))));
  }
  return g;
}

/* subrayado suelto, de dos trazos */
function subrayado(x1, x2, y, grosor) {
  const g = G({});
  [0, 1].forEach(p => {
    let d = '';
    for (let x = x1; x <= x2; x += 26) {
      const yy = y + p * 11 + Math.sin((x - x1) / 120) * 6 + jitter(4);
      d += (d ? 'L' : 'M') + x.toFixed(1) + ',' + yy.toFixed(1);
    }
    g.appendChild(el('path', Object.assign({ d }, L(grosor - p * 1.6, p ? .5 : 1))));
  });
  return g;
}

/* ---------- marcas pequeñas ---------- */
const cheque = (x, y, s) => el('path', Object.assign({
  transform:`translate(${x},${y}) rotate(-6) scale(${s})`, d:'M-30,2 L-8,24 L32,-24' }, L(9)));

const flechaMano = (x, y, s, rot) => G({ transform:`translate(${x},${y}) rotate(${rot||0}) scale(${s})` }, [
  el('path', Object.assign({ d:'M-40,0 C -10,-8 18,-6 40,0' }, L(8))),
  el('path', Object.assign({ d:'M40,0 L18,-13 M40,0 L18,13' }, L(8))),
]);

const admiracion = (x, y, s) => G({ transform:`translate(${x},${y}) rotate(4) scale(${s})` }, [
  el('path', Object.assign({ d:'M0,-34 L2,14' }, L(11))),
  el('circle', { cx:3, cy:32, r:6.4, fill:'#000' }),
]);

const puntos = (x, y, s) => G({ transform:`translate(${x},${y}) scale(${s})` },
  [0, 1, 2].map(i => el('circle', { cx:i*26, r:5.6, fill:'#000', opacity: 1 - i*.28 })));

/* ---------- frases al vuelo ----------
   Texto a mano y un trazo corto debajo. Sin globos: cuanto menos envoltorio,
   más limpio y más joven se ve. */
function frase(x, y, rot, texto, tam, raya) {
  const g = G({ transform:`translate(${x},${y}) rotate(${rot})` });
  const t = el('text', { 'font-family':'Mano', 'font-size': tam || 34, fill:'#000' });
  t.textContent = texto;
  g.appendChild(t);
  if (raya) {
    const w = anchoTexto(texto, tam || 34);
    g.appendChild(el('path', Object.assign({
      d:`M2,${12} C ${w*.35},${20} ${w*.7},${19} ${w},${12}` }, L(2.6, .8))));
  }
  return g;
}

const _medidor = document.createElement('canvas').getContext('2d');
function anchoTexto(t, px) { _medidor.font = px + 'px Mano'; return _medidor.measureText(t).width; }

/* ---------- firma ---------- */
function firma(x, y, s) {
  return G({ transform:`translate(${x},${y}) scale(${s||1})` }, [
    (() => { const t = el('text', { 'font-family':'Mano', 'font-size':58, fill:'#000' });
             t.textContent = 'Tom'; return t; })(),
    el('path', Object.assign({ d:'M-12,16 C 28,33 90,28 124,9 C 105,24 70,33 40,28' }, L(3.4))),
  ]);
}

/* ---------- banda de texto repetido ----------
   Una tira negra con la palabra en bucle: llena el bajo de la página y le
   da el aire de etiqueta de ropa. */
function banda(x, y, w, h, palabra) {
  const g = G({});
  const id = 'bd' + Math.round(az() * 1e6);
  const cp = el('clipPath', { id });
  cp.appendChild(el('rect', { x, y, width:w, height:h }));
  g.appendChild(cp);
  g.appendChild(el('rect', { x, y, width:w, height:h, fill:'#000' }));
  const t = el('text', { x: x + 18, y: y + h / 2 + 10, 'font-family':'Geist', 'font-weight':700,
    'font-size':30, 'letter-spacing':'7', fill:'#fff', 'clip-path':`url(#${id})` });
  t.textContent = (palabra + '   ✦   ').repeat(14);
  g.appendChild(t);
  return g;
}

/* ---------- pegatina girada ---------- */
function pegatina(x, y, rot, arriba, abajo) {
  const g = G({ transform:`translate(${x},${y}) rotate(${rot})` });
  g.appendChild(el('rect', Object.assign({ x:-92, y:-52, width:184, height:104, rx:14 },
    { fill:'#fff', stroke:'#000', 'stroke-width':4 })));
  g.appendChild(el('rect', Object.assign({ x:-80, y:-40, width:160, height:80, rx:8 }, L(1.4, .5))));
  const a = el('text', { y:-6, 'text-anchor':'middle', 'font-family':'Geist', 'font-weight':700,
                         'font-size':17, 'letter-spacing':'4', fill:'#000' });
  a.textContent = arriba; g.appendChild(a);
  const b = el('text', { y:30, 'text-anchor':'middle', 'font-family':'Bric', 'font-weight':700,
                         'font-size':34, 'letter-spacing':'-1', fill:'#000' });
  b.textContent = abajo; g.appendChild(b);
  return g;
}

/* ---------- casillas ---------- */
function casillas(x, y, n, marcadas) {
  const g = G({ transform:`translate(${x},${y})` });
  for (let i = 0; i < n; i++) {
    g.appendChild(el('rect', Object.assign({ x:i*62, y:0, width:42, height:42, rx:4 }, L(3.4))));
    if (marcadas.includes(i))
      g.appendChild(el('path', Object.assign({ d:`M${i*62+8},22 L${i*62+18},33 L${i*62+36},4` }, L(5.4))));
  }
  return g;
}

/* ---------- flecha curva a mano ---------- */
function flechaCurva(x1, y1, x2, y2, curva) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (curva || 90);
  const g = G({});
  g.appendChild(el('path', Object.assign({ d:`M${x1},${y1} Q${mx},${my} ${x2},${y2}` }, L(3.2))));
  const ang = Math.atan2(y2 - my, x2 - mx) * 180 / Math.PI;
  g.appendChild(el('path', Object.assign({
    transform:`translate(${x2},${y2}) rotate(${ang})`, d:'M0,0 L-19,-9 M0,0 L-17,10' }, L(3.2))));
  return g;
}
