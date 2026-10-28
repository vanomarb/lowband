/**
 * Runs in <head> before the first paint, so there's no flash of the wrong layout.
 *
 * A phone is a touch screen whose short side is under 600 CSS px. That holds even when the browser's
 * "Desktop site" mode is on, which fakes a ~980px-wide layout and ignores the viewport meta tag.
 *
 * - On a phone, the web player sends you to the phone app, unless the URL asks for the web player (?web).
 * - On the phone app in "Desktop site" mode, the page is zoomed back to the phone's real width.
 *   native.css divides the app's full-screen height by the same --lb-zoom so it still fits the screen.
 */
export const phoneScript = `(function () {
  try {
    var touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    var phone = touch && Math.min(screen.width, screen.height) < 600;
    if (!phone) return;
    var path = location.pathname;
    if (!/\\/app\\/?$/.test(path)) {
      if (!/[?&]web\\b/.test(location.search)) location.replace(path.replace(/\\/?$/, '/') + 'app/' + location.hash);
      return;
    }
    var zoom = innerWidth / screen.width;
    if (zoom > 1.2) {
      var root = document.documentElement;
      root.style.zoom = String(zoom);
      root.style.setProperty('--lb-zoom', String(zoom));
    }
  } catch (e) {}
})();`;
