/* ============================================================
   עמוד התודה — סרטוני המלצה מותאמים לסיבה שהגולש בחר
   הבחירה מגיעה בכתובת: thanks.html?goal=variety
   ============================================================ */

const BUNNY_LIB = '726759';

/* לכל סיבה: כותרת משנה והסרטונים שמדברים אליה.
   id = הקליפ המקומי (assets/vid), guid = הסרטון המלא ב-Bunny */
const TRACKS = {
  variety: {
    label: 'הם הגיעו לנסות ספורט חדש',
    clips: [
      { id: 't11', guid: '11002eb0-5303-4aab-9d74-f2aba3f01d15' }, // הנאה ואנרגיות
      { id: 't10', guid: '6ec877d2-958e-49f3-9242-d880efe6ea9a' }, // לא חדר כושר
      { id: 't07', guid: '6adc7ff6-ab09-4915-9966-cd4e34772504' }  // נדב
    ]
  },
  fitness: {
    label: 'הם הגיעו להיכנס לכושר ולרדת במשקל',
    clips: [
      { id: 't06', guid: 'dec0da24-44cb-490f-b37b-79732668c42e' }, // כפיר עמדי
      { id: 't05', guid: 'dd2c7d47-68e0-49f7-97be-45a88da622a8' }, // בן ברנע
      { id: 't00', guid: '08f5d6ae-5ab6-4fc3-9c4b-31e57c155fb9' }  // מייקל
    ]
  },
  defense: {
    label: 'הם הגיעו לרכוש יכולות לחימה והגנה עצמית',
    clips: [
      { id: 't12', guid: '1ada0673-6c7a-4451-a29f-02909c658646' }, // ביטחון
      { id: 't09', guid: '50e1c26c-5fb6-43c4-a0b6-1cb6600e83b4' }, // בית ומשפחה
      { id: 't08', guid: 'a5cb1a88-0cdc-4482-b4cd-a62a96b1ae4c' }  // טכניקה מקצועית
    ]
  }
};

/* הניסוח שנשלח מהטופס → המפתח כאן */
const FROM_TEXT = {
  'לנסות ספורט חדש שלא ישעמם אותי': 'variety',
  'להיכנס לכושר ולרדת במשקל': 'fitness',
  'לרכוש יכולות לחימה והגנה עצמית': 'defense'
};

(function () {
  const params = new URLSearchParams(location.search);
  const raw = params.get('goal') || '';
  const key = TRACKS[raw] ? raw : (FROM_TEXT[raw] || 'variety');
  const track = TRACKS[key];

  document.getElementById('topic').textContent = track.label;

  const PLAY = '<span class="play"><svg viewBox="0 0 64 64" fill="none">' +
    '<circle cx="32" cy="32" r="31" fill="#fff3b7"/>' +
    '<path d="M26 21l19 11-19 11z" fill="#101c1d"/></svg></span>';

  const grid = document.getElementById('grid');
  grid.innerHTML = track.clips.map(c =>
    `<button class="card" type="button" data-guid="${c.guid}" aria-label="צפייה בהמלצה">
       <video muted loop playsinline autoplay poster="assets/vid/${c.id}.jpg" src="assets/vid/${c.id}.mp4"></video>
       ${PLAY}
     </button>`).join('');

  /* ---- פופ־אפ עם הסרטון המלא ---- */
  const modal = document.getElementById('modal');
  const frame = modal.querySelector('.frame');
  let lastFocus = null;

  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    lastFocus = card;
    const f = document.createElement('iframe');
    f.src = `https://iframe.mediadelivery.net/embed/${BUNNY_LIB}/${card.dataset.guid}` +
      '?autoplay=true&loop=false&muted=false&preload=true&responsive=true';
    f.allow = 'accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;';
    f.allowFullscreen = true;
    frame.replaceChildren(f);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('close').focus();
  });

  function close() {
    modal.classList.remove('open');
    frame.replaceChildren();      // עוצר את הניגון ואת התעבורה
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.getElementById('close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();

/* ============================================================
   קונפטי בכניסה — מטח אחד מהמרכז
   מצויר ב-canvas ולא באלמנטים: מאתיים פתיתים ב-DOM היו מכריחים את
   הדפדפן לחשב פריסה מחדש בכל פריים, וזה נתקע בטלפון.
   ============================================================ */
const CONFETTI_COLORS = ['#fff3b7', '#ffffff', '#3e6e72', '#8fd0d4', '#f5e08a'];
const GRAVITY = 620, DRAG = 0.985, FADE_AFTER = 2.4;

/* המדידה חייבת לקרות אחרי שהגופן והלוגו נטענו: עד אז הכותרת יושבת
   גבוה יותר, ומטח שנורה לפי המיקום ההוא יוצא מעליה. */
function whenSettled(go) {
  const logo = document.querySelector('.logo');
  const waits = [document.fonts ? document.fonts.ready : Promise.resolve()];
  if (logo && !logo.complete)
    waits.push(new Promise(done => { logo.onload = logo.onerror = done; }));
  Promise.all(waits).then(() => requestAnimationFrame(() => requestAnimationFrame(go)));
}

whenSettled(function () {
  const canvas = document.getElementById('confetti');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = innerWidth, H = innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];

  /* המטח מתפרס לפי המסך: מסך גדול מקבל יותר פתיתים ומהירות גבוהה יותר,
     אחרת הפיצוץ נבלע באמצע ולא מגיע לקצוות */
  const spread = Math.max(1, Math.min(W, H) / 640);
  const count = Math.min(220, Math.round(90 + W * 0.12));

  /* בטלפון המטח יוצא ממרכז הכותרת עצמה. הקנבס קבוע למסך, ולכן המלבן
     של הכותרת הוא כבר בקואורדינטות המסך ואין צורך להוסיף גלילה. */
  let ox = W / 2, oy = H * 0.42;
  if (matchMedia('(max-width:820px)').matches) {
    const title = document.querySelector('h1');
    if (title) {
      const r = title.getBoundingClientRect();
      ox = r.left + r.width / 2;
      oy = r.top + r.height / 2;
    }
  }

  const bits = Array.from({ length: count }, () => {
    const a = rnd(0, Math.PI * 2), v = rnd(180, 520) * spread, size = rnd(7, 13);
    return {
      x: ox, y: oy,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      w: size, h: size * rnd(0.35, 0.6),
      rot: rnd(0, Math.PI * 2), spin: rnd(-0.24, 0.24),
      flip: rnd(0, Math.PI * 2), flipSpeed: rnd(0.08, 0.2),
      color: pick(CONFETTI_COLORS), life: 0
    };
  });

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    ctx.clearRect(0, 0, W, H);
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.vy += GRAVITY * dt;
      b.vx *= DRAG; b.vy *= DRAG;
      b.x += b.vx * dt; b.y += b.vy * dt;
      b.rot += b.spin; b.flip += b.flipSpeed;
      b.life += dt;

      if (b.y > H + 40 || b.x < -60 || b.x > W + 60) { bits.splice(i, 1); continue; }

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      /* הכיווץ האופקי לפי הסחרור הוא מה שנותן תחושת נייר מסתובב */
      ctx.scale(Math.cos(b.flip), 1);
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, b.life - FADE_AFTER) / 1.2);
      ctx.fillStyle = b.color;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }

    if (bits.length) requestAnimationFrame(frame);
    else canvas.remove();     /* נגמר — מסירים את הקנבס לגמרי */
  }
  requestAnimationFrame(frame);
});
