/* ============================================================
   Parallax עכבר — סקשן "מתחילים מאפס"
   שני הקבועים לכוונון:
   ============================================================ */

const STRENGTH = 18;   // פיקסלים של תזוזה עבור עומק 1 (הגדל = תנועה חזקה יותר)
const SMOOTH   = 0.08; // קבוע ההחלקה של ה-lerp (0.02 = איטי ונוזלי, 0.3 = צמוד לעכבר)

/* גבולות הסקשן בקואורדינטות הקנבס (בין שני פסי הרקע) */
const SECTION_TOP = 3530;
const SECTION_BOTTOM = 4630;
const CANVAS_W = 1728;

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('canvas');
  const items = [...document.querySelectorAll('.pxi')];
  if (!canvas || !items.length) return;

  const layers = items.map(el => ({
    el,
    depth: parseFloat(el.dataset.depth) || 1,
    base: (el.style.transform || '').trim(), // משמר transform קיים (scaleX(-1))
    x: 0, y: 0
  }));

  layers.forEach(l => { l.el.style.willChange = 'transform'; });

  let targetX = 0, targetY = 0, running = false, enabled = true;

  /* המרת קואורדינטות עכבר למרחב הקנבס — הקנבס מוזז ומוקטן ב-JS */
  function toCanvas(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    const k = r.width / CANVAS_W;
    return { x: (clientX - r.left) / k, y: (clientY - r.top) / k };
  }

  function onMove(e) {
    if (!enabled) return;
    const p = toCanvas(e.clientX, e.clientY);
    if (p.y < SECTION_TOP || p.y > SECTION_BOTTOM || p.x < 0 || p.x > CANVAS_W) {
      targetX = targetY = 0;
      return;
    }
    targetX = (p.x - CANVAS_W / 2) / (CANVAS_W / 2);
    targetY = (p.y - (SECTION_TOP + SECTION_BOTTOM) / 2) / ((SECTION_BOTTOM - SECTION_TOP) / 2);
    start();
  }

  function recenter() { targetX = targetY = 0; start(); }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(loop);
  }

  function loop() {
    let moving = false;
    for (const l of layers) {
      const tx = targetX * STRENGTH * l.depth;
      const ty = targetY * STRENGTH * l.depth;
      l.x += (tx - l.x) * SMOOTH;
      l.y += (ty - l.y) * SMOOTH;
      if (Math.abs(tx - l.x) > 0.02 || Math.abs(ty - l.y) > 0.02) moving = true;
      else { l.x = tx; l.y = ty; }
      l.el.style.transform = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0) ${l.base}`;
    }
    if (moving) requestAnimationFrame(loop);
    else running = false;
  }

  function reset() {
    for (const l of layers) {
      l.x = l.y = 0;
      l.el.style.transform = l.base;
    }
  }

  /* מתחת ל-768px האפקט כבוי לגמרי */
  function applyBreakpoint() {
    const on = window.innerWidth >= 768;
    if (on === enabled) return;
    enabled = on;
    if (!enabled) { targetX = targetY = 0; reset(); }
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', recenter, { passive: true });
  window.addEventListener('scroll', recenter, { passive: true });
  window.addEventListener('resize', applyBreakpoint);
  applyBreakpoint();
})();
