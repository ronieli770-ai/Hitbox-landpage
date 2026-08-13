/* ============================================================
   סקשן המלצות וידאו — הגריד שנפרש מהכרטיס המרכזי
   ============================================================ */

const MID_SCALE   = 3;      // כמה גדול הכרטיס המרכזי בהתחלה
const ITEM_SCALE  = 0.2;    // הגודל ההתחלתי של שאר הכרטיסים
const MID_DUR     = 0.6;    // משך הכיווץ של המרכזי (ביחידות ציר הזמן)
const ITEM_DUR    = 1.0;    // משך הכניסה של כרטיס בודד
const ITEM_DELAY  = 0.1;    // מתי מתחילים לצאת מהמרכז
const STAGGER     = 0.8;    // פריסת ההשהיה בין המרכז לפינות
const BACK        = 1.4;    // עוצמת ה"קפיצה" בכניסת הכרטיס
const TOTAL       = ITEM_DELAY + ITEM_DUR + STAGGER;

/* ---- הסרטונים המלאים ב-Bunny Stream (הפופ־אפ בלבד) ----
   הכרטיסים בגריד מנגנים לופים מקומיים מ-assets/vid — רק הצפייה המלאה עוברת דרך Bunny.
   כדי להחליף סרטון: מחליפים כאן את המזהה ותו לא. */
const BUNNY_LIB = '726759';
const BUNNY = {
  hero: 'd265a829-af72-493b-a208-c072adeb34b4', // הכרטיס המרכזי
  t00: '08f5d6ae-5ab6-4fc3-9c4b-31e57c155fb9',  // מייקל
  t01: '7ecd071a-eed7-474e-bc24-bf026b7d4456',  // עידן אגמי
  t02: 'e7fdf958-5d47-4e2a-8b64-20057352c084',  // ספורט בצורה חווייתית
  t03: '4c6b5497-8041-4695-8940-0208ea01fb96',  // פימה יגודיב
  t04: '8a2eac20-cab8-418e-af34-7bdfc7814f4f',  // ידידיה
  t05: 'dd2c7d47-68e0-49f7-97be-45a88da622a8',  // בן ברנע
  t06: 'dec0da24-44cb-490f-b37b-79732668c42e',  // כפיר עמדי
  t07: '6adc7ff6-ab09-4915-9966-cd4e34772504',  // נדב
  t08: 'a5cb1a88-0cdc-4482-b4cd-a62a96b1ae4c',  // טכניקה מקצועית
  t09: '50e1c26c-5fb6-43c4-a0b6-1cb6600e83b4',  // בית ומשפחה
  t10: '6ec877d2-958e-49f3-9242-d880efe6ea9a',  // לא חדר כושר
  // עדיין לא מקודדים ללופ בגריד:
  t11: '11002eb0-5303-4aab-9d74-f2aba3f01d15',  // הנאה ואנרגיות
  t12: '1ada0673-6c7a-4451-a29f-02909c658646',  // ביטחון
  t13: 'df8e6229-c6de-46e4-b137-103238a7766c'   // המשבצת האחרונה
};

const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const backOut = t => 1 + (BACK + 1) * Math.pow(t - 1, 3) + BACK * Math.pow(t - 1, 2);
const clamp01 = t => t < 0 ? 0 : t > 1 ? 1 : t;

