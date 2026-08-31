/**
 * AMG CONSULTING GROUP — MAIN SCRIPT
 * Interações Luxo, Efeito Text-Fill, Menu Responsivo e Validação
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTextFillScroll();
  initActiveNavOnScroll();
  initContactForm();
  initSmoothScroll();
});

/* ----------------------------------------------------
   1. MENU MOBILE
   ---------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ----------------------------------------------------
   2. EFEITO TEXT-FILL PROGRESSIVO ANTECIPADO NO SCROLL
   ---------------------------------------------------- */
function initTextFillScroll() {
  const textContainer = document.getElementById('text-fill-target');
  if (!textContainer) return;

  // Quebrar o texto em palavras individuais envolvidas em spans
  const originalText = textContainer.innerText.trim();
  const words = originalText.split(/\s+/);
  textContainer.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

  const wordElements = textContainer.querySelectorAll('.word');
  const totalWords = wordElements.length;

  function updateTextFill() {
    const rect = textContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Início imediato na entrada inferior (95% da tela)
    // Conclusão total antecipada: 100% das palavras iluminadas assim que o título/seção atinge o centro da visão (55% da tela)
    const startPoint = windowHeight * 0.95;
    const endPoint = windowHeight * 0.55;

    let progress = (startPoint - rect.top) / (startPoint - endPoint);
    progress = Math.max(0, Math.min(1, progress));

    const wordsToHighlight = Math.floor(progress * totalWords);

    wordElements.forEach((wordEl, index) => {
      if (index < wordsToHighlight) {
        wordEl.classList.add('highlighted');
      } else {
        wordEl.classList.remove('highlighted');
      }
    });
  }

  window.addEventListener('scroll', updateTextFill, { passive: true });
  window.addEventListener('resize', updateTextFill, { passive: true });
  updateTextFill();
}

/* ----------------------------------------------------
   3. RASTREAMENTO DE SEÇÕES ATIVAS NO MENU
   ---------------------------------------------------- */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item a, .mobile-nav-link');

  function onScroll() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------------------
   4. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
   ---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('advisor-contact-form');
  const feedback = document.getElementById('form-feedback-message');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.querySelector('#nome').value.trim();
    const email = form.querySelector('#email').value.trim();
    const telefone = form.querySelector('#telefone').value.trim();

    // Validação dos campos obrigatórios
    if (!nome || !email || !telefone) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Por favor, preencha todos os campos obrigatórios (Nome, E-mail e WhatsApp/Telefone).';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Por favor, insira um endereço de e-mail válido.';
      return;
    }

    // Feedback de envio
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando mensagem...';

    setTimeout(() => {
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `<strong>Agradecemos seu contato, ${nome}.</strong><br>Sua mensagem foi enviada ao Sr. Alexandre Monteiro Giglio. Retornaremos em breve com total discrição.`;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Mensagem Enviada com Sucesso';

      setTimeout(() => {
        submitBtn.innerHTML = 'Enviar Mensagem ao Advisor';
      }, 5000);
    }, 800);
  });
}

/* ----------------------------------------------------
   5. ROLAGEM SUAVE REFINADA
   ---------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
