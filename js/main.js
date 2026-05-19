// ── MOBILE NAV ──
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const dropdowns = document.querySelectorAll('.nav-dropdown');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

dropdowns.forEach(dd => {
  dd.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.stopPropagation();
      dd.classList.toggle('open');
    }
  });
});

document.addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  }
});

// ── ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── BACK TO TOP ──
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── SCROLL ANIMATIONS ──
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.enterprise-card, .card, .stat-num, .feature-item, .crop-card, .product-card, .value-card, .timeline-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#40916c';
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.background = '';
    }, 3500);
  }, 1200);
});

// inject animate-in style once
const style = document.createElement('style');
style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
