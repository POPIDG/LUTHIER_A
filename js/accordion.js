/**
 * accordion.js
 * Accordion(s) — one panel open at a time, per accordion instance.
 * Supports multiple independent accordions on the same page (Maderas,
 * Cronograma, FAQ, etc.) — each tracks its own open item and never
 * touches the others.
 *
 * Two flavors, recognized by their container class:
 *  - .accordion (.wood-item/.wood-header/.wood-panel) — the wood/course
 *    "ficha" pattern (also gets the horizontal layout at desktop widths).
 *    Always keeps exactly one item open; clicking the open one is a no-op.
 *  - .faq-accordion (.faq-item/.faq-header/.faq-panel) — plain vertical
 *    FAQ pattern, fully independent styling. Classic toggle: clicking the
 *    open item closes it, and it's fine for all items to be closed.
 *
 * Uses the HTML `hidden` attribute for panel visibility.
 */

(function () {
  'use strict';

  function initAccordion(accordion) {
    var forceOneOpen = accordion.classList.contains('accordion');
    var items = accordion.querySelectorAll('.wood-item, .faq-item');

    items.forEach(function (item) {
      var btn   = item.querySelector('.wood-header, .faq-header');
      var panel = item.querySelector('.wood-panel, .faq-panel');

      if (!btn || !panel) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        if (isOpen) {
          /* Wood-style accordions always keep one item open */
          if (forceOneOpen) return;

          item.classList.remove('is-open');
          panel.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
          return;
        }

        /* Close all items within this accordion only */
        items.forEach(function (other) {
          var otherPanel = other.querySelector('.wood-panel, .faq-panel');
          var otherBtn   = other.querySelector('.wood-header, .faq-header');
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

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.accordion, .faq-accordion').forEach(initAccordion);
  });

}());
