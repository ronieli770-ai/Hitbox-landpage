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
      '?autoplay=true&loop=false&muted=false&preload=false&responsive=true';
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
