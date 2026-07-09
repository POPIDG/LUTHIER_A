/**
 * accordion.js
 * Woods accordion — only one panel open at a time.
 * Uses the HTML `hidden` attribute for panel visibility.
 */

(function () {
  'use strict';

  function initAccordion() {
    var accordion = document.getElementById('woods-accordion');
    if (!accordion) return;

    var items = accordion.querySelectorAll('.wood-item');

    items.forEach(function (item) {
      var btn   = item.querySelector('.wood-header');
      var panel = item.querySelector('.wood-panel');

      if (!btn || !panel) return;

      btn.addEventListener('click', function () {
        /* One item must always stay open — clicking the open item does nothing */
        if (item.classList.contains('is-open')) return;

        /* Close all items */
        items.forEach(function (other) {
          var otherPanel = other.querySelector('.wood-panel');
          var otherBtn   = other.querySelector('.wood-header');
          other.classList.remove('is-open');
          if (otherPanel) otherPanel.hidden = true;
          if (otherBtn)   otherBtn.setAttribute('aria-expanded', 'false');
        });

        /* Open the clicked item */
        item.classList.add('is-open');
        panel.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAccordion);

}());
