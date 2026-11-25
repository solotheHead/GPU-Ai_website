/* NodeX progressive interface enhancements. All content works without animation. */
(function () {
  'use strict';
  function ready() {
    var header = document.querySelector('[data-nx-header]');
    if (header) {
      var button = header.querySelector('.nx-menu-toggle');
      var nav = header.querySelector('.nx-nav');
      if (button && nav) {
        header.classList.add('nx-menu-ready');
        function close(focus) { header.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); if (focus) button.focus(); }
        button.addEventListener('click', function () { var open = button.getAttribute('aria-expanded') !== 'true'; header.classList.toggle('is-open', open); button.setAttribute('aria-expanded', String(open)); });
        nav.addEventListener('click', function (event) { if (event.target.closest('a')) close(false); });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && header.classList.contains('is-open')) close(true); });
        document.addEventListener('click', function (event) { if (!header.contains(event.target)) close(false); });
        header.addEventListener('focusout', function (event) { if (event.relatedTarget && !header.contains(event.relatedTarget)) close(false); });
        nav.querySelectorAll('a').forEach(function (link) { if (new URL(link.href).pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '')) link.setAttribute('aria-current', 'page'); });
      }
    }
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!reduced.matches && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.remove('nx-reveal-pending'); entry.target.classList.add('nx-revealed'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
      document.querySelectorAll('[data-nx-reveal]').forEach(function (element) { if (element.getBoundingClientRect().top > window.innerHeight) { element.classList.add('nx-reveal-pending'); observer.observe(element); } });
      reduced.addEventListener('change', function () { if (reduced.matches) { observer.disconnect(); document.querySelectorAll('.nx-reveal-pending').forEach(function (element) { element.classList.remove('nx-reveal-pending'); }); } });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
}());
