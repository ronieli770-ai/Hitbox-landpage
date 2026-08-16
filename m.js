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
  { id: 't12', guid: '1ada0673-6c7a-4451-a29f-02909c658646' },
  { id: 't03', guid: '4c6b5497-8041-4695-8940-0208ea01fb96' }
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
vgrid.innerHTML =
  '<span class="vslot"></span>' +
  CLIPS.map((c, i) =>
    `<button class="vcell${i ? '' : ' hero'}" type="button" data-guid="${c.guid}" aria-label="צפייה בהמלצה">
       <video muted loop playsinline preload="none" poster="assets/vid/${c.id}.jpg"
              data-src="assets/vid/${c.id}.mp4"></video>${PLAY}
     </button>`).join('');
vgrid.querySelector('.hero').insertAdjacentHTML('beforeend',
  '<div class="vhead"><p>לא מאמין לנו?</p><p class="y">תשמע אותם.</p></div>');

/* ---------- פתיחת הגריד ----------
   הכרטיס של יוסף נפרש על רוחב המסך לאורך, עם הכותרת עליו, ובגלילה הוא
   נכנס למשבצת שלו בגריד בזמן שהשאר קופצים פנימה.

   הצורה שלו משתנה מפריים מלא-מסך למשבצת של 3/4, כלומר יחס הצדדים משתנה.
   לכן הוא נע ע"י left/top/width/height ולא ע"י scale — transform היה מועך
   את הווידאו, ואילו כאן object-fit מחשב את החיתוך מחדש בכל גודל. */
(function () {
  const ITEM_SCALE = 0.2;
  const ITEM_DUR = 1.0, ITEM_DELAY = 0.15, STAGGER = 0.85, BACK = 1.4;
  const TOTAL = ITEM_DELAY + ITEM_DUR + STAGGER;
  const OPEN_DUR = 0.55;      /* כמה מציר הזמן לוקח לכרטיס להיכנס למשבצת */

  const clamp01 = t => t < 0 ? 0 : t > 1 ? 1 : t;
  const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const backOut = t => 1 + (BACK + 1) * Math.pow(t - 1, 3) + BACK * Math.pow(t - 1, 2);

  const pin = document.getElementById('vpin');
  const tail = document.getElementById('vtail');
  const stick = vgrid.parentElement;
  const hero = vgrid.querySelector('.hero');
  const slot = vgrid.querySelector('.vslot');
  const rest = [...vgrid.querySelectorAll('.vcell')].filter(c => c !== hero);
  let near = [], far = [];
  const head = vgrid.querySelector('.vhead');
  const heroPlay = hero.querySelector('.play');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, target = 0, running = false;
  let open = { l: 0, t: 0, w: 0, h: 0 }, rest_ = { l: 0, t: 0, w: 0, h: 0 };

  let PIN = 0;

  function layout() {
    rest_ = { l: slot.offsetLeft, t: slot.offsetTop, w: slot.offsetWidth, h: slot.offsetHeight };
    const w = innerWidth;
    const h = Math.min(w * 16 / 9, innerHeight * 0.88);
    open = { w, h };

    /* אורך הנעיצה, והמקום שצריך להישמר לשורות שגולשות מתחת ל-vstick */
    PIN = innerHeight;
    const spill = Math.max(0, vgrid.offsetHeight - stick.clientHeight);
    pin.style.height = (stick.clientHeight + PIN) + 'px';
    tail.style.height = spill + 'px';

    /* מי נראה בזמן הנעיצה נכנס עם ההשהיה מהמרכז; מי שמתחת לקיפול
       יקבל אנימציה משלו כשיגיע למסך אחרי השחרור */
    near = []; far = [];
    const fold = stick.clientHeight;
    const hx = rest_.l + rest_.w / 2, hy = rest_.t + rest_.h / 2;
    const d = rest.map(c => Math.hypot(
      c.offsetLeft + c.offsetWidth / 2 - hx,
      c.offsetTop + c.offsetHeight / 2 - hy));
    const max = Math.max(...d, 1);
    rest.forEach((c, i) => {
      c.dataset.delay = ITEM_DELAY + d[i] / max * STAGGER;
      (c.offsetTop + c.offsetHeight <= fold ? near : far).push(c);
    });
  }

  /* ההתקדמות נמדדת מתוך הנעיצה: כל פיקסל גלילה בטווח הזה מזין את
     האנימציה, והעמוד עצמו עומד במקום */
  function scrollProgress() {
    return clamp01(-pin.getBoundingClientRect().top / PIN);
  }

  function play(cell) {
    const v = cell.querySelector('video');
    if (!v || v.dataset.on) return;
    v.dataset.on = '1';
    if (!v.src) v.src = v.dataset.src;
    v.play().catch(() => { });
  }

  function pop(c, t) {
    const k = t <= 0 ? 0 : t >= 1 ? 1 : backOut(t);
    const o = clamp01(t * 3);
    c.style.transform = `scale(${(ITEM_SCALE + (1 - ITEM_SCALE) * k).toFixed(4)})`;
    c.style.opacity = o.toFixed(3);
    if (o > 0.02) play(c);
  }

  function apply(p) {
    const gr = vgrid.getBoundingClientRect();
    const T = p * TOTAL;
    const e = easeInOut(clamp01(T / OPEN_DUR));
    const mix = (a, b) => a + (b - a) * e;
    /* הפריים הפתוח ממורכז במסך כל עוד הסקשן נעוץ, ולפני כן יושב בראש הגריד */
    const oT = Math.max(0, (innerHeight - open.h) / 2 - gr.top);
    hero.style.left = mix(-gr.left, rest_.l).toFixed(1) + 'px';
    hero.style.top = mix(oT, rest_.t).toFixed(1) + 'px';
    hero.style.width = mix(open.w, rest_.w).toFixed(1) + 'px';
    hero.style.height = mix(open.h, rest_.h).toFixed(1) + 'px';
    head.style.opacity = clamp01(1 - e * 2.2).toFixed(3);
    heroPlay.style.opacity = clamp01((e - 0.75) / 0.25).toFixed(3);
    if (p > 0) play(hero);

    near.forEach(c => pop(c, clamp01((T - c.dataset.delay) / ITEM_DUR)));
    /* השורות שמתחת לקיפול נכנסות לפי המיקום שלהן, תוך כדי הגלילה שאחרי השחרור */
    far.forEach(c => pop(c, clamp01(
      (innerHeight * 0.92 - c.getBoundingClientRect().top) / (innerHeight * 0.3))));
  }

  function frame() {
    const settled = Math.abs(target - cur) < 0.0005;
    if (settled) cur = target;
    apply(cur);
    if (settled) { running = false; return; }
    cur += (target - cur) * 0.12;
    requestAnimationFrame(frame);
  }

  function onScroll() {
    target = scrollProgress();
    if (reduced) { cur = target; apply(cur); return; }
    if (!running) { running = true; requestAnimationFrame(frame); }
  }

  layout(); apply(0);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { layout(); apply(cur); onScroll(); });
  addEventListener('load', () => { layout(); apply(cur); onScroll(); });
  onScroll();

  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) return;
    vgrid.querySelectorAll('video').forEach(v => { v.pause(); delete v.dataset.on; });
  }), { threshold: 0 }).observe(vgrid);
})();

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
/* details סוגר את התוכן מיד ולכן אין לו אנימציית סגירה — כאן המצב
   מוחזק במחלקה, כדי שגם הסגירה תרוץ */
