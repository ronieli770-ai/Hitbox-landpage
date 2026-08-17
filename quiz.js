/* ============================================================
   שאלון ההתאמה — ארבע שאלות שמובילות לטופס
   כדי לערוך שאלה או תשובה: לשנות כאן בלבד.
   ============================================================ */

const QUESTIONS = [
  {
    key: 'goal',
    q: 'מה הכי מדבר אליך עכשיו?',
    a: ['לנסות ספורט חדש שלא ישעמם אותי',
        'להיכנס לכושר ולרדת במשקל',
        'לרכוש יכולות לחימה והגנה עצמית']
  },
  {
    key: 'experience',
    q: 'מתי בפעם האחרונה התאמנת באופן קבוע?',
    a: ['אני מתאמן באופן קבוע ורוצה לנסות משהו חדש',
        'היה פעם, נגמר לפני כמה שנים',
        'בכנות? אף פעם']
  },
  {
    key: 'branch',
    q: 'איזה סניף הכי נוח לך?',
    a: ['רמת גן', 'פתח תקווה', 'תל אביב - גבעתיים']
  },
  {
    key: 'time',
    q: 'מתי הכי מתאים לך להתאמן?',
    a: ['לפני העבודה', 'אחרי העבודה', 'בסופ״ש']
  }
];

(function () {
  const quiz = document.getElementById('quiz');
  if (!quiz) return;
  const head = quiz.querySelector('.q-head');
  const opts = quiz.querySelector('.q-opts');
  const back = quiz.querySelector('.q-back');
  const form = quiz.querySelector('.q-result');
  const sub = quiz.querySelector('.qr-sub');

  const answers = {};
  let i = 0;

  function paint() {
    const item = QUESTIONS[i];
    head.textContent = item.q;
    opts.innerHTML = item.a
      .map(t => `<button class="qopt" type="button">${t}</button>`).join('');
    back.hidden = i === 0;
  }

  /* החלפה רכה בין שאלות, כדי שהמעבר לא יקפוץ */
  function go(next) {
    quiz.classList.add('swap');
    setTimeout(() => {
      i = next;
      if (i >= QUESTIONS.length) finish();
      else { paint(); quiz.classList.remove('done'); }
      quiz.classList.remove('swap');
    }, 250);
  }

  function finish() {
    sub.textContent = `על בסיס התשובות שלך, מצאנו קבוצה מתאימה בסניף ${answers.branch}. ` +
      'תשאיר פרטים ונחזור אליך היום לקביעת אימון ניסיון.';
    /* כל התשובות נוסעות יחד עם הפרטים */
    form.querySelectorAll('input[type=hidden]').forEach(x => x.remove());
    for (const [k, v] of Object.entries(answers)) {
      const h = document.createElement('input');
      h.type = 'hidden'; h.name = k; h.value = v;
      form.appendChild(h);
    }
    back.hidden = false;
    quiz.classList.add('done');
  }

  /* מודדים פעם אחת את כפתור השליחה, ומקבעים שם את כפתור החזרה לכל אורך השאלון —
     כך הוא לא זז בין שאלה לשאלה ולא במעבר לטופס */
  function lockBack() {
    if (matchMedia('(max-width:820px)').matches) return;
    const wasDone = quiz.classList.contains('done');
    const wasHidden = back.hidden;
    quiz.style.visibility = 'hidden';
    quiz.classList.add('done');
    back.hidden = false;

    const submit = form.querySelector('.qr-submit');
    if (submit) {
      const qz = quiz.getBoundingClientRect();
      const sb = submit.getBoundingClientRect();
      const scale = qz.width / quiz.offsetWidth;   // הקנבס מוקטן, מחזירים ליחידות שלו
      back.style.right = 'auto';
      back.style.left = '0px';
      back.style.top = ((sb.bottom - qz.top) / scale - back.offsetHeight) + 'px';
    }

    back.hidden = wasHidden;
    if (!wasDone) {
      quiz.classList.remove('done');
      /* המיקום המחושב שייך למסך התוצאה. בזמן השאלות מנקים אותו
         כדי שהכפתור יחזור למקומו לפי העיצוב — בקצה הימני. */
      back.style.left = '';
      back.style.right = '';
      back.style.top = '';
    }
    quiz.style.visibility = '';
  }

  opts.addEventListener('click', e => {
    const b = e.target.closest('.qopt');
    if (!b) return;
    answers[QUESTIONS[i].key] = b.textContent.trim();
    go(i + 1);
  });

  back.addEventListener('click', () => {
    if (quiz.classList.contains('done')) {
      quiz.classList.remove('done');
      i = QUESTIONS.length;          // חוזרים מהטופס אל השאלה האחרונה
      go(QUESTIONS.length - 1);
    } else if (i > 0) {
      go(i - 1);
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const ph = form.querySelector('[name=phone]');
    if (ph && /[^\d+]/.test(ph.value.trim())) {
      let note = form.querySelector('.phone-err');
      if (!note) {
        note = document.createElement('p');
        note.className = 'phone-err';
        note.setAttribute('role', 'alert');
        ph.insertAdjacentElement('afterend', note);
      }
      note.textContent = 'כמעט. מספר הטלפון צריך להיכתב בלי מקפים ובלי רווחים — תקן ונשלח.';
      ph.focus();
      return;
    }
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log('פרטי הליד:', data);   // כאן יתחבר היעד בפועל
    location.href = 'thanks.html?goal=' + encodeURIComponent(answers.goal || '');
  });

  paint();
  lockBack();
  addEventListener('load', lockBack);   // שוב אחרי טעינת הפונטים
})();
