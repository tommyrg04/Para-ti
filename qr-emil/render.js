const { chromium } = require('playwright');
const D = __dirname + '/';
const BASE = process.argv[2] || 'tarjeta';          // 'tarjeta' o 'tarjeta-bn'
const SAL  = BASE === 'tarjeta' ? 'qr-tarjeta' : 'qr-tarjeta-bn';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  // 300 ppp: 1mm CSS = 3.7795 px a 96 ppp, y 300/96 = 3.125
  const pg = await b.newPage({ viewport: { width: 400, height: 900 }, deviceScaleFactor: 3.125 });
  const errs = [];
  pg.on('pageerror', e => errs.push('ERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await pg.goto('file://' + D + BASE + '.html');
  await pg.waitForFunction(() => document.body.dataset.listo === '1', null, { timeout: 15000 });
  await pg.waitForTimeout(400);

  /* Comprobación de la versión en blanco y negro: ahí el marco es cerrado y
     nada puede cruzarlo. En la de color el ramo se sale a propósito. */
  const choques = BASE.endsWith('-bn') ? await pg.evaluate(() => {
    const t = document.querySelector('.tarjeta').getBoundingClientRect();
    const rel = r => ({ x1:r.left-t.left, y1:r.top-t.top, x2:r.right-t.left, y2:r.bottom-t.top });
    const f = document.querySelector('.filete');
    const marco = f ? rel(f.getBoundingClientRect()) : null;
    const prohibidas = [];
    ['.panel', '.titulo', '.pie', '.firma', '.cinta'].forEach(sel => {
      const e = document.querySelector(sel); if (!e) return;
      const ra = document.createRange(); ra.selectNodeContents(e);
      const r = sel === '.panel' || sel === '.cinta' ? e.getBoundingClientRect() : ra.getBoundingClientRect();
      prohibidas.push({ sel, ...rel(r) });
    });
    const prob = [];
    document.querySelectorAll('.capa svg > g').forEach((n, i) => {
      const r = rel(n.getBoundingClientRect());
      if (marco && (r.x1 < marco.x1 || r.x2 > marco.x2 || r.y1 < marco.y1 || r.y2 > marco.y2))
        prob.push(`tulipán ${i} se sale del marco  [${r.x1.toFixed(0)},${r.y1.toFixed(0)} → ${r.x2.toFixed(0)},${r.y2.toFixed(0)}]  marco [${marco.x1.toFixed(0)},${marco.y1.toFixed(0)} → ${marco.x2.toFixed(0)},${marco.y2.toFixed(0)}]`);
      prohibidas.forEach(p => {
        const ox = Math.min(r.x2,p.x2) - Math.max(r.x1,p.x1);
        const oy = Math.min(r.y2,p.y2) - Math.max(r.y1,p.y1);
        if (ox > 2 && oy > 2) prob.push(`tulipán ${i} pisa ${p.sel} (${ox.toFixed(0)}x${oy.toFixed(0)} px)`);
      });
    });
    return prob;
  }) : null;
  if (choques) console.log(choques.length ? choques.join('\n') : 'dibujo: nada fuera del marco ni encima del QR');

  const med = await pg.evaluate(() => {
    const mm = px => +(px / (96 / 25.4)).toFixed(2);
    const t = document.querySelector('.tarjeta').getBoundingClientRect();
    const p = document.querySelector('.panel').getBoundingClientRect();
    const q = document.querySelector('.panel img').getBoundingClientRect();
    return {
      tarjeta_mm: [mm(t.width), mm(t.height)],
      panel_mm: [mm(p.width), mm(p.height)],
      qr_mm: [mm(q.width), mm(q.height)],
      modulo_mm: +(mm(q.width) / 41).toFixed(3),
      zona_tranquila_mm: +(mm(q.left - p.left)).toFixed(2),
      zona_tranquila_modulos: +((mm(q.left - p.left)) / (mm(q.width) / 41)).toFixed(1),
    };
  });
  console.log(JSON.stringify(med, null, 1));

  // caja del QR en píxeles del PNG, para pegar encima la versión pixel-exacta
  const caja = await pg.evaluate(() => {
    const t = document.querySelector('.tarjeta').getBoundingClientRect();
    const q = document.querySelector('.panel img').getBoundingClientRect();
    return { x: q.left - t.left, y: q.top - t.top, w: q.width, h: q.height };
  });
  const k = 3.125;
  require('fs').writeFileSync(D + 'caja-qr.json', JSON.stringify(
    { x: Math.round(caja.x * k), y: Math.round(caja.y * k), w: Math.round(caja.w * k), h: Math.round(caja.h * k) }));

  // el PDF primero, con el QR en vectorial: lo rasteriza la impresora a su resolución
  await pg.pdf({ path: D + SAL + '.pdf', width: '55mm', height: '80mm', printBackground: true,
                 pageRanges: '1', margin: { top:0, bottom:0, left:0, right:0 } });

  /* Para el PNG se esconde el QR: el navegador lo escala a 9,19 px por módulo
     y unos salen de 9 y otros de 10. Encima se pega el de píxeles clavados. */
  await pg.evaluate(() => { document.querySelector('.panel img').style.visibility = 'hidden'; });
  await pg.locator('#t1').screenshot({ path: D + SAL + '.png' });
  console.log(errs.length ? errs.join('\n') : 'sin errores');
  await b.close();
})();
