/* ==========================================================================
   AINUN NISHAT PROTTOY — PORTFOLIO SCRIPT
   Vanilla JS only. Sections:
   1. Navbar scroll shrink
   2. Mobile menu (hamburger -> X, slide in, overlay)
   3. Active nav link on scroll
   4. Typing animation (hero title)
   5. Scroll reveal (Intersection Observer)
   6. Skill bar fill (Intersection Observer)
   7. Button ripple effect
   8. Contact form (opens Messenger with the message pre-filled)
   9. Back-to-top button
   10. Footer year
   11. 3D neural-network background (canvas)
   12. Section transition curtain (nav / anchor navigation)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------- 1. NAVBAR SCROLL SHRINK ------------------------ */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------- 2. MOBILE MENU --------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinksEl.classList.remove('open');
    navOverlay.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    hamburger.classList.add('active');
    navLinksEl.classList.add('open');
    navOverlay.classList.add('show');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });
  navOverlay.addEventListener('click', closeMenu);

  const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));
  navLinkEls.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------------------- 3. ACTIVE NAV LINK ON SCROLL -------------------- */
  const sections = navLinkEls
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ---------------------- 4. TYPING ANIMATION ----------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Frontend Developer',
    'MERN Stack Engineer',
    'Next.js Enthusiast',
    'AI & ML Explorer'
  ];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    if (!typedTextEl) return;
    const current = roles[roleIndex];

    if (!deleting){
      charIndex++;
      typedTextEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typedTextEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 85);
  }

  if (prefersReducedMotion){
    typedTextEl.textContent = roles[0];
  } else {
    typeLoop();
  }

  /* ---------------------- 5. SCROLL REVEAL -------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------- 6. SKILL BAR FILL ------------------------------- */
  const bars = document.querySelectorAll('.bar');
  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => barObserver.observe(bar));

  /* ---------------------- 7. BUTTON RIPPLE -------------------------------- */
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------- 8. CONTACT FORM --------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const sendBtn = document.getElementById('sendBtn');

  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()){
        formStatus.textContent = 'Please fill in every field before sending.';
        formStatus.style.color = 'var(--danger)';
        return;
      }
      const label = sendBtn.querySelector('.btn-label');
      const original = label.textContent;
      sendBtn.disabled = true;
      label.textContent = 'Opening Messenger…';

      const messengerId = contactForm.dataset.messengerId;
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      const composed =
        `Hi Ainun, I'm ${name} (${email}).\n` +
        `Subject: ${subject}\n\n${message}`;
      const messengerUrl = `https://m.me/${messengerId}?text=${encodeURIComponent(composed)}`;

      setTimeout(() => {
        label.textContent = original;
        sendBtn.disabled = false;
        formStatus.style.color = 'var(--accent)';
        formStatus.textContent = 'Opening Messenger with your message pre-filled — send it from there to reach me directly.';
        window.open(messengerUrl, '_blank', 'noopener');
        contactForm.reset();
      }, 500);
    });
  }

  /* ---------------------- 9. BACK TO TOP ---------------------------------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------------------- 10. FOOTER YEAR --------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------- 11. 3D NEURAL-NETWORK BACKGROUND ---------------- */
  (function initNeuralCanvas(){
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');

    const NODE_COUNT = 70;
    const SPACE = 900;
    const FOV = 640;
    const LINK_DIST = 150;

    let width, height, cx, cy;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let rotY = 0, rotX = 0, targetRotX = 0;
    let raf = null;

    function resize(){
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      cy = height / 2;
    }

    function makeNodes(){
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++){
        nodes.push({
          x: (Math.random() * 2 - 1) * SPACE,
          y: (Math.random() * 2 - 1) * SPACE * 0.55,
          z: (Math.random() * 2 - 1) * SPACE,
          vz: (Math.random() * 0.35 + 0.08) * (Math.random() < 0.5 ? -1 : 1)
        });
      }
    }

    // Rotate each point around Y then X, then project with a simple
    // perspective divide — enough to read as "3D" without a WebGL library.
    function project(p){
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const rx = p.x * cosY - p.z * sinY;
      const rz1 = p.x * sinY + p.z * cosY;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const ry = p.y * cosX - rz1 * sinX;
      const rz = p.y * sinX + rz1 * cosX;

      const scale = FOV / (FOV + rz + SPACE * 0.4);
      return { x: cx + rx * scale, y: cy + ry * scale, scale };
    }

    function draw(){
      ctx.clearRect(0, 0, width, height);
      const projected = nodes.map(project);

      for (let i = 0; i < projected.length; i++){
        for (let j = i + 1; j < projected.length; j++){
          const a = projected[i], b = projected[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST){
            const alpha = (1 - dist / LINK_DIST) * 0.35 * Math.min(a.scale, b.scale);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      projected.forEach(p => {
        const r = Math.max(0.6, 2.2 * p.scale);
        ctx.beginPath();
        ctx.fillStyle = `rgba(140, 230, 255, ${Math.min(1, p.scale * 0.9)})`;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function tick(){
      rotY += 0.0009;
      rotX += (targetRotX - rotX) * 0.02;
      nodes.forEach(p => {
        p.z += p.vz;
        if (p.z > SPACE || p.z < -SPACE) p.vz *= -1;
      });
      draw();
      raf = requestAnimationFrame(tick);
    }

    resize();
    makeNodes();

    if (prefersReducedMotion){
      draw(); // one static frame — no motion for reduced-motion users
    } else {
      tick();
      window.addEventListener('mousemove', (e) => {
        targetRotX = ((e.clientY / height) - 0.5) * 0.3;
      }, { passive: true });
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (prefersReducedMotion) draw();
      }, 150);
    });
  })();

  /* ---------------------- 12. SECTION TRANSITION CURTAIN ------------------ */
  // A gradient panel wipes up to cover the viewport, we jump-scroll to the
  // target section behind it, then it wipes away from the top — the same
  // "covered cut" feeling as a full page transition, applied to in-page
  // anchor navigation (nav links, logo, scroll cue, hero CTAs).
  const overlay = document.getElementById('transitionOverlay');
  let transitioning = false;

  const CURTAIN_MS = 500;

  function sectionTransition(targetSelector){
    const target = document.querySelector(targetSelector);
    if (!target || !overlay || transitioning) return;

    if (prefersReducedMotion){
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }

    transitioning = true;
    overlay.classList.remove('reveal');
    void overlay.offsetWidth; // force reflow so repeated clicks re-trigger cleanly
    overlay.classList.add('cover');

    setTimeout(() => {
      const offset = navbar.classList.contains('scrolled') ? 68 : 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;

      // html{scroll-behavior:smooth} would otherwise turn this jump into a
      // slow animated scroll even with behavior:'auto' — disable it for the
      // instant jump behind the curtain, then restore it afterwards.
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, top);
      html.style.scrollBehavior = prevBehavior;

      requestAnimationFrame(() => {
        overlay.classList.remove('cover');
        overlay.classList.add('reveal');

        setTimeout(() => {
          overlay.classList.remove('reveal');
          transitioning = false;
        }, CURTAIN_MS);
      });
    }, CURTAIN_MS);
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.length < 2) return; // skip bare "#" placeholder links
    if (!document.querySelector(href)) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sectionTransition(href);
    });
  });

});
