/* =====================================================================
   DULCE MAREA — script.js
   1. ✏️ ZONA PARA EDITAR: nombre, WhatsApp, sabores, postres, horario
   2. Utilidades
   3. Contenido: llena la página con los datos de CONFIG
   4. Horario y "abierto ahora"
   5. Menú móvil, navegación y enlaces
   6. Animaciones (GSAP + ScrollTrigger + Lenis)
   7. Cursor personalizado y botones magnéticos
   8. Helado 3D (Three.js)
   ===================================================================== */
(() => {
  'use strict';

  /* ===================================================================
     1. ✏️ ZONA PARA EDITAR
     =================================================================== */
  const CONFIG = {
    // Nombre del negocio (logo, portada, pantalla de carga, mapa y footer)
    nombre: 'Dulce Marea',

    // WhatsApp: 57 (Colombia) + número de celular. Solo números, sin "+" ni espacios.
    whatsapp: '573000000000',

    // Mensajes que se escriben solos al abrir WhatsApp
    mensajeGeneral: 'Hola, Dulce Marea 🍦 quiero hacer un pedido',
    mensajeSabor: 'Hola, quiero pedir: Helado de {sabor}',   // {sabor} = nombre del sabor
    mensajePostre: 'Hola, quiero pedir: {postre}',           // {postre} = nombre del postre

    direccion: 'Carrera 00 # 00-00, Barranquilla, Atlántico',
    referencia: 'Dirección de ejemplo · a una cuadra del parque',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Barranquilla%2C+Atl%C3%A1ntico',

    // Horario en formato 24 horas. Para cerrar un día deja abre: '' y cierra: ''.
    horario: [
      { dia: 'Lunes',     abre: '14:00', cierra: '21:00' },
      { dia: 'Martes',    abre: '14:00', cierra: '21:00' },
      { dia: 'Miércoles', abre: '14:00', cierra: '21:00' },
      { dia: 'Jueves',    abre: '14:00', cierra: '21:00' },
      { dia: 'Viernes',   abre: '12:00', cierra: '22:30' },
      { dia: 'Sábado',    abre: '12:00', cierra: '22:30' },
      { dia: 'Domingo',   abre: '11:00', cierra: '22:00' }
    ],

    /* SABORES (carrusel horizontal)
       - precio: en pesos, solo números (9500 se muestra como $9.500)
       - fondo: color de la tarjeta · bola: color del helado
       - topping: semillas, coco, bocadillo, puntos, sal, fresa, limon o cristales
       - oscuro: true si el fondo es oscuro (el texto se pone claro) */
    sabores: [
      { nombre: 'Maracuyá', detalle: 'con panela', precio: 9500, fondo: '#F7C873', bola: '#FBDD8E', topping: 'semillas',
        descripcion: 'Ácido, dulce y con semillas crocantes, como la fruta recién abierta.' },
      { nombre: 'Coco', detalle: 'playero', precio: 9500, fondo: '#9AD7EA', bola: '#FFFDF6', topping: 'coco',
        descripcion: 'Leche de coco y coco tostado. Sabe a brisa de mar y tarde de playa.' },
      { nombre: 'Arequipe', detalle: 'con bocadillo', precio: 10500, fondo: '#EDC197', bola: '#D9965A', topping: 'bocadillo',
        descripcion: 'Arequipe casero con trocitos de bocadillo de guayaba. Puro antojo.' },
      { nombre: 'Guanábana', detalle: 'de la abuela', precio: 9500, fondo: '#DDEDC8', bola: '#FBFAF0', topping: 'puntos',
        descripcion: 'Cremosa, fresca y suavecita: la receta con la que empezó todo.' },
      { nombre: 'Chocolate', detalle: 'con sal marina', precio: 11500, fondo: '#3A2118', bola: '#7A4A33', topping: 'sal', oscuro: true,
        descripcion: 'Cacao colombiano al 70 % y un toque de sal de mar. Intenso y elegante.' },
      { nombre: 'Fresa', detalle: 'con crema', precio: 9500, fondo: '#F3A5B6', bola: '#F8C6D2', topping: 'fresa',
        descripcion: 'Fresas maduras y crema de leche, como el postre de los domingos.' },
      { nombre: 'Mango biche', detalle: 'con limón y sal', precio: 9900, fondo: '#CDE69A', bola: '#E6F2B0', topping: 'limon',
        descripcion: 'Verde, ácido y con su pizca de sal, como en la esquina del colegio.' },
      { nombre: 'Corozo', detalle: 'en sorbete', precio: 9500, fondo: '#B8344F', bola: '#DE5A74', topping: 'cristales', oscuro: true,
        descripcion: 'La fruta roja del Caribe convertida en sorbete. Sin lácteos.' }
    ],

    // Combo que aparece al final del carrusel de sabores
    combo: { nombre: 'La Marea', descripcion: 'Tres bolas a tu gusto, en cono o en vaso, con salsa y chispitas.', precio: 24900 },

    /* POSTRES DESTACADOS
       - dibujo: copa, paleta, waffle o torta
       - forma: arco, circulo, blob o squircle (la silueta del fondo)
       - fondo: color del fondo de la ilustración */
    postres: [
      { nombre: 'Copa Marea', precio: 18900, dibujo: 'copa', forma: 'arco', fondo: '#FCDDE4',
        descripcion: 'Tres bolas, salsa de fresa, crema batida y su cereza. La insignia de la casa.' },
      { nombre: 'Paleta de corozo', precio: 7500, dibujo: 'paleta', forma: 'circulo', fondo: '#FFF5E9',
        descripcion: 'Sorbete de corozo en palito, bañado a la mitad en chocolate blanco.' },
      { nombre: 'Waffle con arequipe', precio: 16500, dibujo: 'waffle', forma: 'squircle', fondo: '#F7C873',
        descripcion: 'Waffle recién hecho, bola de vainilla y un chorro generoso de arequipe.' },
      { nombre: 'Torta helada de maracuyá', precio: 12900, dibujo: 'torta', forma: 'blob', fondo: '#FCDDE4',
        descripcion: 'Base de galleta, crema helada y espejo de maracuyá. Por porción.' }
    ]
  };
  /* ======================= FIN DE LA ZONA PARA EDITAR ======================= */


  /* ===================================================================
     2. Utilidades
     =================================================================== */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hayGSAP = !!(window.gsap && window.ScrollTrigger);
  const html = document.documentElement;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const precio = n => '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const numeroWA = String(CONFIG.whatsapp).replace(/\D/g, '');
  const linkWA = msg => `https://wa.me/${numeroWA}?text=${encodeURIComponent(msg)}`;
  const telefono = n => (n.length === 12 && n.startsWith('57')) ? `+57 ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : '+' + n;
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const azarCon = semilla => () => {
    semilla = (semilla + 0x6D2B79F5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let lenis = null;
  const estado3D = { aparecer: hayGSAP && !reduce ? 0 : 1, scroll: 0 };

  // Bola de helado en SVG: cúpula redonda con el borde de abajo ondulado
  function pathBola(cx, cy, r) {
    const f = n => Math.round(n * 10) / 10;
    const k = .5523 * r, arriba = cy - r * .95;
    let d = `M${f(cx - r)} ${f(cy)} C${f(cx - r)} ${f(cy - k * 1.2)} ${f(cx - k)} ${f(arriba)} ${f(cx)} ${f(arriba)} C${f(cx + k)} ${f(arriba)} ${f(cx + r)} ${f(cy - k * 1.2)} ${f(cx + r)} ${f(cy)}`;
    for (let i = 0; i < 6; i++) {
      const x1 = cx + r - 2 * r * (i / 6), x2 = cx + r - 2 * r * ((i + 1) / 6);
      d += ` Q${f((x1 + x2) / 2)} ${f(cy + r * (i % 2 ? .16 : .22))} ${f(x2)} ${f(cy + (i === 5 ? 0 : r * .04))}`;
    }
    return d + 'Z';
  }

  // Divide un texto en letras (para animarlas una por una)
  function partirLetras(el) {
    const texto = el.textContent;
    el.textContent = '';
    return Array.from(texto).map(ch => {
      const caja = document.createElement('span');
      const letra = document.createElement('span');
      caja.className = 'ch';
      letra.textContent = ch === ' ' ? ' ' : ch;
      caja.appendChild(letra);
      el.appendChild(caja);
      return letra;
    });
  }

  // Envuelve cada palabra en un <span> (con máscara para los títulos)
  function envolverPalabras(el, conMascara) {
    const nodos = [];
    const recorrido = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (recorrido.nextNode()) nodos.push(recorrido.currentNode);
    const piezas = [];
    nodos.forEach(nodo => {
      if (!nodo.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      nodo.textContent.split(/(\s+)/).forEach(trozo => {
        if (!trozo) return;
        if (/^\s+$/.test(trozo)) { frag.appendChild(document.createTextNode(' ')); return; }
        const span = document.createElement('span');
        if (conMascara) {
          const dentro = document.createElement('span');
          span.className = 'wm';
          dentro.textContent = trozo;
          span.appendChild(dentro);
          piezas.push(dentro);
        } else {
          span.className = 'w';
          span.textContent = trozo;
          piezas.push(span);
        }
        frag.appendChild(span);
      });
      nodo.parentNode.replaceChild(frag, nodo);
    });
    return piezas;
  }


  /* ===================================================================
     3. Contenido
     =================================================================== */
  document.title = `${CONFIG.nombre} · Heladería artesanal en Barranquilla`;
  $$('[data-nombre]').forEach(el => { el.textContent = CONFIG.nombre; });
  const [palabra1, ...resto] = CONFIG.nombre.trim().split(/\s+/);
  $('.hero__word--1').textContent = palabra1;
  $('.hero__word--2').textContent = resto.join(' ');
  $('.hero__title').setAttribute('aria-label', CONFIG.nombre);

  $$('[data-wa]').forEach(a => { a.href = linkWA(CONFIG.mensajeGeneral); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-telefono]').forEach(el => { el.textContent = telefono(numeroWA); });
  $$('[data-direccion]').forEach(el => { el.textContent = CONFIG.direccion; });
  $$('[data-referencia]').forEach(el => { el.textContent = CONFIG.referencia; });
  $$('[data-mapa]').forEach(a => { a.href = CONFIG.mapa; });
  $$('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
  $$('[data-demo]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  // Combo al final del carrusel
  $$('[data-combo-nombre]').forEach(el => { el.textContent = CONFIG.combo.nombre; });
  $$('[data-combo-descripcion]').forEach(el => { el.textContent = CONFIG.combo.descripcion; });
  $$('[data-combo-precio]').forEach(el => { el.textContent = precio(CONFIG.combo.precio); });
  $$('[data-wa-combo]').forEach(a => {
    a.href = linkWA(CONFIG.mensajePostre.replace(/\{postre\}/g, () => CONFIG.combo.nombre));
    a.target = '_blank'; a.rel = 'noopener';
    $('span', a).textContent = `Pedir ${CONFIG.combo.nombre}`;
  });

  // ----- Ilustraciones de los sabores -----
  function esRojizo(hex) {
    const n = parseInt(hex.replace('#', ''), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return false;
    let h = max === r ? ((g - b) / (max - min)) % 6 : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
    h = (h * 60 + 360) % 360;
    return h > 300 || h < 25;
  }

  function toppings(tipo, azar) {
    const puntos = n => Array.from({ length: n }, () => {
      const a = azar() * Math.PI * 2, d = Math.sqrt(azar());
      return [120 + Math.cos(a) * d * 66, 108 + Math.sin(a) * d * 38, Math.round(azar() * 180)];
    });
    const f = n => n.toFixed(1);
    switch (tipo) {
      case 'semillas': return puntos(15).map(([x, y, g]) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="3.2" ry="4.8" transform="rotate(${g} ${f(x)} ${f(y)})" fill="#2B1B12"/>`).join('');
      case 'coco': return puntos(16).map(([x, y, g]) => `<rect x="${f(x - 5)}" y="${f(y - 1.7)}" width="10" height="3.4" rx="1.7" transform="rotate(${g} ${f(x)} ${f(y)})" fill="#D9A86C"/>`).join('');
      case 'bocadillo': return puntos(9).map(([x, y, g]) => `<rect x="${f(x - 4.5)}" y="${f(y - 4.5)}" width="9" height="9" rx="2" transform="rotate(${g} ${f(x)} ${f(y)})" fill="#B8344F"/>`).join('');
      case 'puntos': return puntos(16).map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="2.4" fill="#A6C98A"/>`).join('');
      case 'sal': return puntos(16).map(([x, y, g]) => `<rect x="${f(x - 2)}" y="${f(y - 2)}" width="4" height="4" transform="rotate(${g} ${f(x)} ${f(y)})" fill="#FFF5E9"/>`).join('');
      case 'fresa': return puntos(9).map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="4.2" fill="#E07A92"/>`).join('') + puntos(10).map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="1.4" fill="#F7E08A"/>`).join('');
      case 'limon': return puntos(10).map(([x, y, g]) => `<rect x="${f(x - 4)}" y="${f(y - 1.5)}" width="8" height="3" rx="1.5" transform="rotate(${g} ${f(x)} ${f(y)})" fill="#6FA83A"/>`).join('') + puntos(8).map(([x, y]) => `<rect x="${f(x - 1.6)}" y="${f(y - 1.6)}" width="3.2" height="3.2" fill="#FFFFFF"/>`).join('');
      case 'cristales': return puntos(14).map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="2" fill="#FFFFFF" opacity=".55"/>`).join('');
      default: return '';
    }
  }

  function dibujoSabor(s, i) {
    const id = `sb${i}`;
    const azar = azarCon(i * 97 + 13);
    const bola = pathBola(120, 140, 84);
    const cup = 'M50 150H190L174 284Q173 292 165 292H75Q67 292 66 284Z';
    const recipiente = i % 2 === 0
      ? `<defs><pattern id="${id}w" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" fill="#E3AE74"/><path d="M0 0H16M0 0V16" stroke="#B87A45" stroke-width="3.5"/></pattern></defs>
         <path d="M62 152H178L120 292Z" fill="url(#${id}w)" stroke="#3A2118" stroke-width="3" stroke-linejoin="round"/>
         <rect x="52" y="138" width="136" height="24" rx="12" fill="#D99A5E" stroke="#3A2118" stroke-width="3"/>`
      : `<defs><clipPath id="${id}v"><path d="${cup}"/></clipPath></defs>
         <path d="${cup}" fill="#FFF5E9"/>
         <g clip-path="url(#${id}v)" fill="${esRojizo(s.fondo) ? '#9AD7EA' : '#F3A5B6'}">${[0, 1, 2, 3, 4].map(k => `<rect x="${52 + k * 30}" y="140" width="14" height="160" transform="skewX(-6)"/>`).join('')}</g>
         <path d="${cup}" fill="none" stroke="#3A2118" stroke-width="3" stroke-linejoin="round"/>
         <rect x="42" y="138" width="156" height="20" rx="10" fill="#FFF5E9" stroke="#3A2118" stroke-width="3"/>`;
    const goteo = s.topping === 'sal'
      ? `<path d="M164 146c2 16 6 26 2 36-3 8-12 6-12-2 0-10 2-20 0-32Z" fill="${s.bola}" stroke="#3A2118" stroke-width="3" stroke-linejoin="round"/>`
      : '';
    return `<svg viewBox="0 0 240 300" aria-hidden="true" focusable="false">
      ${recipiente}
      <defs><clipPath id="${id}b"><path d="${bola}"/></clipPath></defs>
      ${goteo}
      <path d="${bola}" fill="${s.bola}"/>
      <g clip-path="url(#${id}b)">
        <ellipse cx="120" cy="166" rx="104" ry="36" fill="#3A2118" opacity=".1"/>
        <ellipse cx="90" cy="86" rx="30" ry="14" transform="rotate(-24 90 86)" fill="#FFFFFF" opacity=".42"/>
        ${toppings(s.topping, azar)}
      </g>
      <path d="${bola}" fill="none" stroke="#3A2118" stroke-width="3" stroke-linejoin="round"/>
    </svg>`;
  }

  function pintarSabores() {
    const pista = $('.sabores__track'), final = $('.sabores__outro');
    const tarjetas = CONFIG.sabores.map((s, i) => {
      const nombreCompleto = `${s.nombre} ${s.detalle || ''}`.trim();
      const mensaje = CONFIG.mensajeSabor.replace(/\{sabor\}/g, () => nombreCompleto);
      const numero = String(i + 1).padStart(2, '0');
      return `
        <article class="sabor sabor--v${i % 3}${s.oscuro ? ' sabor--oscuro' : ''}" style="--card:${esc(s.fondo)}">
          <span class="sabor__big" aria-hidden="true">${numero}</span>
          <div class="sabor__art">
            ${dibujoSabor(s, i)}
            <!-- FOTO REAL: aquí iría una foto del helado, p. ej. <img src="img/sabor-${i + 1}.webp" alt="Helado de ${esc(nombreCompleto)}"> -->
          </div>
          <div class="sabor__body">
            <p class="sabor__num">N.º ${numero}</p>
            <h3 class="sabor__name">${esc(s.nombre)}${s.detalle ? ` <em>${esc(s.detalle)}</em>` : ''}</h3>
            <p class="sabor__desc">${esc(s.descripcion)}</p>
            <div class="sabor__foot">
              <p class="sabor__price"><strong>${precio(s.precio)}</strong><span>la bola</span></p>
              <a class="btn btn--sm" href="${esc(linkWA(mensaje))}" target="_blank" rel="noopener" data-cursor="Pedir" aria-label="Pedir helado de ${esc(nombreCompleto)} por WhatsApp">
                <svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg><span>Pedir</span>
              </a>
            </div>
          </div>
        </article>`;
    }).join('');
    final.insertAdjacentHTML('beforebegin', tarjetas);
  }

  // ----- Ilustraciones de los postres -----
  const TRAZO = 'stroke="#3A2118" stroke-width="3" stroke-linejoin="round"';
  const DIBUJOS = {
    copa: () => `
      <ellipse cx="120" cy="268" rx="60" ry="8" fill="#3A2118" opacity=".12"/>
      <path d="M80 264c0-14 80-14 80 0Z" fill="#DCF1F7" ${TRAZO}/>
      <rect x="111" y="206" width="18" height="54" rx="8" fill="#DCF1F7" ${TRAZO}/>
      <rect x="164" y="44" width="16" height="84" rx="5" transform="rotate(22 172 86)" fill="#E9B98A" ${TRAZO}/>
      <path d="${pathBola(82, 122, 40)}" fill="#F6B8C6" ${TRAZO}/>
      <path d="${pathBola(158, 122, 40)}" fill="#FFF8EC" ${TRAZO}/>
      <path d="${pathBola(120, 90, 40)}" fill="#F8D27F" ${TRAZO}/>
      <path d="M44 132H196C194 182 166 212 120 214 74 212 46 182 44 132Z" fill="#DCF1F7" fill-opacity=".88" ${TRAZO}/>
      <path d="M52 152c22-8 38 12 68 2s46-10 68 0c-6 30-32 56-68 56S58 184 52 152Z" fill="#F3A5B6" opacity=".9"/>
      <path d="M62 146c4 20 14 36 30 46" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".7" fill="none"/>
      <path d="M94 58c-6-14 10-24 20-18 4-14 26-12 26 2 14-2 18 16 6 22H100c-8 0-10-4-6-6Z" fill="#FFFDF8" ${TRAZO}/>
      <path d="M122 30c2-10 8-16 18-18" stroke="#3A2118" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="120" cy="36" r="11" fill="#D9455F" ${TRAZO}/>
      <circle cx="116" cy="32" r="3" fill="#FFFFFF" opacity=".75"/>`,
    paleta: i => `
      <defs>
        <clipPath id="pc${i}"><rect x="62" y="24" width="116" height="178" rx="56"/></clipPath>
        <mask id="pm${i}"><rect width="240" height="280" fill="#fff"/><circle cx="172" cy="34" r="26" fill="#000"/></mask>
      </defs>
      <ellipse cx="120" cy="270" rx="40" ry="6" fill="#3A2118" opacity=".12"/>
      <rect x="106" y="180" width="28" height="86" rx="14" fill="#E8C9A0" ${TRAZO}/>
      <g mask="url(#pm${i})">
        <rect x="62" y="24" width="116" height="178" rx="56" fill="#C2415B"/>
        <g clip-path="url(#pc${i})">
          <path d="M50 124c18 10 34-8 52 4s34 10 50-2 26-4 40 4V220H50Z" fill="#FFF1DC"/>
          <path d="M50 124c18 10 34-8 52 4s34 10 50-2 26-4 40 4" fill="none" ${TRAZO}/>
          <g stroke-width="4" stroke-linecap="round"><path d="M84 152l7 4" stroke="#F3A5B6"/><path d="M112 146l-2 8" stroke="#9AD7EA"/><path d="M140 160l8-2" stroke="#F7C873"/><path d="M98 174l6 5" stroke="#9AD7EA"/><path d="M128 182l8 2" stroke="#F3A5B6"/><path d="M152 140l3 7" stroke="#B9E3A6"/></g>
          <rect x="80" y="50" width="14" height="60" rx="7" fill="#FFFFFF" opacity=".3"/>
        </g>
        <rect x="62" y="24" width="116" height="178" rx="56" fill="none" ${TRAZO}/>
      </g>
      <g clip-path="url(#pc${i})"><circle cx="172" cy="34" r="26" fill="none" ${TRAZO}/></g>`,
    waffle: () => `
      <ellipse cx="120" cy="262" rx="94" ry="10" fill="#3A2118" opacity=".1"/>
      <g transform="rotate(-8 120 196)">
        <rect x="30" y="140" width="180" height="112" rx="26" fill="#E6B47C" ${TRAZO}/>
        ${[0, 1, 2].map(f => [0, 1, 2, 3, 4].map(c => `<rect x="${46 + c * 31}" y="${154 + f * 30}" width="22" height="20" rx="5" fill="#C98E52" opacity=".6"/>`).join('')).join('')}
      </g>
      <path d="${pathBola(120, 134, 60)}" fill="#FFF4D6" ${TRAZO}/>
      <g fill="#3A2118" opacity=".35"><circle cx="100" cy="104" r="1.6"/><circle cx="132" cy="96" r="1.6"/><circle cx="146" cy="118" r="1.6"/><circle cx="112" cy="124" r="1.6"/><circle cx="90" cy="120" r="1.6"/></g>
      <path d="M54 176c16-26 30 10 44-16s24-36 36-6 18 30 30 6 16-18 26 6" fill="none" stroke="#A0612B" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M150 74c4-14 30-14 32 2 2 14-14 26-22 30-8-6-14-18-10-32Z" fill="#E5536F" ${TRAZO}/>
      <g fill="#F7E08A"><circle cx="160" cy="82" r="1.5"/><circle cx="170" cy="90" r="1.5"/><circle cx="162" cy="94" r="1.5"/><circle cx="172" cy="80" r="1.5"/></g>
      <path d="M156 70c-2-10 6-14 10-8 4-6 12-2 10 8" fill="#7FB069" ${TRAZO}/>`,
    torta: () => {
      const capas = [[0, 26, '#F7C873', '#E8B456'], [26, 66, '#FFF1DD', '#F1DFC4'], [66, 92, '#6B4A3A', '#58392C']];
      const izq = capas.map(([a, b, c]) => `<path d="M36 ${120 + a}L96 ${150 + a}V${150 + b}L36 ${120 + b}Z" fill="${c}"/>`).join('');
      const der = capas.map(([a, b, , c]) => `<path d="M96 ${150 + a}L206 ${124 + a}V${124 + b}L96 ${150 + b}Z" fill="${c}"/>`).join('');
      return `
        <ellipse cx="121" cy="228" rx="110" ry="28" fill="#FFF5E9" ${TRAZO}/>
        ${izq}${der}
        <path d="M36 120L146 96 206 124 96 150Z" fill="#F9D88A" ${TRAZO}/>
        <g fill="#2B1B12"><ellipse cx="90" cy="118" rx="2.6" ry="3.8" transform="rotate(30 90 118)"/><ellipse cx="120" cy="128" rx="2.6" ry="3.8"/><ellipse cx="160" cy="116" rx="2.6" ry="3.8" transform="rotate(-20 160 116)"/><ellipse cx="108" cy="108" rx="2.6" ry="3.8" transform="rotate(60 108 108)"/><ellipse cx="176" cy="126" rx="2.6" ry="3.8" transform="rotate(10 176 126)"/></g>
        <path d="M36 120V212L96 242 206 216V124M96 150V242" fill="none" ${TRAZO}/>
        <path d="M60 116l40-9" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".6"/>
        <circle cx="146" cy="104" r="17" fill="#F7C873" ${TRAZO}/>
        <circle cx="146" cy="104" r="10" fill="#E8B456"/>
        <g fill="#2B1B12"><circle cx="142" cy="101" r="1.8"/><circle cx="150" cy="103" r="1.8"/><circle cx="145" cy="108" r="1.8"/></g>
        <path d="M168 94c4-12 18-12 18-2-6 6-12 6-18 2Z" fill="#7FB069" ${TRAZO}/>`;
    }
  };

  function pintarPostres() {
    const velocidades = [.16, -.1, .2, -.08];
    $('.postres__grid').innerHTML = CONFIG.postres.map((p, i) => {
      const mensaje = CONFIG.mensajePostre.replace(/\{postre\}/g, () => p.nombre);
      const dibujo = (DIBUJOS[p.dibujo] || DIBUJOS.copa)(i);
      return `
        <article class="postre postre--${i + 1}" data-velocidad="${velocidades[i % velocidades.length]}">
          <div class="postre__visual forma-${esc(p.forma || 'circulo')}" style="--fondo:${esc(p.fondo || '#FCDDE4')}" data-cursor="Antojo">
            <!-- FOTO REAL: cambia el dibujo por <img src="img/postre-${i + 1}.webp" alt="${esc(p.nombre)}"> -->
            <svg viewBox="0 0 240 280" aria-hidden="true" focusable="false">${dibujo}</svg>
          </div>
          <div class="postre__info">
            <h3 class="postre__name">${esc(p.nombre)}</h3>
            <p class="postre__desc">${esc(p.descripcion)}</p>
            <div class="postre__row">
              <span class="postre__price">${precio(p.precio)}</span>
              <a class="link-pedir" href="${esc(linkWA(mensaje))}" target="_blank" rel="noopener" data-cursor="Pedir" aria-label="Pedir ${esc(p.nombre)} por WhatsApp">Pedir <svg class="ico" aria-hidden="true"><use href="#i-flecha"/></svg></a>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  pintarSabores();
  pintarPostres();


  /* ===================================================================
     4. Horario y "abierto ahora" (hora de Colombia, UTC-5)
     =================================================================== */
  const aMinutos = h => { if (!h) return null; const [hh, mm] = h.split(':').map(Number); return hh * 60 + (mm || 0); };
  function hora12(h) {
    const m = aMinutos(h) % 1440, hh = Math.floor(m / 60), mm = m % 60;
    if (hh === 12 && mm === 0) return '12:00 m.';
    return `${hh % 12 || 12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'a. m.' : 'p. m.'}`;
  }
  const aLas = h => (Math.floor((aMinutos(h) % 1440) / 60) % 12 === 1 ? 'a la ' : 'a las ') + hora12(h);

  function pintarHorario() {
    const ahora = new Date(Date.now() - 5 * 3600 * 1000);
    const hoy = (ahora.getUTCDay() + 6) % 7; // 0 = lunes … 6 = domingo
    const minutos = ahora.getUTCHours() * 60 + ahora.getUTCMinutes();
    const abre = d => d && d.abre && d.cierra;

    $('#horario').innerHTML = CONFIG.horario.map((d, i) => `
      <li class="${i === hoy ? 'is-hoy' : ''}">
        <span>${esc(d.dia)}${i === hoy ? '<em>hoy</em>' : ''}</span>
        <span>${abre(d) ? `${hora12(d.abre)} – ${hora12(d.cierra)}` : 'Cerrado'}</span>
      </li>`).join('');

    const d = CONFIG.horario[hoy];
    let texto = '', abierto = false;
    if (abre(d) && minutos >= aMinutos(d.abre) && minutos < aMinutos(d.cierra)) {
      abierto = true;
      texto = `Abierto · cerramos ${aLas(d.cierra)}`;
    } else if (abre(d) && minutos < aMinutos(d.abre)) {
      texto = `Cerrado · abrimos hoy ${aLas(d.abre)}`;
    } else {
      for (let k = 1; k <= 7; k++) {
        const s = CONFIG.horario[(hoy + k) % 7];
        if (abre(s)) { texto = `Cerrado · abrimos ${k === 1 ? 'mañana' : 'el ' + s.dia.toLowerCase()} ${aLas(s.abre)}`; break; }
      }
    }
    $('#estado-texto').textContent = texto || 'Cerrado temporalmente';
    $('#estado').classList.toggle('is-closed', !abierto);
  }
  pintarHorario();
  setInterval(pintarHorario, 60000);


  /* ===================================================================
     5. Menú móvil, navegación y enlaces
     =================================================================== */
  const nav = $('.nav'), botonMenu = $('.nav__menu'), menu = $('#menu');
  let menuAbierto = false;
  function abrirMenu(abrir) {
    menuAbierto = abrir;
    botonMenu.setAttribute('aria-expanded', String(abrir));
    $('.nav__menu-txt').textContent = abrir ? 'Cerrar' : 'Menú';
    menu.classList.toggle('is-open', abrir);
    menu.setAttribute('aria-hidden', String(!abrir));
    html.classList.toggle('menu-abierto', abrir);
    if (lenis) { if (abrir) lenis.stop(); else lenis.start(); }
    else document.body.style.overflow = abrir ? 'hidden' : '';
  }
  botonMenu.addEventListener('click', () => abrirMenu(!menuAbierto));
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && menuAbierto) { abrirMenu(false); botonMenu.focus(); } });

  // Enlaces internos (con scroll suave si Lenis está activo)
  $$('a[href^="#"]:not(.skip)').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const destino = $(id);
    if (!destino) return;
    if (menuAbierto) abrirMenu(false);
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(destino, { duration: 1.4 });
    }
  }));

  // La barra se esconde al bajar y aparece al subir
  let ultimoY = window.scrollY;
  function alHacerScroll(y) {
    if (y > ultimoY + 4 && y > 160 && !menuAbierto) nav.classList.add('is-hidden');
    else if (y < ultimoY - 4 || y <= 160) nav.classList.remove('is-hidden');
    nav.classList.toggle('is-solid', y > 30);
    ultimoY = y;
  }

  // Relleno líquido de los botones: nace donde entra el cursor
  $$('.btn').forEach(b => {
    const fijar = e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--x', `${e.clientX - r.left}px`);
      b.style.setProperty('--y', `${e.clientY - r.top}px`);
    };
    b.addEventListener('pointerenter', fijar);
    b.addEventListener('pointerleave', fijar);
  });

  // Línea ondulada que une los íconos de los pasos (se recalcula si cambia el tamaño)
  function trazarLinea() {
    const zona = $('.pasos-wrap'), svg = $('.pasos__linea'), linea = $('path', svg);
    const caja = zona.getBoundingClientRect();
    const centros = $$('.paso__icono').map(ic => {
      const r = ic.getBoundingClientRect();
      return [r.left - caja.left + r.width / 2, r.top - caja.top + r.height / 2];
    });
    const f = n => n.toFixed(1);
    let d = `M${f(centros[0][0])} ${f(centros[0][1])}`;
    for (let i = 1; i < centros.length; i++) {
      const [x1, y1] = centros[i - 1], [x2, y2] = centros[i];
      const dx = x2 - x1, dy = y2 - y1, largo = Math.hypot(dx, dy) || 1;
      const nx = -dy / largo, ny = dx / largo, onda = Math.min(60, largo * .2) * (i % 2 ? -1 : 1);
      d += ` C${f(x1 + dx * .33 + nx * onda)} ${f(y1 + dy * .33 + ny * onda)} ${f(x1 + dx * .66 - nx * onda)} ${f(y1 + dy * .66 - ny * onda)} ${f(x2)} ${f(y2)}`;
    }
    svg.setAttribute('viewBox', `0 0 ${f(caja.width)} ${f(caja.height)}`);
    linea.setAttribute('d', d);
  }
  trazarLinea();
  if ('ResizeObserver' in window) new ResizeObserver(trazarLinea).observe($('.pasos-wrap'));
  if (document.fonts) document.fonts.ready.then(trazarLinea);

  // Burbuja del botón flotante (solo en pantallas grandes, para no tapar botones en el celular)
  const flotante = $('.wa-float');
  if (window.matchMedia('(min-width: 900px)').matches) setTimeout(() => {
    flotante.classList.add('muestra-tip');
    setTimeout(() => flotante.classList.remove('muestra-tip'), 4500);
  }, 5000);


  /* ===================================================================
     6. Animaciones
     =================================================================== */
  function sinAnimaciones() {
    // Movimiento reducido o sin GSAP: todo visible y carrusel deslizable con el dedo
    const loader = $('.loader');
    if (loader) loader.remove();
    $('.sabores__hint span').textContent = 'Desliza hacia el lado';
    window.addEventListener('scroll', () => alHacerScroll(window.scrollY), { passive: true });
  }

  function animar() {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Scroll suave
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: .09 });
      lenis.on('scroll', ScrollTrigger.update);
      lenis.on('scroll', e => alHacerScroll(e.scroll));
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      window.addEventListener('scroll', () => alHacerScroll(window.scrollY), { passive: true });
    }

    // ----- Pantalla de carga + entrada de la portada -----
    html.classList.add('is-loading');
    if (lenis) lenis.stop();
    setTimeout(() => html.classList.remove('is-loading'), 6000); // seguro por si algo falla

    const letrasCarga = partirLetras($('.loader__name span'));
    const letrasHero = [...partirLetras($('.hero__word--1')), ...partirLetras($('.hero__word--2'))];
    const extras = ['.hero__meta', '.hero__aside', '.hero__badge', '.hero__scroll'];
    gsap.set(letrasHero, { yPercent: 115, rotate: 8 });
    gsap.set(extras, { autoAlpha: 0, y: 26 });

    const cuenta = $('.loader__count'), num = { v: 0 };
    const entrada = gsap.timeline({ paused: true });
    entrada
      .from(letrasCarga, { yPercent: 120, duration: .9, stagger: .04, ease: 'expo.out' })
      .to('.loader__bar span', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, .15)
      .to(num, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { cuenta.textContent = String(Math.round(num.v)).padStart(2, '0'); } }, .15)
      .to(letrasCarga, { yPercent: -120, duration: .55, stagger: .025, ease: 'expo.in' }, '+=.15')
      .to('.loader', { yPercent: -125, duration: 1.1, ease: 'expo.inOut' }, '-=.25')
      .add(() => {
        html.classList.remove('is-loading');
        if (lenis) lenis.start();
        gsap.to(estado3D, { aparecer: 1, duration: 1.8, ease: 'elastic.out(1, .55)' });
      }, '-=.75')
      .to(letrasHero, { yPercent: 0, rotate: 0, duration: 1.3, stagger: .055, ease: 'expo.out' }, '-=.8')
      .to(extras, { autoAlpha: 1, y: 0, duration: 1, stagger: .08, ease: 'power3.out' }, '-=1')
      .set('.loader', { display: 'none' });
    Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), espera(1500)]).then(() => entrada.play());

    // ----- Portada: las palabras se separan y el helado sube al bajar -----
    const enPortada = () => ({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true });
    ScrollTrigger.create({ ...enPortada(), onUpdate: s => { estado3D.scroll = s.progress; } });
    gsap.to('.hero__word--1', { xPercent: -14, ease: 'none', scrollTrigger: enPortada() });
    gsap.to('.hero__word--2', { xPercent: 12, ease: 'none', scrollTrigger: enPortada() });
    gsap.to('.hero__blobs', { yPercent: 14, ease: 'none', scrollTrigger: enPortada() });

    // ----- Sabores: carrusel horizontal que avanza con el scroll -----
    const sabores = $('.sabores'), pista = $('.sabores__track'), barra = $('.sabores__progress span');
    sabores.classList.add('is-pinned');
    $('.sabores__hint span').textContent = 'Sigue bajando';
    const distancia = () => Math.max(0, pista.scrollWidth - window.innerWidth);
    const horizontal = gsap.to(pista, {
      x: () => -distancia(),
      ease: 'none',
      scrollTrigger: {
        trigger: sabores, start: 'top top', end: () => '+=' + distancia(),
        pin: true, scrub: .9, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: s => gsap.set(barra, { scaleX: s.progress })
      }
    });
    $$('.sabor__art').forEach(arte => {
      gsap.fromTo(arte, { rotate: -9, xPercent: 12 }, {
        rotate: 7, xPercent: -12, ease: 'none',
        scrollTrigger: { trigger: arte.closest('.sabor'), containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true }
      });
    });

    // ----- Títulos: palabras que suben desde una máscara -----
    $$('[data-titulo]').forEach(el => {
      const piezas = envolverPalabras(el, true);
      gsap.from(piezas, { yPercent: 115, rotate: 4, duration: 1.15, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
    });

    // ----- Historia: el texto se revela palabra por palabra -----
    $$('[data-palabras]').forEach(el => {
      envolverPalabras(el, false);
      gsap.fromTo($$('.w, .pill', el), { opacity: .14 }, {
        opacity: 1, ease: 'none', stagger: .1,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 52%', scrub: true }
      });
    });

    // ----- Elementos que aparecen suave al entrar en pantalla -----
    const suaves = $$('.folio, .sabores__text, .sabores__hint, .sabores__outro-price, .historia__foto, .historia__caption, .historia__firma, .postres__intro, .paso__num, .paso h3, .paso p, .pedidos__cta, .footer__cta, .footer__cols > div');
    gsap.set(suaves, { autoAlpha: 0, y: 34 });
    ScrollTrigger.batch(suaves, {
      start: 'top 92%', once: true,
      onEnter: lote => gsap.to(lote, { autoAlpha: 1, y: 0, duration: 1, stagger: .08, ease: 'power3.out', overwrite: true })
    });

    // ----- Postres: parallax a distintas velocidades + inclinación 3D -----
    $$('.postre').forEach(p => {
      const v = parseFloat(p.dataset.velocidad) || .1;
      const visual = $('.postre__visual', p);
      gsap.fromTo(p, { y: () => window.innerHeight * v * .5 }, {
        y: () => -window.innerHeight * v * .5, ease: 'none',
        scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
      });
      gsap.from(visual, { scale: .82, rotate: v > 0 ? -7 : 7, autoAlpha: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 90%' } });
    });
    if (punteroFino) {
      $$('.postre__visual').forEach(visual => {
        const dibujo = $('svg', visual);
        gsap.set(dibujo, { z: 60 });
        visual.addEventListener('pointermove', e => {
          const r = visual.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          gsap.to(visual, { rotationY: x * 20, rotationX: -y * 18, transformPerspective: 900, duration: .6, ease: 'power3.out' });
          gsap.to(dibujo, { x: x * 22, y: y * 22, duration: .6, ease: 'power3.out' });
        });
        visual.addEventListener('pointerleave', () => {
          gsap.to(visual, { rotationY: 0, rotationX: 0, duration: 1.4, ease: 'elastic.out(1, .4)' });
          gsap.to(dibujo, { x: 0, y: 0, duration: 1.4, ease: 'elastic.out(1, .4)' });
        });
      });
    }

    // ----- Pedidos: la línea se dibuja y los íconos saltan -----
    $$('.pasos__linea path').forEach(path => {
      gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.pasos-wrap', start: 'top 72%', end: 'bottom 62%', scrub: true } });
    });
    $$('.paso__icono').forEach(icono => {
      gsap.from(icono, { scale: .3, rotate: -24, autoAlpha: 0, duration: 1, ease: 'back.out(2.2)', scrollTrigger: { trigger: icono, start: 'top 86%' } });
    });

    // ----- Visítanos -----
    gsap.fromTo('.visita__mapa', { clipPath: 'inset(12% 10% 12% 10% round 60px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: '.visita__mapa', start: 'top 85%' }
    });
    gsap.from('.mapa__pin', { yPercent: -160, autoAlpha: 0, duration: 1.2, ease: 'bounce.out', delay: .3, scrollTrigger: { trigger: '.visita__mapa', start: 'top 70%' } });
    gsap.from('.visita__card', { y: 90, rotate: 6, autoAlpha: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.visita__card', start: 'top 92%' } });
    gsap.from('.visita__sticker', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.visita', start: 'top 70%' } });

    // ----- Footer: el nombre gigante sube letra por letra -----
    const letrasFooter = partirLetras($('.footer__wordmark'));
    gsap.from(letrasFooter, { yPercent: 100, duration: 1.3, stagger: .045, ease: 'expo.out', scrollTrigger: { trigger: '.footer__wordmark', start: 'top 98%' } });

    // ----- Cintas: se aceleran con la velocidad del scroll -----
    const cintas = $$('.marquee__track').map(t => (t.getAnimations ? t.getAnimations()[0] : null)).filter(Boolean);
    let velocidad = 0;
    if (lenis) lenis.on('scroll', e => { velocidad = e.velocity; });
    else {
      let yPrevio = window.scrollY;
      window.addEventListener('scroll', () => { velocidad = (window.scrollY - yPrevio) * .6; yPrevio = window.scrollY; }, { passive: true });
    }
    gsap.ticker.add(() => {
      const meta = 1 + Math.min(Math.abs(velocidad) * .25, 4);
      cintas.forEach(a => { a.playbackRate += (meta - a.playbackRate) * .08; });
      velocidad *= .92;
    });

    // Recalcula posiciones cuando cargan las fuentes y la página
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }


  /* ===================================================================
     7. Cursor personalizado y botones magnéticos (solo computador)
     =================================================================== */
  function iniciarCursor() {
    const { gsap } = window;
    const cursor = $('.cursor'), punto = $('.cursor__dot'), aro = $('.cursor__ring'), etiqueta = $('.cursor__label');
    html.classList.add('has-cursor');
    const px = gsap.quickTo(punto, 'x', { duration: .12, ease: 'power3' });
    const py = gsap.quickTo(punto, 'y', { duration: .12, ease: 'power3' });
    const ax = gsap.quickTo(aro, 'x', { duration: .5, ease: 'power3' });
    const ay = gsap.quickTo(aro, 'y', { duration: .5, ease: 'power3' });
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      px(e.clientX); py(e.clientY); ax(e.clientX); ay(e.clientY);
      cursor.classList.add('is-visible');
    }, { passive: true });
    html.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('pointerover', e => {
      const objetivo = e.target.closest('a, button, [data-cursor]');
      const texto = (objetivo && objetivo.dataset.cursor) || '';
      cursor.classList.toggle('is-hover', !!objetivo);
      cursor.classList.toggle('has-label', !!texto);
      etiqueta.textContent = texto;
      cursor.classList.toggle('is-oscuro', !!e.target.closest('[data-tema="oscuro"]'));
    });
    window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

    // Botones magnéticos: se acercan un poco al cursor
    $$('.btn').forEach(b => {
      const xTo = gsap.quickTo(b, 'x', { duration: .7, ease: 'elastic.out(1, .45)' });
      const yTo = gsap.quickTo(b, 'y', { duration: .7, ease: 'elastic.out(1, .45)' });
      b.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = b.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * .22);
        yTo((e.clientY - (r.top + r.height / 2)) * .3);
      });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  if (hayGSAP && !reduce) {
    animar();
    if (punteroFino) iniciarCursor();
  } else {
    sinAnimaciones();
  }


  /* ===================================================================
     8. Helado 3D (Three.js)
     Si Three.js o WebGL no están disponibles, se queda la ilustración SVG.
     =================================================================== */
  const FUENTES_THREE = [
    'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js',
    'https://unpkg.com/three@0.165.0/build/three.module.min.js'
  ];
  async function cargarThree() {
    for (const url of FUENTES_THREE) {
      try { return await import(url); } catch (e) { /* probamos la siguiente fuente */ }
    }
    throw new Error('Three.js no disponible');
  }
  function hayWebGL() {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch (e) { return false; }
  }

  function iniciarHelado(THREE) {
    const stage = $('.hero__stage'), canvas = $('#helado3d');
    const V = THREE.Vector3;
    const azar = azarCon(7);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.02;

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(26, 1, .1, 100);

    // Luz cálida de atardecer + un borde azul caribe
    escena.add(new THREE.HemisphereLight(0xfff3e4, 0xf3b9c4, 1.5));
    const sol = new THREE.DirectionalLight(0xffe3c4, 2.3);
    sol.position.set(3.5, 5, 4.5);
    const borde = new THREE.DirectionalLight(0x9ad7ea, 1.7);
    borde.position.set(-4.5, 2.5, -3);
    const calido = new THREE.DirectionalLight(0xffb48a, .55);
    calido.position.set(-3, -2, 4);
    escena.add(sol, borde, calido);

    const soporte = new THREE.Group();  // flota, se inclina y sigue al puntero
    const helado = new THREE.Group();   // gira
    soporte.add(helado);
    escena.add(soporte);
    helado.position.y = -.42;

    // Ruido suave para que las bolas no sean esferas perfectas
    const hash = (x, y, z) => {
      let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1440662683);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
    const ruido = (x, y, z) => {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      const s = t => t * t * (3 - 2 * t);
      const u = s(x - xi), v = s(y - yi), w = s(z - zi);
      const l = (a, b, t) => a + (b - a) * t;
      const c = (a, b, d) => hash(xi + a, yi + b, zi + d);
      return l(l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
               l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
    };
    const fbm = (x, y, z) => ruido(x, y, z) * .6 + ruido(x * 2.1, y * 2.1, z * 2.1) * .28 + ruido(x * 4.3, y * 4.3, z * 4.3) * .12;

    // Forma de la bola: irregular, con el "borde de cuchara" abajo y la base metida
    function desplazar(n, semilla) {
      const th = Math.atan2(n.z, n.x);
      let d = fbm(n.x * 1.7 + semilla, n.y * 1.7 + semilla * .5, n.z * 1.7) * .085;
      const falda = Math.exp(-(((n.y + .32) / .11) ** 2));
      d += falda * (.07 + Math.sin(th * 8 + semilla) * .03 + fbm(n.x * 6 + semilla, n.y * 6, n.z * 6) * .04);
      if (n.y < -.42) d -= (-n.y - .42) * .45;
      return d;
    }
    function puntoBola(n, r, semilla, out) {
      out.copy(n).multiplyScalar(r * (1 + desplazar(n, semilla)));
      out.y *= .92;
      return out;
    }
    // Promedia normales de vértices repetidos (costura y polos) para que no se vean líneas
    function suavizarNormales(geo) {
      const p = geo.attributes.position, nor = geo.attributes.normal, grupos = new Map();
      for (let i = 0; i < p.count; i++) {
        const k = `${p.getX(i).toFixed(4)},${p.getY(i).toFixed(4)},${p.getZ(i).toFixed(4)}`;
        const g = grupos.get(k) || { x: 0, y: 0, z: 0, ids: [] };
        g.x += nor.getX(i); g.y += nor.getY(i); g.z += nor.getZ(i); g.ids.push(i);
        grupos.set(k, g);
      }
      grupos.forEach(g => {
        const l = Math.hypot(g.x, g.y, g.z) || 1;
        g.ids.forEach(i => nor.setXYZ(i, g.x / l, g.y / l, g.z / l));
      });
      nor.needsUpdate = true;
    }

    function geoBola(r, semilla, base, motas) {
      const geo = new THREE.SphereGeometry(1, 96, 64);
      const p = geo.attributes.position, n = new V(), q = new V();
      const colores = new Float32Array(p.count * 3), c = new THREE.Color(), cBase = new THREE.Color(base), cMotas = new THREE.Color(motas);
      for (let i = 0; i < p.count; i++) {
        n.fromBufferAttribute(p, i).normalize();
        puntoBola(n, r, semilla, q);
        p.setXYZ(i, q.x, q.y, q.z);
        c.copy(cBase).offsetHSL(0, 0, fbm(n.x * 2.5 + semilla, n.y * 2.5, n.z * 2.5) * .035);
        const m = ruido(n.x * 11 + semilla * 3, n.y * 11, n.z * 11);
        if (m > .55) c.lerp(cMotas, Math.min(1, (m - .55) * 3.5));
        colores[i * 3] = c.r; colores[i * 3 + 1] = c.g; colores[i * 3 + 2] = c.b;
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colores, 3));
      geo.computeVertexNormals();
      suavizarNormales(geo);
      return geo;
    }
    // Material mate, aterciopelado (nada de plástico brillante)
    const matHelado = brillo => new THREE.MeshPhysicalMaterial({
      vertexColors: true, roughness: .8, metalness: 0,
      sheen: .8, sheenRoughness: .55, sheenColor: new THREE.Color(brillo)
    });

    function semillas(r, semilla, cantidad) {
      const im = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshStandardMaterial({ color: '#2B1A10', roughness: .5 }), cantidad);
      const o = new THREE.Object3D(), n = new V(), q = new V(), arriba = new V(0, 1, 0);
      for (let k = 0; k < cantidad; k++) {
        const th = azar() * Math.PI * 2, y = Math.min(.95, -.2 + azar() * 1.15), s = Math.sqrt(1 - y * y);
        n.set(Math.cos(th) * s, y, Math.sin(th) * s).normalize();
        puntoBola(n, r, semilla, q);
        o.position.copy(q).addScaledVector(n, -.004);
        o.quaternion.setFromUnitVectors(arriba, n);
        o.rotateY(azar() * Math.PI);
        o.scale.set(.034, .018, .05);
        o.updateMatrix();
        im.setMatrixAt(k, o.matrix);
      }
      return im;
    }

    // Cobertura de chocolate con chorritos que bajan, gotitas y chispitas de colores
    function cobertura(r, semilla) {
      const chorros = Array.from({ length: 7 }, (_, k) => ({ th: (k / 7) * Math.PI * 2 + azar() * .6, a: .22 + azar() * .55, w: .1 + azar() * .1 }));
      const limite = th => {
        let b = .92 + .05 * Math.sin(th * 5 + 1);
        chorros.forEach(c => { const d = Math.atan2(Math.sin(th - c.th), Math.cos(th - c.th)); b += c.a * Math.exp(-((d / c.w) ** 2)); });
        return b;
      };
      const geo = new THREE.SphereGeometry(1, 128, 72);
      const p = geo.attributes.position, n = new V(), q = new V(), nb = new V();
      for (let i = 0; i < p.count; i++) {
        n.fromBufferAttribute(p, i).normalize();
        const phi = Math.acos(THREE.MathUtils.clamp(n.y, -1, 1)), th = Math.atan2(n.z, n.x), b = limite(th);
        if (phi <= b) {
          puntoBola(n, r, semilla, q);
          const orilla = Math.max(0, 1 - (b - phi) / .07);
          q.addScaledVector(n, r * (.028 + orilla * .014));
        } else {
          nb.set(Math.sin(b) * Math.cos(th), Math.cos(b), Math.sin(b) * Math.sin(th));
          puntoBola(nb, r, semilla, q);
          q.addScaledVector(nb, -r * .03);
        }
        p.setXYZ(i, q.x, q.y, q.z);
      }
      geo.computeVertexNormals();
      suavizarNormales(geo);

      const grupo = new THREE.Group();
      const matChoco = new THREE.MeshStandardMaterial({ color: '#4A2A1C', roughness: .5, metalness: 0 });
      grupo.add(new THREE.Mesh(geo, matChoco));
      chorros.filter(c => c.a > .45).forEach(c => {
        const b = limite(c.th) - .03;
        nb.set(Math.sin(b) * Math.cos(c.th), Math.cos(b), Math.sin(b) * Math.sin(c.th));
        puntoBola(nb, r, semilla, q);
        const gota = new THREE.Mesh(new THREE.SphereGeometry(r * .065, 16, 12), matChoco);
        gota.position.copy(q).addScaledVector(nb, r * .02);
        gota.scale.y = 1.35;
        grupo.add(gota);
      });

      const cuantas = 46, colores = ['#F3A5B6', '#9AD7EA', '#FFF5E9', '#F7C873', '#B9E3A6'];
      const chispas = new THREE.InstancedMesh(new THREE.CapsuleGeometry(.017, .07, 3, 8), new THREE.MeshStandardMaterial({ roughness: .65 }), cuantas);
      const o = new THREE.Object3D(), t = new V(), arriba = new V(0, 1, 0), aux = new V(), color = new THREE.Color();
      for (let k = 0; k < cuantas; k++) {
        const th = azar() * Math.PI * 2, phi = Math.sqrt(azar()) * .78;
        n.set(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
        puntoBola(n, r, semilla, q);
        o.position.copy(q).addScaledVector(n, r * .045);
        aux.set(azar() - .5, azar() - .5, azar() - .5);
        t.crossVectors(n, aux).normalize();
        o.quaternion.setFromUnitVectors(arriba, t);
        o.updateMatrix();
        chispas.setMatrixAt(k, o.matrix);
        chispas.setColorAt(k, color.set(colores[k % colores.length]));
      }
      grupo.add(chispas);
      return grupo;
    }

    // Cono de waffle con textura dibujada en un canvas (sin imágenes externas)
    function texturaWaffle() {
      const dibujar = (fondo, linea, conGrano) => {
        const c = document.createElement('canvas');
        c.width = c.height = 256;
        const x = c.getContext('2d');
        x.fillStyle = fondo;
        x.fillRect(0, 0, 256, 256);
        if (conGrano) {
          for (let k = 0; k < 900; k++) {
            x.fillStyle = azar() > .5 ? 'rgba(255,240,215,.18)' : 'rgba(150,90,40,.14)';
            x.fillRect(azar() * 256, azar() * 256, 2, 2);
          }
        }
        [[18, .28], [12, .6], [7, 1]].forEach(([ancho, alfa]) => {
          x.strokeStyle = linea;
          x.globalAlpha = alfa;
          x.lineWidth = ancho;
          for (let k = -256; k <= 512; k += 64) {
            x.beginPath(); x.moveTo(k, 0); x.lineTo(k + 256, 256); x.stroke();
            x.beginPath(); x.moveTo(k, 256); x.lineTo(k + 256, 0); x.stroke();
          }
        });
        return c;
      };
      const color = new THREE.CanvasTexture(dibujar('#E9B67E', '#B57841', true));
      color.colorSpace = THREE.SRGBColorSpace;
      const relieve = new THREE.CanvasTexture(dibujar('#FFFFFF', '#3A3A3A', false));
      [color, relieve].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 3.2); t.anisotropy = 4; });
      return { color, relieve };
    }
    function cono() {
      const tex = texturaWaffle();
      const geo = new THREE.ConeGeometry(.9, 2.55, 72, 8, true);
      geo.rotateX(Math.PI);
      geo.translate(0, -1.275, 0);
      const cuerpo = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex.color, bumpMap: tex.relieve, bumpScale: 2.2, roughness: .9 }));
      const aro = new THREE.Mesh(new THREE.TorusGeometry(.9, .085, 16, 80), new THREE.MeshStandardMaterial({ map: tex.color, color: '#E8B27A', roughness: .9 }));
      aro.rotation.x = Math.PI / 2;
      const grupo = new THREE.Group();
      grupo.add(cuerpo, aro);
      return grupo;
    }

    // Armado: cono + maracuyá (abajo) + fresa + coco con chocolate (arriba)
    helado.add(cono());
    [
      { r: .98, pos: [0, .52, 0], base: '#F7CF78', motas: '#E9A23B', brillo: '#FFF1D6', semilla: 1.3, extra: g => g.add(semillas(.98, 1.3, 34)) },
      { r: .9, pos: [.05, 1.62, .03], base: '#F5B3C3', motas: '#DE6F8C', brillo: '#FFE6EC', semilla: 4.1 },
      { r: .8, pos: [-.05, 2.6, -.02], base: '#FFF6EA', motas: '#E9D3B4', brillo: '#FFFFFF', semilla: 7.7, extra: g => g.add(cobertura(.8, 7.7)) }
    ].forEach((b, k) => {
      const grupo = new THREE.Group();
      grupo.add(new THREE.Mesh(geoBola(b.r, b.semilla, b.base, b.motas), matHelado(b.brillo)));
      if (b.extra) b.extra(grupo);
      grupo.position.set(...b.pos);
      grupo.rotation.set(0, k * 1.7, (k - 1) * .05);
      helado.add(grupo);
    });

    // Cámara que se adapta al tamaño (celular o computador)
    function ajustar() {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camara.aspect = w / h;
      const t = 2 * Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
      const dist = Math.max(6.4 / t, 3.3 / (t * camara.aspect));
      camara.position.set(0, .5, dist);
      camara.lookAt(0, .1, 0);
      camara.updateProjectionMatrix();
    }
    if ('ResizeObserver' in window) new ResizeObserver(ajustar).observe(stage);
    else window.addEventListener('resize', ajustar);
    ajustar();

    // Sigue al mouse o al dedo con suavidad
    let objX = 0, objY = 0, mx = 0, my = 0, giro = 0, t = 0, visible = true, listo = false;
    if (!reduce) {
      window.addEventListener('pointermove', e => {
        objX = (e.clientX / window.innerWidth) * 2 - 1;
        objY = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
      const soltar = e => { if (e.pointerType !== 'mouse') { objX = 0; objY = 0; } };
      window.addEventListener('pointerup', soltar);
      window.addEventListener('pointercancel', soltar);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);

    const reloj = new THREE.Clock();
    function cuadro() {
      requestAnimationFrame(cuadro);
      const dt = Math.min(reloj.getDelta(), .05);
      if (!visible) return;
      t += dt;
      if (!reduce) giro += dt * .32;
      const k = 1 - Math.pow(.015, dt);
      mx += (objX - mx) * k;
      my += (objY - my) * k;
      const a = estado3D.aparecer, s = estado3D.scroll;
      helado.rotation.y = giro + mx * .8 - (1 - a) * 2.4;
      soporte.rotation.x = .1 + my * .2 + s * .35;
      soporte.rotation.z = -mx * .14;
      soporte.position.y = (reduce ? 0 : Math.sin(t * 1.2) * .06) + s * 1.4 - (1 - a) * 1.2;
      soporte.scale.setScalar(.6 + a * .4);
      renderer.render(escena, camara);
      if (!listo) { listo = true; stage.classList.add('is-3d'); }
    }
    cuadro();
  }

  if (hayWebGL()) {
    cargarThree()
      .then(THREE => iniciarHelado(THREE))
      .catch(err => console.warn('Helado 3D no disponible; se muestra la ilustración:', err));
  }
})();
