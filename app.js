
'use strict';

/* =========================================
   COCOCYCLE WEBSITE — COMPLETE APP.JS
   ========================================= */

/* ---------- Website configuration ---------- */

const CONFIG = {
  // Add your business email when available.
  // Leave empty to let visitors choose a recipient
  // in their email application.
  contactEmail: ''
};

/* ---------- Product catalogue ---------- */

const PRODUCTS = [
  {
    id: 'planters',
    name: 'Coconut Planters',
    category: 'home',
    type: 'HOME & LIFESTYLE',
    description: 'Natural-looking gardening accessories made with repurposed coconut material.',
    image: 'planters.svg'
  },
  {
    id: 'biochar',
    name: 'Biochar',
    category: 'garden',
    type: 'GARDEN & SOIL',
    description: 'A potential carbon-rich soil amendment, subject to testing and specifications.',
    image: 'biochar.svg'
  },
  {
    id: 'tableware',
    name: 'Eco Tableware',
    category: 'home',
    type: 'HOME & LIFESTYLE',
    description: 'Exploratory molded plates and bowls from suitable coconut biomass composites.',
    image: 'tableware.svg'
  },
  {
    id: 'decor',
    name: 'Coconut Décor',
    category: 'home',
    type: 'HOME & LIFESTYLE',
    description: 'Rustic home accents and design-forward coconut-inspired accessories.',
    image: 'decor.svg'
  },
  {
    id: 'charcoal',
    name: 'Shell Charcoal',
    category: 'material',
    type: 'RAW MATERIAL',
    description: 'A potential carbon material stream for suitable commercial applications.',
    image: 'charcoal.svg'
  },
  {
    id: 'activated',
    name: 'Activated Carbon',
    category: 'material',
    type: 'RAW MATERIAL',
    description: 'A prospective filtration input requiring specialized processing and validation.',
    image: 'activated.svg'
  },
  {
    id: 'composite',
    name: 'Composite Materials',
    category: 'material',
    type: 'RAW MATERIAL',
    description: 'Coconut-based fillers and fibers for partner-led material innovation.',
    image: 'composite.svg'
  },
  {
    id: 'souvenirs',
    name: 'Goa-Inspired Gifts',
    category: 'home',
    type: 'HOME & LIFESTYLE',
    description: 'Thoughtful souvenir concepts designed around circular materials.',
    image: 'souvenirs.svg'
  }
];

/* ---------- CocoCycle costing data ---------- */

const FIXED = [
  ['Shredding & processing machinery', 100000],
  ['Drying equipment', 40000],
  ['Collection bins & tools', 20000],
  ['Facility setup', 30000],
  ['Licensing & registration', 10000]
];

const MONTHLY = [
  ['Collection & transportation', 12000],
  ['Labour', 20000],
  ['Electricity & processing', 8000],
  ['Facility rent', 10000],
  ['Packaging & distribution', 5000],
  ['Maintenance & miscellaneous', 5000]
];

const BASE_KG = 3000;
const BASE_COST = 60000;

/* ---------- Utility functions ---------- */

const $ = selector => document.querySelector(selector);

const $$ = selector => [
  ...document.querySelectorAll(selector)
];

const money = value =>
  '₹' + Number(value).toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });

const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const escapeHTML = value =>
  String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

/* =========================================
   INQUIRY BASKET
   ========================================= */

let basket = [];

try {
  const saved = JSON.parse(
    localStorage.getItem('cococycleInquiryBasket') || '[]'
  );

  basket = Array.isArray(saved)
    ? [...new Set(saved.filter(id =>
        PRODUCTS.some(product => product.id === id)
      ))]
    : [];

} catch (_) {
  basket = [];
}

/* ---------- Save basket ---------- */

function save() {
  try {
    localStorage.setItem(
      'cococycleInquiryBasket',
      JSON.stringify(basket)
    );
  } catch (_) {}

  renderBasket();
}

/* ---------- Toast notifications ---------- */

