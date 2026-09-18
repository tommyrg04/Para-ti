const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const pg = await b.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 2 });
  const errs = [];
  pg.on('pageerror', e => errs.push('ERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await pg.goto('file://' + D + 'portadas.html');
  await pg.waitForFunction(() => document.body.dataset.listo === '1', null, { timeout: 15000 });
  await pg.waitForTimeout(600);

  const info = await pg.evaluate(() => {
    const MI = 78, MD = 1240 - 78, MA = 78, MB = 1754 - 78, prob = [];
    const cajas = [];
    document.querySelectorAll('.hoja').forEach(h => {
      const hb = h.getBoundingClientRect(), id = h.id;
      const rel = r => ({ x1: r.left - hb.left, y1: r.top - hb.top, x2: r.right - hb.left, y2: r.bottom - hb.top });
      const piezas = [];
      // piezas sueltas del svg (grupos de primer nivel + textos)
      h.querySelectorAll('.capa svg > *').forEach((n, i) => {
        if (n.tagName === 'clipPath') return;
        const r = n.getBoundingClientRect();
        if (!r.width && !r.height) return;
        piezas.push({ n: n.tagName + '#' + i, ...rel(r), txt: (n.textContent || '').slice(0, 24) });
      });
      ['.chico', '.estado', '.fila span', '.linea', '.linea2'].forEach(sel =>
        h.querySelectorAll(sel).forEach(e => {
          const ra = document.createRange(); ra.selectNodeContents(e);
          const r = e.classList.contains('linea') || e.classList.contains('linea2')
            ? e.getBoundingClientRect() : ra.getBoundingClientRect();
          piezas.push({ n: sel, ...rel(r), txt: e.textContent.slice(0, 24) });
        }));
      piezas.forEach(p => {
        if (p.txt.includes('✦')) return;   // la banda va recortada por clip-path
        if (p.x1 < MI - 1 || p.x2 > MD + 1 || p.y1 < MA - 1 || p.y2 > MB + 1)
          prob.push(`${id} fuera de margen: ${p.n} "${p.txt}" [${p.x1.toFixed(0)},${p.y1.toFixed(0)} → ${p.x2.toFixed(0)},${p.y2.toFixed(0)}]`);
      });
      // solapes: la banda negra y el óvalo/palabra se permiten
      const libre = p => !/rect|clip/.test(p.n);
      for (let i = 0; i < piezas.length; i++) for (let j = i + 1; j < piezas.length; j++) {
        const a = piezas[i], c = piezas[j];
        if (/#[012]$/.test(a.n) && /#[012]$/.test(c.n) && id === 'h2') continue;  // palabra + subrayado + flecha
        if (/#0$|#1$/.test(a.n) && /#0$|#1$/.test(c.n)) continue;          // palabra + gesto
        if (/g#\d+/.test(a.n) && a.txt.includes('✦')) continue;
        if (/g#\d+/.test(c.n) && c.txt.includes('✦')) continue;
        const ox = Math.min(a.x2, c.x2) - Math.max(a.x1, c.x1);
        const oy = Math.min(a.y2, c.y2) - Math.max(a.y1, c.y1);
        if (ox > 4 && oy > 4)
          prob.push(`${id} choque: ${a.n} "${a.txt}" ↔ ${c.n} "${c.txt}" (${ox.toFixed(0)}x${oy.toFixed(0)})`);
      }
      cajas.push({ id, n: piezas.length });
    });
    const tam = getComputedStyle(document.querySelector('.capa svg text')).fontSize;
    return { prob, cajas, tam };
  });
  console.log(JSON.stringify(info, null, 1));

  for (const id of ['h1', 'h2', 'h3', 'h4'])
    await pg.locator('#' + id).screenshot({ path: D + 'portada-' + id + '.png' });

  // 1240px de ancho → 210mm: la hoja cae exacta en el A4
  await pg.pdf({ path: D + 'portadas.pdf', width: '210mm', height: '297mm',
                 printBackground: true, scale: 793.7 / 1240 });
  console.log(errs.length ? errs.join('\n') : 'sin errores');
  await b.close();
})();
