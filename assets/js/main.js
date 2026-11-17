/**
 * LimoConnect — Header Navigation & Interactive Controls
 */
(function () {
  'use strict';

  const dropdown = document.querySelector('.nav-dropdown');
  const dropdownTrigger = document.querySelector('.nav-dropdown__trigger');

  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileAccordion = document.querySelector('.mobile-nav__accordion');
  const mobileSubmenu = document.getElementById('mobile-services-submenu');

  function setDropdownState(isOpen) {
    if (!dropdown || !dropdownTrigger) return;
    dropdown.classList.toggle('is-open', isOpen);
    dropdownTrigger.setAttribute('aria-expanded', String(isOpen));
  }

  function setMobileNavState(isOpen) {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
    mobileNav.hidden = !isOpen;
  }

  // Desktop Services dropdown
  if (dropdown && dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = dropdownTrigger.getAttribute('aria-expanded') === 'true';
      setDropdownState(!isOpen);
    });

    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) {
        setDropdownState(false);
      }
    });
  }

  // Mobile navigation toggle
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setMobileNavState(!isOpen);
    });
  }

  // Mobile Services accordion
  if (mobileAccordion && mobileSubmenu) {
    mobileAccordion.addEventListener('click', () => {
      const isOpen = mobileAccordion.getAttribute('aria-expanded') === 'true';
      mobileAccordion.setAttribute('aria-expanded', String(!isOpen));
      mobileSubmenu.hidden = isOpen;
    });
  }

  // Close menus on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setDropdownState(false);
    setMobileNavState(false);
  });

  // Sticky header with glassmorphism & Back to top button visibility on scroll
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY;
    if (siteHeader) {
      siteHeader.classList.toggle('is-scrolled', scrollY > 20);
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('is-visible', scrollY > 360);
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Scroll reveal observer
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // Reset mobile drawer when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      setMobileNavState(false);
    }
  });

  // Smooth scroll for all internal anchor links with sticky header offset
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    event.preventDefault();

    // Close mobile nav or dropdown if open
    setDropdownState(false);
    setMobileNavState(false);

    const headerHeight = siteHeader ? siteHeader.offsetHeight : 80;
    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });

    if (history.pushState) {
      history.pushState(null, '', href);
    }
  });

  // =========================================================================
  // Reusable Horizontal Carousel Controller
  // =========================================================================
  function initHorizontalCarousel({
    trackId,
    prevId,
    nextId,
    progressFillId,
    counterCurrentId,
    counterTotalId,
    cardSelector,
  }) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const progressFill = document.getElementById(progressFillId);
    const counterCurrent = document.getElementById(counterCurrentId);
    const counterTotal = document.getElementById(counterTotalId);

    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.querySelectorAll(cardSelector));
    const totalCards = cards.length;
    if (!totalCards) return;

    if (counterTotal) {
      counterTotal.textContent = String(totalCards).padStart(2, '0');
    }

    function getStepSize() {
      if (cards.length < 2) return 360;
      const cardRect = cards[0].getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24');
      return cardRect.width + gap;
    }

    function updateCarouselUI() {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const scrollLeft = track.scrollLeft;

      prevBtn.disabled = scrollLeft <= 2;
      nextBtn.disabled = scrollLeft >= maxScroll - 2;

      const step = getStepSize();
      let activeIndex = Math.round(scrollLeft / step) + 1;
      if (scrollLeft >= maxScroll - 4) {
        activeIndex = totalCards;
      }
      activeIndex = Math.max(1, Math.min(totalCards, activeIndex));

      if (counterCurrent) {
        counterCurrent.textContent = String(activeIndex).padStart(2, '0');
      }

      if (progressFill) {
        const minPercent = (1 / totalCards) * 100;
        const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const fillPercent = minPercent + scrollRatio * (100 - minPercent);
        progressFill.style.width = `${Math.min(100, Math.max(minPercent, fillPercent))}%`;
      }
    }

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getStepSize(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getStepSize(), behavior: 'smooth' });
    });

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        track.scrollBy({ left: getStepSize(), behavior: 'smooth' });
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        track.scrollBy({ left: -getStepSize(), behavior: 'smooth' });
      }
    });

    let rafId = null;
    track.addEventListener(
      'scroll',
      () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          updateCarouselUI();
          rafId = null;
        });
      },
      { passive: true }
    );

    window.addEventListener('resize', updateCarouselUI);
    updateCarouselUI();
  }

  initHorizontalCarousel({
    trackId: 'services-track',
    prevId: 'services-prev',
    nextId: 'services-next',
    progressFillId: 'services-progress-fill',
    counterCurrentId: 'services-counter-current',
    counterTotalId: 'services-counter-total',
    cardSelector: '.service-card',
  });

  initHorizontalCarousel({
    trackId: 'testimonials-track',
    prevId: 'testimonials-prev',
    nextId: 'testimonials-next',
    progressFillId: 'testimonials-progress-fill',
    counterCurrentId: 'testimonials-counter-current',
    counterTotalId: 'testimonials-counter-total',
    cardSelector: '.testimonial-card',
  });

  // =========================================================================
  // FAQ Accordion
  // =========================================================================
  const faqAccordion = document.getElementById('faq-accordion');
  if (faqAccordion) {
    const items = Array.from(faqAccordion.querySelectorAll('.faq-item'));

    items.forEach((item) => {
      const trigger = item.querySelector('.faq-item__trigger');
      const panel = item.querySelector('.faq-item__panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all items
        items.forEach((other) => {
          const otherTrigger = other.querySelector('.faq-item__trigger');
          other.classList.remove('is-open');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
})();
