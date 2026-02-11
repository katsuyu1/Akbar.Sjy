// animations.js - refined micro-animations, accessibility & performance
(() => {
  'use strict';

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  /* ---------- reveal / stagger ---------- */
  const revealSelectors = [
    '.hero .hero-intro > *',
    '.hero-title',
    '.hero-subtitle',
    '.hero-actions .btn',
    '.about-text h3',
    '.about-text p',
    '.about-card',
    '.about-grid .about-card',
    '.project-card',
    '.skills-container .skill-category',
    '.contact-info-card',
    '.footer-content'
  ];

  function addRevealClasses() {
    let delayBase = 0;
    revealSelectors.forEach((sel) => {
      const items = Array.from(document.querySelectorAll(sel));
      items.forEach((el, idx) => {
        el.classList.add('reveal');
        el.style.setProperty('--delay', Math.min(600, delayBase + idx * 40) + 'ms');
      });
      delayBase += 50; // small base shift across groups
    });
  }

  function setupRevealObserver() {
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    // Collect reveals and limit how many we actively observe to reduce IO overhead on long pages
    const all = Array.from(document.querySelectorAll('.reveal'));
    if (all.length === 0) return;

    const MAX_OBSERVE = Math.max(24, Math.min(80, Math.floor(window.innerHeight / 32) * 6));
    const toObserve = (all.length > MAX_OBSERVE) ? all.slice(0, MAX_OBSERVE) : all;

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: [0.1, 0.25, 0.6],
      rootMargin: '0px 0px -6% 0px'
    });

    toObserve.forEach(el => io.observe(el));

    // If we didn't observe all elements (due to limit), mark the remainder visible but with smaller delay
    if (toObserve.length < all.length) {
      all.slice(toObserve.length).forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), 480 + (i * 25));
      });
    }
  }

  /* ---------- hero accent tilt (throttled) ---------- */
  function setupHeroTilt(){
    const accent = document.querySelector('.hero-accent');
    if (!accent) return;
    // disable tilt for reduced motion, touch devices, and very narrow viewports
    if (prefersReduced || hasTouch || window.innerWidth < 720) return;

    let lastX = 0, lastY = 0, raf = 0;
    const onMove = (e) => {
      lastX = (e.clientX - window.innerWidth / 2) / 40;
      lastY = (e.clientY - window.innerHeight / 2) / 80;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        accent.style.transform = `translate(${lastX}px, ${lastY}px) rotate(${lastX * 0.15}deg)`;
      });
    };

    // attach once
    document.addEventListener('mousemove', onMove, { passive: true });
  }

  /* ---------- modal & animated skill bars ---------- */
  function setupCvModal() {
    const openBtn = document.getElementById('viewCVBtn');
    const modal = document.getElementById('cvModal');
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;
    const closeBtn = document.getElementById('closeModal');
    if (!modal || !openBtn) return;

    function animateSkillBars() {
      const bars = modal.querySelectorAll('.skill-fill');
      bars.forEach((bar, i) => {
        const pct = Number(bar.getAttribute('data-pct') || 0);
        setTimeout(() => {
          bar.style.width = pct + '%';
          bar.setAttribute('aria-valuenow', String(pct));
          let pctEl = bar.closest('.skill-item').querySelector('.skill-pct');
          if (!pctEl) {
            pctEl = document.createElement('span');
            pctEl.className = 'skill-pct';
            pctEl.style.marginLeft = '8px';
            pctEl.style.fontSize = '0.9rem';
            pctEl.style.opacity = 0.85;
            bar.closest('.skill-item').querySelector('.skill-name').after(pctEl);
          }

          if (prefersReduced) {
            pctEl.textContent = pct + '%';
          } else {
            const dur = 700; let startTime = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - startTime) / dur);
              const v = Math.round(t * pct);
              pctEl.textContent = v + '%';
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }, i * 140);
      });
    }

    function openModal() {
      modal.classList.add('open');
      // trap focus is optional — keep simple: prevent scroll
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setTimeout(animateSkillBars, 120));
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      modal.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = '0%';
        bar.setAttribute('aria-valuenow', '0');
        const pctEl = bar.closest('.skill-item').querySelector('.skill-pct');
        if (pctEl) pctEl.textContent = '';
      });
    }

    openBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });
  }

  /* ---------- nav indicator & scroll spy ---------- */
  function setupNavIndicatorAndScrollSpy() {
    const navList = document.getElementById('navLinks');
    const indicator = document.getElementById('navIndicator');
    if (!navList || !indicator) return;

    const links = Array.from(navList.querySelectorAll('.nav-link'));

    function moveIndicatorTo(link) {
      if (!link) return;
      const linkRect = link.getBoundingClientRect();
      const parentRect = navList.getBoundingClientRect();
      const left = Math.round(linkRect.left - parentRect.left);
      const width = Math.round(linkRect.width);
      // set transform/width for the animated indicator
      indicator.style.width = width + 'px';
      indicator.style.transform = `translateX(${left}px)`;
    }

    links.forEach(l => l.addEventListener('click', (e) => { setTimeout(() => moveIndicatorTo(e.currentTarget), 120); }));

    const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if (sections.length === 0) return;

    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(en => en.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio);
      if (visible.length > 0) {
        const best = visible[0].target;
        const link = links.find(l => l.getAttribute('href') === ('#' + best.id));
        if (link) {
          links.forEach(x => x.classList.toggle('active', x === link));
          moveIndicatorTo(link);
        }
      }
    }, { threshold: [0.12, 0.28, 0.5] });

    sections.forEach(s => io.observe(s));

    // ensure indicator is positioned correctly initially and on resize (debounced)
    const initial = navList.querySelector('.nav-link.active') || links[0];
    moveIndicatorTo(initial);
    let rTimer;
    window.addEventListener('resize', () => { clearTimeout(rTimer); rTimer = setTimeout(() => moveIndicatorTo(navList.querySelector('.nav-link.active')), 120); });
  }

  /* ---------- button ripple (click and keyboard) ---------- */
  function setupButtonRipple() {
    if (prefersReduced) return; // skip for reduced-motion users

    const createRipple = (btn, x, y, triggeredByKey = false) => {
      if (!btn) return;
      const now = Date.now();
      const last = Number(btn.dataset.lastRipple || 0);
      if (now - last < 300) return; // avoid spamming ripples
      btn.dataset.lastRipple = String(now);

      const rect = btn.getBoundingClientRect();
      const isIcon = btn.classList.contains('icon') || btn.classList.contains('social-icon');
      const sizeBase = Math.max(rect.width, rect.height);
      const size = isIcon ? Math.round(sizeBase * 1.0) : Math.round(sizeBase * 1.6);

      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.width = r.style.height = size + 'px';

      const offsetX = triggeredByKey ? Math.round((rect.width - size) / 2) : Math.round(x - rect.left - size / 2);
      const offsetY = triggeredByKey ? Math.round((rect.height - size) / 2) : Math.round(y - rect.top - size / 2);
      r.style.left = offsetX + 'px';
      r.style.top = offsetY + 'px';
      btn.appendChild(r);

      setTimeout(() => { try { r.remove(); } catch (e) {} }, 700);
    };

    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.btn');
      if (!btn) return;
      createRipple(btn, ev.clientX, ev.clientY, false);
    }, { passive: true });

    // keyboard activation (Enter/Space) — center the ripple on element
    document.addEventListener('keydown', (ev) => {
      if (!(ev.key === 'Enter' || ev.key === ' ')) return;
      const btn = ev.target.closest('.btn');
      if (!btn) return;
      // prevent double behavior for Space triggering click
      createRipple(btn, 0, 0, true);
    });
  }

  /* ---------- initialization ---------- */
  function init() {
    addRevealClasses();
    setupRevealObserver();
    setupHeroTilt();
    setupCvModal();
    setupNavIndicatorAndScrollSpy();
    setupButtonRipple();

    // early visible small set for quick-first paint
    if (window.scrollY === 0) {
      document.querySelectorAll('.reveal').forEach((el, idx) => { if (idx < 8) el.classList.add('is-visible'); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
// animations.js - small, dependency-free micro-animations and UX polish
(() => {
  'use strict';

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add 'reveal' class to many useful elements so CSS can animate them
  const revealSelectors = [
    '.hero .hero-intro > *',
    '.hero-title',
    '.hero-subtitle',
    '.hero-actions .btn',
    '.about-text h3',
    '.about-text p',
    '.about-card',
    '.about-grid .about-card',
    '.project-card',
    '.skills-container .skill-category',
    '.contact-info-card',
    '.footer-content'
  ];

  function addRevealClasses() {
    let delayBase = 0;
    revealSelectors.forEach((sel) => {
      const items = Array.from(document.querySelectorAll(sel));
      items.forEach((el, idx) => {
        // give each a small per-item stagger delay
        el.classList.add('reveal');
        const delay = Math.min(350, delayBase + idx * 40);
        el.style.setProperty('--delay', delay + 'ms');
      });
      delayBase += 60; // advance base for next selector
    });
  }

  function setupRevealObserver() {
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // small hero accent mouse parallax, gentle and limited
  function setupHeroTilt(){
    const accent = document.querySelector('.hero-accent');
    if (!accent) return;
    if (prefersReduced) return;
    let lastX = 0, lastY = 0, raf = null;
    document.addEventListener('mousemove', (e)=>{
      lastX = (e.clientX - window.innerWidth/2) / 40; // smaller movement
      lastY = (e.clientY - window.innerHeight/2) / 80;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        accent.style.transform = `translate(${lastX}px, ${lastY}px) rotate(${lastX * 0.2}deg)`;
      });
    });
  }

  // Modal + skill bar animations
  function setupCvModal() {
    const openBtn = document.getElementById('viewCVBtn');
    const modal = document.getElementById('cvModal');
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;
    const closeBtn = document.getElementById('closeModal');

    if (!modal || !openBtn) return;

    function animateSkillBars() {
      const bars = modal.querySelectorAll('.skill-fill');
      bars.forEach((bar, i) => {
        const pct = Number(bar.getAttribute('data-pct') || 0);
        // small delay per-bar
        setTimeout(() => {
          bar.style.width = pct + '%';
          bar.setAttribute('aria-valuenow', String(pct));
          // add a small textual percentage (accessible and visible)
          let pctEl = bar.closest('.skill-item').querySelector('.skill-pct');
          if (!pctEl) {
            pctEl = document.createElement('span');
            pctEl.className = 'skill-pct';
            pctEl.style.marginLeft = '8px';
            pctEl.style.fontSize = '0.9rem';
            pctEl.style.opacity = 0.8;
            bar.closest('.skill-item').querySelector('.skill-name').after(pctEl);
          }

          // animate the number increase
          if (prefersReduced) {
            pctEl.textContent = pct + '%';
          } else {
            let start = 0, dur = 700, startTime = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - startTime) / dur);
              const v = Math.round(start + (pct - start) * t);
              pctEl.textContent = v + '%';
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }

        }, i * 140);
      });
    }

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // allow animations to run after the modal is visible
      requestAnimationFrame(() => setTimeout(animateSkillBars, 120));
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // reset skill bars when closed - so it replays next time
      modal.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = '0%';
        bar.setAttribute('aria-valuenow', '0');
        const pctEl = bar.closest('.skill-item').querySelector('.skill-pct');
        if (pctEl) pctEl.textContent = '';
      });
    }

    openBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
    if (overlay) overlay.addEventListener('click', () => closeModal());
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });
  }

  // Attach reveal class to elements and wire up everything
  function init() {
    addRevealClasses();
    setupRevealObserver();
    setupHeroTilt();
    setupCvModal();

    setupNavIndicatorAndScrollSpy();

    // add simple hover focus ring for keyboard users on .btn
    document.querySelectorAll('.btn').forEach(el => {
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') el.classList.add('active'); });
      el.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') el.classList.remove('active'); });
    });

    // quick safe reveal for elements that are already visible on small screens
    if (window.scrollY === 0) {
      const early = document.querySelectorAll('.reveal');
      early.forEach((el, idx) => { if (idx < 6) el.classList.add('is-visible'); });
    }
  }

  /* ---------- Navigation indicator & scroll spy ---------- */
  function setupNavIndicatorAndScrollSpy() {
    const navList = document.getElementById('navLinks');
    const indicator = document.getElementById('navIndicator');
    if (!navList || !indicator) return;

    const links = Array.from(navList.querySelectorAll('.nav-link'));

    function moveIndicatorTo(link) {
      if (!link) return;
      const linkRect = link.getBoundingClientRect();
      const parentRect = navList.getBoundingClientRect();
      const left = Math.round(linkRect.left - parentRect.left);
      const width = Math.round(linkRect.width);
      indicator.style.width = width + 'px';
      indicator.style.transform = `translateX(${left}px)`;
    }

    // click handlers to animate indicator immediately
    links.forEach(l => l.addEventListener('click', (e) => {
      // give a tiny delay while the browser moves to the anchor
      setTimeout(() => moveIndicatorTo(e.currentTarget), 140);
    }));

    // intersection observer for sections -> active link
    const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if (sections.length === 0) return;

    const io = new IntersectionObserver((entries) => {
      // choose the visible section with highest intersection ratio
      const visible = entries.filter(en => en.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio);
      if (visible.length > 0) {
        const best = visible[0].target;
        // find corresponding link
        const link = links.find(l => l.getAttribute('href') === ('#' + best.id));
        if (link) {
          links.forEach(x => x.classList.toggle('active', x === link));
          moveIndicatorTo(link);
        }
      }
    }, {threshold: [0.12, 0.28, 0.5]});

    sections.forEach(s => io.observe(s));

    // ensure indicator moves to current active link on load/resize
    const initial = navList.querySelector('.nav-link.active') || links[0];
    moveIndicatorTo(initial);
    window.addEventListener('resize', () => moveIndicatorTo(navList.querySelector('.nav-link.active')));
  }

  /* ---------- Button ripple effect ---------- */
  function setupButtonRipple() {
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.btn');
      if (!btn) return;
      if (prefersReduced) return; // skip heavy visual effect

      // create ripple element
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.2;
      r.style.width = r.style.height = size + 'px';
      // center the ripple at click position
      const offsetX = ev.clientX - rect.left - size / 2;
      const offsetY = ev.clientY - rect.top - size / 2;
      r.style.left = offsetX + 'px';
      r.style.top = offsetY + 'px';
      btn.appendChild(r);

      // remove after animation
      setTimeout(() => { try { r.remove(); } catch (e) {} }, 700);
    }, {passive: true});
  }

  // wire ripple setup
  (function autoWireRipple(){ setupButtonRipple(); })();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
