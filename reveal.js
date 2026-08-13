/* ============================================================
   כניסת כותרות — עלייה מאחורי מסכה, שורה אחרי שורה
   ============================================================ */

const REVEAL_STEP = 110;   // מילישניות בין שורה לשורה
const REVEAL_AT = 0.88;    // מתי להדליק: חלק מגובה המסך שהכותרת צריכה לחצות

(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* הירו וכותרת הגריד מוחרגים: אחד רץ במיזוג difference והשנייה מתקזזת מול
     הגדלה של הכרטיס — מסכה תשבור את שניהם. */
  const heads = [...document.querySelectorAll('.h100')]
    .filter(el => !el.closest('#hero') && !el.classList.contains('vhead'));

  const pending = [];

  heads.forEach(el => {
    const lines = [...el.children].filter(c => c.tagName === 'P');
    const parts = lines.length ? lines : [el];

    parts.forEach((part, i) => {
      const mask = document.createElement('span');
      mask.className = 'rv-line';
      const inner = document.createElement('i');
      /* מעבירים את התוכן פנימה בלי לגעת בו — הצבעים והספאנים נשמרים */
      while (part.firstChild) inner.appendChild(part.firstChild);
      mask.appendChild(inner);
      part.appendChild(mask);
      inner.style.setProperty('--d', (i * REVEAL_STEP) + 'ms');
    });

    el.classList.add('rv');
    pending.push(el);
  });

  /* אלמנטים שעולים מטשטוש — ההשהיה של כל אחד יושבת עליו ב---rd */
  pending.push(...document.querySelectorAll('.rise'));

  /* הקנבס מקובע ומונע ב-JS, ולכן נבדק כאן המלבן בפועל במקום להסתמך על
     IntersectionObserver, שתלוי בשרשרת ההורים ועלול לפספס. */
  window.revealTick = () => {
    if (!pending.length) return;
    const line = innerHeight * REVEAL_AT;
    for (let i = pending.length - 1; i >= 0; i--) {
      const r = pending[i].getBoundingClientRect();
      if (r.top < line && r.bottom > 0) {
        pending[i].classList.add('go');
        pending.splice(i, 1);
      }
    }
  };
})();
