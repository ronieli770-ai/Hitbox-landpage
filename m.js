/* ============================================================
   עמוד המובייל — תוכן דינמי ואינטראקציות
   ============================================================ */

const BUNNY_LIB = '726759';

/* המלצות הווידאו: id = הקליפ המקומי, guid = הסרטון המלא ב-Bunny */
const CLIPS = [
  { id: 'hero', guid: 'd265a829-af72-493b-a208-c072adeb34b4' },
  { id: 't00', guid: '08f5d6ae-5ab6-4fc3-9c4b-31e57c155fb9' },
  { id: 't01', guid: '7ecd071a-eed7-474e-bc24-bf026b7d4456' },
  { id: 't05', guid: 'dd2c7d47-68e0-49f7-97be-45a88da622a8' },
  { id: 't06', guid: 'dec0da24-44cb-490f-b37b-79732668c42e' },
  { id: 't09', guid: '50e1c26c-5fb6-43c4-a0b6-1cb6600e83b4' },
  { id: 't12', guid: '1ada0673-6c7a-4451-a29f-02909c658646' }
];

const WALL = [
  { id: 'noa', delta: '-15', b: '93', a: '78' },
  { id: 'mic', delta: '-18', b: '106', a: '88' },
  { id: 'mao', delta: '-7', b: '86', a: '79', single: true },
  { id: 'eli', delta: '-20', b: '110', a: '90' },
  { id: 'lon', delta: '-34', b: '118', a: '84' },
  { id: 'gnt', delta: '-36', b: '124', a: '88' },
  { id: 'tal', delta: '-18', b: '95', a: '77' }
];

const OBJECTIONS = [
  { ic: 'icon-30', q: 'אין לי זמן',
    a: 'שעה, פעם-פעמיים בשבוע — פחות ממה שאתה מבזבז על הטלפון בערב אחד. והסניפים חמש דקות מהמשרד, בדרך הביתה.' },
  { ic: 'icon-29', q: 'אני לא בכושר מספיק בשביל אגרוף',
    a: 'רוב מי שמגיע אלינו לא. לכל תרגיל יש גרסה קלה יותר, אתה קובע את הקצב והמאמן דואג לטכניקה. אחרי שלושה אימונים תבין שזה לא היה שיקול.' },
  { ic: 'icon-28', q: 'אני אחטוף מכות',
    a: 'עובדים בזוגות בצורה מבוקרת ועל שקים, לא עולים לקרבות זירה.' },
  { ic: 'icon-27', q: 'נרשמתי כבר פעם לחדר כושר ולא הלכתי',
    a: 'כי אף אחד לא שם לב שנעלמת. פה יש עד 12 מתאמנים בקבוצה ומאמן שיודע איך קוראים לך. כשאתה מפספס שבוע — מישהו שואל למה. זה ההבדל בין מנוי למסגרת.' },
  { ic: 'icon-26', q: 'אני לא בטוח שזה בשבילי',
    a: 'בשביל זה יש אימון ניסיון. אתה בא, מתאמן, מרגיש איך זה בגוף ואיך זה בראש - ואז מחליט. בלי טפסים, בלי התחייבות, בלי מישהו שירדוף אחריך.' }
];

const QUESTIONS = [
  { key: 'goal', q: 'מה הכי מדבר אליך עכשיו?',
    a: ['לנסות ספורט חדש שלא ישעמם אותי', 'להיכנס לכושר ולרדת במשקל', 'לרכוש יכולות לחימה והגנה עצמית'] },
  { key: 'experience', q: 'מתי בפעם האחרונה התאמנת באופן קבוע?',
    a: ['אני מתאמן באופן קבוע ורוצה לנסות משהו חדש', 'היה פעם, נגמר לפני כמה שנים', 'בכנות? אף פעם'] },
  { key: 'branch', q: 'איזה סניף הכי נוח לך?',
    a: ['רמת גן', 'פתח תקווה', 'תל אביב - גבעתיים'] },
  { key: 'time', q: 'מתי הכי מתאים לך להתאמן?',
    a: ['לפני העבודה', 'אחרי העבודה', 'בסופ״ש'] }
];

const PLAY = '<span class="play"><svg viewBox="0 0 64 64" fill="none">' +
  '<circle cx="32" cy="32" r="31" fill="#fff3b7"/>' +
  '<path d="M26 21l19 11-19 11z" fill="#101c1d"/></svg></span>';

/* ---------- גריד ההמלצות ---------- */
const vgrid = document.getElementById('vgrid');
vgrid.innerHTML = CLIPS.map(c =>
  `<button class="vcell" type="button" data-guid="${c.guid}" aria-label="צפייה בהמלצה">
     <video muted loop playsinline preload="none" poster="assets/vid/${c.id}.jpg"
            data-src="assets/vid/${c.id}.mp4"></video>${PLAY}
   </button>`).join('');

/* הסרטונים מתחילים לרוץ רק כשהם על המסך */
const io = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target.querySelector('video');
  if (!v) return;
  if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => { }); }
  else v.pause();
}), { threshold: .25 });
vgrid.querySelectorAll('.vcell').forEach(c => io.observe(c));

