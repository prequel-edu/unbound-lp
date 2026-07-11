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
        /* CTA buttons: hover lift + press feedback (translate/scale so existing
           transition/transform declarations are untouched) */
        + '.ua-cta:hover{translate:0 -2px;scale:1.03;box-shadow:0 8px 20px -10px rgba(15,23,32,.45)}'
        + '.ua-cta:active{translate:0 0;scale:.96}'
        /* periodic sheen sweep on primary conversion buttons */
        + '@keyframes ua-sheen{0%{transform:translateX(-150%) skewX(-18deg)}14%{transform:translateX(400%) skewX(-18deg)}100%{transform:translateX(400%) skewX(-18deg)}}'
        + '.ua-sheen{overflow:hidden}'
        + '.ua-sheen::after{content:"";position:absolute;top:0;bottom:0;left:0;width:40%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.5),rgba(255,255,255,0));transform:translateX(-150%) skewX(-18deg);animation:ua-sheen 6s ease-in-out infinite;animation-delay:var(--ua-sh-d,2s);pointer-events:none}'
        /* floating decor circles */
        + '@keyframes ua-float-a{from{transform:translate(0,0)}to{transform:translate(7px,-12px)}}'
        + '@keyframes ua-float-b{from{transform:translate(0,0)}to{transform:translate(-9px,10px)}}'
        + '@keyframes ua-float-c{from{transform:translate(0,0)}to{transform:translate(10px,6px)}}'
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
        '.faqs_item', '.history_item'
      ].join(',');

      function eligible(el) {
        /* skip nav/footer and sliders */
        if (el.closest('.w-slider,.navbar,.nav_wrapper,.nav_wrap,footer,.footer')) return false;
        /* skip elements Webflow interactions already animate: own trigger id,
           IX2 initial inline styles, or word-by-word text reveals inside */
        if (el.hasAttribute('data-w-id')) return false;
        var st = el.getAttribute('style') || '';
        if (/opacity|transform/.test(st)) return false;
        if (el.querySelector('.is-word')) return false;
        return true;
      }

      /* pass 1: cards; pass 2: section headings on every page,
         skipping headings already inside a revealed card */
      var els = Array.prototype.slice.call(document.querySelectorAll(rvSel)).filter(eligible);
      var inCards = els.slice();
      Array.prototype.slice.call(document.querySelectorAll('h2,h3')).forEach(function (h) {
        if (!eligible(h)) return;
        for (var i = 0; i < inCards.length; i++) if (inCards[i].contains(h)) return;
        els.push(h);
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

      /* ---- highlight/underline roll-out ----
         Site highlights are spans with `box-shadow: inset 0 -.42em <color>`.
         Swap each for a bottom gradient of the same color/height and grow
         background-size 0% -> 100% when the span scrolls into view. */
      var hlSel = '.nh-hl,.nh-hlb,.nh-hlp,.hf-hl,.np-hl,.pf-hl,.tr-hl,.gr-hl,.hl-lime,.text-highlight';
      var hls = Array.prototype.slice.call(document.querySelectorAll(hlSel)).filter(function (el) {
        if (el.closest('.w-slider,.navbar,.nav_wrapper,.nav_wrap,footer,.footer')) return false;
        if (el.hasAttribute('data-w-id') || el.querySelector('.is-word') || el.closest('.is-word')) return false;
        return true;
      });
      hls.forEach(function (el) {
        var cs = getComputedStyle(el);
        var sh = cs.boxShadow || '';
        var color = (sh.match(/rgba?\([^)]+\)/) || [null])[0];
        var nums = sh.replace(/rgba?\([^)]+\)/g, '').match(/-?[\d.]+/g) || [];
        var h = Math.abs(parseFloat(nums[1] || 0));
        if (!color || sh.indexOf('inset') === -1 || h < 2) return; /* not a band highlight — leave alone */
        el.style.boxShadow = 'none';
        el.style.backgroundImage = 'linear-gradient(' + color + ',' + color + ')';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = '0 100%';
        el.style.backgroundSize = '0% ' + h + 'px';
        el.style.webkitBoxDecorationBreak = 'clone';
        el.style.boxDecorationBreak = 'clone';
        el.style.transition = 'background-size .7s cubic-bezier(.4,0,.2,1) .35s';
        el.setAttribute('data-ua-hlh', h);
      });
      var ioHl = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          ioHl.unobserve(e.target);
          e.target.style.backgroundSize = '100% ' + e.target.getAttribute('data-ua-hlh') + 'px';
        });
      }, { rootMargin: '0px 0px -12% 0px' });
      hls.forEach(function (el) { if (el.getAttribute('data-ua-hlh')) ioHl.observe(el); });

      /* ---- floating decor circles ----
         Slow drift on the absolutely-positioned decorative circles.
         Strict runtime checks so only true decor is touched. */
      var circSel = '[class*="-circ"],.hm-c1,.hm-c2,.hm-c3,.hm-s1,.hm-s2,.hm-k1,.hm-k2,'
        + '.pg-c1,.pg-c2,.pg-c3,.ad-c1,.ad-c2,.ad-c3,.ct-c1,.ct-c2,.ab-c1,.ab-c2,.ab-c3,'
        + '.ab2-c1,.ab2-c2,.ab2-c3,.ps-c1,.ps-c2,.gr-c1,.gr-c2,.gr-c3';
      var names = ['ua-float-a', 'ua-float-b', 'ua-float-c'];
      Array.prototype.slice.call(document.querySelectorAll(circSel)).forEach(function (el, i) {
        if (el.children.length || el.hasAttribute('data-w-id')) return;
        var cs = getComputedStyle(el);
        if (cs.position !== 'absolute' || cs.borderRadius.indexOf('50%') === -1 || cs.transform !== 'none') return;
        el.style.animation = names[i % 3] + ' ' + (7 + (i % 5) * 1.4).toFixed(1) + 's ease-in-out ' + (-(i * 1.7)).toFixed(1) + 's infinite alternate';
      });

      /* ---- CTA buttons: lift on hover, sheen on primary conversion CTAs ---- */
      var ctaSel = '.nav_cta-enroll,.nav_cta-info,.nh-pill-lime,.nh-pill-lime-sm,.nh-pill-outline,.nh-pill-white,'
        + '.np-pill-lime,.tr-btn-lime,.tr-btn-outline,.pr-btnp,.pr-btns,.press-events-cta,.button,.hf-btn,.hf-submit';
      var sheenSel = '.nav_cta-enroll,.nh-pill-lime,.nh-pill-lime-sm,.np-pill-lime,.tr-btn-lime,.pr-btnp';
      var sheenCount = 0;
      Array.prototype.slice.call(document.querySelectorAll(ctaSel)).forEach(function (el) {
        el.classList.add('ua-cta');
        /* append to any existing transition so color/bg hovers keep working */
        var cur = getComputedStyle(el).transition;
        el.style.transition = (cur && cur.indexOf('all 0s') !== 0 ? cur + ',' : '') + 'translate .2s ease,scale .2s ease,box-shadow .25s ease';
        var isPrimary = el.matches(sheenSel)
          || (el.classList.contains('button') && /enroll|apply/i.test(el.textContent || el.value || ''));
        /* ::after doesn't render on <input>, so sheen only on real elements */
        if (isPrimary && el.tagName !== 'INPUT') {
          if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
          el.classList.add('ua-sheen');
          el.style.setProperty('--ua-sh-d', (2 + (sheenCount % 4) * 1.6).toFixed(1) + 's');
          sheenCount++;
        }
      });
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
