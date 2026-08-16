/* ============================================================
   ביקורות גוגל — חלונית צפה שמתחלפת בפינה השמאלית התחתונה
   הקובץ עצמאי: מזריק את הסגנון ואת המבנה בעצמו.
   ============================================================ */

const PLACE_ID = 'ChIJSf1mgb5LHRURVjL9o4BIQOw';   // היטבוקס רמת גן — לשימוש ה-API
const CID = '10325028178909130511';              // מזהה העסק, לקישור לעמוד הביקורות
const API_KEY = '';        // ריק = משתמש ברשימה שלמטה. עם מפתח = מושך חי מגוגל.
const FIRST_DELAY = 4000;  // כמה להמתין לפני ההופעה הראשונה

/* ביקורות אמיתיות מהעמוד העסקי, כפי שהועתקו משם.
   הטקסט נחתך אוטומטית לשלוש שורות עם שלוש נקודות, כך שגודל החלונית קבוע
   ולא משנה כמה ארוכה הביקורת. */
const REVIEWS = {
  place: { url: 'https://maps.google.com/?cid=' + CID },
  reviews: [
    { author: 'Song Min hae', initial: 'S', rating: 5, when: 'לפני חודשיים',
      text: 'אני זר ולא חשבתי שיהיה קל ללמוד איגרוף בישראל. הם לימדו אותי ונתנו לי הרבה ידע על איגרוף. הרגשתי טוב, נהניתי, נפצעתי לפעמים, אבל זה היה ממש כיף.😊' },
    { author: 'דניאל רז', initial: 'ד', rating: 5, when: 'לפני 6 חודשים',
      text: 'מכון מקצועי 10/10. אור, מיכאל, וולד תותחים אחד אחד. אני נהנה ולומד מכל מאמן, גם סביבת המתאמנים איכותית ונעימה. כיף להגיע כל פעם מחדש :)' },
    { author: 'שיראל סרוסי', initial: 'ש', rating: 5, when: 'לפני 11 חודשים',
      text: 'וואו. אני מתאמנת בהיטבוקס כבר 8 חודשים ואני נהנת מכל אימון. וכל אימון שנגמר כבר מחכה לאימון הבא. המאמנים כל כך טובים במה שהם עושים, הם נותנים את הלב שלהם בשביל ההצלחה שלכם. אז אני ממליצה מכל הלב❤️' },
    { author: 'עדי נ', initial: 'ע', rating: 5, when: 'לפני שנה',
      text: 'צוות מאמנים מקצועי ורציני מאוד. אכפת להם מההתקדמות של המתאמנים ברמה האישית, ממש מקפידים על הדברים הכי קטנים ע"מ להביא אותך למקסימום ביצועים. ממש מקום ברמה גבוהה.' },
    { author: 'סהר שרעבי', initial: 'ס', rating: 5, when: 'לפני 11 חודשים',
      text: 'מקום מצוין! מאמנים איכותיים, קבוצות קטנות, המקום בנוי בצורה מצוינת ויש יחס מאוד אישי ואווירה טובה. ממליץ מאוד לכל מי שרוצה להיכנס לענף הלחימה והגנה עצמית.' },
    { author: 'Shmuel Blau', initial: 'S', rating: 5, when: 'לפני שנה',
      text: 'היטבוקס פתח תקווה הוא מקום מדהים לכל מי שמחפש אימון איכותי ומאתגר! האווירה שם מקצועית אבל גם מאוד משפחתית, כך שכל מתאמן מקבל יחס אישי ותמיכה לאורך כל הדרך. המאמנים מנוסים, סבלניים ויודעים איך לדחוף אותך קדימה בצורה הכי טובה שיש.' },
    { author: 'salih osman', initial: 'S', rating: 5, when: 'לפני שנה',
      text: 'אני מאוד מרוצה מהאימונים בסטודיו! התחלתי עם האימונים במוי תאי במשך 90 ימים ועכשיו אני מתאמן בבוקסינג. המאמנים מקצועיים, סבלניים ותומכים, והאווירה בסטודיו תמיד חיובית וממלאת מוטיבציה. כל אימון מרגיש מאתגר ומלמד, ואני רואה שיפור מדהים.' },
    { author: 'מאור בן שיטרית', initial: 'מ', rating: 5, when: 'לפני שנה',
      text: 'אני נמצא בסטודיו מעל שנה וחצי, הדבר הכי טוב שעשיתי לגוף שלי, מחכה כל הזמן לאימון הבא ופשוט נהנה מתהליך ובנייה. צוות המאמנים מדהים תומך עוזר וקשוב, מי שמחפש את האימון הנכון עבורו זה המקום.' },
    { author: 'יובל תורן', initial: 'י', rating: 5, when: 'לפני שנה',
      text: 'מקום מדהים! ולד המאמן - תותח. שילוב מדויק בין כושר, הנאה ומקצועיות. במידה מכל דבר. הבחירה הכי טובה שעשיתי' },
    { author: 'Ilan Grif', initial: 'I', rating: 5, when: 'לפני שנה',
      text: 'אחלה מקום להתאמן, מאמנים אלופים וממש תענוג להגיע. בחיים לא הצלחתי להתמיד בשום מקום ופה אני כבר יותר משנה מגיע כל שבוע לאימון 💪' },
    { author: 'yuval po', initial: 'Y', rating: 5, when: 'לפני שנה',
      text: 'קבוצות יחסית קטנות עם יחס אישי מעולה מהמאמן. מרגיש שיפור אחריי כל שיעור. גרם לי לחזור לכושר בלי לסבול ולהשתעמם בחדר כושר' },
    { author: 'יוסי יוסף', initial: 'י', rating: 5, when: 'לפני שנה',
      text: 'מקום שהוקם ע״י אנשים שאוהבים את מה שהם עושים. חווית אימון מקצועית. האימונים האישיים עם המאמן ולד מומלצים ביותר. AAA+++' },
    { author: 'כפיר הררי', initial: 'כ', rating: 5, when: 'לפני 5 שנים',
      text: 'מקצועי, אנרגיות טובות, תענוג של אימון!! האימון עצמו מעלה את הביטחון עצמי וכושר. אתה יודע איך להתמודד עם סיטואציות טוב יותר ובעיקר איך להימנע מהם. מרגיש שהקצב מותאם בדיוק לי.' }
  ]
};
const SHOW_TIME = 7000;    // כמה זמן כל ביקורת נשארת
const EXIT_TIME = 560;     // משך היציאה שמאלה לפני שהבאה נכנסת

