/* ============================================================
   פנס שעוקב אחרי העכבר על הפסים הטורקיזיים
   ============================================================ */

const TORCH_SMOOTH = 0.18;   // 0 = דביק לעכבר, 1 = מיידי

(function () {
  const bands = [...document.querySelectorAll('.band.teal')];
  const canvas = document.getElementById('canvas');
  if (!bands.length || !canvas) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pos = bands.map(() => ({ x: 0, y: 0, tx: 0, ty: 0, on: false }));
  let running = false;

  addEventListener('mousemove', e => {
    bands.forEach((band, i) => {
      const r = band.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right &&
                     e.clientY >= r.top && e.clientY <= r.bottom;
      const p = pos[i];
      if (inside) {
        /* המלבן כבר מוקטן יחד עם הקנבס, ולכן היחס מחושב עליו ישירות */
        p.tx = ((e.clientX - r.left) / r.width) * 100;
        p.ty = ((e.clientY - r.top) / r.height) * 100;
        if (!p.on) { p.on = true; p.x = p.tx; p.y = p.ty; band.classList.add('lit'); }
        start();
      } else if (p.on) {
        p.on = false;
        band.classList.remove('lit');
      }
    });
  }, { passive: true });

  addEventListener('mouseleave', () => {
    bands.forEach((b, i) => { pos[i].on = false; b.classList.remove('lit'); });
  });

  function start() { if (!running) { running = true; requestAnimationFrame(loop); } }

  function loop() {
    let live = false;
    bands.forEach((band, i) => {
      const p = pos[i];
      if (!p.on) return;
      live = true;
      p.x += (p.tx - p.x) * TORCH_SMOOTH;
      p.y += (p.ty - p.y) * TORCH_SMOOTH;
      const t = band.querySelector('.torch');
      t.style.setProperty('--mx', p.x.toFixed(2) + '%');
      t.style.setProperty('--my', p.y.toFixed(2) + '%');
    });
    if (live) requestAnimationFrame(loop);
    else running = false;
  }
})();