function toast(message) {
  const element = $('#toast');

  if (!element) return;

  element.textContent = message;
  element.classList.add('visible');

  clearTimeout(toast.timeout);

  toast.timeout = setTimeout(() => {
    element.classList.remove('visible');
  }, 2900);
}

/* ---------- Current product filter ---------- */

function currentFilter() {
  return $('#filters .active')?.dataset.filter || 'all';
}

/* =========================================
   PRODUCT CATALOGUE
   ========================================= */

function renderProducts(filter = 'all') {

  const grid = $('#productGrid');

  if (!grid) return;

  const filteredProducts = PRODUCTS.filter(product =>
    filter === 'all' || product.category === filter
  );

  grid.innerHTML = filteredProducts.map((product, index) => {

    const added = basket.includes(product.id);

    return `
      <article
        class="product-card"
        style="animation-delay:${index * 60}ms"
      >

        <div class="product-art">

          <span class="concept">
            CONCEPT / PRE-LAUNCH
          </span>

          <img
            class="product-photo"
            src="assets/${product.image}"
            alt="Concept illustration of ${escapeHTML(product.name)}"
            loading="lazy"
            width="620"
            height="560"
          >

        </div>

        <div class="product-info">

          <span class="category">
            ${escapeHTML(product.type)}
          </span>

          <h3>${escapeHTML(product.name)}</h3>

          <p>${escapeHTML(product.description)}</p>

          <button
            type="button"
            data-add="${product.id}"
            class="${added ? 'added' : ''}"
          >
            ${
              added
                ? 'Added to inquiry ✓'
                : 'Add to inquiry basket <span>↗</span>'
            }
          </button>

        </div>

      </article>
    `;

  }).join('');
}

/* ---------- Product filter counts ---------- */

function renderCounts() {

  const count = category =>
    PRODUCTS.filter(product =>
      product.category === category
    ).length;

  const counts = {
    countAll: PRODUCTS.length,
    countHome: count('home'),
    countGarden: count('garden'),
    countMaterial: count('material')
  };

  Object.entries(counts).forEach(([id, value]) => {
    const element = $('#' + id);
    if (element) element.textContent = value;
  });
}

/* =========================================
   BASKET INTERFACE
   ========================================= */

function renderBasket() {

  const badge = $('#cartCount');

  if (badge) {
    badge.textContent = basket.length;

    badge.classList.add('bump');

    setTimeout(() => {
      badge.classList.remove('bump');
    }, 250);
  }

  const basketItems = $('#basketItems');

  if (!basketItems) return;

  basketItems.innerHTML = basket.length
    ? basket.map(id => {

        const product = PRODUCTS.find(
          item => item.id === id
        );

        if (!product) return '';

        return `
          <div class="basket-entry">

            <img
              src="assets/${product.image}"
              alt=""
              width="68"
              height="62"
            >

            <div>
              <h4>${escapeHTML(product.name)}</h4>
              <small>
                ${escapeHTML(product.type)} · Concept
              </small>
            </div>

            <button
              type="button"
              data-remove="${id}"
              aria-label="Remove ${escapeHTML(product.name)}"
            >
              Remove
            </button>

          </div>
        `;

      }).join('')

    : `
      <p class="basket-empty">
        Your basket is empty. Browse our product concepts
        and add anything you're interested in.
      </p>
    `;

  const checkout = $('#basketCheckout');

  if (checkout) {
    checkout.disabled = basket.length === 0;
  }
}

/* ---------- Open / close basket ---------- */

function toggleBasket(open) {

  const panel = $('#basket');
  const overlay = $('#basketOverlay');

  if (!panel) return;

  panel.classList.toggle('open', open);

  panel.setAttribute(
    'aria-hidden',
    String(!open)
  );

  if (overlay) {
    overlay.hidden = !open;
  }

  document.body.style.overflow = open
    ? 'hidden'
    : '';

  const focusTarget = open
    ? $('#cartClose')
    : $('#cartOpen');

  focusTarget?.focus();
}

/* ---------- Pre-fill contact form ---------- */