/* ---------- לפני־אחרי ---------- */
document.getElementById('rail').innerHTML = WALL.map(w =>
  `<article class="ba">
     <div class="pic"><img src="assets/ba/${w.id}.jpg" alt="">${w.single ? '' : '<i></i>'}</div>
     <div class="txt">
       <p class="delta"><span dir="ltr">${w.delta}</span> קילו</p>
       <p class="kg"><span dir="ltr">${w.b}</span> ← <span dir="ltr">${w.a}</span> ק״ג</p>
     </div>
   </article>`).join('');

/* ---------- התנגדויות ---------- */
document.getElementById('objs').innerHTML = OBJECTIONS.map(o =>
  `<details class="acc">
     <summary><img src="assets/${o.ic}.svg" alt="">${o.q}</summary>
     <p class="body">${o.a}</p>
   </details>`).join('');
/* פתוח אחד בכל רגע */
document.querySelectorAll('.acc').forEach(d => d.addEventListener('toggle', () => {
  if (d.open) document.querySelectorAll('.acc[open]').forEach(o => { if (o !== d) o.open = false; });
}));

/* ---------- פופ־אפ הווידאו ---------- */
const vm = document.getElementById('vm'), frame = vm.querySelector('.frame');
vgrid.addEventListener('click', e => {
  const cell = e.target.closest('.vcell');
  if (!cell) return;
  const f = document.createElement('iframe');
  f.src = `https://iframe.mediadelivery.net/embed/${BUNNY_LIB}/${cell.dataset.guid}` +
    '?autoplay=true&muted=false&preload=false&responsive=true';
  f.allow = 'autoplay;encrypted-media;picture-in-picture;';
  f.allowFullscreen = true;
  frame.replaceChildren(f);
  vm.classList.add('on');
  document.body.style.overflow = 'hidden';
});
function closeVm() {
  vm.classList.remove('on');
  frame.replaceChildren();
  document.body.style.overflow = '';
}
document.getElementById('vmx').addEventListener('click', closeVm);
vm.addEventListener('click', e => { if (e.target === vm) closeVm(); });

/* ---------- השאלון ---------- */
(function () {
  const head = document.getElementById('q-head');
  const opts = document.getElementById('q-opts');
  const back = document.getElementById('q-back');
  const form = document.getElementById('q-result');
  const sub = document.getElementById('q-sub');
  const answers = {};
  let i = 0;

  function paint() {
    const item = QUESTIONS[i];
    head.textContent = item.q;
    opts.innerHTML = item.a.map(t => `<button class="qopt" type="button">${t}</button>`).join('');
    back.hidden = i === 0;
  }

  function finish() {
    sub.textContent = `על בסיס התשובות שלך, מצאנו קבוצה מתאימה בסניף ${answers.branch}. ` +
      'תשאיר פרטים ונחזור אליך היום לקביעת אימון ניסיון.';
    form.querySelectorAll('input[type=hidden]').forEach(x => x.remove());
    for (const [k, v] of Object.entries(answers)) {
      const h = document.createElement('input');
      h.type = 'hidden'; h.name = k; h.value = v;
      form.appendChild(h);
    }
    head.hidden = opts.hidden = true;
    form.hidden = false;
    back.hidden = false;
  }

  opts.addEventListener('click', e => {
    const b = e.target.closest('.qopt');
    if (!b) return;
    answers[QUESTIONS[i].key] = b.textContent.trim();
    i++;
    if (i >= QUESTIONS.length) finish();
    else paint();
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  back.addEventListener('click', () => {
    if (!form.hidden) { form.hidden = true; head.hidden = opts.hidden = false; i = QUESTIONS.length - 1; }
    else if (i > 0) i--;
    paint();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    console.log('פרטי הליד:', Object.fromEntries(new FormData(form).entries()));
    location.href = 'thanks.html?goal=' + encodeURIComponent(answers.goal || '');
  });

  paint();
})();

/* ---------- ציר הזמן ----------
   הקו נצבע לינארית לפי הגלילה, ועיגול וטקסט נדלקים ברגע שהצבע מגיע אליהם.
   קו הקריאה: רבע מגובה המסך מלמטה. */
const TL_MARK = 0.75;

(function () {
  const tl = document.getElementById('tl');
  const line = tl && tl.querySelector('.tlline');
  const fill = document.getElementById('tlfill');
  if (!tl || !line || !fill) return;
  const cards = [...tl.querySelectorAll('.tlc')];
  const nodes = cards.map(c => c.querySelector('.nd'));
  let queued = false;

  /* הקו נמתח ממרכז העיגול הראשון עד מרכז האחרון */
  function layout() {
    const top = tl.getBoundingClientRect().top;
    const a = nodes[0].getBoundingClientRect();
    const b = nodes[nodes.length - 1].getBoundingClientRect();
    line.style.top = (a.top - top + a.height / 2) + 'px';
    line.style.height = (b.top - a.top) + 'px';
  }

  function sync() {
    queued = false;
    const mark = innerHeight * TL_MARK;
    const r = line.getBoundingClientRect();
    fill.style.height = Math.max(0, Math.min(r.height, mark - r.top)) + 'px';
    nodes.forEach((n, i) => {
      const b = n.getBoundingClientRect();
      cards[i].classList.toggle('on', b.top + b.height / 2 <= mark);
    });
  }

  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sync);
  }, { passive: true });
  addEventListener('resize', () => { layout(); sync(); });
  addEventListener('load', () => { layout(); sync(); });
  layout(); sync();
})();
