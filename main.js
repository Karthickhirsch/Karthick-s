/* ============================================================
   Karthick S — Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scroll state + mobile toggle ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav__links');

  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    const bar = document.getElementById('scrollProgress');
    if (bar) bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      })
    );
  }

  /* ---------- Typing effect (hero role) ---------- */
  const typedEl = document.getElementById('typed');
  const roles = [
    ' the boring parts.',
    ' UI with Selenium.',
    ' APIs end-to-end.',
    ' regression suites.',
    ' quality at scale.',
  ];
  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = ' quality at scale.';
    } else {
      let r = 0, c = 0, deleting = false;
      const tick = () => {
        const word = roles[r];
        typedEl.textContent = word.substring(0, c);
        if (!deleting) {
          c++;
          if (c > word.length) { deleting = true; return setTimeout(tick, 1600); }
        } else {
          c--;
          if (c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; }
        }
        setTimeout(tick, deleting ? 45 : 90);
      };
      tick();
    }
  }

  /* ---------- Terminal boot sequence ---------- */
  const term = document.getElementById('terminalBody');
  const lines = [
    { t: '<span class="t-prompt">karthick@qa</span><span class="t-dim">:~$</span> <span class="t-cmd">behave --tags=@regression</span>', d: 500 },
    { t: '<span class="t-dim">Running 42 scenarios across 8 features...</span>', d: 700 },
    { t: '<span class="t-info">✓ Login &amp; access control</span> <span class="t-dim">... 6 passed</span>', d: 350 },
    { t: '<span class="t-info">✓ API contract validation</span> <span class="t-dim">... 9 passed</span>', d: 350 },
    { t: '<span class="t-info">✓ Data-driven policy checks</span> <span class="t-dim">... 12 passed</span>', d: 350 },
    { t: '<span class="t-info">✓ E2E reconciliation flow</span> <span class="t-dim">... 15 passed</span>', d: 400 },
    { t: '', d: 200 },
    { t: '<span class="t-pass">42 scenarios passed, 0 failed</span> <span class="t-dim">(100%)</span>', d: 300 },
    { t: '<span class="t-warn">⏱  cycle time reduced by 50%</span>', d: 300 },
    { t: '<span class="t-prompt">karthick@qa</span><span class="t-dim">:~$</span> <span class="t-caret">▋</span>', d: 0 },
  ];
  if (term) {
    if (reduceMotion) {
      term.innerHTML = lines.map((l) => l.t).join('<br>');
    } else {
      let i = 0;
      const render = () => {
        if (i >= lines.length) return;
        const div = document.createElement('div');
        div.innerHTML = lines[i].t || '&nbsp;';
        term.appendChild(div);
        const delay = lines[i].d;
        i++;
        setTimeout(render, delay);
      };
      setTimeout(render, 400);
    }
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll('.stat__num');
  const runCounter = (el) => {
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = target; return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 45));
    const inc = () => {
      cur += step;
      if (cur >= target) { el.textContent = target; return; }
      el.textContent = cur;
      requestAnimationFrame(inc);
    };
    inc();
  };

  /* ---------- Scroll reveal + counter trigger ---------- */
  const revealEls = document.querySelectorAll(
    '.section, .hero__stats, .skill-card, .tl-item, .project, .contact-link'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('hero__stats')) {
          entry.target.querySelectorAll('.stat__num').forEach(runCounter);
        }
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));

  /* Fallback: if hero stats already in view on load */
  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      heroStats.classList.add('visible');
      heroStats.querySelectorAll('.stat__num').forEach(runCounter);
    }
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navMap = {};
  document.querySelectorAll('.nav__links a').forEach((a) => {
    navMap[a.getAttribute('href').slice(1)] = a;
  });
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Object.values(navMap).forEach((a) => a && a.classList.remove('active'));
          const link = navMap[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => spy.observe(s));
})();
