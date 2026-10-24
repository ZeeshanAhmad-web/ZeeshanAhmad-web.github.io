/* zeeshanahmad.art */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- pill nav indicator ---- */
  const nav = $('.pillnav');
  const ind = $('.pill-ind', nav);
  const links = $$('a', nav);
  let active = links[0];
  function moveTo(el) {
    if (!el) return;
    ind.style.width = el.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + el.offsetLeft + 'px)';
    links.forEach(l => l.classList.toggle('on', l === el));
  }
  links.forEach(l => {
    l.addEventListener('mouseenter', () => moveTo(l));
    l.addEventListener('focus', () => moveTo(l));
  });
  nav.addEventListener('mouseleave', () => moveTo(active));
  addEventListener('resize', () => moveTo(active));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveTo(active));
  moveTo(active);

  /* ---- grid layout and filters ---- */
  const grid = $('#grid');
  const cards = $$('.card', grid);
  const names = { all: 'Selected work', everything: 'All work', game: 'Game & concept art', publishing: 'Publishing', product: 'Product illustration', personal: 'Personal' };
  const catNames = { game: 'Game & concept art', publishing: 'Publishing', product: 'Product illustration', personal: 'Personal' };
  let current = 'all';
  const hashFor = { all: '', everything: 'all-work', game: 'game', publishing: 'publishing', product: 'product', personal: 'personal' };
  const fromHash = h => (h === 'all-work' ? 'everything' : (h in hashFor && h !== 'all' ? h : null));

  function listFor(cat) {
    if (cat === 'all') return cards.filter(c => c.dataset.feat).sort((a, b) => a.dataset.feat - b.dataset.feat);
    if (cat === 'everything') return cards.slice();
    return cards.filter(c => c.dataset.cat === cat).concat(cards.filter(c => c.dataset.also === cat));
  }

  function layout(cat) {
    const vis = listFor(cat);
    cards.forEach(c => {
      c.hidden = !vis.includes(c);
      c.classList.remove('hero', 'wide');
      c.style.gridColumn = '';
      c.style.order = '';
    });
    vis.forEach((c, i) => { c.style.order = i; });
    const list = vis.slice();
    if (cat === 'all' && list.length) {
      const h = list.shift();
      h.classList.add('hero');
      h.style.gridColumn = '1 / -1';
    }
    let flip = false;
    for (let i = 0; i < list.length; i += 2) {
      const a = list[i], b = list[i + 1];
      if (!b) { a.classList.add('wide'); a.style.gridColumn = '1 / -1'; break; }
      a.style.gridColumn = 'span ' + (flip ? 4 : 6);
      b.style.gridColumn = 'span ' + (flip ? 6 : 4);
      flip = !flip;
    }
    $('#work-label').textContent = names[cat];
    $('#work-count').textContent = String(vis.length).padStart(2, '0');
    $('#reset').hidden = cat === 'all';
    $('#all-works').hidden = cat === 'everything';
  }

  function setFilter(cat, opts = {}) {
    if (!names[cat]) cat = 'all';
    const run = () => layout(cat);
    if (!opts.instant && !reduce && cat !== current && document.startViewTransition) document.startViewTransition(run);
    else run();
    current = cat;
    active = links.find(l => l.dataset.filter === cat) || links[0];
    moveTo(active);
    const h = hashFor[cat];
    try { history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); } catch (err) {}
    if (opts.scroll !== false) $('#work').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-filter]');
    if (!a) return;
    e.preventDefault();
    closeSheet();
    const cat = a.dataset.filter;
    if (cat === 'all') { setFilter('all', { scroll: false }); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
    else setFilter(cat);
  });
  $('#reset').addEventListener('click', () => setFilter('all'));
  $('#all-works').addEventListener('click', () => setFilter('everything'));

  layout('all');
  const start = fromHash((location.hash || '').slice(1));
  if (start) setFilter(start, { instant: true, scroll: false });
  addEventListener('hashchange', () => {
    const cat = fromHash((location.hash || '').slice(1));
    if (cat && cat !== current) setFilter(cat);
  });

  /* ---- mobile menu ---- */
  const menuBtn = $('.menu-btn');
  const sheet = $('#sheet');
  function closeSheet() {
    if (!sheet.classList.contains('open')) return;
    sheet.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu';
    document.documentElement.classList.remove('locked');
  }
  menuBtn.addEventListener('click', () => {
    if (sheet.classList.contains('open')) return closeSheet();
    sheet.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.textContent = 'Close';
    document.documentElement.classList.add('locked');
  });
  $$('a:not([data-filter])', sheet).forEach(a => a.addEventListener('click', closeSheet));

  /* ---- reveal on scroll (elements stay visible at rest) ---- */
  const io = ('IntersectionObserver' in window && !reduce) ? new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.remove('pending');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }) : null;

  function arm(el, delay) {
    if (!io) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.92) return;
    if (delay) el.style.setProperty('--d', delay + 'ms');
    el.classList.add('pending');
    io.observe(el);
  }

  const st = $('#statement');
  let wi = 0;
  [...st.childNodes].forEach(node => {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.className = 'w'; s.style.setProperty('--i', wi++); s.textContent = part;
        frag.appendChild(s);
      });
      node.replaceWith(frag);
    } else if (node.nodeType === 1) {
      node.classList.add('w'); node.style.setProperty('--i', wi++);
    }
  });

  listFor('all').forEach((c, i) => arm(c, (i % 2) * 110));
  arm(st); arm($('#rows'));

  /* ---- gentle parallax inside cards ---- */
  let ticking = false;
  function parallax() {
    ticking = false;
    const vh = innerHeight;
    cards.forEach(c => {
      if (c.hidden || c.classList.contains('paper')) return;
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      c.querySelector('img').style.setProperty('--py', (p * -r.height * 0.05).toFixed(1) + 'px');
    });
  }
  if (!reduce) {
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
    parallax();
  }

  /* ---- follow cursor over artwork ---- */
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.documentElement.classList.add('has-cursor');
    const cur = $('.cursor');
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, s = 0, ts = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    grid.addEventListener('pointerover', e => { if (e.target.closest('.card')) ts = 1; });
    grid.addEventListener('pointerout', e => { if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest('.card')) ts = 0; });
    (function loop() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2; s += (ts - s) * 0.16;
      cur.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
      requestAnimationFrame(loop);
    })();
  }

  /* ---- sketchbook strip: drifts on its own, drag or swipe to move it ---- */
  const mq = $('#marquee'), track = $('#track');
  let tx0 = 0, half = 0, vel = 0, dragging = false, lastX = 0, lastT = 0, hovering = false, moved = 0;
  const drift = reduce ? 0 : 0.4;
  const measure = () => { half = track.scrollWidth / 2; };
  $$('img', track).forEach(im => { if (!im.complete) im.addEventListener('load', measure); });
  addEventListener('resize', measure);
  addEventListener('load', measure);
  measure();
  mq.addEventListener('pointerdown', e => {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true; moved = 0; vel = 0;
    lastX = e.clientX; lastT = performance.now();
    try { mq.setPointerCapture(e.pointerId); } catch (err) {}
    mq.classList.add('dragging');
  });
  mq.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now(), dx = e.clientX - lastX;
    tx0 += dx; moved += Math.abs(dx);
    vel = dx / Math.max(1, now - lastT) * 16;
    lastX = e.clientX; lastT = now;
  });
  const release = () => { if (!dragging) return; dragging = false; mq.classList.remove('dragging'); };
  mq.addEventListener('pointerup', release);
  mq.addEventListener('pointercancel', release);
  mq.addEventListener('lostpointercapture', release);
  mq.addEventListener('mouseenter', () => { hovering = true; });
  mq.addEventListener('mouseleave', () => { hovering = false; });
  mq.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); tx0 -= e.deltaX; }
  }, { passive: false });
  (function tick() {
    if (!dragging) {
      tx0 += vel; vel *= 0.94;
      if (Math.abs(vel) < 0.05) vel = 0;
      if (!hovering && vel === 0) tx0 -= drift;
    }
    if (half > 0) tx0 = ((tx0 % half) - half) % half;
    track.style.transform = 'translate3d(' + tx0.toFixed(1) + 'px,0,0)';
    requestAnimationFrame(tick);
  })();

  /* ---- case viewer ---- */
  const dlg = $('#viewer');
  const fig = $('#v-fig');
  const vimg = $('#v-img');
  const thumbs = $('#v-thumbs');
  let order = [], idx = 0;
  function swapTo(src, alt) {
    vimg.src = src; vimg.alt = alt || '';
    fig.classList.remove('swap'); void fig.offsetWidth; fig.classList.add('swap');
  }
  function show(i) {
    idx = (i + order.length) % order.length;
    const c = order[idx], d = c.dataset, img = c.querySelector('img');
    const srcs = [img.dataset.full || img.getAttribute('src')].concat(d.gallery ? d.gallery.split('|') : []);
    swapTo(srcs[0], img.alt);
    $('#v-title').textContent = d.title;
    $('#v-t').textContent = d.title;
    $('#v-y').textContent = d.year;
    $('#v-c').textContent = catNames[d.cat] || d.cat;
    $('#v-s').textContent = d.scope;
    const desc = $('#v-d');
    desc.hidden = !d.desc; desc.textContent = d.desc || '';
    thumbs.textContent = '';
    thumbs.hidden = srcs.length < 2;
    if (srcs.length > 1) {
      srcs.forEach((src, k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show image ' + (k + 1) + ' of ' + srcs.length);
        b.setAttribute('aria-pressed', k === 0 ? 'true' : 'false');
        const t = document.createElement('img'); t.src = src; t.alt = '';
        b.appendChild(t);
        b.addEventListener('click', () => {
          $$('button', thumbs).forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
          swapTo(src, img.alt);
        });
        thumbs.appendChild(b);
      });
    }
  }
  function openViewer(card) {
    order = listFor(current);
    show(order.indexOf(card));
    dlg.showModal();
    dlg.scrollTop = 0;
    document.documentElement.classList.add('locked');
  }
  function closeViewer() {
    if (!dlg.open) return;
    if (reduce) { dlg.close(); return; }
    dlg.classList.add('closing');
    dlg.addEventListener('animationend', () => { dlg.classList.remove('closing'); dlg.close(); }, { once: true });
  }
  cards.forEach(c => $('.hit', c).addEventListener('click', () => openViewer(c)));
  $('#v-close').addEventListener('click', closeViewer);
  $('#v-prev').addEventListener('click', () => show(idx - 1));
  $('#v-next').addEventListener('click', () => show(idx + 1));
  dlg.addEventListener('cancel', e => { e.preventDefault(); closeViewer(); });
  dlg.addEventListener('close', () => document.documentElement.classList.remove('locked'));
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });

  /* ---- copy email ---- */
  const copyBtn = $('#copy');
  copyBtn.addEventListener('click', () => {
    const text = $('#mail').textContent.trim();
    const done = msg => { copyBtn.textContent = msg; setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 2200); };
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents($('#mail'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      done('Selected, press Ctrl+C');
    };
    try {
      navigator.clipboard.writeText(text).then(() => done('Copied'), fallback);
    } catch (err) { fallback(); }
  });
})();