const objs = document.getElementById('objs');
objs.innerHTML = OBJECTIONS.map(o =>
  `<div class="acc">
     <button class="q" type="button" aria-expanded="false">
       <img src="assets/${o.ic}.svg" alt="">${o.q}</button>
     <div class="a"><div><p>${o.a}</p></div></div>
   </div>`).join('');

/* פתוח אחד בכל רגע */
objs.addEventListener('click', e => {
  const q = e.target.closest('.q');
  if (!q) return;
  const acc = q.parentElement, isOpen = acc.classList.contains('on');
  objs.querySelectorAll('.acc.on').forEach(o => {
    o.classList.remove('on');
    o.querySelector('.q').setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) { acc.classList.add('on'); q.setAttribute('aria-expanded', 'true'); }
});

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
  const title = document.getElementById('q-title');
  const head = document.getElementById('q-head');
  const opts = document.getElementById('q-opts');
  const back = document.getElementById('q-back');
  const form = document.getElementById('q-result');
  const sub = document.getElementById('q-sub');
  const answers = {};
  let i = 0, busy = false;

  function paint() {
    const item = QUESTIONS[i];
    head.textContent = item.q;
    opts.innerHTML = item.a.map(t =>
      `<button class="qopt" type="button">${t}</button>`).join('');
    back.hidden = i === 0;          /* אין לאן לחזור מהשאלה הראשונה */
  }

  /* בסיום נשארים על המסך רק הכותרת החדשה, הטופס והחזרה */
  function show(asking) {
    title.hidden = head.hidden = opts.hidden = !asking;
    form.hidden = asking;
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
    show(false);
    back.hidden = false;
  }

  opts.addEventListener('click', e => {
    const b = e.target.closest('.qopt');
    if (!b || busy) return;
    busy = true;
    b.classList.add('on');           /* נשארת מסומנת עד שהשאלה מתחלפת */
    answers[QUESTIONS[i].key] = b.textContent.trim();
    setTimeout(() => {
      busy = false;
      i++;
      if (i >= QUESTIONS.length) finish();
      else paint();
    }, 280);
  });

  back.addEventListener('click', () => {
    if (!form.hidden) { show(true); i = QUESTIONS.length - 1; }
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

/* ---------- הטופס התחתון ---------- */
(function () {
  const form = document.getElementById('lead');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log('פרטי הליד:', data);
    location.href = 'thanks.html?goal=' + encodeURIComponent(data.goal || '');
  });
})();

/* ---------- כפתור הווצאפ הצף ---------- */
(function () {
  const wa = document.getElementById('wa');
  const foot = document.querySelector('footer');
  if (!wa || !foot) return;
  /* גובה הכפתור ועוד השוליים משני צדיו — הרגע שבו הפוטר מגיע אליו */
  const REACH = 84;
  let queued = false;
  function sync() {
    queued = false;
    wa.classList.toggle('gone', foot.getBoundingClientRect().top <= innerHeight - REACH);
  }
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sync);
  }, { passive: true });
  addEventListener('resize', sync);
  sync();
})();

