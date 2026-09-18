const { chromium } = require('playwright');
const D = __dirname + '/';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  // 300 ppp: 1mm CSS = 3.7795 px a 96 ppp, y 300/96 = 3.125
  const pg = await b.newPage({ viewport: { width: 400, height: 900 }, deviceScaleFactor: 3.125 });
  const errs = [];
  pg.on('pageerror', e => errs.push('ERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await pg.goto('file://' + D + 'tarjeta.html');
  await pg.waitForFunction(() => document.body.dataset.listo === '1', null, { timeout: 15000 });
  await pg.waitForTimeout(400);

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
  await pg.pdf({ path: D + 'qr-tarjeta.pdf', width: '55mm', height: '80mm', printBackground: true,
                 pageRanges: '1', margin: { top:0, bottom:0, left:0, right:0 } });

  await pg.locator('#t1').screenshot({ path: D + 'qr-tarjeta.png' });
  console.log(errs.length ? errs.join('\n') : 'sin errores');
  await b.close();
})();
