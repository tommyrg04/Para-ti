/* ============================================================
   EVIANNY.EXE
   Sin módulos ES: abriendo el archivo directo (file://) el
   navegador bloquea los imports por CORS, así que va todo en
   un IIFE con <script src>.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONTENIDO
     Todo lo repetitivo vive aquí para poder tocarlo sin
     pelearse con el marcado.
     --------------------------------------------------------- */

  const PALABRAS = [
    { txt: 'confianza.' },
    { txt: 'chisme.', estilo: 'acento' },
    { txt: 'consejos.' },
    { txt: 'audios de 7 minutos.' },
    { txt: 'JAJAJAJAJA.', estilo: 'fuerte' },
    { txt: 'problemas que terminamos resolviendo.' },
    { txt: 'conversaciones random.' },
    { txt: '“mi amor”.', estilo: 'acento' },
    { txt: 'y probablemente demasiadas estupideces.' },
  ];

  const ENCANTAN = [
    { titulo: 'Tu forma de ser.',
      texto: 'Eres de esas personas que caen bien sin tener que esforzarse. Llegas y ya, el ambiente cambia.' },
    { titulo: 'Tu confianza.',
      texto: 'Que me cuentes las cosas sabiendo que aquí se quedan. Eso no se le da a cualquiera y no lo doy por sentado.' },
    { titulo: 'Tu cariño.',
      texto: 'Lo demuestras en cosas chiquitas y sin avisar. Un mensaje, un “cómo estás”, y ya me cambiaste el día.' },
    { titulo: 'Tu sentido del humor.',
      texto: 'Nos reímos de cosas que no le dan risa a nadie más. Honestamente, así está perfecto.' },
    { titulo: 'Que siempre hay algo de qué hablar.',
      texto: 'Nunca se nos acaba el tema. Pasamos de algo serio a una estupidez sin escalas.' },
    { titulo: 'Que puedo ser yo contigo.',
      texto: 'Creo que esa es de las cosas más bonitas de nuestra amistad. Nunca siento que tengo que medir demasiado lo que digo contigo.' },
  ];

  const HITOS = [
    'Empezamos hablando de cualquier cosa.',
    'Después empezamos a contarnos absolutamente todo.',
    'Luego llegaron los audios eternos.',
    'Después las conversaciones que empiezan normales y terminan en cualquier cosa.',
    'Y ahora aquí estoy haciendo una página web para ti.',
  ];

  const MEDIDORES = [
    { nombre: 'Drama', v: .6 },
    { nombre: 'Chisme', v: 1 },
    { nombre: 'Paciencia conmigo', v: .8 },
    { nombre: 'Nivel de random', v: 1 },
    { nombre: 'Capacidad de decir “JAJAJA”', v: 1 },
  ];

  const SALIDAS_EXE = [
    'Evianny.exe está funcionando perfectamente.',
    'Se detectó exceso de chisme.',
    'Se recomienda continuar la conversación.',
    'Error 404: conversación aburrida no encontrada.',
    'Sistema protegido por demasiada confianza.',
  ];

  const KIT = [
    { clave: 'SOS', titulo: 'Estoy estresada.',
      lineas: ['Ven, cuéntame qué pasó.', 'Puedes soltarlo todo. Estoy aquí.'] },
    { clave: '👀', titulo: 'Necesito chisme.',
      lineas: ['PROCEDA INMEDIATAMENTE.', 'Necesito contexto, nombres y cronología.'] },
    { clave: '?', titulo: 'Necesito consejo.',
      lineas: ['Tú sabes que aquí estoy.', 'Lo hablamos sin juzgar. Bueno… quizá juzgamos un poquito, pero con cariño. 🤣'] },
    { clave: '∞', titulo: 'Necesito que me recuerdes que todo estará bien.',
      lineas: ['Respira.', 'Una cosa a la vez.', 'No tienes que resolverlo todo hoy.', 'Y si necesitas hablar, sabes dónde encontrarme.'] },
  ];

  const RECUERDOS = [
    'Los “mi amor” sin contexto.',
    'Los mensajes de “cómo estás?”',
    'Los audios.',
    'Las conversaciones random.',
    'Las estupideces.',
    'Simplemente estar.',
  ];

  /* ---------------------------------------------------------
     HERRAMIENTAS
     --------------------------------------------------------- */

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Crea un elemento con clases, texto y atributos de una sola vez. */
  function nodo(tag, opciones) {
    const o = opciones || {};
    const el = document.createElement(tag);
    if (o.clase) el.className = o.clase;
    if (o.texto != null) el.textContent = o.texto;
    if (o.html != null) el.innerHTML = o.html;
    if (o.attrs) for (const k in o.attrs) el.setAttribute(k, o.attrs[k]);
    if (o.vars) for (const k in o.vars) el.style.setProperty(k, o.vars[k]);
    if (o.hijos) o.hijos.forEach((h) => h && el.appendChild(h));
    return el;
  }

  /** Panel plegable: mide el contenido real para que la altura anime exacto. */
  function plegable(contenedor, cuerpo, boton, alUsar) {
    let abierto = false;
    const fijar = () => { if (abierto) cuerpo.style.maxHeight = cuerpo.scrollHeight + 'px'; };

    function alternar(forzar) {
      abierto = forzar != null ? forzar : !abierto;
      contenedor.classList.toggle('abierta', abierto);
      boton.setAttribute('aria-expanded', String(abierto));
      cuerpo.style.maxHeight = abierto ? cuerpo.scrollHeight + 'px' : '0px';
    }

    boton.addEventListener('click', () => { alternar(); if (alUsar) alUsar(); });
    window.addEventListener('resize', fijar);
    return { cerrar: () => alternar(false) };
  }

  /* ---------------------------------------------------------
     SECCIONES
     --------------------------------------------------------- */

  function pintarPalabras() {
    const nube = $('#nube');
    PALABRAS.forEach((p, i) => {
      const clase = 'pildora rev' + (p.estilo ? ' pildora--' + p.estilo : '');
      // giro mínimo para que no parezca una cuadrícula perfecta
      const giro = (i % 3 === 1 ? -.7 : i % 3 === 2 ? .8 : 0);
      nube.appendChild(nodo('span', {
        clase, texto: p.txt, vars: { '--i': i, '--giro': giro + 'deg' },
      }));
    });
  }

  const plegables = [];

  function pintarEncantan() {
    const lista = $('#encantan');
    ENCANTAN.forEach((c, i) => {
      const id = 'enc-' + i;
      const boton = nodo('button', {
        clase: 'tarjeta__btn',
        attrs: { type: 'button', 'aria-expanded': 'false', 'aria-controls': id },
        hijos: [
          nodo('span', { clase: 'tarjeta__txt', texto: c.titulo }),
          i === 0 ? nodo('span', { clase: 'pista-toque', texto: 'toca' }) : null,
          nodo('span', { clase: 'tarjeta__mas', attrs: { 'aria-hidden': 'true' } }),
        ],
      });
      const cuerpo = nodo('div', {
        clase: 'tarjeta__cuerpo', attrs: { id },
        hijos: [nodo('div', { clase: 'tarjeta__interior', texto: c.texto })],
      });
      const tarjeta = nodo('article', {
        clase: 'tarjeta rev', vars: { '--i': i }, hijos: [boton, cuerpo],
      });
      lista.appendChild(tarjeta);
      plegables.push(plegable(tarjeta, cuerpo, boton, () => lista.classList.add('sin-pistas')));
    });
  }

  function pintarHitos() {
    const linea = $('#hitos');
    HITOS.forEach((t, i) => {
      linea.appendChild(nodo('div', {
        clase: 'hito rev', vars: { '--i': i },
        hijos: [
          nodo('span', { clase: 'hito__num', texto: String(i + 1).padStart(2, '0') }),
          nodo('p', { clase: 'hito__txt', texto: t }),
        ],
      }));
    });
  }

  function pintarMedidores() {
    const caja = $('#medidores');
    MEDIDORES.forEach((m, i) => {
      const relleno = nodo('div', {
        clase: 'medidor__relleno' + (m.v === 1 ? ' medidor__relleno--tope' : ''),
        vars: { '--v': m.v, '--i': i },
      });
      caja.appendChild(nodo('div', {
        clase: 'medidor',
        hijos: [
          nodo('div', {
            clase: 'medidor__fila',
            hijos: [
              nodo('span', { clase: 'medidor__nom', texto: m.nombre }),
              nodo('span', { clase: 'medidor__pct', texto: Math.round(m.v * 100) + '%' }),
            ],
          }),
          nodo('div', { clase: 'medidor__riel', hijos: [relleno] }),
        ],
      }));
    });
  }

  function pintarKit() {
    const caja = $('#kit');
    KIT.forEach((k, i) => {
      const id = 'kit-' + i;
      const boton = nodo('button', {
        clase: 'kit__btn',
        attrs: { type: 'button', 'aria-expanded': 'false', 'aria-controls': id },
        hijos: [
          nodo('span', { clase: 'kit__ico', attrs: { 'aria-hidden': 'true' }, texto: k.clave }),
          nodo('span', { clase: 'kit__txt', texto: k.titulo }),
          i === 0 ? nodo('span', { clase: 'pista-toque', texto: 'toca' }) : null,
        ],
      });
      const cuerpo = nodo('div', {
        clase: 'kit__cuerpo', attrs: { id },
        hijos: [nodo('div', {
          clase: 'kit__interior',
          hijos: k.lineas.map((l) => nodo('p', { texto: l })),
        })],
      });
      const item = nodo('article', {
        clase: 'kit__item rev', vars: { '--i': i }, hijos: [boton, cuerpo],
      });
      caja.appendChild(item);
      plegables.push(plegable(item, cuerpo, boton, () => caja.classList.add('sin-pistas')));
    });
  }

  function pintarRecuerdos() {
    const caja = $('#recuerdos');
    RECUERDOS.forEach((r, i) => {
      caja.appendChild(nodo('p', {
        clase: 'capsula rev' + (i === RECUERDOS.length - 1 ? ' capsula--ultima' : ''),
        texto: r, vars: { '--i': i % 4 },
      }));
    });
  }

  /* ---------------------------------------------------------
     CONSOLA DE EVIANNY.EXE
     --------------------------------------------------------- */

  function montarConsola() {
    const salida = $('#salidaExe');
    const boton = $('#ejecutar');
    let ultima = -1;

    boton.addEventListener('click', () => {
      // nunca repite el mensaje anterior seguido
      let i;
      do { i = Math.floor(Math.random() * SALIDAS_EXE.length); }
      while (SALIDAS_EXE.length > 1 && i === ultima);
      ultima = i;

      const linea = nodo('p', {
        html: '<span class="prompt">&gt;</span> ' + SALIDAS_EXE[i] + '<span class="cursor"></span>',
      });
      $$('.cursor', salida).forEach((c) => c.remove());
      salida.appendChild(linea);
      while (salida.children.length > 4) salida.removeChild(salida.firstChild);
      salida.scrollTop = salida.scrollHeight;
    });

    return { limpiar: () => { salida.innerHTML = ''; ultima = -1; } };
  }

  /* ---------------------------------------------------------
     ENTRADAS AL HACER SCROLL
     --------------------------------------------------------- */

  function montarRevelado() {
    const objetivos = () => $$('.rev, #hitos, #panelExe');
    const vigia = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('on');
        vigia.unobserve(e.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });

    return {
      observar: () => objetivos().forEach((n) => vigia.observe(n)),
      rebobinar: () => objetivos().forEach((n) => { n.classList.remove('on'); vigia.unobserve(n); }),
    };
  }

  /* ---------------------------------------------------------
     BARRA DE PROGRESO
     --------------------------------------------------------- */

  function montarProgreso() {
    const barra = $('#progreso');
    const pista = $('#pistaScroll');
    let pedido = false;
    const pintar = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.transform = 'scaleX(' + (alto > 0 ? Math.min(1, window.scrollY / alto) : 0) + ')';
      pista.classList.toggle('ida', window.scrollY > 220);
      pedido = false;
    };
    addEventListener('scroll', () => {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(pintar);
    }, { passive: true });
    pintar();
  }

  /* ---------------------------------------------------------
     MOTAS DE LA TARJETA FINAL
     --------------------------------------------------------- */

  function sembrarMotas() {
    const escena = $('#escenaTarjeta');
    for (let i = 0; i < 14; i++) {
      escena.insertBefore(nodo('span', {
        clase: 'mota', attrs: { 'aria-hidden': 'true' },
        vars: {
          left: (6 + Math.random() * 88) + '%',
          top: (55 + Math.random() * 40) + '%',
          '--sx': (Math.random() * 50 - 25).toFixed(0) + 'px',
          '--dur': (7 + Math.random() * 6).toFixed(1) + 's',
          '--ret': (Math.random() * 8).toFixed(1) + 's',
        },
      }), escena.firstChild);
    }
  }

  /* ---------------------------------------------------------
     ORQUESTACIÓN
     --------------------------------------------------------- */

  function irA(sel) {
    const destino = $(sel);
    if (destino) destino.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'start' });
  }

  function arriba() {
    const raiz = document.documentElement;
    const antes = raiz.style.scrollBehavior;
    raiz.style.scrollBehavior = 'auto';   // el reinicio nunca debe verse como un scroll largo
    window.scrollTo(0, 0);
    raiz.style.scrollBehavior = antes;
  }

  document.addEventListener('DOMContentLoaded', () => {
    pintarPalabras();
    pintarEncantan();
    pintarHitos();
    pintarMedidores();
    pintarKit();
    pintarRecuerdos();
    sembrarMotas();

    const consola  = montarConsola();
    const revelado = montarRevelado();
    montarProgreso();

    const intro   = $('#intro');
    const cuerpo  = $('#cuerpo');
    const escena  = $('#escenaTarjeta');

    document.body.classList.add('bloqueado');

    /* --- entrar --- */
    $('#entrar').addEventListener('click', () => {
      intro.classList.add('fuera');
      intro.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('bloqueado');
      document.body.classList.add('entrado');
      cuerpo.classList.add('visible');
      cuerpo.removeAttribute('aria-hidden');
      revelado.observar();
      setTimeout(() => {
        intro.style.display = 'none';
        const h = $('#tituloApertura');
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }, quieto ? 0 : 900);
    });

    /* --- "sigue ↓" --- */
    $('#sigue').addEventListener('click', () => irA('#s-tuyyo'));

    /* --- guardar la amistad --- */
    $('#guardar').addEventListener('click', () => {
      escena.classList.add('abierta');
      escena.removeAttribute('aria-hidden');
      document.body.classList.add('bloqueado');
      setTimeout(() => $('#reiniciar').focus({ preventScroll: true }), quieto ? 0 : 900);
    });

    /* --- volver a empezar --- */
    $('#reiniciar').addEventListener('click', () => {
      escena.classList.remove('abierta');
      escena.setAttribute('aria-hidden', 'true');

      plegables.forEach((p) => p.cerrar());
      $$('.sin-pistas').forEach((n) => n.classList.remove('sin-pistas'));
      $('#pistaScroll').classList.remove('ida');
      consola.limpiar();
      revelado.rebobinar();

      cuerpo.classList.remove('visible');
      cuerpo.setAttribute('aria-hidden', 'true');
      arriba();
      document.body.classList.remove('entrado');
      document.body.classList.add('bloqueado');

      intro.style.display = '';
      intro.classList.remove('fuera');
      void intro.offsetWidth;              // fuerza reflujo: la intro vuelve a animarse
      intro.removeAttribute('aria-hidden');
      $('#entrar').focus({ preventScroll: true });
    });
  });
})();
