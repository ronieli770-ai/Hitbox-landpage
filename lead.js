/* ---------- שליחת לידים ----------
   הפרטים נשלחים לנקודת קצה באתר, והיא מעבירה ל-Make ומשם ל-CRM.
   דרך השרת ולא ישירות, כדי שכתובת הוובהוק לא תיחשף בקוד המקור.

   פרמטרי הקמפיין נלכדים מהכתובת בכניסה ונשמרים לאורך הביקור, אחרת
   הם אובדים ברגע שהגולש עובר בין מסכי השאלון. */
const LEAD_ENDPOINT = '/wp-json/hitbox/v1/lead';
const TRACK_KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'];

function leadTracking() {
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('hbx_track') || '{}'); } catch (e) { }
  const q = new URLSearchParams(location.search);
  let changed = false;
  TRACK_KEYS.forEach(k => {
    const v = q.get(k);
    if (v && !saved[k]) { saved[k] = v; changed = true; }
  });
  if (changed) { try { sessionStorage.setItem('hbx_track', JSON.stringify(saved)); } catch (e) { } }
  return saved;
}

/* הגולש ממשיך לדף התודה בלי להמתין לתשובת השרת — הליד נשמר בצד
   השרת בכל מקרה, ואין סיבה להשהות אותו בגלל רשת איטית. */
function sendLead(data) {
  const body = JSON.stringify(Object.assign({
    page_name: document.title,
    page_url: location.href
  }, leadTracking(), data));

  if (navigator.sendBeacon) {
    navigator.sendBeacon(LEAD_ENDPOINT, new Blob([body], { type: 'application/json' }));
    return Promise.resolve();
  }
  return fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true
  }).catch(() => { });
}
