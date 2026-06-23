(function () {
  'use strict';

  const phrases = [
    'Fullstack Engineer',
    'Laravel & PHP Expert',
    'Node.js + TypeScript',
    'React & Vue Developer',
    'Fintech Builder',
    'Automation Architect'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedEl = document.getElementById('typedText');
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseEnd = 2000;

  function typeEffect() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(typeEffect, delay);
  }

  typeEffect();

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.1}s`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = width + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillFills.forEach(el => skillObserver.observe(el));

  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          let current = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            entry.target.textContent = current;
          }, 30);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(el => statObserver.observe(el));

  const glow = document.querySelector('.cursor-glow');
  let glowX = 0, glowY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
  });

  function animateGlow() {
    currentX += (glowX - currentX) * 0.08;
    currentY += (glowY - currentY) * 0.08;
    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';
    requestAnimationFrame(animateGlow);
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    animateGlow();
  }

  document.querySelectorAll('.project-card[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const honey = contactForm.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      let valid = true;
      if (name.length < 2) { contactForm.name.classList.add('error'); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { contactForm.email.classList.add('error'); valid = false; }
      if (subject.length < 3) { contactForm.subject.classList.add('error'); valid = false; }
      if (message.length < 10) { contactForm.message.classList.add('error'); valid = false; }

      if (!valid) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill in all fields correctly.';
        return;
      }

      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      submitBtn.disabled = true;
      btnText.hidden = true;
      btnLoading.hidden = false;

      try {
        const res = await fetch('https://formsubmit.co/ajax/ayomikunariyo@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name,
            email,
            subject: `[Portfolio] ${subject}`,
            message: `From: ${name} (${email})\n\n${message}`,
            _subject: `Portfolio Contact: ${subject}`,
            _template: 'table'
          })
        });

        if (res.ok) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
          contactForm.reset();
        } else {
          throw new Error('Send failed');
        }
      } catch {
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
        );
        window.location.href = `mailto:ayomikunariyo@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Opening your email client as a fallback...';
      } finally {
        submitBtn.disabled = false;
        btnText.hidden = false;
        btnLoading.hidden = true;
      }
    });
  }

  if (window.location.hash === '#contact' || window.location.search.includes('sent=1')) {
    const status = document.getElementById('formStatus');
    if (status && window.location.search.includes('sent=1')) {
      status.className = 'form-status success';
      status.textContent = 'Message sent successfully! I\'ll get back to you soon.';
    }
  }
})();
