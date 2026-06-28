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
        var isOpen = item.classList.contains('is-open');

        /* Close all items */
        items.forEach(function (other) {
          var otherPanel = other.querySelector('.wood-panel');
          var otherBtn   = other.querySelector('.wood-header');
          other.classList.remove('is-open');
          if (otherPanel) otherPanel.hidden = true;
          if (otherBtn)   otherBtn.setAttribute('aria-expanded', 'false');
        });

        /* If this item was closed, open it */
        if (!isOpen) {
          item.classList.add('is-open');
          panel.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAccordion);

}());
