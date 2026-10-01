/* =====================================================
   AMAN SINGH — PORTFOLIO · script.js
   Typewriter · Particles · Reveal · Navbar · Counter
   ===================================================== */

'use strict';

// ── Typewriter ──────────────────────────────────────
const phrases = [
  'AI / ML Engineer',
  'Full-Stack Developer',
  'Competitive Programmer',
  'Data Analytics Builder',
  'Civic Tech Innovator',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeLoop() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typeEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 55 : 85);
}
typeLoop();

// ── Particle Canvas ─────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

function initParticles() {
  particles = [];
  const count = Math.floor((W * H) / 16000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15,
    });
  }
}
initParticles();

const COLORS = ['#a78bfa','#818cf8','#67e8f9','#f9a8d4'];
function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.globalAlpha = p.alpha;
    ctx.fill();

    // connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = '#7c3aed';
        ctx.globalAlpha = (1 - dist / 100) * 0.12;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Scroll → Navbar ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNavLink();
});

// ── Active nav link on scroll ────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
function highlightNavLink() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

// ── Mobile nav toggle ────────────────────────────────
const toggle   = document.getElementById('navToggle');
const navMenu  = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const spans = toggle.querySelectorAll('span');
  const open  = navMenu.classList.contains('open');
  spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity   = open ? '0' : '';
  spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
});
navMenu.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    navMenu.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Intersection observer — reveal ───────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // trigger count-up if needed
      const nums = e.target.querySelectorAll('[data-count]');
      nums.forEach(n => animateCount(n));
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-children').forEach(el => io.observe(el));

// Also observe project rows as reveal
document.querySelectorAll('.project-row, .exp-card, .ach-card').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// ── Counter animation ────────────────────────────────
function animateCount(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Smooth hover tilt on project cards ───────────────
document.querySelectorAll('.project-row').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 4;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -4;
    card.style.transform = `translateY(-2px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform .1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all .3s cubic-bezier(.4,0,.2,1)';
  });
});

// ── IssueSnap mockup flow step cycler ───────────────
const steps = document.querySelectorAll('.isp-step');
if (steps.length) {
  let si = 0;
  setInterval(() => {
    steps.forEach(s => s.classList.remove('active'));
    si = (si + 1) % steps.length;
    steps[si].classList.add('active');
  }, 1200);
}

// ── CLI cursor blink (already via CSS but add typing anim) ─
const cliBody = document.querySelector('.cli-body');
if (cliBody) {
  const lines = Array.from(cliBody.querySelectorAll('.cli-line'));
  lines.forEach((l, i) => {
    l.style.opacity = '0';
    l.style.transform = 'translateX(-8px)';
    l.style.transition = `opacity .3s ease, transform .3s ease`;
    setTimeout(() => {
      l.style.opacity = '1';
      l.style.transform = 'translateX(0)';
    }, i * 320 + 800);
  });
}

// ── Smooth scroll ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Achievement bars animate when visible ────────────
const achBars = document.querySelectorAll('.ach-bar');
const achIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = e.target;
      const finalWidth = target.style.width;
      target.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.style.transition = 'width 1s cubic-bezier(.4,0,.2,1)';
          target.style.width = finalWidth;
        });
      });
      achIO.unobserve(target);
    }
  });
}, { threshold: 0.3 });
achBars.forEach(b => achIO.observe(b));

// ── Stagger reveal for project rows ─────────────────
const projectRows = document.querySelectorAll('.project-row');
const projIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      projIO.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
projectRows.forEach((row, i) => {
  row.style.transitionDelay = `${i * 0.08}s`;
  projIO.observe(row);
});
