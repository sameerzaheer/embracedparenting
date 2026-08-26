document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observerInstance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('in'));
  }

  const instagramEmbeds = document.querySelectorAll('blockquote.instagram-media');
  if (instagramEmbeds.length) {
    const scriptSrc = 'https://www.instagram.com/embed.js';
    const processEmbeds = () => {
      if (window.instgrm?.Embeds?.process) {
        try {
          window.instgrm.Embeds.process();
        } catch (error) {
          console.warn('Instagram embed process failed', error);
        }
      }
    };

    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', processEmbeds, { once: true });
      processEmbeds();
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.src = scriptSrc;
      script.onload = processEmbeds;
      document.body.appendChild(script);
      window.setTimeout(processEmbeds, 3000);
    }
  }

  // Contact form handling removed - no form exists in HTML
});
