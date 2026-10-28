/**
 * Runs in <head> before the first paint and marks phones with data-device="phone" on <html>, so the home
 * page can show the phone app instead of the web player at the same address (see app/page.tsx).
 *
 * A phone is a touch screen narrower than 600 CSS px. "Desktop site" mode makes this hard to see: the
 * browser lays the page out ~980px wide, ignores the viewport meta tag, and zooms out to fit. So the
 * real width is taken from several sources and the smallest wins: the screen size, and the visible
 * width multiplied by the zoom (980px shown at 0.42x is a 412px phone). If the zoom isn't known yet
 * when this runs, it checks again once the page has loaded and fires "lowband:device".
 *
 * In "Desktop site" mode the page is also zoomed back to the phone's real width; native.css divides the
 * phone app's full-screen height by the same --lb-zoom so it still fits the screen.
 */
export const phoneScript = `(function () {
  function phoneWidth() {
    var touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    if (!touch) return 0;
    var vv = window.visualViewport;
    var visible = vv ? vv.width * vv.scale : innerWidth;
    var shortSide = Math.min(screen.width || Infinity, screen.height || Infinity, visible);
    return shortSide < 600 ? Math.min(screen.width || Infinity, visible) : 0;
  }
  function apply() {
    var width = phoneWidth();
    if (!width) return false;
    var root = document.documentElement;
    root.dataset.device = 'phone';
    var zoom = innerWidth / width;
    if (zoom > 1.2) {
      root.style.zoom = String(zoom);
      root.style.setProperty('--lb-zoom', String(zoom));
    }
    dispatchEvent(new Event('lowband:device'));
    return true;
  }
  try {
    if (!apply()) addEventListener('load', function () { try { apply(); } catch (e) {} }, { once: true });
  } catch (e) {}
})();`;