function contactPrefill(interest, message) {

  const interestField = $('#interest');
  const form = $('#contactForm');

  if (interestField) {
    interestField.value = interest;
  }

  if (form?.elements.message) {
    form.elements.message.value = message;
  }

  toggleBasket(false);

  $('#contact')?.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth'
  });

  setTimeout(() => {
    form?.elements.name?.focus({
      preventScroll: true
    });
  }, reduceMotion ? 0 : 500);
}

/* ---------- Product add button ---------- */

$('#productGrid')?.addEventListener('click', event => {

  const button = event.target.closest('[data-add]');

  if (!button) return;

  const id = button.dataset.add;

  if (!basket.includes(id)) {

    basket.push(id);

    save();

    toast('Added to inquiry basket');

  } else {
    toggleBasket(true);
  }

  renderProducts(currentFilter());
});

/* ---------- Product category filters ---------- */

$('#filters')?.addEventListener('click', event => {

  const button = event.target.closest('[data-filter]');

  if (!button) return;

  $$('#filters button').forEach(item => {

    item.classList.remove('active');

    item.setAttribute(
      'aria-pressed',
      'false'
    );

  });

  button.classList.add('active');

  button.setAttribute(
    'aria-pressed',
    'true'
  );

  renderProducts(button.dataset.filter);
});

/* ---------- Basket actions ---------- */

if ($('#cartOpen')) {
  $('#cartOpen').onclick = () =>
    toggleBasket(true);
}

if ($('#cartClose')) {
  $('#cartClose').onclick = () =>
    toggleBasket(false);
}

if ($('#basketOverlay')) {
  $('#basketOverlay').onclick = () =>
    toggleBasket(false);
}

$('#basketItems')?.addEventListener('click', event => {

  const button = event.target.closest('[data-remove]');

  if (!button) return;

  basket = basket.filter(id =>
    id !== button.dataset.remove
  );

  save();

  renderProducts(currentFilter());
});

if ($('#clearBasket')) {

  $('#clearBasket').onclick = () => {

    basket = [];

    save();

    renderProducts(currentFilter());
  };
}

/* ---------- Checkout inquiry ---------- */

if ($('#basketCheckout')) {

  $('#basketCheckout').onclick = () => {

    const selectedProducts = basket.map(id =>
      PRODUCTS.find(product => product.id === id)?.name
    ).filter(Boolean);

    contactPrefill(
      'Buying consumer products',

      'I would like more information about these CocoCycle concepts: ' +
      selectedProducts.join(', ') +
      '.\nPlease share availability, specifications and next steps.'
    );
  };
}

/* ---------- Interest buttons ---------- */

$$('[data-interest]').forEach(button => {

  button.addEventListener('click', () => {

    const interest = button.dataset.interest;

    contactPrefill(
      interest,
      'I would like to discuss ' +
      interest.toLowerCase() +
      ' with CocoCycle.'
    );

  });
});

/* =========================================
   MOBILE NAVIGATION
   ========================================= */

function closeMenu() {

  $('#navLinks')?.classList.remove('open');

  $('#menuBtn')?.setAttribute(
    'aria-expanded',
    'false'
  );
}

if ($('#menuBtn')) {

  $('#menuBtn').onclick = () => {

    const opened =
      $('#navLinks')?.classList.toggle('open');

    $('#menuBtn').setAttribute(
      'aria-expanded',
      String(Boolean(opened))
    );
  };
}

$$('#navLinks a').forEach(link => {

  link.addEventListener('click', closeMenu);

});

document.addEventListener('keydown', event => {

  if (event.key === 'Escape') {

    if ($('#basket')?.classList.contains('open')) {
      toggleBasket(false);
    }

    closeMenu();
  }
});

/* =========================================
   COST EXPLORER
   ========================================= */

