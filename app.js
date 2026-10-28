'use strict';
// IMPORTANT: Replace this placeholder with your business email before publishing.
const CONFIG = { contactEmail: 'YOUR_EMAIL@example.com' };

const PRODUCTS = [
  {id:'planters', name:'Coconut Planters', category:'home', type:'HOME & LIFESTYLE', description:'Natural-looking gardening accessories made with repurposed coconut material.', image:'planters.svg'},
  {id:'biochar', name:'Biochar', category:'garden', type:'GARDEN & SOIL', description:'A potential carbon-rich soil amendment, subject to testing and specifications.', image:'biochar.svg'},
  {id:'tableware', name:'Eco Tableware', category:'home', type:'HOME & LIFESTYLE', description:'Exploratory molded plates and bowls from suitable coconut biomass composites.', image:'tableware.svg'},
  {id:'decor', name:'Coconut Décor', category:'home', type:'HOME & LIFESTYLE', description:'Rustic home accents and design-forward coconut-inspired accessories.', image:'decor.svg'},
  {id:'charcoal', name:'Shell Charcoal', category:'material', type:'RAW MATERIAL', description:'A potential carbon material stream for suitable commercial applications.', image:'charcoal.svg'},
  {id:'activated', name:'Activated Carbon', category:'material', type:'RAW MATERIAL', description:'A prospective filtration input requiring specialized processing and validation.', image:'activated.svg'},
  {id:'composite', name:'Composite Materials', category:'material', type:'RAW MATERIAL', description:'Coconut-based fillers and fibers for partner-led material innovation.', image:'composite.svg'},
  {id:'souvenirs', name:'Goa-Inspired Gifts', category:'home', type:'HOME & LIFESTYLE', description:'Thoughtful souvenir concepts designed around circular materials.', image:'souvenirs.svg'}
];
const FIXED = [['Shredding & processing machinery',100000],['Drying equipment',40000],['Collection bins & tools',20000],['Facility setup',30000],['Licensing & registration',10000]];
const MONTHLY = [['Collection & transportation',12000],['Labour',20000],['Electricity & processing',8000],['Facility rent',10000],['Packaging & distribution',5000],['Maintenance & miscellaneous',5000]];
const BASE_KG = 3000, BASE_COST = 60000;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => '₹' + Number(n).toLocaleString('en-IN', {maximumFractionDigits: 0});
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- basket state ---------- */
let basket = [];
try {
  const saved = JSON.parse(localStorage.getItem('cococycleInquiryBasket') || '[]');
  basket = Array.isArray(saved) ? saved.filter(id => PRODUCTS.some(p => p.id === id)) : [];
} catch (_) { basket = []; }

function save() {
  try { localStorage.setItem('cococycleInquiryBasket', JSON.stringify(basket)); } catch (_) {}
  renderBasket();
}
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('visible');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('visible'), 2900);
}
const currentFilter = () => $('#filters .active').dataset.filter;

/* ---------- products ---------- */
function renderProducts(filter = 'all') {
  $('#productGrid').innerHTML = PRODUCTS.filter(p => filter === 'all' || p.category === filter).map((p, i) => `
    <article class="product-card" style="animation-delay:${i * 60}ms">
      <div class="product-art">
        <span class="concept">CONCEPT / PRE-LAUNCH</span>
        <img class="product-photo" src="assets/${p.image}" alt="Concept illustration of ${p.name}" loading="lazy" width="620" height="560">
      </div>
      <div class="product-info">
        <span class="category">${p.type}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <button type="button" data-add="${p.id}" class="${basket.includes(p.id) ? 'added' : ''}">${basket.includes(p.id) ? 'Added to inquiry ✓' : 'Add to inquiry basket <span>↗</span>'}</button>
      </div>
    </article>`).join('');
}
function renderCounts() {
  const c = k => PRODUCTS.filter(p => p.category === k).length;
  $('#countAll').textContent = PRODUCTS.length;
  $('#countHome').textContent = c('home');
  $('#countGarden').textContent = c('garden');
  $('#countMaterial').textContent = c('material');
}

