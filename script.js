/* ============================================
   ZEESHAN AHMAD — Interactions
   ============================================ */

(function () {
  'use strict';

  // ----- Header scroll state -----
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Tile tap-to-reveal on touch devices -----
  // (tiles are now anchor tags, so the tap behavior is two-stage:
  //  first tap reveals title overlay, second tap navigates)
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (isTouch) {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach((tile) => {
      tile.addEventListener('click', (e) => {
        // First tap: just reveal the overlay, don't navigate yet
        if (!tile.classList.contains('tapped')) {
          e.preventDefault();
          // Clear any other tapped tiles
          document.querySelectorAll('.tile.tapped').forEach((t) => {
            if (t !== tile) t.classList.remove('tapped');
          });
          tile.classList.add('tapped');
        }
        // Second tap: let the link's default behavior take over (navigate)
      });
    });

    // Tap outside any tile = clear all tapped states
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.tile')) {
        document.querySelectorAll('.tile.tapped').forEach((t) => t.classList.remove('tapped'));
      }
    });
  }

  // ----- Image Protection (Disable Right-Click) -----
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  });

})();
