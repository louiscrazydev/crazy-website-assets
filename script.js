(() => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch {} },
  };

  /* ---------- Welcome splash (once per browser session) ---------- */
  const splash = document.getElementById('splash');
  if (splash) {
    let seenSplash = false;
    try { seenSplash = sessionStorage.getItem('crazySplashSeen') === '1'; } catch {}
    if (seenSplash || prefersReducedMotion) {
      splash.remove();
    } else {
      try { sessionStorage.setItem('crazySplashSeen', '1'); } catch {}
      const HOLD_MS = 4900;
      const EXIT_MS = 600;
      document.documentElement.style.overflow = 'hidden';
      setTimeout(() => {
        splash.classList.add('is-leaving');
        setTimeout(() => {
          splash.remove();
          document.documentElement.style.overflow = '';
        }, EXIT_MS);
      }, HOLD_MS);
    }
  }

  /* ---------- Content data ---------- */
  // Drop a URL here to populate the homepage "Channel Intro" video slot. Two kinds of URL work:
  // 1. A direct video *file* link (e.g. a GitHub raw .mp4 URL, or 'images/intro.mp4') - rendered
  //    as a native <video> player with controls.
  // 2. A YouTube or Twitch *embed* URL, e.g. 'https://www.youtube.com/embed/VIDEO_ID' or
  //    'https://clips.twitch.tv/embed?clip=CLIP_SLUG&parent=YOURDOMAIN' - rendered as an iframe.
  // Leave empty and the slot renders a finished-looking "intro coming soon" placeholder instead.
  const FEATURED_VIDEO_EMBED_URL = '';

  // Drop a direct, hosted video *file* URL here (e.g. 'images/about-bg.mp4') to enable a
  // muted, looping ambient background video behind the About Me bio. Keep it short (6-15s)
  // and compressed (aim under ~5MB) since it loops seamlessly and doesn't need length.
  // Leave empty and the About page renders exactly as it does today, no request is made.
  const ABOUT_BG_VIDEO_URL = '';

  const interestItems = [
    {
      title: 'Books',
      copy: 'Reading in my free time when I\'m not on camera.',
      icon: '<path d="M4 7c4-2 9-2 13 1v19c-4-3-9-3-13-1V7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M30 7c-4-2-9-2-13 1v19c4-3 9-3 13-1V7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    },
    {
      title: 'Anything Paranormal',
      copy: 'Anything paranormal has my attention, ghost stories included.',
      icon: '<path d="M8 30V15a9 9 0 0 1 18 0v15l-3-3-3 3-3-3-3 3-3-3-3 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="none"/><circle cx="13" cy="15" r="1.4" fill="currentColor"/><circle cx="21" cy="15" r="1.4" fill="currentColor"/>',
    },
    {
      title: 'Ghost Hunting',
      copy: 'I dabble in ghost hunting when I get the chance.',
      icon: '<path d="M13 6h8l2 6-2 4v14a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V16l-2-4 2-6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="none"/><path d="M13 12h8" stroke="currentColor" stroke-width="1.8"/>',
    },
    {
      title: 'Tornado Watching',
      copy: 'Certified tornado enthusiast, always tracking the sky.',
      icon: '<path d="M6 8h22M9 14h16M12 20h10M15 26h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    },
    {
      title: 'Occasional IRL Streams',
      copy: 'Every once in a while I\'ll attempt an IRL stream too.',
      icon: '<path d="M6 12h5l2-3h8l2 3h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="none"/><circle cx="17" cy="20" r="5" stroke="currentColor" stroke-width="1.8"/>',
    },
  ];
  // Each game can have a `cover` image: either a local path (drop a file in images/games/
  // using the suggested filename in the comment, matching each game's Steam store header/
  // capsule art) or a direct hosted image URL (e.g. a GitHub raw link). Leave `cover` empty
  // and that card renders a clean placeholder tile instead, no broken image, no distortion.
  const games = [
    { name: 'World of Warcraft', cover: '' }, // suggested: images/games/world-of-warcraft.jpg
    { name: 'Bookshop Simulator', cover: '' }, // suggested: images/games/bookshop-simulator.jpg
    { name: 'Among Us', cover: '' }, // suggested: images/games/among-us.jpg
    { name: 'R.E.P.O.', cover: '' }, // suggested: images/games/repo.jpg
    { name: 'Other Side', cover: '' }, // suggested: images/games/other-side.jpg
    { name: 'Dead by Daylight', cover: '' }, // suggested: images/games/dead-by-daylight.jpg
    { name: 'Waterpark Simulator', cover: '' }, // suggested: images/games/waterpark-simulator.jpg
    { name: 'Wobbly Life', cover: '' }, // suggested: images/games/wobbly-life.jpg
    { name: 'PalWorld', cover: '' }, // suggested: images/games/palworld.jpg
    { name: 'Minecraft', cover: '' }, // suggested: images/games/minecraft.jpg
  ];
  const gameCardPlaceholderIcon = '<path d="M9 13h16a4 4 0 0 1 4 4v6a3 3 0 0 1-5.3 1.9L21.5 22h-9L10 24.9A3 3 0 0 1 5 23v-6a4 4 0 0 1 4-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M11.5 15.5v5M9 18h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="23" cy="17" r="1.3" fill="currentColor"/><circle cx="26" cy="19.5" r="1.3" fill="currentColor"/>';

  const interestCards = document.getElementById('interestCards');
  if (interestCards) {
    interestItems.forEach(item => {
      const el = document.createElement('div');
      el.className = 'interest-card';
      el.setAttribute('data-reveal', '');
      el.setAttribute('data-reveal-group', 'interests');
      el.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 34 34" fill="none" class="interest-icon">${item.icon}</svg>
        <h3 class="interest-card-title">${item.title}</h3>
        <p class="interest-card-copy">${item.copy}</p>
      `;
      interestCards.appendChild(el);
    });
  }

  const gamesGrid = document.getElementById('games-grid');
  games.forEach(game => {
    const el = document.createElement('div');
    el.className = 'game-card' + (game.cover ? '' : ' game-card-noart');
    el.setAttribute('data-reveal', '');
    el.setAttribute('data-reveal-group', 'games');
    el.innerHTML = game.cover
      ? `<div class="game-card-art"><img src="${game.cover}" alt="${game.name} cover art" loading="lazy"></div>
         <div class="game-card-scrim"></div>
         <div class="game-card-name">${game.name}</div>`
      : `<div class="game-card-placeholder-icon"><svg width="26" height="26" viewBox="0 0 34 34" fill="none">${gameCardPlaceholderIcon}</svg></div>
         <div class="game-card-scrim"></div>
         <div class="game-card-name">${game.name}</div>`;
    gamesGrid.appendChild(el);
  });
  const morePill = document.createElement('div');
  morePill.className = 'game-card-more';
  morePill.textContent = '+ way more';
  morePill.setAttribute('data-reveal', '');
  morePill.setAttribute('data-reveal-group', 'games');
  gamesGrid.appendChild(morePill);

  /* ---------- Channel intro video slot ---------- */
  const videoSlot = document.getElementById('featuredVideo');
  if (videoSlot) {
    const isDirectVideoFile = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(FEATURED_VIDEO_EMBED_URL);
    if (FEATURED_VIDEO_EMBED_URL && isDirectVideoFile) {
      const video = document.createElement('video');
      video.src = FEATURED_VIDEO_EMBED_URL;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.title = 'Channel intro';
      videoSlot.appendChild(video);
    } else if (FEATURED_VIDEO_EMBED_URL) {
      const iframe = document.createElement('iframe');
      iframe.src = FEATURED_VIDEO_EMBED_URL;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      iframe.title = 'Channel intro';
      videoSlot.appendChild(iframe);
    } else {
      videoSlot.innerHTML = `
        <div class="video-placeholder">
          <div class="video-play-ring">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 7l9 5-9 5V7z" fill="currentColor"/></svg>
          </div>
          <div class="video-placeholder-text">Get to know the channel. Intro video coming soon.</div>
        </div>`;
    }
  }

  /* Stagger delays for grouped reveal items */
  const groupCounters = {};
  document.querySelectorAll('[data-reveal-group]').forEach(el => {
    const g = el.getAttribute('data-reveal-group');
    groupCounters[g] = (groupCounters[g] || 0);
    el.style.setProperty('--reveal-i', groupCounters[g]);
    groupCounters[g]++;
  });

  /* ---------- Theme presets ---------- */
  const themes = [
    { key: 'signature', name: 'Signature', accent: '#39FF14' },
    { key: 'toxic', name: 'Toxic Slime', accent: '#C6FF00' },
    { key: 'blood-moon', name: 'Blood Moon', accent: '#FF2E4C' },
    { key: 'cyber-violet', name: 'Cyber Violet', accent: '#B026FF' },
    { key: 'arctic', name: 'Arctic Frost', accent: '#4DF0FF' },
    { key: 'inferno', name: 'Inferno', accent: '#FF5B1F' },
    { key: 'royal-static', name: 'Royal Static', accent: '#2E7CFF' },
    { key: 'vapor', name: 'Vapor Dust', accent: '#FF2ED1' },
    { key: 'gold-rush', name: 'Gold Rush', accent: '#FFC53D' },
    { key: 'midnight-mono', name: 'Midnight Mono', accent: '#E4E4E4' },
    { key: 'deep-ocean', name: 'Deep Ocean', accent: '#1FE6C4' },
    { key: 'clean-slate', name: 'Clean Slate', accent: '#6FBF73' },
  ];

  const fonts = [
    { key: 'signature', name: 'SIGNATURE', preview: 'Bungee / Inter' },
    { key: 'neon', name: 'NEON SIGN', preview: 'Monoton / Space Grotesk' },
    { key: 'comic', name: 'COMIC PUNCH', preview: 'Bangers / Work Sans' },
    { key: 'blockade', name: 'BLOCKADE', preview: 'Rubik Mono One / Inter' },
    { key: 'impact', name: 'IMPACT LINE', preview: 'Anton / Roboto' },
    { key: 'street', name: 'STREET BOLD', preview: 'Archivo Black / Karla' },
    { key: 'clean', name: 'CLEAN MINIMAL', preview: 'Space Grotesk' },
    { key: 'riot', name: 'RIOT SHADE', preview: 'Bungee Shade / Inter' },
    { key: 'glitch', name: 'GLITCH STATIC', preview: 'Rubik Glitch / Space Grotesk' },
    { key: 'chrome', name: 'CHROME TAG', preview: 'Bungee Inline / Inter' },
    { key: 'sticker', name: 'STICKER BOMB', preview: 'Luckiest Guy / Nunito' },
    { key: 'marker', name: 'MARKER DRIP', preview: 'Permanent Marker / Mulish' },
    { key: 'concrete', name: 'CONCRETE BLOCK', preview: 'Oswald / Source Sans 3' },
    { key: 'tube', name: 'NEON TUBE', preview: 'Faster One / Manrope' },
    { key: 'party', name: 'BLOCK PARTY', preview: 'Passion One / Nunito Sans' },
    { key: 'newsprint', name: 'NEWSPRINT', preview: 'Bebas Neue / Lato' },
    { key: 'terminal', name: 'TERMINAL', preview: 'Press Start 2P / JetBrains Mono' },
  ];

  const swatchGrid = document.getElementById('swatchGrid');
  themes.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'swatch-btn';
    btn.dataset.themeOpt = t.key;
    btn.style.setProperty('--swatch-accent', t.accent);
    btn.innerHTML = `<span class="swatch-dot"></span>${t.name}`;
    swatchGrid.appendChild(btn);
  });

  const fontList = document.getElementById('fontList');
  fonts.forEach(f => {
    const btn = document.createElement('button');
    btn.className = 'font-opt';
    btn.dataset.fontOpt = f.key;
    btn.innerHTML = `<div class="font-opt-name">${f.name}</div><div class="font-opt-preview" data-font-preview="${f.key}">Crazy</div>`;
    fontList.appendChild(btn);
  });

  /* ---------- Appearance state ---------- */
  function applyTheme(key) {
    body.setAttribute('data-theme', key);
    store.set('crazy-theme', key);
    document.querySelectorAll('.swatch-btn').forEach(b => b.classList.toggle('is-active', b.dataset.themeOpt === key));
    document.querySelectorAll('.press-kit-swatch').forEach(b => b.classList.toggle('is-active', b.dataset.themeOpt === key));
  }
  function applyMode(mode) {
    body.setAttribute('data-mode', mode);
    store.set('crazy-mode', mode);
    document.querySelectorAll('.mode-opt').forEach(b => b.classList.toggle('is-active', b.dataset.modeOpt === mode));
  }
  function applyFont(key) {
    body.setAttribute('data-font', key);
    store.set('crazy-font', key);
    document.querySelectorAll('.font-opt').forEach(b => b.classList.toggle('is-active', b.dataset.fontOpt === key));
    requestAnimationFrame(syncHeaderLayout);
  }

  applyTheme(store.get('crazy-theme', 'signature'));
  applyMode(store.get('crazy-mode', 'dark'));
  applyFont(store.get('crazy-font', 'signature'));

  swatchGrid.addEventListener('click', e => {
    const btn = e.target.closest('.swatch-btn');
    if (btn) applyTheme(btn.dataset.themeOpt);
  });
  const pressKitSwatches = document.getElementById('pressKitSwatches');
  if (pressKitSwatches) {
    pressKitSwatches.addEventListener('click', e => {
      const btn = e.target.closest('.press-kit-swatch');
      if (btn) applyTheme(btn.dataset.themeOpt);
    });
  }
  document.getElementById('themePanel').addEventListener('click', e => {
    const modeBtn = e.target.closest('.mode-opt');
    if (modeBtn) applyMode(modeBtn.getAttribute('data-mode-opt'));
  });
  fontList.addEventListener('click', e => {
    const btn = e.target.closest('.font-opt');
    if (btn) applyFont(btn.dataset.fontOpt);
  });

  /* ---------- Picker panel toggling ---------- */
  function setupPicker(btnId, panelId) {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = panel.hidden;
      closeAllPanels();
      panel.hidden = !willOpen;
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  }
  function closeAllPanels() {
    document.querySelectorAll('.picker-panel').forEach(p => p.hidden = true);
    document.getElementById('themeBtn').setAttribute('aria-expanded', 'false');
    document.getElementById('fontBtn').setAttribute('aria-expanded', 'false');
  }
  setupPicker('themeBtn', 'themePanel');
  setupPicker('fontBtn', 'fontPanel');
  document.addEventListener('click', () => closeAllPanels());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAllPanels(); closeNav(); } });

  /* ---------- Hamburger + slide-in drawer nav (mobile fallback) ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');
  const navClose = document.getElementById('navClose');
  function openNav() {
    navMenu.hidden = false;
    navBackdrop.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    navMenu.hidden = true;
    navBackdrop.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', e => {
    e.stopPropagation();
    if (navMenu.hidden) openNav(); else closeNav();
  });
  navClose.addEventListener('click', closeNav);
  navBackdrop.addEventListener('click', closeNav);
  navMenu.addEventListener('click', e => e.stopPropagation());

  /* ---------- Pill nav sliding indicator + header height sync ---------- */
  const topbarEl = document.getElementById('topbar');
  const pillNav = document.getElementById('pillNav');
  const pillIndicator = document.getElementById('pillIndicator');

  function positionIndicator(route) {
    if (!pillNav || !pillIndicator) return;
    const active = pillNav.querySelector(`.pill-nav-link[data-route="${route}"]`);
    if (!active) return;
    const navRect = pillNav.getBoundingClientRect();
    const linkRect = active.getBoundingClientRect();
    pillIndicator.style.transform = `translate(${linkRect.left - navRect.left}px, ${linkRect.top - navRect.top}px)`;
    pillIndicator.style.width = linkRect.width + 'px';
    pillIndicator.style.height = linkRect.height + 'px';
    pillIndicator.classList.add('is-ready');
  }

  function updateHeaderHeight() {
    if (!topbarEl) return;
    document.documentElement.style.setProperty('--header-h', topbarEl.offsetHeight + 'px');
  }

  function syncHeaderLayout() {
    updateHeaderHeight();
    const activeRoute = document.querySelector('.pill-nav-link.is-active')?.dataset.route;
    if (activeRoute) positionIndicator(activeRoute);
  }

  window.addEventListener('resize', syncHeaderLayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeaderLayout);

  /* ---------- Scroll reveal (per active view) ---------- */
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }) : null;

  function triggerReveal(viewEl) {
    const items = viewEl.querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!revealObserver || prefersReducedMotion) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    items.forEach(el => revealObserver.observe(el));
  }

  /* ---------- About page ambient background video (lazy, optional) ---------- */
  const aboutBgVideoWrap = document.getElementById('aboutBgVideoWrap');
  let aboutBgVideoEl = null;
  function updateAboutVideoState(route) {
    if (!aboutBgVideoWrap || !ABOUT_BG_VIDEO_URL || prefersReducedMotion) return;
    if (route === 'about') {
      if (!aboutBgVideoEl) {
        aboutBgVideoEl = document.createElement('video');
        aboutBgVideoEl.src = ABOUT_BG_VIDEO_URL;
        aboutBgVideoEl.muted = true;
        aboutBgVideoEl.loop = true;
        aboutBgVideoEl.autoplay = true;
        aboutBgVideoEl.playsInline = true;
        aboutBgVideoEl.setAttribute('aria-hidden', 'true');
        aboutBgVideoEl.className = 'about-bg-video';
        aboutBgVideoWrap.insertBefore(aboutBgVideoEl, aboutBgVideoWrap.firstChild);
      }
      aboutBgVideoEl.play().catch(() => {});
    } else if (aboutBgVideoEl) {
      aboutBgVideoEl.pause();
    }
  }

  /* ---------- Router / view transitions ---------- */
  const views = Array.from(document.querySelectorAll('.view'));
  const routeLinks = Array.from(document.querySelectorAll('[data-route]'));
  let currentView = null;
  let transitioning = false;

  function setActiveNav(route) {
    document.querySelectorAll('.nav-drawer a').forEach(a => a.classList.toggle('is-active', a.dataset.route === route));
    document.querySelectorAll('.pill-nav-link').forEach(a => a.classList.toggle('is-active', a.dataset.route === route));
    positionIndicator(route);
  }

  function goTo(route, opts = {}) {
    const target = document.getElementById('view-' + route);
    if (!target || target === currentView) { closeNav(); return; }
    setActiveNav(route);
    closeNav();
    updateAboutVideoState(route);
    if (!currentView || prefersReducedMotion) {
      views.forEach(v => v.classList.remove('is-active', 'is-leaving'));
      target.classList.add('is-active');
      currentView = target;
      if (!opts.silent) window.location.hash = '/' + route;
      triggerReveal(target);
      return;
    }
    transitioning = true;
    const leaving = currentView;
    leaving.classList.add('is-leaving');
    leaving.classList.remove('is-active');
    setTimeout(() => {
      leaving.classList.remove('is-leaving');
      target.classList.add('is-active');
      target.querySelector('.view-scroll')?.scrollTo(0, 0);
      currentView = target;
      transitioning = false;
      triggerReveal(target);
    }, 320);
    if (!opts.silent) window.location.hash = '/' + route;
  }

  routeLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(link.dataset.route);
    });
  });

  window.addEventListener('hashchange', () => {
    const route = (window.location.hash || '#/home').replace('#/', '');
    goTo(route, { silent: true });
  });

  const initialRoute = (window.location.hash || '#/home').replace('#/', '');
  goTo(document.getElementById('view-' + initialRoute) ? initialRoute : 'home', { silent: true });
  updateHeaderHeight();

  /* ---------- Typewriter tagline ---------- */
  const phrases = ['variety gamer.', 'aspiring IRL streamer.', 'future Twitch Partner.'];
  const twEl = document.getElementById('typewriter');
  if (prefersReducedMotion) {
    twEl.textContent = phrases[0];
  } else {
    let phraseIndex = 0, charIndex = 0, deleting = false;
    const TYPE_MS = 55, DELETE_MS = 30, HOLD_MS = 1400, GAP_MS = 400;
    function tick() {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        twEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) { deleting = true; setTimeout(tick, HOLD_MS); return; }
        setTimeout(tick, TYPE_MS);
      } else {
        charIndex--;
        twEl.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(tick, GAP_MS); return; }
        setTimeout(tick, DELETE_MS);
      }
    }
    tick();
  }

  /* ---------- "Currently" rotating status strip ---------- */
  const currentlyEl = document.getElementById('currentlyText');
  const currentlyLines = [
    'Building toward Twitch Partner.',
    'New schedule posted weekly, check Twitter or Discord.',
    'Variety gamer, always taking requests.',
  ];
  if (currentlyEl) {
    if (prefersReducedMotion) {
      currentlyEl.textContent = currentlyLines[0];
    } else {
      let currentlyIndex = 0;
      setInterval(() => {
        currentlyIndex = (currentlyIndex + 1) % currentlyLines.length;
        currentlyEl.style.opacity = '0';
        setTimeout(() => {
          currentlyEl.textContent = currentlyLines[currentlyIndex];
          currentlyEl.style.opacity = '1';
        }, 300);
      }, 4200);
    }
  }

  /* ---------- Accordion (FAQ + About Q&A) ---------- */
  function setupAccordion(listId) {
    const list = document.getElementById(listId);
    if (!list) return;
    list.addEventListener('click', e => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;
      const answer = document.getElementById(btn.getAttribute('aria-controls'));
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        requestAnimationFrame(() => { answer.style.maxHeight = '0px'; });
        btn.setAttribute('aria-expanded', 'false');
        answer.addEventListener('transitionend', function onEnd() {
          answer.hidden = true;
          answer.removeEventListener('transitionend', onEnd);
        }, { once: true });
      } else {
        answer.hidden = false;
        answer.style.maxHeight = '0px';
        requestAnimationFrame(() => { answer.style.maxHeight = answer.scrollHeight + 'px'; });
        btn.setAttribute('aria-expanded', 'true');
        answer.addEventListener('transitionend', function onEnd() {
          answer.style.maxHeight = 'none';
          answer.removeEventListener('transitionend', onEnd);
        }, { once: true });
      }
    });
  }
  setupAccordion('faqList');
  setupAccordion('aboutQaList');

  /* ---------- Contact copy-to-clipboard ---------- */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        copyFeedback.classList.add('is-shown');
        setTimeout(() => copyFeedback.classList.remove('is-shown'), 1600);
      } catch {}
    });
  }

  /* ---------- Hero parallax ---------- */
  const heroParallax = document.getElementById('heroParallax');
  const homeScroll = document.querySelector('#view-home .view-scroll');
  if (heroParallax && homeScroll && !prefersReducedMotion) {
    let ticking = false;
    homeScroll.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = Math.min(homeScroll.scrollTop * 0.12, 60);
        heroParallax.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Hero photo tilt (mouse parallax) ---------- */
  const heroTilt = document.getElementById('heroTilt');
  if (heroTilt && window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    let tiltTicking = false;
    let tiltX = 0, tiltY = 0;
    heroTilt.addEventListener('mousemove', (e) => {
      const rect = heroTilt.getBoundingClientRect();
      tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      if (tiltTicking) return;
      tiltTicking = true;
      requestAnimationFrame(() => {
        heroTilt.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        tiltTicking = false;
      });
    });
    heroTilt.addEventListener('mouseleave', () => {
      heroTilt.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ---------- Hero background particles (localized, ties into site particle system) ---------- */
  const heroBgCanvas = document.getElementById('heroBgParticles');
  if (heroBgCanvas) {
    const heroBgCtx = heroBgCanvas.getContext('2d');
    const sizeHeroCanvas = () => {
      const rect = heroBgCanvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        heroBgCanvas.width = rect.width;
        heroBgCanvas.height = rect.height;
      }
    };
    sizeHeroCanvas();
    window.addEventListener('resize', sizeHeroCanvas);

    const heroParticles = Array.from({ length: 16 }, () => ({
      x: Math.random() * heroBgCanvas.width,
      y: Math.random() * heroBgCanvas.height,
      r: Math.random() * 1.6 + 0.5,
      speed: Math.random() * 0.3 + 0.08,
      drift: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const drawHeroParticles = () => {
      const rgb = accentRGB();
      heroBgCtx.clearRect(0, 0, heroBgCanvas.width, heroBgCanvas.height);
      heroParticles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -6) { p.y = heroBgCanvas.height + 6; p.x = Math.random() * heroBgCanvas.width; }
        if (p.x < -6) p.x = heroBgCanvas.width + 6;
        if (p.x > heroBgCanvas.width + 6) p.x = -6;
        heroBgCtx.beginPath();
        heroBgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        heroBgCtx.fillStyle = `rgba(${rgb},${p.alpha})`;
        heroBgCtx.shadowColor = `rgba(${rgb},0.8)`;
        heroBgCtx.shadowBlur = 5;
        heroBgCtx.fill();
      });
      requestAnimationFrame(drawHeroParticles);
    };
    if (!prefersReducedMotion) drawHeroParticles();
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Floating particle field ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  function accentRGB() {
    const rgb = getComputedStyle(body).getPropertyValue('--accent-rgb').trim();
    return rgb || '57,255,20';
  }

  const N = 50;
  const particles = Array.from({ length: N }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.6,
    speed: Math.random() * 0.35 + 0.08,
    drift: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.5 + 0.15,
  }));

  const draw = () => {
    const rgb = accentRGB();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},${p.alpha})`;
      ctx.shadowColor = `rgba(${rgb},0.8)`;
      ctx.shadowBlur = 6;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  if (!prefersReducedMotion) draw();
  else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
})();

// --- Site logo swap ---
(function(){
  var LOGO_SRC = 'images/Thecrazy.png';
  var selectors = ['.splash-mascot', '.mascot-glow', '.hero-badge', '.footer-brand svg', '.press-kit-mark svg'];
  document.addEventListener('DOMContentLoaded', function(){
    selectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(svg){
        var w = svg.getAttribute('width') || 30;
        var h = svg.getAttribute('height') || 30;
        var img = document.createElement('img');
        img.src = LOGO_SRC;
        img.alt = 'Crazy logo';
        img.style.width = w + 'px';
        img.style.height = h + 'px';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '50%';
        img.style.background = '#060706';
        img.style.padding = '2px';
        svg.parentNode.replaceChild(img, svg);
      });
    });
  });
})();