/* ---------- basket UI ---------- */
function renderBasket() {
  const badge = $('#cartCount');
  badge.textContent = basket.length;
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 250);
  $('#basketItems').innerHTML = basket.length ? basket.map(id => {
    const p = PRODUCTS.find(v => v.id === id);
    return `<div class="basket-entry"><img src="assets/${p.image}" alt="" width="68" height="62"><div><h4>${p.name}</h4><small>${p.type} · Concept</small></div><button type="button" data-remove="${id}" aria-label="Remove ${p.name}">Remove</button></div>`;
  }).join('') : '<p class="basket-empty">Your basket is empty. Browse the concepts and add anything you’re interested in.</p>';
  $('#basketCheckout').disabled = !basket.length;
}
function toggleBasket(open) {
  const b = $('#basket');
  b.classList.toggle('open', open);
  b.setAttribute('aria-hidden', String(!open));
  $('#basketOverlay').hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  (open ? $('#cartClose') : $('#cartOpen')).focus();
}
function contactPrefill(interest, msg) {
  $('#interest').value = interest;
  $('#contactForm').elements.message.value = msg;
  toggleBasket(false);
  $('#contact').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
  setTimeout(() => $('#contactForm').elements.name.focus({preventScroll: true}), 500);
}

$('#productGrid').addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const id = btn.dataset.add;
  if (!basket.includes(id)) { basket.push(id); save(); toast('Added to inquiry basket'); }
  else toggleBasket(true);
  renderProducts(currentFilter());
});
$('#filters').addEventListener('click', e => {
  const btn = e.target.closest('[data-filter]');
  if (!btn) return;
  $$('#filters button').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  renderProducts(btn.dataset.filter);
});
$('#cartOpen').onclick = () => toggleBasket(true);
$('#cartClose').onclick = () => toggleBasket(false);
$('#basketOverlay').onclick = () => toggleBasket(false);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if ($('#basket').classList.contains('open')) toggleBasket(false);
    closeMenu();
  }
});
$('#basketItems').onclick = e => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  basket = basket.filter(id => id !== btn.dataset.remove);
  save();
  renderProducts(currentFilter());
};
$('#clearBasket').onclick = () => { basket = []; save(); renderProducts(currentFilter()); };
$('#basketCheckout').onclick = () => contactPrefill('Buying consumer products',
  'I would like more information about these CocoCycle concepts: ' + basket.map(id => PRODUCTS.find(p => p.id === id).name).join(', ') + '.\nPlease share availability, specifications and next steps.');
$$('[data-interest]').forEach(btn => btn.addEventListener('click', () =>
  contactPrefill(btn.dataset.interest, 'I would like to discuss ' + btn.dataset.interest.toLowerCase() + ' with CocoCycle.')));

/* ---------- mobile menu ---------- */
function closeMenu() { $('#navLinks').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', 'false'); }
$('#menuBtn').onclick = () => {
  const opened = $('#navLinks').classList.toggle('open');
  $('#menuBtn').setAttribute('aria-expanded', String(opened));
};
$$('#navLinks a').forEach(link => link.addEventListener('click', closeMenu));

/* ---------- cost explorer ---------- */
function updateCosts() {
  const range = $('#throughput');
  const kg = Number(range.value);
  const cost = Math.max(0, Number($('#monthlyCost').value) || 0);
  const pct = (kg - range.min) / (range.max - range.min) * 100;
  range.style.setProperty('--p', pct + '%');
  const per = cost / kg, base = BASE_COST / BASE_KG;
  $('#throughputLabel').textContent = kg.toLocaleString('en-IN') + ' kg';
  $('#costPerKg').innerHTML = '₹' + per.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' <span>/ kg</span>';
  $('#costTile').textContent = money(cost);
  const diff = per - base;
  $('#costDelta').textContent = Math.abs(diff) < 0.005 ? 'Matches the ₹20.00 baseline'
    : (diff > 0 ? '▲ ₹' : '▼ ₹') + Math.abs(diff).toFixed(2) + ' per kg ' + (diff > 0 ? 'above' : 'below') + ' the ₹20.00 baseline';
}
$('#throughput').addEventListener('input', updateCosts);
$('#monthlyCost').addEventListener('input', updateCosts);
$('#resetCosts').onclick = () => { $('#throughput').value = BASE_KG; $('#monthlyCost').value = BASE_COST; updateCosts(); };
$('#costBreakdown').innerHTML = MONTHLY.map(([name, value]) =>
  `<div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar-fill" data-w="${100 * value / 20000}"></div></div><span>${money(value)}</span></div>`).join('');
const rows = items => items.map(([n, v]) => `<div class="table-row"><span>${n}</span><strong>${money(v)}</strong></div>`).join('') +
  `<div class="table-row"><span>Total</span><strong>${money(items.reduce((s, i) => s + i[1], 0))}</strong></div>`;
$('#fixedRows').innerHTML = rows(FIXED);
$('#monthlyRows').innerHTML = rows(MONTHLY);
$('#breakdownToggle').onclick = () => {
  const el = $('#costTables');
  el.hidden = !el.hidden;
  $('#breakdownToggle').setAttribute('aria-expanded', String(!el.hidden));
  $('#breakdownToggle').innerHTML = el.hidden ? 'View full cost tables <span>＋</span>' : 'Hide full cost tables <span>−</span>';
};

/* ---------- contact form ---------- */
function buildInquiry(f) {
  const d = new FormData(f);
  const v = k => String(d.get(k) || '').trim();
  return {
    subject: 'CocoCycle inquiry: ' + v('interest'),
    body: `Name: ${v('name')}\nEmail: ${v('email')}\nOrganization: ${v('organization') || 'Not provided'}\nInterest: ${v('interest')}\n\nMessage:\n${v('message')}\n\n--\nSent by a visitor through CocoCycle website (email prepared in visitor's email app)`
  };
}
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.currentTarget;
  if (!f.reportValidity()) return;
  if (CONFIG.contactEmail.includes('YOUR_EMAIL')) {
    $('#contactNotice').textContent = 'Site owner setup required: edit CONFIG.contactEmail in app.js to a real email address before inquiries can be sent.';
    toast('Contact email needs configuration');
    return;
  }
  const {subject, body} = buildInquiry(f);
  $('#contactNotice').textContent = 'Your email application should open with a prepared message. Send it there to complete your inquiry; this website does not collect or store submissions.';
  window.location.href = 'mailto:' + encodeURIComponent(CONFIG.contactEmail) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});
