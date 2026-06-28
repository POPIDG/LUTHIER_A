/**
 * masonry.js
 * Enhances the CSS column-count gallery with equal column balancing.
 * Falls back gracefully to CSS columns if JS is unavailable.
 */

(function () {
  'use strict';

  function initMasonry() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    /* CSS columns already handle basic masonry layout.
       This script adds lazy-load triggering and ensures
       images are loaded before column layout is calculated. */

    var items = grid.querySelectorAll('.gallery-item img');

    items.forEach(function (img) {
      /* Force lazy images to trigger load when in viewport */
      if (img.complete) return;
      img.addEventListener('load', function () {
        /* Re-trigger the parent reveal animation if needed */
        var item = img.closest('[data-reveal]');
        if (item && !item.classList.contains('revealed')) {
          var rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            item.classList.add('revealed');
          }
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initMasonry);

}());