function updateCosts() {

  const range = $('#throughput');
  const costInput = $('#monthlyCost');

  if (!range || !costInput) return;

  const kg = Math.max(
    1,
    Number(range.value) || BASE_KG
  );

  const cost = Math.max(
    0,
    Number(costInput.value) || 0
  );

  const minimum = Number(range.min);
  const maximum = Number(range.max);

  const percentage = maximum > minimum
    ? ((kg - minimum) / (maximum - minimum)) * 100
    : 0;

  range.style.setProperty(
    '--p',
    percentage + '%'
  );

  const costPerKg = cost / kg;
  const baseline = BASE_COST / BASE_KG;

  if ($('#throughputLabel')) {

    $('#throughputLabel').textContent =
      kg.toLocaleString('en-IN') + ' kg';
  }

  if ($('#costPerKg')) {

    $('#costPerKg').innerHTML =
      '₹' +
      costPerKg.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) +
      ' <span>/ kg</span>';
  }

  if ($('#costTile')) {

    $('#costTile').textContent = money(cost);
  }

  const difference = costPerKg - baseline;

  if ($('#costDelta')) {

    $('#costDelta').textContent =
      Math.abs(difference) < 0.005

        ? 'Matches the ₹20.00 baseline'

        : (difference > 0 ? '▲ ₹' : '▼ ₹') +
          Math.abs(difference).toFixed(2) +
          ' per kg ' +
          (difference > 0 ? 'above' : 'below') +
          ' the ₹20.00 baseline';
  }
}

/* ---------- Cost input listeners ---------- */

$('#throughput')?.addEventListener(
  'input',
  updateCosts
);

$('#monthlyCost')?.addEventListener(
  'input',
  updateCosts
);

/* ---------- Reset calculator ---------- */

if ($('#resetCosts')) {

  $('#resetCosts').onclick = () => {

    $('#throughput').value = BASE_KG;

    $('#monthlyCost').value = BASE_COST;

    updateCosts();
  };
}

/* ---------- Monthly cost bar chart ---------- */

if ($('#costBreakdown')) {

  const maxCost = Math.max(
    ...MONTHLY.map(item => item[1])
  );

  $('#costBreakdown').innerHTML =
    MONTHLY.map(([name, value]) => `
      <div class="bar-row">

        <span>${escapeHTML(name)}</span>

        <div class="bar-track">
          <div
            class="bar-fill"
            data-w="${100 * value / maxCost}"
          ></div>
        </div>

        <span>${money(value)}</span>

      </div>
    `).join('');
}

/* ---------- Full cost tables ---------- */

function costRows(items) {

  const itemRows = items.map(([name, value]) => `
    <div class="table-row">

      <span>${escapeHTML(name)}</span>

      <strong>${money(value)}</strong>

    </div>
  `).join('');

  const total = items.reduce(
    (sum, item) => sum + item[1],
    0
  );

  return itemRows + `
    <div class="table-row">

      <span>Total</span>

      <strong>${money(total)}</strong>

    </div>
  `;
}

if ($('#fixedRows')) {
  $('#fixedRows').innerHTML = costRows(FIXED);
}

if ($('#monthlyRows')) {
  $('#monthlyRows').innerHTML = costRows(MONTHLY);
}

/* ---------- Toggle cost tables ---------- */

if ($('#breakdownToggle')) {

  $('#breakdownToggle').onclick = () => {

    const tables = $('#costTables');

    if (!tables) return;

    tables.hidden = !tables.hidden;

    $('#breakdownToggle').setAttribute(
      'aria-expanded',
      String(!tables.hidden)
    );

    $('#breakdownToggle').innerHTML =
      tables.hidden

        ? 'View full cost tables <span>＋</span>'

        : 'Hide full cost tables <span>−</span>';
  };
}

/* =========================================
   CONTACT FORM — CLEAN VERSION
   ========================================= */

/*
   No email configuration warning.

   No "This opens your email app" notification.

   No setup-required popups.

   Form prepares an email using mailto.

   If a business email is configured, it becomes
   the recipient.

   Otherwise, the visitor can enter a recipient
   in their email application.

   GitHub Pages does not provide a backend
   email delivery service.
*/

/* ---------- Remove old notices ---------- */

function removeContactWarnings() {

  const notice = $('#contactNotice');

  if (notice) {
    notice.textContent = '';
    notice.hidden = true;
    notice.style.display = 'none';
  }
}

