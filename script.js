/* ============================================================
   STOPWATCH TIMER — script.js
   Structure:
   1. DOM References
   2. State
   3. Timer Core
   4. Display
   5. Lap Manager
   6. Button State Manager
   7. Theme Manager
   8. Event Listeners — Buttons
   9. Event Listeners — Keyboard
============================================================ */


/* ============================================================
   1. DOM REFERENCES
============================================================ */
const hoursEl      = document.getElementById('hours');
const minutesEl    = document.getElementById('minutes');
const secondsEl    = document.getElementById('seconds');
const msEl         = document.getElementById('milliseconds');
const timerDisplay = document.getElementById('timerDisplay');
const statusDot    = document.getElementById('statusIndicator');

const startBtn     = document.getElementById('startBtn');
const stopBtn      = document.getElementById('stopBtn');
const lapBtn       = document.getElementById('lapBtn');
const resetBtn     = document.getElementById('resetBtn');

const themeToggle  = document.getElementById('themeToggle');
const themeIcon    = document.getElementById('themeIcon');

const lapSection   = document.getElementById('lapSection');
const lapList      = document.getElementById('lapList');
const lapCountEl   = document.getElementById('lapCount');


/* ============================================================
   2. STATE
   All mutable values live here — never scattered as globals.
============================================================ */
const state = {
  intervalId:    null,    // holds the setInterval reference
  isRunning:     false,   // true while the timer is ticking
  startTime:     0,       // timestamp when the timer last started
  elapsed:       0,       // total ms accumulated before last stop
  lapCount:      0,       // number of laps recorded
  lastLapElapsed: 0,      // elapsed ms at the time of the last lap
};


/* ============================================================
   3. TIMER CORE
============================================================ */

/**
 * Start or resume the stopwatch.
 * Uses Date.now() as the reference so elapsed time stays
 * accurate even if the interval fires slightly late.
 */
function startTimer() {
  if (state.isRunning) return; // guard against double-starts

  state.startTime = Date.now() - state.elapsed;
  state.intervalId = setInterval(tick, 10); // update every 10ms for ms precision
  state.isRunning = true;

  timerDisplay.classList.add('is-running');
  statusDot.classList.add('is-running');
  updateButtons();
}

/**
 * Pause the stopwatch.
 * Saves the current elapsed so it can be resumed later.
 */
function stopTimer() {
  if (!state.isRunning) return;

  clearInterval(state.intervalId);
  state.intervalId = null;
  state.elapsed = Date.now() - state.startTime;
  state.isRunning = false;

  timerDisplay.classList.remove('is-running');
  statusDot.classList.remove('is-running');
  updateButtons();
}

/**
 * Reset everything back to zero.
 */
function resetTimer() {
  clearInterval(state.intervalId);
  state.intervalId    = null;
  state.isRunning     = false;
  state.elapsed       = 0;
  state.startTime     = 0;
  state.lapCount      = 0;
  state.lastLapElapsed = 0;

  timerDisplay.classList.remove('is-running');
  statusDot.classList.remove('is-running');

  renderDisplay(0);
  clearLaps();
  updateButtons();
}

/**
 * Called on every interval tick.
 * Calculates current elapsed and pushes it to the display.
 */
function tick() {
  const now = Date.now() - state.startTime;
  renderDisplay(now);
}


/* ============================================================
   4. DISPLAY
============================================================ */

/**
 * Breaks total milliseconds into HH, MM, SS, MS
 * and writes them to the DOM.
 *
 * @param {number} totalMs - total elapsed milliseconds
 */
function renderDisplay(totalMs) {
  const ms      = Math.floor((totalMs % 1000) / 10); // 00–99
  const seconds = Math.floor(totalMs / 1000) % 60;
  const minutes = Math.floor(totalMs / 60000) % 60;
  const hours   = Math.floor(totalMs / 3600000);

  hoursEl.textContent   = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
  msEl.textContent      = pad(ms);
}

/**
 * Pads a number to always be at least 2 digits.
 * e.g. 4 → "04", 12 → "12"
 *
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Returns a formatted time string for lap entries.
 * e.g. "01:23:45.07"
 *
 * @param {number} totalMs
 * @returns {string}
 */
