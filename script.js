/* ============================================================
   prostohome. — JS
   Cart · Mobile Menu · Tabs · Gallery · Scroll animations
   ============================================================ */
(function () {
  'use strict';

  /* ── CART ─────────────────────────────────── */
  let cart = JSON.parse(localStorage.getItem('ph_cart') || '[]');
  function saveCart() { localStorage.setItem('ph_cart', JSON.stringify(cart)); }
  function cartCount() { return cart.reduce((s, i) => s + (i.qty || 1), 0); }

  function updateCartUI() {
    const n = cartCount();
    document.querySelectorAll('.cart-dot').forEach(d => d.classList.toggle('hidden', n === 0));
  }

  function addToCart(item) {
    const ex = cart.find(i => i.id === item.id && i.color === item.color);
    if (ex) ex.qty = (ex.qty || 1) + 1;
    else cart.push({ ...item, qty: 1 });
    saveCart(); updateCartUI();
    toast('✅ Добавлено в корзину');
  }

  window.phAdd = function (id, name, price, color) {
    addToCart({ id, name, price: parseInt(price) || 0, color: color || '' });
  };

  /* ── TOAST ─────────────────────────────────── */
  function toast(msg, dur = 2800) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), dur);
  }
  window.showToast = toast;

  /* ── MOBILE MENU ───────────────────────────── */
  function initMenu() {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.mobile-menu');
    const close = document.querySelector('.mm-close');
    if (!burger || !menu) return;
    burger.addEventListener('click', () => { menu.classList.toggle('open'); burger.classList.toggle('open'); });
    if (close) close.addEventListener('click', () => { menu.classList.remove('open'); burger.classList.remove('open'); });
    menu.addEventListener('click', e => { if (e.target === menu) { menu.classList.remove('open'); burger.classList.remove('open'); } });
  }

  /* ── STICKY HEADER ─────────────────────────── */
  function initHeader() {
    const h = document.querySelector('.site-header');
    if (!h) return;
    window.addEventListener('scroll', () => h.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
  }

  /* ── TABS ──────────────────────────────────── */
  function initTabs() {
    document.querySelectorAll('.tabs-nav').forEach(nav => {
      nav.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          const t = this.dataset.tab;
          nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('on'));
          this.classList.add('on');
          const container = nav.closest('.tabs-section') || nav.parentElement.parentElement;
          container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('on'));
          const pane = container.querySelector(`[data-pane="${t}"]`);
          if (pane) pane.classList.add('on');
        });
      });
    });
  }

  /* ── GALLERY ───────────────────────────────── */
  function initGallery() {
    document.querySelectorAll('.g-thumb').forEach(thumb => {
      thumb.addEventListener('click', function () {
        document.querySelectorAll('.g-thumb').forEach(t => t.classList.remove('on'));
        this.classList.add('on');
      });
    });
  }

  /* ── COLOR SWATCHES ────────────────────────── */
  function initSwatches() {
    document.querySelectorAll('.color-swatches, .pcard-colors').forEach(g => {
      g.querySelectorAll('.csw, .csw-lg').forEach(sw => {
        sw.addEventListener('click', function () {
          g.querySelectorAll('.csw, .csw-lg').forEach(s => s.classList.remove('on'));
          this.classList.add('on');
          const label = this.closest('.color-pick')?.querySelector('.selected-color');
          if (label) label.textContent = this.title;
        });
      });
    });
  }

  /* ── QTY CONTROLS ──────────────────────────── */
  function initQty() {
    document.querySelectorAll('.qty-wrap').forEach(w => {
      const inp = w.querySelector('.qty-val');
      w.querySelector('[data-dir="-1"]')?.addEventListener('click', () => { inp.value = Math.max(1, +inp.value - 1); });
      w.querySelector('[data-dir="1"]')?.addEventListener('click', () => { inp.value = +inp.value + 1; });
    });
  }

  /* ── WISHLIST ───────────────────────────────── */
  function initWishlist() {
    document.querySelectorAll('.pcard-wish').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        const on = this.classList.toggle('wished');
        this.textContent = on ? '❤️' : '🤍';
        toast(on ? '❤️ Добавлено в избранное' : 'Убрано из избранного');
      });
    });
  }

  /* ── SCROLL ANIMATIONS ─────────────────────── */
  function initFade() {
    if (!window.IntersectionObserver) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
  }

  /* ── CAT TAGS ──────────────────────────────── */
  function initCatTags() {
    document.querySelectorAll('.cat-tag').forEach(tag => {
      tag.addEventListener('click', function () {
        document.querySelectorAll('.cat-tag').forEach(t => t.classList.remove('on'));
        this.classList.add('on');
      });
    });
  }

  /* ── INIT ──────────────────────────────────── */
  function init() {
    updateCartUI();
    initMenu();
    initHeader();
    initTabs();
    initGallery();
    initSwatches();
    initQty();
    initWishlist();
    initFade();
    initCatTags();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