/* ---------- Generate inquiry message ---------- */

function buildInquiry(form) {

  const data = new FormData(form);

  const value = key =>
    String(data.get(key) || '').trim();

  const name = value('name');
  const email = value('email');
  const organization = value('organization');
  const interest = value('interest');
  const message = value('message');

  const subject =
    'CocoCycle Inquiry: ' + interest;

  const body = [
    'COCOCYCLE — NEW INQUIRY',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Organization: ' + (
      organization || 'Not provided'
    ),
    'Interest: ' + interest,
    '',
    'Message:',
    message,
    '',
    '------------------------------',
    'CocoCycle | Goa',
    'Circular Innovation from Coconut Waste'
  ].join('\n');

  return {
    subject,
    body
  };
}

/* ---------- Submit inquiry ---------- */

$('#contactForm')?.addEventListener(
  'submit',
  event => {

    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const { subject, body } = buildInquiry(form);

    const configuredEmail =
      CONFIG.contactEmail.trim();

    const recipient =
      configuredEmail &&
      !configuredEmail.includes('YOUR_EMAIL')
        ? configuredEmail
        : '';

    const mailtoURL =
      'mailto:' + recipient +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    // No setup warning or contact notice.
    removeContactWarnings();

    // Open the prepared email.
    window.location.href = mailtoURL;

  }
);

/* ---------- Copy inquiry ---------- */

if ($('#copyInquiry')) {

  $('#copyInquiry').onclick = async () => {

    const form = $('#contactForm');

    if (!form || !form.reportValidity()) {
      return;
    }

    const { subject, body } = buildInquiry(form);

    const message = subject + '\n\n' + body;

    try {

      await navigator.clipboard.writeText(message);

      toast('Inquiry copied successfully');

    } catch (_) {

      // Fallback for browsers without Clipboard API.
      const textArea = document.createElement('textarea');

      textArea.value = message;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';

      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      let copied = false;

      try {
        copied = document.execCommand('copy');
      } catch (_) {}

      textArea.remove();

      if (copied) {
        toast('Inquiry copied successfully');
      } else {
        toast('Unable to copy inquiry');
      }
    }
  };
}

/* =========================================
   ANIMATIONS AND SCROLL EFFECTS
   ========================================= */

/* ---------- Animated number counter ---------- */

function countUp(element) {

  const target = Number(element.dataset.count);

  if (!Number.isFinite(target)) return;

  if (reduceMotion) {

    element.textContent =
      target.toLocaleString('en-IN');

    return;
  }

  const startTime = performance.now();
  const duration = 1400;

  const animate = currentTime => {

    const progress = Math.min(
      1,
      (currentTime - startTime) / duration
    );

    const easing =
      1 - Math.pow(1 - progress, 3);

    const value = Math.round(
      target * easing
    );

    element.textContent =
      value.toLocaleString('en-IN');

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}

/* ---------- Intersection observers ---------- */

if ('IntersectionObserver' in window) {

  const revealObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const element = entry.target;

        element.classList.add('in');

        element.querySelectorAll('[data-count]')
          .forEach(countUp);

        element.querySelectorAll('.bar-fill')
          .forEach(bar => {

            bar.style.width =
              bar.dataset.w + '%';

          });

        revealObserver.unobserve(element);

      });

    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  $$('.reveal').forEach(element =>
    revealObserver.observe(element)
  );

  /* ---------- Cost bar animation ---------- */

  const barObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll('.bar-fill')
          .forEach(bar => {

            bar.style.width =
              bar.dataset.w + '%';

          });

        barObserver.unobserve(entry.target);

      });

    },
    {
      threshold: 0.2
    }
  );

  const costBreakdown = $('#costBreakdown');

  if (costBreakdown) {
    barObserver.observe(costBreakdown);
  }

  /* ---------- Active navigation links ---------- */

  const links = $$('#navLinks a[href^="#"]');

  const navObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        links.forEach(link => {

          link.classList.toggle(
            'active',
            link.getAttribute('href') ===
              '#' + entry.target.id
          );

        });

      });

    },
    {
      rootMargin: '-45% 0px -50% 0px'
    }
  );

  links.forEach(link => {

    const section = document.querySelector(
      link.getAttribute('href')
    );

    if (section) {
      navObserver.observe(section);
    }

  });

} else {

  $$('.reveal').forEach(element =>
    element.classList.add('in')
  );

  $$('[data-count]').forEach(countUp);

  $$('.bar-fill').forEach(bar => {

    bar.style.width =
      bar.dataset.w + '%';

  });
}

