/* ============================================================
   תוסף נגישות — כפתור צף, לוח הגדרות, והעדפות שנשמרות
   ============================================================ */

const A11Y_KEY = 'hitbox-a11y';
const ZOOM_STEPS = [1, 1.15, 1.3, 1.5];

const OPTIONS = [
  { id: 'zoom',      label: 'הגדלת טקסט',        type: 'steps' },
  { id: 'contrast',  label: 'ניגודיות גבוהה',     type: 'toggle' },
  { id: 'grayscale', label: 'גווני אפור',         type: 'toggle' },
  { id: 'invert',    label: 'היפוך צבעים',        type: 'toggle' },
  { id: 'links',     label: 'הדגשת קישורים',      type: 'toggle' },
  { id: 'still',     label: 'עצירת אנימציות',     type: 'toggle' },
  { id: 'cursor',    label: 'סמן גדול',           type: 'toggle' },
  { id: 'readable',  label: 'גופן קריא',          type: 'toggle' }
];

(function () {
  const state = Object.assign({ zoom: 0 }, readSaved());

  /* ---- הכפתור והלוח ---- */
  const btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'תפריט נגישות');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle cx="12" cy="3.8" r="2.1"/>' +
    '<path d="M20.4 7.4c.2.6-.1 1.2-.7 1.4l-4.2 1.2v3l1.9 6.6c.2.6-.2 1.2-.8 1.4-.6.2-1.2-.2-1.4-.8L13.5 14h-3l-1.7 6.2c-.2.6-.8 1-1.4.8-.6-.2-1-.8-.8-1.4L8.5 13v-3L4.3 8.8c-.6-.2-.9-.8-.7-1.4.2-.6.8-.9 1.4-.7L9.4 8h5.2l4.4-1.3c.6-.2 1.2.1 1.4.7z"/>' +
    '</svg>';

  const panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'הגדרות נגישות');
  panel.innerHTML =
    '<p class="a11y-title">נגישות</p>' +
    OPTIONS.map(o => o.type === 'steps'
      ? `<div class="a11y-row" data-id="${o.id}">
           <span>${o.label}</span>
           <span class="a11y-steps">
             <button type="button" data-act="minus" aria-label="הקטנת טקסט">−</button>
             <b class="a11y-lvl">0</b>
             <button type="button" data-act="plus" aria-label="הגדלת טקסט">+</button>
           </span>
         </div>`
      : `<button class="a11y-row a11y-toggle" type="button" data-id="${o.id}" aria-pressed="false">
           <span>${o.label}</span><i class="a11y-mark"></i>
         </button>`).join('') +
    '<button class="a11y-reset" type="button">איפוס הגדרות</button>' +
    '<a class="a11y-statement" href="#a11y-statement">הצהרת נגישות</a>';

  document.body.append(btn, panel);

  /* ---- החלה ---- */
  function apply() {
    const root = document.documentElement;
    OPTIONS.forEach(o => {
      if (o.type === 'toggle') root.classList.toggle('a11y-' + o.id, !!state[o.id]);
    });
    if (window.a11ySetZoom) window.a11ySetZoom(ZOOM_STEPS[state.zoom] || 1);
    panel.querySelector('.a11y-lvl').textContent = state.zoom;
    panel.querySelectorAll('.a11y-toggle').forEach(t =>
      t.setAttribute('aria-pressed', String(!!state[t.dataset.id])));
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(state)); } catch (e) { }
  }

  function readSaved() {
    try { return JSON.parse(localStorage.getItem(A11Y_KEY)) || {}; } catch (e) { return {}; }
  }

  /* ---- אירועים ---- */
  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('button').focus();
  });

  panel.addEventListener('click', e => {
    const toggle = e.target.closest('.a11y-toggle');
    if (toggle) { state[toggle.dataset.id] = !state[toggle.dataset.id]; return apply(); }

    const step = e.target.closest('[data-act]');
    if (step) {
      state.zoom = Math.max(0, Math.min(ZOOM_STEPS.length - 1,
        state.zoom + (step.dataset.act === 'plus' ? 1 : -1)));
      return apply();
    }

    if (e.target.closest('.a11y-reset')) {
      Object.keys(state).forEach(k => delete state[k]);
      state.zoom = 0;
      return apply();
    }
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#a11y-panel') && !e.target.closest('#a11y-btn'))
      panel.classList.remove('open');
  });

  apply();
})();
