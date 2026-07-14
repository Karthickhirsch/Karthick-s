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

  /* ---------- Command palette (Ctrl/Cmd + K) ---------- */
  (function commandPalette() {
    const cmdk = document.getElementById('cmdk');
    const input = document.getElementById('cmdkInput');
    const list = document.getElementById('cmdkList');
    const openBtn = document.getElementById('cmdkOpen');
    if (!cmdk || !input || !list) return;

    const COMMANDS = [
      { label: 'Home', kind: 'section', icon: '⌂', target: '#home' },
      { label: 'About', kind: 'section', icon: '☺', target: '#about' },
      { label: 'Skills', kind: 'section', icon: '❯', target: '#skills' },
      { label: 'Automation in Action', kind: 'section', icon: '▶', target: '#automation' },
      { label: 'Quality & Delivery', kind: 'section', icon: '📊', target: '#quality' },
      { label: 'Playground', kind: 'section', icon: '🎮', target: '#playground' },
      { label: 'Experience', kind: 'section', icon: '❐', target: '#experience' },
      { label: 'Featured Work', kind: 'section', icon: '✦', target: '#work' },
      { label: 'Contact', kind: 'section', icon: '✉', target: '#contact' },
      { label: 'Preview Résumé', kind: 'action', icon: '📄', modal: 'resume' },
      { label: 'Download Résumé', kind: 'action', icon: '⬇', href: 'assets/Karthick_S_Resume.pdf', download: true },
      { label: 'Email Karthick', kind: 'action', icon: '✉', href: 'mailto:karthickyuvisri@gmail.com' },
      { label: 'Copy Email Address', kind: 'action', icon: '📋', copy: 'karthickyuvisri@gmail.com', copyLabel: 'Email address' },
      { label: 'Call Karthick', kind: 'action', icon: '☎', href: 'tel:+916382026795' },
      { label: 'Keyboard Shortcuts', kind: 'action', icon: '⌨', modal: 'shortcuts' },
    ];

    let filtered = COMMANDS.slice();
    let active = 0;

    const render = () => {
      list.innerHTML = '';
      if (!filtered.length) {
        list.innerHTML = '<li class="cmdk__empty">No matching commands</li>';
        return;
      }
      filtered.forEach((cmd, i) => {
        const li = document.createElement('li');
        li.className = 'cmdk__item';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', i === active ? 'true' : 'false');
        li.innerHTML =
          '<span class="cmdk__item-icon">' + cmd.icon + '</span>' +
          '<span class="cmdk__item-label">' + cmd.label + '</span>' +
          '<span class="cmdk__item-kind">' + cmd.kind + '</span>';
        li.addEventListener('mousemove', () => { active = i; updateActive(); });
        li.addEventListener('click', () => run(cmd));
        list.appendChild(li);
      });
    };
    const updateActive = () => {
      [...list.children].forEach((li, i) => li.setAttribute && li.setAttribute('aria-selected', i === active ? 'true' : 'false'));
      const el = list.children[active];
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    };
    const filter = (q) => {
      const s = q.trim().toLowerCase();
      filtered = s ? COMMANDS.filter((c) => c.label.toLowerCase().includes(s) || c.kind.includes(s)) : COMMANDS.slice();
      active = 0;
      render();
    };

    const open = () => {
      cmdk.classList.add('open');
      cmdk.setAttribute('aria-hidden', 'false');
      input.value = '';
      filter('');
      setTimeout(() => input.focus(), 20);
    };
    const close = () => {
      cmdk.classList.remove('open');
      cmdk.setAttribute('aria-hidden', 'true');
    };
    const run = (cmd) => {
      close();
      if (cmd.modal) {
        if (window.PF) window.PF.openModal(cmd.modal);
      } else if (cmd.copy) {
        if (window.PF) window.PF.copyText(cmd.copy, cmd.copyLabel);
      } else if (cmd.target) {
        const el = document.querySelector(cmd.target);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      } else if (cmd.href) {
        const a = document.createElement('a');
        a.href = cmd.href;
        if (cmd.download) a.setAttribute('download', '');
        else if (cmd.href.startsWith('http')) a.target = '_blank';
        document.body.appendChild(a); a.click(); a.remove();
      }
    };

    if (openBtn) openBtn.addEventListener('click', open);
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.classList.contains('open') ? close() : open(); return; }
      if (!cmdk.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (filtered.length) { active = (active + 1) % filtered.length; updateActive(); } }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (filtered.length) { active = (active - 1 + filtered.length) % filtered.length; updateActive(); } }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) run(filtered[active]); }
    });
    input.addEventListener('input', () => filter(input.value));
    cmdk.addEventListener('click', (e) => { if (e.target.hasAttribute('data-cmdk-close')) close(); });
  })();

  /* ---------- Copy-to-clipboard, modals, shortcuts, micro-interactions ---------- */
  (function uiEnhancements() {
    const toastEl = document.getElementById('toast');
    let toastT;
    const toast = (msg) => {
      if (!toastEl) return;
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(toastT);
      toastT = setTimeout(() => toastEl.classList.remove('show'), 2200);
    };
    const fallbackCopy = (text, cb) => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { document.execCommand('copy'); cb && cb(); } catch (e) { /* noop */ }
      ta.remove();
    };
    const copyText = (text, label) => {
      const done = () => toast((label || 'Text') + ' copied to clipboard');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else fallbackCopy(text, done);
    };

    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        copyText(btn.dataset.copy, btn.dataset.copyLabel);
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1200);
      });
    });

    // Modals (résumé preview + shortcuts)
    const resumeModal = document.getElementById('resumeModal');
    const resumeFrame = document.getElementById('resumeFrame');
    const shortcutsModal = document.getElementById('shortcutsModal');
    let lastFocus = null;

    const openModal = (which) => {
      const m = which === 'shortcuts' ? shortcutsModal : resumeModal;
      if (!m) return;
      if (m === resumeModal && resumeFrame && resumeFrame.src.indexOf('Resume') === -1) {
        resumeFrame.src = 'assets/Karthick_S_Resume.pdf';
      }
      lastFocus = document.activeElement;
      m.classList.add('open');
      m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeBtn = m.querySelector('.modal__close');
      if (closeBtn) setTimeout(() => closeBtn.focus(), 30);
    };
    const closeModal = (m) => {
      const targets = m ? [m] : [...document.querySelectorAll('.modal.open')];
      if (!targets.length) return false;
      targets.forEach((el) => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); });
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) { lastFocus.focus(); lastFocus = null; }
      return true;
    };

    document.querySelectorAll('[data-resume-open]').forEach((el) => {
      el.addEventListener('click', (e) => { e.preventDefault(); openModal('resume'); });
    });
    document.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', () => closeModal(el.closest('.modal')));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeModal(); return; }
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (!typing && (e.key === '?' || (e.key === '/' && e.shiftKey))) {
        e.preventDefault();
        if (shortcutsModal && shortcutsModal.classList.contains('open')) closeModal(shortcutsModal);
        else openModal('shortcuts');
      }
    });

    // Expose for the command palette
    window.PF = { toast, copyText, openModal, closeModal };

    // Micro-interactions — only for fine pointers, and disabled under reduced motion
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !reduce) {
      document.querySelectorAll('.project, .tl-card, .skill-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transition = 'none';
          card.style.transform = 'perspective(720px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 5).toFixed(2) + 'deg) translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => { card.style.transition = ''; card.style.transform = ''; });
      });
      document.querySelectorAll('.btn--primary').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          btn.style.transition = 'none';
          btn.style.transform = 'translate(' + (x * 0.25).toFixed(1) + 'px, ' + (y * 0.25 - 3).toFixed(1) + 'px)';
        });
        btn.addEventListener('mouseleave', () => { btn.style.transition = ''; btn.style.transform = ''; });
      });
    }
  })();

  /* ---------- Quality & Delivery: bars, donuts, counts, pipeline ---------- */
  (function qualityAnimations() {
    const once = (el, cb) => {
      if (!el) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { cb(); io.unobserve(e.target); } });
      }, { threshold: 0.3 });
      io.observe(el);
    };
    const countUp = (el, target, suffix) => {
      if (reduceMotion) { el.textContent = target + (suffix || ''); return; }
      let cur = 0; const step = Math.max(1, Math.ceil(target / 45));
      const inc = () => { cur += step; if (cur >= target) { el.textContent = target + (suffix || ''); return; } el.textContent = cur + (suffix || ''); requestAnimationFrame(inc); };
      inc();
    };

    // Proficiency bars
    const prof = document.getElementById('proficiency');
    once(prof, () => {
      prof.querySelectorAll('.prof__fill').forEach((f) => { f.style.width = f.dataset.pct + '%'; });
      prof.querySelectorAll('.prof__pct').forEach((p) => countUp(p, +p.dataset.pct, '%'));
    });

    // Metrics: donuts + counts
    const metrics = document.getElementById('metrics');
    once(metrics, () => {
      const C = 2 * Math.PI * 52;
      metrics.querySelectorAll('.donut__fill').forEach((c) => {
        const pct = +c.dataset.pct;
        c.style.strokeDashoffset = reduceMotion ? String(C * (1 - pct / 100)) : String(C);
        if (!reduceMotion) requestAnimationFrame(() => { c.style.strokeDashoffset = String(C * (1 - pct / 100)); });
      });
      metrics.querySelectorAll('.donut__num, .metric__big').forEach((n) => countUp(n, +n.dataset.count, ''));
    });

    // CI/CD pipeline
    const pipeline = document.getElementById('pipeline');
    once(pipeline, () => {
      const steps = [...pipeline.querySelectorAll('.pipe')];
      const links = [...pipeline.querySelectorAll('.pipe__link')];
      if (reduceMotion) { steps.forEach((s) => s.classList.add('done')); links.forEach((l) => l.classList.add('fill')); return; }
      let i = 0;
      const run = () => {
        if (i >= steps.length) return;
        steps[i].classList.add('active');
        setTimeout(() => {
          steps[i].classList.remove('active');
          steps[i].classList.add('done');
          if (links[i]) links[i].classList.add('fill');
          i++;
          setTimeout(run, 500);
        }, 650);
      };
      run();
    });
  })();

  /* ---------- Automation in Action: multi-scenario live demo ---------- */
  (function automationDemo() {
    const code = document.getElementById('demoCode');
    const demo = document.getElementById('demo');
    if (!code || !demo) return;

    const url = document.getElementById('demoUrl');
    const viewport = document.getElementById('demoViewport');
    const mockLogin = document.getElementById('mockLogin');
    const mUser = document.getElementById('mUser');
    const mPass = document.getElementById('mPass');
    const mBtn = document.getElementById('mBtn');
    const success = document.getElementById('mockSuccess');
    const cons = document.getElementById('demoConsole');
    const status = document.getElementById('demoStatus');
    const statusText = document.getElementById('demoStatusText');
    const fileEl = document.getElementById('demoFile');
    const langEl = document.getElementById('demoLang');
    const tabs = document.getElementById('demoTabs');

    const ABORT = Symbol('abort');
    const PW = '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';
    const kw = (t) => '<span class="c-kw">' + t + '</span>';
    const fn = (t) => '<span class="c-fn">' + t + '</span>';
    const st = (t) => '<span class="c-str">' + t + '</span>';
    const mod = (t) => '<span class="c-mod">' + t + '</span>';
    const at = (t) => '<span class="c-attr">' + t + '</span>';
    const nm = (t) => '<span class="c-num">' + t + '</span>';
    const px = (t) => '<span class="c-punct">' + t + '</span>';

    const setRun = (idx) => {
      code.querySelectorAll('.ln').forEach((l) => l.classList.remove('run'));
      const el = code.querySelector('.ln[data-idx="' + idx + '"]');
      if (el) el.classList.add('run');
    };
    const valEl = (input) => {
      let s = input.querySelector('.mock__val');
      if (!s) { s = document.createElement('span'); s.className = 'mock__val'; input.insertBefore(s, input.querySelector('i')); }
      return s;
    };
    const cline = (html) => { const d = document.createElement('div'); d.className = 'cl'; d.innerHTML = html; cons.appendChild(d); cons.scrollTop = cons.scrollHeight; return d; };
    const setStatus = (cls, txt) => { status.className = 'demo__status' + (cls ? ' ' + cls : ''); statusText.textContent = txt; };

    /* ---- Scenarios ---- */
    const SCENARIOS = {
      ui: {
        file: 'test_login.py', lang: 'Python · Selenium', view: 'browser', url: 'https://app.velocity/login',
        code: [
          { p: 'from selenium import webdriver', h: kw('from') + ' ' + mod('selenium') + ' ' + kw('import') + ' ' + mod('webdriver') },
          { p: 'from selenium.webdriver.common.by import By', h: kw('from') + ' ' + mod('selenium.webdriver.common.by') + ' ' + kw('import') + ' ' + mod('By') },
          { p: '', h: '' },
          { p: 'def test_login(driver):', h: kw('def') + ' ' + fn('test_login') + px('(') + 'driver' + px('):') },
          { p: '    driver.get("https://app.velocity/login")', h: '    driver.' + fn('get') + px('(') + st('"https://app.velocity/login"') + px(')') },
          { p: '    driver.find_element(By.ID, "email").send_keys("karthick@qa.io")', h: '    driver.' + fn('find_element') + px('(') + at('By.ID') + px(',') + ' ' + st('"email"') + px(')') + '.' + fn('send_keys') + px('(') + st('"karthick@qa.io"') + px(')') },
          { p: '    driver.find_element(By.ID, "password").send_keys("SecurePass!")', h: '    driver.' + fn('find_element') + px('(') + at('By.ID') + px(',') + ' ' + st('"password"') + px(')') + '.' + fn('send_keys') + px('(') + st('"SecurePass!"') + px(')') },
          { p: '    driver.find_element(By.ID, "signin").click()', h: '    driver.' + fn('find_element') + px('(') + at('By.ID') + px(',') + ' ' + st('"signin"') + px(')') + '.' + fn('click') + px('()') },
          { p: '    assert "Dashboard" in driver.title', h: '    ' + kw('assert') + ' ' + st('"Dashboard"') + ' ' + kw('in') + ' driver.title' },
          { p: '    print("\u2713 Login test passed")', h: '    ' + fn('print') + px('(') + st('"\u2713 Login test passed"') + px(')') },
        ],
        run: async (wait) => {
          setStatus('running', 'Running test_login ...');
          setRun(4); mockLogin.classList.add('show'); await wait(750);
          setRun(5); mUser.classList.add('focus'); await typeInto(mUser, 'karthick@qa.io', wait); mUser.classList.remove('focus'); await wait(260);
          setRun(6); mPass.classList.add('focus'); await typeInto(mPass, PW, wait); mPass.classList.remove('focus'); await wait(260);
          setRun(7); mBtn.classList.add('press'); await wait(220); mBtn.classList.remove('press'); await wait(450);
          setRun(8); success.classList.add('show'); await wait(800);
          setRun(9); setStatus('pass', '\u2713 1 passed in 1.42s');
        },
      },

      api: {
        file: 'test_api.py', lang: 'Python · Pytest + requests', view: 'console', url: 'pytest tests/test_api.py -v',
        code: [
          { p: 'import requests', h: kw('import') + ' ' + mod('requests') },
          { p: '', h: '' },
          { p: 'def test_login_api():', h: kw('def') + ' ' + fn('test_login_api') + px('():') },
          { p: '    payload = {"email": "karthick@qa.io", "password": "SecurePass!"}', h: '    payload ' + px('=') + ' ' + px('{') + st('"email"') + px(':') + ' ' + st('"karthick@qa.io"') + px(',') + ' ' + st('"password"') + px(':') + ' ' + st('"SecurePass!"') + px('}') },
          { p: '    r = requests.post("https://api.velocity/v1/auth/login", json=payload)', h: '    r ' + px('=') + ' requests.' + fn('post') + px('(') + st('"https://api.velocity/v1/auth/login"') + px(',') + ' json' + px('=') + 'payload' + px(')') },
          { p: '    assert r.status_code == 200', h: '    ' + kw('assert') + ' r.status_code ' + px('==') + ' ' + nm('200') },
          { p: '    body = r.json()', h: '    body ' + px('=') + ' r.' + fn('json') + px('()') },
          { p: '    assert body["token"] is not None', h: '    ' + kw('assert') + ' body' + px('[') + st('"token"') + px(']') + ' ' + kw('is') + ' ' + kw('not') + ' ' + kw('None') },
          { p: '    assert body["role"] == "admin"', h: '    ' + kw('assert') + ' body' + px('[') + st('"role"') + px(']') + ' ' + px('==') + ' ' + st('"admin"') },
        ],
        run: async (wait) => {
          setStatus('running', 'Running test_api.py ...');
          cline('<span class="cl-dim">$ pytest tests/test_api.py -v</span>'); await wait(600);
          setRun(4); cline('<span class="cl-info">POST</span> <span class="cl-dim">/v1/auth/login</span> \u2192 <span class="cl-ok">200 OK</span> <span class="cl-dim">88ms</span>'); await wait(650);
          setRun(5); cline('<span class="cl-dim">  \u21b3 assert status_code == 200</span> <span class="cl-ok">\u2713</span>'); await wait(400);
          setRun(6); cline('<span class="cl-dim">  \u21b3 body = r.json()</span> <span class="cl-ok">\u2713</span>'); await wait(400);
          setRun(7); cline('<span class="cl-dim">  \u21b3 assert body["token"] is not None</span> <span class="cl-ok">\u2713</span>'); await wait(400);
          setRun(8); cline('<span class="cl-dim">  \u21b3 assert body["role"] == "admin"</span> <span class="cl-ok">\u2713</span>'); await wait(600);
          cline('<span class="cl-pass">3 passed in 0.19s</span>');
          setStatus('pass', '\u2713 3 passed in 0.19s');
        },
      },

      flaky: {
        file: 'test_dashboard.py', lang: 'Python · pytest-rerunfailures', view: 'console', url: 'pytest test_dashboard.py --reruns 2',
        code: [
          { p: 'import pytest', h: kw('import') + ' ' + mod('pytest') },
          { p: '', h: '' },
          { p: '@pytest.mark.flaky(reruns=2, reruns_delay=1)', h: at('@pytest.mark.flaky') + px('(') + 'reruns' + px('=') + nm('2') + px(',') + ' reruns_delay' + px('=') + nm('1') + px(')') },
          { p: 'def test_dashboard_loads(driver):', h: kw('def') + ' ' + fn('test_dashboard_loads') + px('(') + 'driver' + px('):') },
          { p: '    driver.get("https://app.velocity/dashboard")', h: '    driver.' + fn('get') + px('(') + st('"https://app.velocity/dashboard"') + px(')') },
          { p: '    widget = driver.find_element(By.ID, "widget")', h: '    widget ' + px('=') + ' driver.' + fn('find_element') + px('(') + at('By.ID') + px(',') + ' ' + st('"widget"') + px(')') },
          { p: '    assert widget.is_displayed()', h: '    ' + kw('assert') + ' widget.' + fn('is_displayed') + px('()') },
        ],
        run: async (wait) => {
          setStatus('running', 'Running test_dashboard_loads ...');
          cline('<span class="cl-dim">$ pytest test_dashboard.py --reruns 2</span>'); await wait(600);
          setRun(4); cline('<span class="cl-info">\u25b6 test_dashboard_loads</span> <span class="cl-dim">[attempt 1/3]</span>'); await wait(750);
          setRun(5); cline('<span class="cl-fail">  \u2717 FAILED</span> <span class="cl-dim">TimeoutException: #widget not visible (10s)</span>');
          setStatus('fail', '\u2717 attempt 1 failed \u2014 retrying'); await wait(850);
          cline('<span class="cl-warn">\u21bb rerunning failed test \u2014 retry in 1s\u2026</span>'); await wait(1100);
          setStatus('running', 'Re-running test_dashboard_loads ...');
          setRun(4); cline('<span class="cl-info">\u25b6 test_dashboard_loads</span> <span class="cl-dim">[attempt 2/3]</span>'); await wait(800);
          setRun(6); cline('<span class="cl-pass">  \u2713 PASSED</span> <span class="cl-dim">recovered after 1 retry</span>'); await wait(550);
          cline('<span class="cl-pass">1 passed, 0 failed</span> <span class="cl-dim">(1 rerun) in 2.31s</span>');
          setStatus('pass', '\u2713 1 passed (1 rerun)');
        },
      },
    };

    async function typeInto(input, text, wait) {
      const s = valEl(input); s.textContent = '';
      for (let i = 0; i < text.length; i++) { s.textContent = text.slice(0, i + 1); await wait(55); }
    }
    async function typeCode(lines, wait) {
      code.innerHTML = '';
      for (let i = 0; i < lines.length; i++) {
        const ln = document.createElement('span');
        ln.className = 'ln'; ln.dataset.idx = i;
        ln.innerHTML = '<span class="ln-body"></span><span class="ex-caret">|</span>';
        code.appendChild(ln);
        const body = ln.querySelector('.ln-body');
        const line = lines[i];
        for (let c = 0; c < line.p.length; c++) { body.textContent = line.p.slice(0, c + 1); await wait(16); }
        body.innerHTML = line.h || '&nbsp;';
        ln.classList.add('done');
        await wait(55);
      }
    }
    function resetFor(s) {
      success.classList.remove('show');
      mockLogin.classList.remove('show');
      [mUser, mPass].forEach((el) => { const v = el.querySelector('.mock__val'); if (v) v.textContent = ''; el.classList.remove('focus'); });
      cons.innerHTML = '';
      viewport.classList.toggle('is-console', s.view === 'console');
      url.textContent = s.url;
      setStatus('', 'Ready to run');
      code.querySelectorAll('.ln').forEach((l) => l.classList.remove('run'));
    }
    function renderStatic(s) {
      resetFor(s);
      code.innerHTML = s.code.map((c) => '<span class="ln done">' + (c.h || '&nbsp;') + '</span>').join('');
      fileEl.textContent = s.file; langEl.textContent = s.lang;
      if (s.view === 'browser') {
        mockLogin.classList.add('show');
        valEl(mUser).textContent = 'karthick@qa.io';
        valEl(mPass).textContent = PW.slice(0, 8);
        success.classList.add('show');
      } else if (s.key === 'api') {
        cline('<span class="cl-pass">3 passed in 0.19s</span>');
      } else {
        cline('<span class="cl-pass">1 passed, 0 failed</span> <span class="cl-dim">(1 rerun)</span>');
      }
      setStatus('pass', s.key === 'api' ? '\u2713 3 passed in 0.19s' : (s.view === 'browser' ? '\u2713 1 passed in 1.42s' : '\u2713 1 passed (1 rerun)'));
    }

    let token = 0;
    async function start(key) {
      const s = SCENARIOS[key]; s.key = key;
      fileEl.textContent = s.file; langEl.textContent = s.lang;
      if (reduceMotion) { renderStatic(s); return; }
      const my = ++token;
      const wait = (ms) => new Promise((res, rej) => setTimeout(() => (my === token ? res() : rej(ABORT)), ms));
      try {
        while (true) {
          resetFor(s);
          await typeCode(s.code, wait);
          await wait(500);
          await s.run(wait);
          await wait(2600);
        }
      } catch (e) { if (e !== ABORT) throw e; }
    }

    let started = false;
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.demo-tab');
        if (!btn) return;
        started = true;
        [...tabs.children].forEach((b) => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
        start(btn.dataset.scn);
      });
    }

    const dio = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting && !started) { started = true; start('ui'); } }),
      { threshold: 0.25 }
    );
    dio.observe(demo);
  })();

  /* ---------- Playground: interactive terminal ---------- */
  (function interactiveTerminal() {
    const body = document.getElementById('term2Body');
    const input = document.getElementById('term2Input');
    if (!body || !input) return;

    const print = (html, cls) => {
      const d = document.createElement('div');
      if (cls) d.className = cls;
      d.innerHTML = html;
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
    };

    const COMMANDS = {
      help: () => "Available commands:\n  <b>about</b>      who is Karthick\n  <b>skills</b>     tech stack\n  <b>experience</b> work history\n  <b>projects</b>   featured work\n  <b>contact</b>    how to reach me\n  <b>resume</b>     download my r\u00e9sum\u00e9\n  <b>social</b>     find me online\n  <b>whoami</b>     quick intro\n  <b>clear</b>      clear the screen\n  <b>sudo hire-me</b>  \u2728",
      about: () => "Senior Automation Test Engineer with 5+ years building scalable UI & API automation with Python, Selenium and BDD. Chennai, India.",
      whoami: () => "karthick \u2014 senior automation test engineer (SDET)",
      skills: () => "Python \u00b7 Selenium WebDriver \u00b7 Behave/Cucumber (BDD) \u00b7 Pytest \u00b7 Rest Assured \u00b7 API testing \u00b7 SQL \u00b7 GitHub Actions CI/CD \u00b7 AI-assisted testing",
      experience: () => "\u2022 Hirsch Pvt Ltd \u2014 Sr. Automation Test Engineer (Apr 2025\u2013now)\n\u2022 Cognizant \u2014 Sr. Test Engineer (May 2021\u2013Mar 2025)",
      projects: () => "\u2022 Velocity Automation Suite (Python/Selenium/Behave)\n\u2022 AEL Insurance Automation (Python/Pytest/Java)\n\u2022 Guardian ESQA \u2014 TRR Testing (BDD/Cucumber/SQL)",
      contact: () => 'Email: <a href="mailto:karthickyuvisri@gmail.com">karthickyuvisri@gmail.com</a>\nPhone: +91 63820 26795\nLocation: Chennai, India',
      social: () => 'GitHub, LinkedIn & email \u2014 see the Contact section. \ud83d\udd17',
      resume: () => { const a = document.createElement('a'); a.href = 'assets/Karthick_S_Resume.pdf'; a.setAttribute('download', ''); document.body.appendChild(a); a.click(); a.remove(); return 'Downloading r\u00e9sum\u00e9\u2026 \u2b07'; },
      'sudo hire-me': () => "\ud83d\ude80 Access granted! Redirecting to my inbox\u2026 open the Contact section or run 'contact'. Let's talk!",
      echo: (args) => args.join(' '),
      ls: () => 'about  skills  experience  projects  contact  resume  social',
      clear: () => { body.innerHTML = ''; return null; },
    };

    print("Welcome to Karthick's portfolio shell \u2014 type <b>help</b> to get started.", 't-out');

    const history = [];
    let hIdx = -1;

    const run = (raw) => {
      const line = raw.trim();
      print('<span class="t-dim">karthick@portfolio:~$</span> <span class="t-cmd-echo">' + line.replace(/</g, '&lt;') + '</span>');
      if (!line) return;
      history.unshift(line); hIdx = -1;
      const lower = line.toLowerCase();
      let fn = COMMANDS[lower];
      if (!fn) {
        const parts = lower.split(/\s+/);
        if (COMMANDS[parts[0]]) fn = () => COMMANDS[parts[0]](line.split(/\s+/).slice(1));
      }
      if (fn) { const out = fn(); if (out != null) print(out, 't-out'); }
      else print('command not found: ' + line.replace(/</g, '&lt;') + " \u2014 type 'help'", 't-err');
    };

    const line = document.getElementById('term2Line');
    const syncCursor = () => { if (line) line.classList.toggle('typing', input.value.length > 0); };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { run(input.value); input.value = ''; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (history.length) { hIdx = Math.min(hIdx + 1, history.length - 1); input.value = history[hIdx]; } }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (hIdx > 0) { hIdx--; input.value = history[hIdx]; } else { hIdx = -1; input.value = ''; } }
      syncCursor();
    });
    input.addEventListener('input', syncCursor);
    if (line) line.addEventListener('click', () => input.focus());
  })();

  /* ---------- Playground: run the suite ---------- */
  (function runSuite() {
    const btn = document.getElementById('suiteBtn');
    const fill = document.getElementById('suiteFill');
    const cons = document.getElementById('suiteConsole');
    const report = document.getElementById('suiteReport');
    if (!btn || !fill || !cons) return;

    const TESTS = [
      { n: 'auth/login_flow', r: 'pass' },
      { n: 'auth/logout', r: 'pass' },
      { n: 'access/role_permissions', r: 'pass' },
      { n: 'api/contract_validation', r: 'pass' },
      { n: 'api/rate_limit', r: 'skip' },
      { n: 'policy/data_driven_checks', r: 'pass' },
      { n: 'billing/invoice_totals', r: 'fail' },
      { n: 'dashboard/widgets_load', r: 'flaky' },
      { n: 'recon/e2e_reconciliation', r: 'pass' },
    ];
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const cline = (html) => { const d = document.createElement('div'); d.className = 'cl'; d.innerHTML = html; cons.appendChild(d); cons.scrollTop = cons.scrollHeight; };

    btn.addEventListener('click', async () => {
      btn.disabled = true; btn.textContent = 'Running…';
      report.hidden = true; cons.innerHTML = ''; fill.style.width = '0%';
      let pass = 0, fail = 0, skip = 0;
      const t0 = performance.now();
      cline('<span class="cl-dim">$ pytest -n auto --reruns 1 tests/regression/</span>');
      await sleep(500);
      for (let i = 0; i < TESTS.length; i++) {
        const t = TESTS[i];
        await sleep(reduceMotion ? 0 : 420);
        if (t.r === 'pass') { pass++; cline('<span class="cl-ok">PASS</span> <span class="cl-dim">' + t.n + '</span>'); }
        else if (t.r === 'skip') { skip++; cline('<span class="cl-warn">SKIP</span> <span class="cl-dim">' + t.n + ' (marked @wip)</span>'); }
        else if (t.r === 'fail') { fail++; cline('<span class="cl-fail">FAIL</span> <span class="cl-dim">' + t.n + ' \u2014 AssertionError: expected 1040.00, got 1039.98</span>'); }
        else if (t.r === 'flaky') {
          cline('<span class="cl-fail">FAIL</span> <span class="cl-dim">' + t.n + ' \u2014 TimeoutException</span>');
          await sleep(reduceMotion ? 0 : 500);
          cline('<span class="cl-warn">\u21bb rerun</span> <span class="cl-dim">' + t.n + '</span>');
          await sleep(reduceMotion ? 0 : 450);
          pass++; cline('<span class="cl-ok">PASS</span> <span class="cl-dim">' + t.n + ' (recovered)</span>');
        }
        fill.style.width = Math.round(((i + 1) / TESTS.length) * 100) + '%';
      }
      const dur = (reduceMotion ? 3.9 : (performance.now() - t0) / 1000).toFixed(1);
      await sleep(300);
      const failTxt = fail > 0 ? '<span class="cl-fail">' + fail + ' failed</span>' : fail + ' failed';
      cline('<span class="cl-pass">' + pass + ' passed</span><span class="cl-dim">, ' + skip + ' skipped, </span>' + failTxt + '<span class="cl-dim"> in ' + dur + 's</span>');
      document.getElementById('repPass').textContent = pass;
      document.getElementById('repFail').textContent = fail;
      document.getElementById('repSkip').textContent = skip;
      document.getElementById('repTime').textContent = dur + 's';
      document.getElementById('repCov').textContent = '98%';
      report.hidden = false;
      btn.disabled = false; btn.textContent = '▶ Run again';
    });
  })();

  /* ---------- Playground: GitHub stats ---------- */
  (function githubStats() {
    const gh = document.getElementById('gh');
    if (!gh) return;
    const user = gh.dataset.user;
    const note = document.getElementById('ghNote');
    const handle = document.getElementById('ghHandle');
    if (handle) { handle.textContent = '@' + user; handle.href = 'https://github.com/' + user; }

    const fail = (msg) => { if (note) note.innerHTML = msg + ' <a href="https://github.com/' + user + '" target="_blank" rel="noopener">Visit @' + user + ' \u2197</a>'; };

    const load = () => {
      fetch('https://api.github.com/users/' + user)
        .then((r) => { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
        .then((d) => {
          document.getElementById('ghRepos').textContent = d.public_repos != null ? d.public_repos : '—';
          document.getElementById('ghFollowers').textContent = d.followers != null ? d.followers : '—';
          document.getElementById('ghFollowing').textContent = d.following != null ? d.following : '—';
          return fetch('https://api.github.com/users/' + user + '/repos?per_page=100&sort=updated');
        })
        .then((r) => (r && r.ok ? r.json() : []))
        .then((repos) => {
          const stars = Array.isArray(repos) ? repos.reduce((s, x) => s + (x.stargazers_count || 0), 0) : 0;
          document.getElementById('ghStars').textContent = stars;
        })
        .catch(() => fail('Live stats unavailable right now.'));
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { load(); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    io.observe(gh);
  })();

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