function formatTime(totalMs) {
  const ms      = Math.floor((totalMs % 1000) / 10);
  const seconds = Math.floor(totalMs / 1000) % 60;
  const minutes = Math.floor(totalMs / 60000) % 60;
  const hours   = Math.floor(totalMs / 3600000);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms)}`;
}


/* ============================================================
   5. LAP MANAGER
============================================================ */

/**
 * Records the current time as a lap.
 * Calculates the delta (time since last lap) for context.
 * Newest lap appears at the top of the list.
 */
function recordLap() {
  if (!state.isRunning) return;

  const currentElapsed = Date.now() - state.startTime;
  const delta = currentElapsed - state.lastLapElapsed;

  state.lapCount++;
  state.lastLapElapsed = currentElapsed;

  // Show the lap section the first time
  if (state.lapCount === 1) {
    lapSection.hidden = false;
  }

  lapCountEl.textContent = state.lapCount;

  const item = buildLapItem(state.lapCount, currentElapsed, delta);

  // Prepend so newest lap is always at the top
  lapList.insertBefore(item, lapList.firstChild);
}

/**
 * Builds and returns a single lap list item element.
 *
 * @param {number} index       - lap number
 * @param {number} totalMs     - total elapsed at lap time
 * @param {number} deltaMs     - time since previous lap
 * @returns {HTMLLIElement}
 */
function buildLapItem(index, totalMs, deltaMs) {
  const li = document.createElement('li');
  li.className = 'lap-item';

  const indexEl = document.createElement('span');
  indexEl.className = 'lap-index';
  indexEl.textContent = `Lap ${index}`;

  const timeEl = document.createElement('span');
  timeEl.className = 'lap-time';
  timeEl.textContent = formatTime(totalMs);

  const deltaEl = document.createElement('span');
  deltaEl.className = 'lap-delta';
  deltaEl.textContent = `+${formatTime(deltaMs)}`;

  li.appendChild(indexEl);
  li.appendChild(timeEl);
  li.appendChild(deltaEl);

  return li;
}

/**
 * Removes all lap entries and hides the lap section.
 */
function clearLaps() {
  lapList.innerHTML = '';
  lapCountEl.textContent = '0';
  lapSection.hidden = true;
}


/* ============================================================
   6. BUTTON STATE MANAGER
   Centralises all disabled/enabled logic in one place.
   The rest of the code never touches button.disabled directly.
============================================================ */

/**
 * Updates button enabled/disabled states based on current timer state.
 * Called every time the timer starts, stops, or resets.
 */
function updateButtons() {
  const running = state.isRunning;
  const hasTime = state.elapsed > 0;

  startBtn.disabled = running;
  stopBtn.disabled  = !running;
  lapBtn.disabled   = !running;
  resetBtn.disabled = running || (!running && !hasTime);

  // Update Start button label to reflect resume context
  startBtn.textContent = (!running && hasTime) ? 'Resume' : 'Start';
}


/* ============================================================
   7. THEME MANAGER
============================================================ */

/**
 * Toggles between dark and light theme.
 * Persists the user's choice in localStorage.
 */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';

  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);

  // Update toggle icon
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';

  localStorage.setItem('sw-theme', next);
}

/**
 * Reads saved theme from localStorage on page load.
 * Falls back to dark if nothing is saved.
 */
function loadSavedTheme() {
  const saved = localStorage.getItem('sw-theme');
  if (saved && saved !== 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
    themeIcon.textContent = '🌙';
  }
}


/* ============================================================
   8. EVENT LISTENERS — BUTTONS
============================================================ */
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetTimer);
themeToggle.addEventListener('click', toggleTheme);


/* ============================================================
   9. EVENT LISTENERS — KEYBOARD SHORTCUTS
   Space → Start / Stop
   R     → Reset
   L     → Lap
   D     → Toggle Theme
============================================================ */
document.addEventListener('keydown', (e) => {
  // Ignore shortcuts when user is typing in an input field
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key) {
    case ' ':
      e.preventDefault(); // prevent page scroll
      state.isRunning ? stopTimer() : startTimer();
      break;

    case 'r':
    case 'R':
      if (!resetBtn.disabled) resetTimer();
      break;

    case 'l':
    case 'L':
      if (!lapBtn.disabled) recordLap();
      break;

    case 'd':
    case 'D':
      toggleTheme();
      break;
  }
});


/* ============================================================
   INIT
============================================================ */
loadSavedTheme();
updateButtons();
