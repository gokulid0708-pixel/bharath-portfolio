/**
 * ==========================================================================
 * BHARATHKUMAR M - PERSONAL DEVELOPER PORTFOLIO
 * Modular Vanilla JavaScript (Zero External Dependencies)
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Light / Dark with localStorage)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'bharath_theme_preference';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to Light Craft Board');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Craft Board');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to Dark Cacao Roast');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Cacao Roast');
      }
    }
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      showToast(newTheme === 'dark' ? 'Switched to Dark Cacao Roast' : 'Switched to Warm Craft Board', '🎨');
    });
  }

  // --------------------------------------------------------------------------
  // 2. LIVE SCROLL READING PROGRESS & HEADER SHADOW
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScrollEvents() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress calculation
    if (scrollProgressBar && scrollHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      scrollProgressBar.style.width = `${progressPercent}%`;
    }

    // Header scrolled class
    if (siteHeader) {
      if (scrollTop > 24) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollTop > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScrollEvents, { passive: true });
  handleScrollEvents(); // run once on load

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close when clicking any nav link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // --------------------------------------------------------------------------
  // 5. ACTIVE NAV LINK TRACKER (ScrollSpy)
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Special case for very top
    if (scrollY < 100 && navLinks.length > 0) {
      navLinks.forEach(link => link.classList.remove('active'));
      const homeLink = document.querySelector('.nav-menu a[href="#hero"]');
      if (homeLink) homeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 6. FILTERABLE PROJECTS GRID
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update active filter button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter project cards with subtle transition
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  let toastTimeout = null;

  function showToast(message, icon = '✓') {
    if (!toastNotice) return;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    if (toastMessage) toastMessage.textContent = message;
    if (toastIcon) toastIcon.textContent = icon;

    toastNotice.classList.add('show');

    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 8. ONE-CLICK COPY TO CLIPBOARD BUTTONS
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const originalText = button.querySelector('span') ? button.querySelector('span').textContent : 'Copy';
        if (button.querySelector('span')) {
          button.querySelector('span').textContent = 'Copied!';
        }
        showToast(`Copied "${textToCopy}" to clipboard!`, '📋');

        setTimeout(() => {
          if (button.querySelector('span')) {
            button.querySelector('span').textContent = originalText;
          }
        }, 2200);
      } catch (err) {
        showToast(`Selected: ${textToCopy}`, 'ℹ️');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. INTERACTIVE CONTACT FORM DISPATCH & MAILTO GENERATOR
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!name || !email || !subject || !message) {
        displayFormStatus('Please complete all required fields before dispatching.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        displayFormStatus('Please provide a valid email address.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      // Format email body
      const emailBody = `Hello Bharathkumar,\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage Details:\n${message}\n\n---\nSent via portfolio contact dispatch.`;
      
      const mailtoUrl = `mailto:bharathm123123@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject}`)}&body=${encodeURIComponent(emailBody)}`;

      // Attempt to copy drafted message to user's clipboard for maximum convenience
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailBody).catch(() => {});
      }

      // Display feedback
      displayFormStatus('Opening your email client with your message drafted. Message text has also been copied to your clipboard!', 'success');
      showToast('Opening default mail client...', '✉️');

      // Trigger mailto link
      window.location.href = mailtoUrl;

      // Reset form after short delay
      setTimeout(() => {
        contactForm.reset();
      }, 3500);
    });
  }

  function displayFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';

    if (type === 'error') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    }
  }

  // --------------------------------------------------------------------------
  // 10. DYNAMIC YEAR
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  console.log('Portfolio of Bharathkumar M loaded successfully. Zero dependencies, pure tactile craft.');
})();