/* =========================================
   SCROLL PROGRESS AND HEADER
   ========================================= */

const header = $('#header');

const progress = $('#progress');

const toTop = $('#toTop');

const visionBackground = $('.vision-bg');

const vision = $('.vision');

let ticking = false;

function onScroll() {

  const scrollY = window.scrollY;

  const pageHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  /* ---------- Sticky header ---------- */

  header?.classList.toggle(
    'scrolled',
    scrollY > 10
  );

  /* ---------- Reading progress ---------- */

  if (progress) {

    const progressValue =
      pageHeight > 0
        ? Math.min(1, scrollY / pageHeight)
        : 0;

    progress.style.transform =
      'scaleX(' + progressValue + ')';
  }

  /* ---------- Back to top button ---------- */

  if (toTop) {
    toTop.hidden = scrollY < 800;
  }

  /* ---------- Vision parallax ---------- */

  if (
    !reduceMotion &&
    vision &&
    visionBackground
  ) {

    const rect =
      vision.getBoundingClientRect();

    if (
      rect.bottom > 0 &&
      rect.top < window.innerHeight
    ) {

      const offset =
        (
          rect.top +
          rect.height / 2 -
          window.innerHeight / 2
        ) * -0.12;

      visionBackground.style.transform =
        'translateY(' + offset +
        'px) scale(1.12)';
    }
  }

  ticking = false;
}

/* ---------- Optimized scrolling ---------- */

window.addEventListener(
  'scroll',
  () => {

    if (!ticking) {

      ticking = true;

      requestAnimationFrame(onScroll);
    }

  },
  {
    passive: true
  }
);

/* ---------- Back to top ---------- */

if (toTop) {

  toTop.onclick = () => {

    window.scrollTo({
      top: 0,
      behavior: reduceMotion
        ? 'auto'
        : 'smooth'
    });
  };
}

/* =========================================
   HERO 3D TILT EFFECT
   ========================================= */

const heroFrame = $('[data-tilt]');

const heroVisual = $('#heroVisual');

if (
  heroFrame &&
  heroVisual &&
  !reduceMotion &&
  window.matchMedia(
    '(hover:hover) and (pointer:fine)'
  ).matches
) {

  heroVisual.addEventListener(
    'pointermove',
    event => {

      const rect =
        heroVisual.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width - 0.5;

      const y =
        (event.clientY - rect.top) /
        rect.height - 0.5;

      heroFrame.style.transform =
        `rotateY(${x * 9}deg) ` +
        `rotateX(${-y * 7}deg)`;
    }
  );

  heroVisual.addEventListener(
    'pointerleave',
    () => {

      heroFrame.style.transform = '';

    }
  );
}

/* =========================================
   FOOTER
   ========================================= */

function updateFooterYear() {

  const year = $('#year');

  if (year) {

    year.textContent =
      new Date().getFullYear();
  }
}

/* =========================================
   INITIALIZE COCOCYCLE WEBSITE
   ========================================= */

function initializeWebsite() {

  // Remove email setup warning.
  removeContactWarnings();

  // Load product category counts.
  renderCounts();

  // Render all products.
  renderProducts('all');

  // Restore inquiry basket.
  renderBasket();

  // Set costing calculator baseline.
  updateCosts();

  // Update footer year.
  updateFooterYear();

  // Initialize scroll UI.
  onScroll();

}

/* ---------- Start website ---------- */

if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    initializeWebsite,
    { once: true }
  );

} else {

  initializeWebsite();
}

/* =========================================
   END OF COCOCYCLE APP.JS
   ========================================= */
