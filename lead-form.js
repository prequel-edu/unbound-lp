/* Unbound Academy — lead form → HubSpot Forms API (hosted copy of the site inline script,
   for pages built headlessly where Page Custom Code can't be set: /home-new, /program-new).
   Same portal + form GUID as unbound.school / and /program. Keep mapGrade in sync with the
   grade_eligibility <select> options. */
(function () {
  'use strict';

  var HS_PORTAL = '49211848';
  var HS_FORM   = '698e8003-4afe-4898-9565-910d2d2554b1';
  var UTM_KEYS  = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];

  // Save UTMs from URL into localStorage
  (function () {
    var p = new URLSearchParams(location.search);
    UTM_KEYS.forEach(function (k) {
      if (p.get(k)) localStorage.setItem('wf_' + k, p.get(k));
    });
  })();

  // Fill UTM hidden inputs on page load and when DOM changes
  function fillUTMFields() {
    UTM_KEYS.forEach(function (k) {
      var stored = localStorage.getItem('wf_' + k);
      if (!stored) return;
      var sel = ['input[name="'+k+'"]','input[name="'+k.toLowerCase()+'"]'].join(',');
      document.querySelectorAll(sel).forEach(function (field) {
        if (!field.value) {
          field.value = stored;
          field.dispatchEvent(new Event('input',  { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
  }

  function boot() {
    fillUTMFields();
    new MutationObserver(fillUTMFields).observe(document.body, { subtree: true, childList: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function mapGrade(raw) {
    if (!raw) return 'eligible';
    if (raw === 'eligible') return 'eligible';
    if (raw.indexOf('Grade 4 to Grade 8') !== -1) return 'eligible';
    if (raw.indexOf('Grade 3 or under')   !== -1) return 'younger';
    if (raw.indexOf('Grade 9 or above')   !== -1) return 'older';
    return 'eligible';
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    var phoneField = form.querySelector('[name="Phone Number"]') ||
                     form.querySelector('[name="Phone-Number"]');
    if (!phoneField) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    var submitBtn = form.querySelector('[type="submit"]') || form.querySelector('input[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (v, k) { data[k] = v; });

    var email = data['Email Address'] || data['Email-Address'] || '';
    var fname = data['First Name']    || data['First-Name']    || '';
    var lname = data['Last Name']     || data['Last-Name']     || '';
    var phone = data['Phone Number']  || data['Phone-Number']  || '';
    var zip   = data['Zip Code']      || data['Zip-Code']      || '';
    var grade = mapGrade(data['grade_eligibility'] || '');

    // State: full name from dropdown (e.g. "Arizona") — portal stores full names
    var stateEl   = form.querySelector('select[name="state_code"]') ||
                    form.querySelector('select[name="hs_state_code"]');
    var stateName = stateEl ? stateEl.value : '';
    var isAZ      = stateName.toLowerCase() === 'arizona';

    var redirectBase = (isAZ && grade === 'eligible')
      ? 'https://unbound.school/thankyou'
      : 'https://unbound.school/en-thankyou';

    var fields = [
      { name: 'email',              value: email      },
      { name: 'firstname',          value: fname      },
      { name: 'lastname',           value: lname      },
      { name: 'phone',              value: phone      },
      { name: 'zip',                value: zip        },
      { name: 'hs_state_code',      value: stateName  },
      { name: 'grade_eligibility',  value: grade      },
      { name: 'lead_source_detail', value: 'webflow'  },
      { name: 'contact_type',       value: 'Parent'   },
      { name: 'page',               value: document.title    },
      { name: 'path',               value: location.pathname },
    ].filter(function (f) { return f.value !== ''; });

    var qp = new URLSearchParams();
    UTM_KEYS.forEach(function (k) {
      var v = localStorage.getItem('wf_' + k) || data[k];
      if (v) {
        fields.push({ name: k, value: v });
        qp.append(k, v);
      }
    });
    if (stateName) qp.append('state_code', stateName);
    qp.append('grade_eligibility', grade);

    var finalUrl = redirectBase + (qp.toString() ? '?' + qp.toString() : '');

    fetch(
      'https://api.hsforms.com/submissions/v3/integration/submit/' + HS_PORTAL + '/' + HS_FORM,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields:  fields,
          context: { pageUri: location.href, pageName: document.title }
        })
      }
    ).then(function (res) {
      if (!res.ok) throw new Error('HubSpot ' + res.status);
      window.location.href = finalUrl;
    }).catch(function (err) {
      console.error('[Unbound form]', err);
      var wrapper = form.closest ? form.closest('.w-form') : form.parentElement;
      var fail = (wrapper && wrapper.querySelector('.w-form-fail')) ||
                 (form.parentElement && form.parentElement.querySelector('.lf-fail'));
      if (fail) fail.style.display = 'block';
      if (submitBtn) submitBtn.disabled = false;
    });

  }, { capture: true });

})();
