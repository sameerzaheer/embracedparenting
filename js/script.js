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

  const contactForm = document.querySelector('form.contact-form');
  if (contactForm) {
    const statusMessage = document.createElement('p');
    statusMessage.className = 'form-status';
    contactForm.prepend(statusMessage);

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      statusMessage.className = 'form-status';
      statusMessage.textContent = 'Sending…';

      const formData = new FormData(contactForm);
      const body = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        company: formData.get('company') || '',
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Unable to send');
        }

        statusMessage.textContent = 'Message sent successfully. Thank you!';
        statusMessage.classList.add('success');
        contactForm.reset();
      } catch (error) {
        statusMessage.textContent = 'Sorry, something went wrong. Please try again later.';
        statusMessage.classList.add('error');
        console.error(error);
      }
    });
  }
});
