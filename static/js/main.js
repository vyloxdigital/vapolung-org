/* ================================================================
   VapoLung — main.js
   ================================================================ */

(function () {
  'use strict';

  /* ── NAV TOGGLE ─────────────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const overlay   = document.querySelector('.mobile-overlay');
  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', open);
    });
    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── STICKY HEADER (IntersectionObserver — zero forced reflow) ─ */
  /* Uses a 1px sentinel at the top of <body>; when it leaves the
     viewport the header gets class "scrolled". No scrollY reads,
     no layout queries, no requestAnimationFrame needed.            */
  const header = document.querySelector('.site-header');
  if (header) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:40px;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(
      ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
      { threshold: 0 }
    ).observe(sentinel);
  }

  /* ── SMOOTH SCROLL ──────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── NAV ACTIVE STATE ───────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  if (sections.length && navLinks.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ── FADE-IN ON SCROLL ──────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const fadeObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); } });
    }, { threshold: 0.10 });
    fadeEls.forEach(el => fadeObs.observe(el));
  }

  /* ── RATING BARS ANIMATION ──────────────────────────────────── */
  const bars = document.querySelectorAll('.rating-bar-fill[data-pct]');
  if (bars.length) {
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.pct + '%';
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => barObs.observe(b));
  }

  /* ── INGREDIENT ACCORDION: close others ────────────────────── */
  document.querySelectorAll('.formula-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.formula-item[open]').forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  /* ── FAQ ACCORDION: close others ───────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item[open]').forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  /* ── CARD STAGGER ───────────────────────────────────────────── */
  const staggerContainers = ['.feature-grid', '.pack-grid', '.bonus-grid', '.testimonials-cards'];
  staggerContainers.forEach(selector => {
    const container = document.querySelector(selector);
    if (!container) return;
    const children = Array.from(container.children);
    children.forEach((child, i) => {
      child.classList.add('fade-in');
      child.style.transitionDelay = (i * 0.1) + 's';
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    obs.observe(container);
  });

  /* ── JS YEAR FILL ───────────────────────────────────────────── */
  document.querySelectorAll('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ── CTA CLICK TRACKING ─────────────────────────────────────── */
  document.querySelectorAll('[data-cta]').forEach(el => {
    el.addEventListener('click', () => {
      if (window.console) console.log('[VapoLung] CTA click:', el.dataset.cta);
    });
  });

})();
