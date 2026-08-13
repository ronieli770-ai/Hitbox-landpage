/* ============================================================
   תפריטי הבחירה בטופס — מעוצבים, לא ברירת המחדל של הדפדפן
   ============================================================ */

(function () {
  const sels = [...document.querySelectorAll('.sel')];
  if (!sels.length) return;

  sels.forEach(sel => {
    const val = sel.querySelector('.sel-val');
    const items = [...sel.querySelectorAll('.sel-list li')];

    /* שדה נסתר שנושא את הערך, כדי שהטופס יישלח כרגיל */
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = sel.dataset.name;
    sel.appendChild(hidden);

    const close = () => sel.classList.remove('open');

    sel.addEventListener('click', e => {
      const li = e.target.closest('li');
      if (li) {
        items.forEach(x => x.classList.toggle('on', x === li));
        val.textContent = li.textContent;
        val.classList.remove('ph');
        hidden.value = li.textContent.trim();
        close();
        return;
      }
      // רק תפריט אחד פתוח בכל רגע
      const wasOpen = sel.classList.contains('open');
      sels.forEach(s => s.classList.remove('open'));
      sel.classList.toggle('open', !wasOpen);
    });

    sel.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel.click(); }
      if (e.key === 'Escape') close();
    });
    sel.addEventListener('blur', () => setTimeout(close, 120));
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.sel')) sels.forEach(s => s.classList.remove('open'));
  });
})();

/* ---- הטופס התחתון: שליחה מפנה לעמוד התודה עם הסיבה שנבחרה ---- */
(function () {
  const btn = [...document.querySelectorAll('.field')]
    .find(el => el.tagName === 'BUTTON' && el.textContent.includes('אימון ניסיון'));
  if (!btn) return;

  btn.addEventListener('click', () => {
    const val = n => (document.querySelector(`[name="${n}"]`) || {}).value || '';
    if (!val('name').trim() || !val('phone').trim()) {
      alert('צריך שם וטלפון כדי שנוכל לחזור אליך.');
      return;
    }
    console.log('פרטי הליד:', {
      name: val('name'), phone: val('phone'),
      branch: val('branch'), goal: val('goal')
    });   // כאן יתחבר היעד בפועל
    location.href = 'thanks.html?goal=' + encodeURIComponent(val('goal'));
  });
})();