(function () {
  const grid = document.getElementById('vgrid');
  if (!grid) return;
  const cells = [...grid.querySelectorAll('.vc')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- בניית התוכן של כל כרטיס ---- */
  const PLAY = '<span class="play"><svg viewBox="0 0 64 64" fill="none">' +
    '<circle cx="32" cy="32" r="31" fill="#fff3b7"/>' +
    '<path d="M26 21l19 11-19 11z" fill="#101c1d"/></svg></span>';

  cells.forEach(cell => {
    const id = cell.dataset.id, still = cell.dataset.still;
    if (still) {
      cell.classList.add('still');
      cell.innerHTML = `<img src="assets/vid/${still}.jpg" alt="" loading="lazy">`;
      return;
    }
    cell.innerHTML =
      `<video muted loop playsinline preload="none" poster="assets/vid/${id}.jpg" ` +
      `data-src="assets/vid/${id}.mp4"></video>` + PLAY;
    cell.setAttribute('aria-label', 'צפייה בהמלצה');
    if (cell.classList.contains('hero'))
      cell.insertAdjacentHTML('beforeend',
        '<div class="vhead h100"><p class="w">לא מאמינים לנו?</p><p class="y">תשמעו אותם.</p></div>');
  });

  const head = grid.querySelector('.vhead');

  const players = cells.filter(c => c.dataset.id)
    .map(c => ({ cell: c, id: c.dataset.id, v: c.querySelector('video') }));

  /* ---- מרחק כל כרטיס ממרכז הגריד, לחישוב ההשהיה ---- */
  const ROWS = 3, COLS = 5, CR = (ROWS - 1) / 2, CC = (COLS - 1) / 2;
  const maxD = Math.hypot(CR, CC);
  const layers = cells.map(cell => {
    const r = +cell.dataset.r, c = +cell.dataset.c;
    const mid = cell.classList.contains('hero');
    cell.style.zIndex = mid ? 25 : 1;
    return {
      el: cell, mid, v: cell.querySelector('video'),
      delay: mid ? 0 : ITEM_DELAY + Math.hypot(r - CR, c - CC) / maxD * STAGGER
    };
  });

  let target = 0, cur = 0, live = false;

  function apply(p) {
    const T = p * TOTAL;
    for (const l of layers) {
      if (l.mid) {
        const t = clamp01(T / MID_DUR);
        const s = MID_SCALE + (1 - MID_SCALE) * easeInOut(t);
        l.el.style.transform = `scale(${s.toFixed(4)})`;
        if (p > 0) start(l);
        if (head) {
          /* מבטל את ההגדלה של הכרטיס כדי שהטקסט יישאר בגודל העיצוב, ודועך עם הכיווץ */
          head.style.transform = `translate(-50%,-50%) scale(${(1 / s).toFixed(4)})`;
          head.style.opacity = clamp01((s - 1.7) / (MID_SCALE - 1.7)).toFixed(3);
        }
      } else {
        const t = clamp01((T - l.delay) / ITEM_DUR);
        const e = t <= 0 ? 0 : t >= 1 ? 1 : backOut(t);
        const s = ITEM_SCALE + (1 - ITEM_SCALE) * e;
        const o = clamp01(t * 3);
        l.el.style.transform = `scale(${s.toFixed(4)})`;
        l.el.style.opacity = o.toFixed(3);
        /* כל כרטיס מתחיל לנגן ברגע שהוא נכנס לתמונה — לא בסוף האנימציה */
        if (o > 0.02) start(l);
      }
    }
    if (p <= 0 && live) stopAll();
    else if (p > 0) live = true;
  }

  /* טעינה עצלה: הקובץ נמשך מהרשת רק כשהכרטיס שלו באמת מופיע */
  function start(l) {
    if (!l.v || l.v.dataset.on) return;
    l.v.dataset.on = '1';
    if (!l.v.src) l.v.src = l.v.dataset.src;
    l.v.play().catch(() => { });
  }

  function stopAll() {
    live = false;
    for (const l of layers) {
      if (!l.v) continue;
      l.v.pause();
      delete l.v.dataset.on;
    }
  }

  window.vgridScroll = t => { target = t; if (reduced) { cur = t; apply(t); } };
  window.vgridDraw = () => {
    if (reduced) return;
    if (Math.abs(target - cur) < 0.0004) { if (cur !== target) { cur = target; apply(cur); } return; }
    cur += (target - cur) * 0.12;   // scrub מרוכך
    apply(cur);
  };
  apply(0);

  /* ---- פופ־אפ: הסרטון המלא מ-Bunny, עם סאונד ---- */
  const modal = document.getElementById('vmodal');
  const frame = modal.querySelector('.frame');
  let lastFocus = null;

  function open(id, aspect) {
    const guid = BUNNY[id];
    if (!guid) return;
    /* רוב הסרטונים לאורך, אבל לא כולם — הפופ־אפ מתאים את עצמו ליחס של כל אחד */
    frame.style.aspectRatio = aspect || '9/16';
    lastFocus = document.activeElement;
    /* ה-iframe נוצר רק בקליק — כלום לא נטען מ-Bunny לפני כן */
    const f = document.createElement('iframe');
    f.src = `https://iframe.mediadelivery.net/embed/${BUNNY_LIB}/${guid}` +
      '?autoplay=true&loop=false&muted=false&preload=false&responsive=true';
    f.loading = 'lazy';
    f.allow = 'accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;';
    f.allowFullscreen = true;
    frame.replaceChildren(f);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('#vclose').focus();
  }

  function close() {
    modal.classList.remove('open');
    frame.replaceChildren();   // הסרת ה-iframe עוצרת את הניגון ואת התעבורה
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  players.forEach(p => p.cell.addEventListener('click', () => open(p.id, p.cell.dataset.aspect)));
  modal.querySelector('#vclose').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();
