(function () {
  'use strict';

  /* ---------- Шапка при скролле ---------- */

  const header = document.querySelector('[data-header]');
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Полноэкранное меню ---------- */

  const menu = document.querySelector('[data-menu]');
  const openButton = document.querySelector('[data-menu-open]');
  const closeButton = document.querySelector('[data-menu-close]');
  const menuLinks = document.querySelectorAll('[data-menu-link]');
  let previousFocus = null;

  const focusableInMenu = () =>
    Array.from(
      menu.querySelectorAll('a[href], button:not([disabled])')
    ).filter((element) => element.offsetParent !== null);

  const openMenu = () => {
    if (!menu || !openButton) return;

    previousFocus = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    openButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    window.setTimeout(() => {
      if (closeButton) closeButton.focus();
    }, 80);
  };

  const closeMenu = (restoreFocus = true) => {
    if (!menu || !openButton) return;

    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    openButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');

    if (restoreFocus) {
      const target = previousFocus && document.contains(previousFocus)
        ? previousFocus
        : openButton;
      window.setTimeout(() => target.focus(), 80);
    }
  };

  if (openButton) openButton.addEventListener('click', openMenu);
  if (closeButton) closeButton.addEventListener('click', () => closeMenu());

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (!menu || !menu.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = focusableInMenu();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ---------- Вопросы: открыт только один ---------- */

  document.querySelectorAll('.faq__item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;

      document.querySelectorAll('.faq__item[open]').forEach((other) => {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });

  /* ---------- Мягкое появление секций ---------- */

  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
