/* ============================================================
   קרוסלת לפני־אחרי — גלילה אופקית עם פס גלילה שניתן לגרירה
   ============================================================ */

(function () {
  const row = document.getElementById('wallrow');
  const bar = document.getElementById('wallbar');
  const thumb = document.getElementById('wallthumb');
  if (!row || !bar || !thumb) return;

  /* תמונה שלא נטענה מפנה מקום למלבן האפור, במקום להציג אייקון שבור */
  row.querySelectorAll('.ba img').forEach(img => {
    img.addEventListener('error', () => img.remove());
  });

  const maxScroll = () => Math.max(1, row.scrollWidth - row.clientWidth);

  /* ---- הפס משקף את מצב הגלילה ---- */
  function sync() {
    const ratio = row.clientWidth / row.scrollWidth;
    const w = Math.max(40, bar.clientWidth * ratio);
    thumb.style.width = w + 'px';
    /* RTL: הגלילה שלילית, והידית נעה מימין לשמאל */
    const p = Math.abs(row.scrollLeft) / maxScroll();
    thumb.style.right = ((bar.clientWidth - w) * p) + 'px';
  }

  row.addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync);
  sync();

  /* ---- גרירת הידית ---- */
  let barDrag = null;
  thumb.addEventListener('pointerdown', e => {
    e.preventDefault();
    barDrag = { x: e.clientX, right: parseFloat(thumb.style.right) || 0 };
    bar.classList.add('drag');
    thumb.setPointerCapture(e.pointerId);
  });
  thumb.addEventListener('pointermove', e => {
    if (!barDrag) return;
    const span = bar.clientWidth - thumb.offsetWidth;
    /* גרירה שמאלה מקדמת את הקרוסלה, ולכן ההיסט מתהפך */
    const p = Math.min(1, Math.max(0, (barDrag.right - (e.clientX - barDrag.x)) / span));
    row.scrollLeft = -p * maxScroll();
  });
  const endBar = () => { barDrag = null; bar.classList.remove('drag'); };
  thumb.addEventListener('pointerup', endBar);
  thumb.addEventListener('pointercancel', endBar);

  /* ---- גרירת הכרטיסים עצמם ---- */
  let rowDrag = null;
  row.addEventListener('pointerdown', e => {
    if (e.target.closest('a,button')) return;
    rowDrag = { x: e.clientX, start: row.scrollLeft, moved: false };
    row.classList.add('drag');
  });
  row.addEventListener('pointermove', e => {
    if (!rowDrag) return;
    const dx = e.clientX - rowDrag.x;
    if (Math.abs(dx) > 3) rowDrag.moved = true;
    row.scrollLeft = rowDrag.start + dx;
  });
  const endRow = () => {
    if (!rowDrag) return;
    rowDrag = null;
    row.classList.remove('drag');
  };
  addEventListener('pointerup', endRow);
  addEventListener('pointercancel', endRow);

  /* ---- גלגלת מעל הקרוסלה מזיזה אותה אופקית ----
     כשמגיעים לקצה מפסיקים לתפוס את הגלגלת, כדי שהעמוד ימשיך לגלול כרגיל */
  row.addEventListener('wheel', e => {
    const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (!d) return;
    const now = row.scrollLeft;
    const next = Math.max(-maxScroll(), Math.min(0, now - d));
    if (Math.abs(next - now) < 0.5) return;
    e.preventDefault();
    row.scrollLeft = next;
  }, { passive: false });
})();