(function () {
  if (document.getElementById('grev-toast')) return;

  const css = `
#grev-toast{position:fixed;left:20px;bottom:20px;z-index:2500;width:390px;max-width:calc(100vw - 40px);
  background:#fff;color:#101c1d;border-radius:14px;padding:14px 16px;
  box-shadow:0 12px 34px rgba(16,28,29,.35);font-family:'FbReissfeder',sans-serif;direction:rtl;
  transform:translateX(-120%);opacity:0;transition:transform .55s cubic-bezier(.16,1,.3,1),opacity .4s ease;}
#grev-toast.in{transform:translateX(0);opacity:1;}
#grev-toast.out{transform:translateX(-120%);opacity:0;}
#grev-toast.noanim{transition:none !important;}
#grev-toast .gr-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
#grev-toast .gr-g{width:20px;height:20px;flex:none;}
#grev-toast .gr-stars{color:#fbbc05;font-size:17px;letter-spacing:1px;line-height:1;}
#grev-toast .gr-ok{width:16px;height:16px;flex:none;}
#grev-toast .gr-body{display:flex;gap:12px;direction:ltr;}
#grev-toast .gr-av{width:44px;height:44px;border-radius:50%;flex:none;object-fit:cover;
  background:#3e6e72;color:#fff;display:flex;align-items:center;justify-content:center;
  font-size:19px;font-weight:700;}
#grev-toast .gr-txt{direction:rtl;text-align:right;flex:1;min-width:0;}
#grev-toast .gr-quote{font-size:15px;line-height:1.45;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
#grev-toast .gr-who{margin-top:6px;font-size:13px;color:#5d6f70;}
#grev-toast .gr-who b{color:#101c1d;font-weight:700;}
#grev-toast .gr-x{position:absolute;top:8px;left:10px;border:0;background:none;cursor:pointer;
  font-size:18px;line-height:1;color:#9aa8a9;padding:2px 4px;}
#grev-toast .gr-x:hover{color:#101c1d;}
#grev-toast a{color:inherit;text-decoration:none;display:block;}
@media (max-width:600px){#grev-toast{left:12px;bottom:12px;width:calc(100vw - 24px);}}
@media (prefers-reduced-motion:reduce){#grev-toast{transition:opacity .3s ease;transform:none;}}`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const G = '<svg class="gr-g" viewBox="0 0 48 48"><path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-4H24v7.5h12c-.2 2-1.5 5-4.4 7l6.7 5.2C42.2 36 45 30.6 45 24z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 41.2 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z"/><path fill="#EA4335" d="M24 10.6c3.2 0 5.4 1.4 6.7 2.6l5.9-5.8C33 4 29 2 24 2 15.4 2 8 6.8 4.4 14.1l7.1 5.5c1.8-5.3 6.7-9 12.5-9z"/></svg>';
  const OK = '<svg class="gr-ok" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1a73e8"/><path d="M7.5 12.4l3 3 6-6.4" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const box = document.createElement('div');
  box.id = 'grev-toast';
  document.body.appendChild(box);

  let list = [], i = 0, stopped = false, timer;

  const stars = n => '★★★★★'.slice(0, n).padEnd(5, '☆');

  function paint(r, url) {
    box.innerHTML =
      `<button class="gr-x" aria-label="סגירה">×</button>
       <a href="${url}" target="_blank" rel="noopener">
         <div class="gr-row">${G}<span class="gr-stars">${stars(r.rating)}</span>${OK}</div>
         <div class="gr-body">
           ${r.photo ? `<img class="gr-av" src="${r.photo}" alt="">`
                     : `<span class="gr-av">${r.initial || (r.author || '?')[0]}</span>`}
           <div class="gr-txt">
             <p class="gr-quote">${r.text}</p>
             <p class="gr-who"><b>${r.author}</b> – ${r.when}</p>
           </div>
         </div>
       </a>`;
    box.querySelector('.gr-x').addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      stopped = true; clearTimeout(timer); box.classList.remove('in');
    });
  }

  /* הביקורת הנוכחית נגררת שמאלה והבאה נכנסת אחריה מימין — תנועה אחת רציפה */
  function slideIn(url) {
    const r = list[i % list.length];
    i++;
    box.classList.add('noanim');
    box.classList.remove('in', 'out');
    box.style.transform = 'translateX(120%)';
    paint(r, url);
    requestAnimationFrame(() => {
      box.classList.remove('noanim');
      box.style.transform = '';
      box.classList.add('in');
    });
    timer = setTimeout(() => slideOut(url), SHOW_TIME);
  }

  function slideOut(url) {
    if (stopped) return;
    box.classList.remove('in');
    box.classList.add('out');
    timer = setTimeout(() => { if (!stopped) slideIn(url); }, EXIT_TIME);
  }

  function cycle(url) {
    if (stopped || !list.length) return;
    slideIn(url);
  }

  function start(data) {
    list = data.reviews || [];
    if (!list.length) return;
    setTimeout(() => cycle(data.place.url), FIRST_DELAY);
  }

  if (API_KEY) {
    fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=he&fields=googleMapsUri,reviews&key=${API_KEY}`)
      .then(r => r.json())
      .then(d => start({
        place: { url: d.googleMapsUri },
        reviews: (d.reviews || []).map(r => ({
          author: r.authorAttribution?.displayName || '',
          photo: r.authorAttribution?.photoUri || '',
          rating: r.rating,
          when: r.relativePublishTimeDescription || '',
          text: r.originalText?.text || r.text?.text || ''
        }))
      }))
      .catch(() => start(REVIEWS));
  } else {
    start(REVIEWS);
  }
})();
