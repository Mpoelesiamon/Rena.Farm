/*
 * Rena Farm — public form spam guard
 *
 * Two cheap, dependency-free checks that between them stop the large
 * majority of automated form spam, with nothing for a real visitor to do:
 *
 *   1. Honeypot — a field that is off-screen and hidden from assistive
 *      technology. A human never sees it, so it must stay empty. Bots that
 *      fill every input they find give themselves away.
 *   2. Time-to-submit — a form completed in under a few seconds was not
 *      typed by a person.
 *
 * When a submission trips either check we return a *fake success*. Telling a
 * bot why it failed just teaches whoever wrote it how to get past next time.
 *
 * Usage:
 *   <form id="x" data-guard> ... </form>
 *   and in the submit handler, before doing any work:
 *     if (window.RenaFormGuard.isBot(form)) { ...show success, send nothing... }
 */
(function () {
  'use strict';

  var HONEYPOT   = 'rf_website';  // plausible-sounding name so bots take the bait
  var MIN_SECONDS = 3;            // below this, nobody read the form

  function attach(form) {
    if (!form || form.dataset.rfGuarded) return;
    form.dataset.rfGuarded = '1';

    var wrap = document.createElement('div');
    wrap.className = 'rf-hp';
    wrap.setAttribute('aria-hidden', 'true');

    var label = document.createElement('label');
    label.setAttribute('for', HONEYPOT);
    label.textContent = 'Website';           // never rendered to a sighted user

    var input = document.createElement('input');
    input.type = 'text';
    input.id = HONEYPOT;
    input.name = HONEYPOT;
    input.tabIndex = -1;                      // unreachable by keyboard
    input.autocomplete = 'off';

    wrap.appendChild(label);
    wrap.appendChild(input);
    form.appendChild(wrap);

    form.dataset.rfRenderedAt = String(Date.now());
  }

  /* Returns a reason string when the submission looks automated, else null. */
  function isBot(form) {
    if (!form) return null;
    var hp = form.querySelector('[name="' + HONEYPOT + '"]');
    if (hp && hp.value.trim() !== '') return 'honeypot';

    var t = Number(form.dataset.rfRenderedAt || 0);
    if (t && (Date.now() - t) < MIN_SECONDS * 1000) return 'too-fast';

    return null;
  }

  window.RenaFormGuard = { attach: attach, isBot: isBot };

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form[data-guard]');
    for (var i = 0; i < forms.length; i++) attach(forms[i]);
  });
})();
