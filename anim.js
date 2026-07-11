/* Unbound site-wide light animations (unbound.school, loaded via Navbar component).
   Scroll-reveal fade-up + subtle card hover lifts. Same pattern as the Oriole wf.js
   scroll-reveal: IntersectionObserver, 60ms stagger per container, respects
   prefers-reduced-motion. Reveal classes are removed after the transition ends so
   hover transitions behave normally afterwards. */
(function () {
  function boot() {
    try {
      if (document.getElementById('ua-anim-css')) return;

      var css = ''
        /* hover: interactive cards lift */
        + '.press-card,.ev-card,.tr-card,.tr-evcard,.pr-rcard,.pr-pcard,.locations_card{transition:transform .25s ease,box-shadow .25s ease}'
        + '.press-card:hover,.ev-card:hover,.tr-card:hover,.tr-evcard:hover,.pr-rcard:hover,.pr-pcard:hover,.locations_card:hover{transform:translateY(-4px);box-shadow:0 14px 28px -16px rgba(15,23,32,.35)}'
        /* hover: press card image zoom (its wrapper is overflow:hidden) */
        + '.press-card-img img{transition:transform .4s ease}'
        + '.press-card:hover .press-card-img img{transform:scale(1.05)}'
        /* scroll-reveal — declared last so it wins the transition while active */
        + '.ua-rv{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease}'
        + '.ua-rv-in{opacity:1;transform:translateY(0)}';

      var st = document.createElement('style');
      st.id = 'ua-anim-css';
      st.appendChild(document.createTextNode(css));
      document.head.appendChild(st);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!('IntersectionObserver' in window)) return;

      var rvSel = [
        /* new home + thankyou (nh-*, ty-*) */
        '.nh-wcard', '.nh-ecard', '.nh-step', '.nh-qcard', '.nh-vcard', '.nh-cmprow', '.nh-trow', '.nh-faqd', '.ty-stepk',
        /* program */
        '.np-scard', '.np-abilcard', '.np-trow',
        /* tour */
        '.tr-card', '.tr-evcard',
        /* guardian resources */
        '.pr-rcard', '.pr-pcard',
        /* press */
        '.press-card', '.ev-card',
        /* about-us / community-partners / admissions / governing board */
        '.staff_item', '.locations_card', '.collection-item-3',
        /* experience pages (guarded below against Webflow interactions) */
        '.faqs_item', '.history_item',
        /* every page gets at least section headings */
        'h2'
      ].join(',');

      var els = Array.prototype.slice.call(document.querySelectorAll(rvSel)).filter(function (el) {
        /* skip nav/footer and sliders */
        if (el.closest('.w-slider,.navbar,.nav_wrapper,.nav_wrap,footer,.footer')) return false;
        /* skip elements Webflow interactions already animate: own trigger id,
           IX2 initial inline styles, or word-by-word text reveals inside */
        if (el.hasAttribute('data-w-id')) return false;
        var st = el.getAttribute('style') || '';
        if (/opacity|transform/.test(st)) return false;
        if (el.querySelector('.is-word')) return false;
        return true;
      });

      var counts = [];
      els.forEach(function (el) {
        var rec = null;
        for (var i = 0; i < counts.length; i++) if (counts[i].p === el.parentNode) { rec = counts[i]; break; }
        if (!rec) { rec = { p: el.parentNode, n: 0 }; counts.push(rec); }
        var d = Math.min(rec.n * 60, 420);
        rec.n++;
        el.setAttribute('data-ua-d', d);
        el.style.transitionDelay = d + 'ms';
        el.classList.add('ua-rv');
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          io.unobserve(el);
          el.classList.add('ua-rv-in');
          /* settle: drop reveal classes + stagger delay so hover transitions run clean */
          var d = parseInt(el.getAttribute('data-ua-d') || '0', 10);
          setTimeout(function () {
            el.classList.remove('ua-rv', 'ua-rv-in');
            el.style.transitionDelay = '';
            el.removeAttribute('data-ua-d');
          }, d + 700);
        });
      }, { rootMargin: '0px 0px -8% 0px' });

      els.forEach(function (el) { io.observe(el); });
    } catch (err) {
      /* never break the page for a decorative effect */
      if (window.console && console.warn) console.warn('ua-anim skipped:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