/* ---------- כניסת כותרות ----------
   כל כותרת נחתכת לשורות לפי ה-<br> שבה, וכל שורה עולה מאחורי מסכה
   משלה. התוכן מועבר פנימה כמות שהוא, כך שהצבעים והספאנים נשמרים. */
const REVEAL_STEP = 110;   /* מילישניות בין שורה לשורה */

(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* הירו מוחרג, כמו בדסקטופ — הוא נראה מיד עם פתיחת העמוד */
  const heads = [...document.querySelectorAll('section h2, footer h2')]
    .filter(el => !el.closest('#hero'));

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('go');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });

  heads.forEach(el => {
    /* פיצול לשורות לפי <br>, כדי שהמדרגה בין השורות תישמר */
    const lines = [[]];
    [...el.childNodes].forEach(n => {
      if (n.nodeName === 'BR') lines.push([]);
      else lines[lines.length - 1].push(n);
    });

    const built = lines
      .filter(nodes => nodes.length)
      .map((nodes, i) => {
        const mask = document.createElement('span');
        mask.className = 'rv-line';
        const inner = document.createElement('i');
        nodes.forEach(n => inner.appendChild(n));
        inner.style.setProperty('--d', (i * REVEAL_STEP) + 'ms');
        mask.appendChild(inner);
        return mask;
      });

    el.replaceChildren(...built);
    el.classList.add('rv');
    io.observe(el);
  });
})();

/* ---------- כניסת הכרטיסיות בסקשן 2 ----------
   הימנית נכנסת מימין והשמאלית משמאל. ההתקדמות נגזרת ממיקום הרשת במסך
   ולא מרגע כניסה בודד, ולכן היא מתקדמת ונסוגה יחד עם האצבע. */
const TILE_SHIFT = 46;     /* מרחק הכניסה בפיקסלים */
const TILE_STAGGER = 0.13; /* ההסטה בציר הזמן בין כרטיסייה לכרטיסייה */
const TILE_SPAN = 0.58;    /* כמה מציר הזמן לוקחת כניסה של כרטיסייה אחת */

(function () {
  const grid = document.querySelector('.grid2');
  if (!grid || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const tiles = [...grid.querySelectorAll('.tile')];
  grid.classList.add('slid');

  const clamp = t => t < 0 ? 0 : t > 1 ? 1 : t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  let queued = false;

  function sync() {
    queued = false;
    const top = grid.getBoundingClientRect().top;
    const raw = clamp((innerHeight * 0.92 - top) / (innerHeight * 0.75));
    tiles.forEach((el, i) => {
      const t = clamp((raw - i * TILE_STAGGER) / TILE_SPAN);
      const e = easeOut(t);
      const dir = i % 2 ? -1 : 1;   /* ב-RTL האלמנט הראשון הוא הימני */
      el.style.opacity = t.toFixed(3);
      el.style.transform = `translateX(${(dir * (1 - e) * TILE_SHIFT).toFixed(1)}px)`;
    });
  }

  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sync);
  }, { passive: true });
  addEventListener('resize', sync);
  addEventListener('load', sync);
  sync();
})();