$('#copyInquiry').onclick = async () => {
  const f = $('#contactForm');
  if (!f.reportValidity()) return;
  const {subject, body} = buildInquiry(f);
  try { await navigator.clipboard.writeText(subject + '\n\n' + body); toast('Message copied — paste it into any email'); }
  catch (_) { toast('Copy is not available in this browser'); }
};

/* ---------- motion & scroll effects ---------- */
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion) { el.textContent = target.toLocaleString('en-IN'); return; }
  const t0 = performance.now(), dur = 1400;
  const step = now => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * e).toLocaleString('en-IN');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    en.target.querySelectorAll('[data-count]').forEach(countUp);
    en.target.querySelectorAll('.bar-fill').forEach(b => b.style.width = b.dataset.w + '%');
    io.unobserve(en.target);
  }), {threshold: .12, rootMargin: '0px 0px -40px 0px'});
  $$('.reveal').forEach(el => io.observe(el));
  // elements that are not .reveal but hold bars
  const bars = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.querySelectorAll('.bar-fill').forEach(b => b.style.width = b.dataset.w + '%'); bars.unobserve(en.target); }
  }), {threshold: .2});
  bars.observe($('#costBreakdown'));
  // active nav link
  const links = $$('#navLinks a[href^="#"]');
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), {rootMargin: '-45% 0px -50% 0px'});
  links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
} else {
  $$('.reveal').forEach(el => el.classList.add('in'));
  $$('.bar-fill').forEach(b => b.style.width = b.dataset.w + '%');
}

const header = $('#header'), progress = $('#progress'), toTop = $('#toTop'), vbg = $('.vision-bg'), vision = $('.vision');
let ticking = false;
function onScroll() {
  const y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
  header.classList.toggle('scrolled', y > 10);
  progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
  toTop.hidden = y < 800;
  if (!reduceMotion && vision) {
    const r = vision.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) vbg.style.transform = 'translateY(' + ((r.top + r.height / 2 - innerHeight / 2) * -.12) + 'px) scale(1.12)';
  }
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, {passive: true});
toTop.onclick = () => scrollTo({top: 0, behavior: reduceMotion ? 'auto' : 'smooth'});

// hero tilt (fine pointers only)
const frame = $('[data-tilt]');
if (frame && !reduceMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const host = $('#heroVisual');
  host.addEventListener('pointermove', e => {
    const r = host.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    frame.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 7}deg)`;
  });
  host.addEventListener('pointerleave', () => frame.style.transform = '');
}

$('#year').textContent = new Date().getFullYear();
renderCounts();
renderProducts();
renderBasket();
updateCosts();
onScroll();
