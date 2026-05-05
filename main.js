/* ═══════════════════════════════════════════
   main.js — Interactividad del sitio web
   María Gomez Campillo
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR: scroll effect ──────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ── NAVBAR: menú hamburguesa (móvil) ──────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Cerrar menú al hacer clic en un enlace
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });

  // ── SMOOTH SCROLL para todos los enlaces #── 
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // altura del navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── REVEAL ON SCROLL ──────────────────────
  // Agrega clase .reveal a elementos de sección para animarlos
  const revealTargets = document.querySelectorAll(
    '.service-card, .work-card, .testimonial-card, .about-text, .about-carousel, .contact-text, .section-header'
  );

  revealTargets.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Retraso escalonado para elementos en grupo
        const siblings = Array.from(entry.target.parentNode.children);
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(el => revealObserver.observe(el));

  // El hero ya tiene .reveal en el HTML, activar al cargar
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 200);

  // ── CARRUSEL ──────────────────────────────
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (track) {
    const slides = track.querySelectorAll('.carousel-slide');
    let current = 0;
    let autoplayTimer;

    // Crear dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
    prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

    // Autoplay cada 4 segundos
    function startAutoplay() {
      autoplayTimer = setInterval(next, 4000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();

    // Touch/swipe en móvil
    let touchStartX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        resetAutoplay();
      }
    }, { passive: true });
  }

  // ── ACTIVE NAV LINK al hacer scroll ───────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

  // ── CONTADOR DE EXPERIENCIA (easter egg) ──
  // Pequeña animación de número cuando la sección About entra en pantalla
  const aboutSection = document.querySelector('.about');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      const strongEl = document.querySelector('.about-text strong');
      if (strongEl) {
        let n = 0;
        const target = 16;
        const interval = setInterval(() => {
          n++;
          strongEl.textContent = `${n} años`;
          if (n >= target) {
            clearInterval(interval);
            strongEl.textContent = `${target} años`;
          }
        }, 60);
      }
    }
  }, { threshold: 0.5 });

  if (aboutSection) countObserver.observe(aboutSection);

  // ── LOG DE CONSOLA ─────────────────────────
  console.log('%c María Gomez Campillo ', 'background:#0096C7;color:white;font-size:16px;padding:8px 16px;border-radius:4px;');
  console.log('%c Especialista en Marketing | Zaragoza ', 'color:#0096C7;font-size:12px;');

});
