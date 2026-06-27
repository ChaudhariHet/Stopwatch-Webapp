# ⏱ Stopwatch Timer

A minimal, elegant, and fully responsive Stopwatch Timer web application built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no libraries.

---

## 📸 Screenshots

> _Add screenshots here after running the project locally._

| Dark Mode | Light Mode |
|-----------|------------|
| ![Dark Mode Screenshot](screenshots/dark.png) | ![Light Mode Screenshot](screenshots/light.png) |

---

## ✨ Features

- **Start / Stop / Resume** — Pause and continue from exactly where you left off
- **Reset** — Instantly clears the timer and all recorded laps
- **Lap Timer** — Record unlimited laps with delta time shown per lap
- **Millisecond Precision** — Timer displays `HH : MM : SS . MS` in real time
- **Dark / Light Mode** — Smooth animated theme toggle, preference saved across sessions
- **Keyboard Shortcuts** — Full keyboard control for power users
- **Responsive Layout** — Works cleanly on desktop, tablet, and mobile
- **Accurate Timing** — Uses `Date.now()` wall-clock approach — no interval drift
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigation, focus indicators

---

## 🛠 Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 | Styling, theming, animations, responsive layout |
| Vanilla JavaScript | Timer logic, DOM manipulation, event handling |

> No frameworks. No libraries. No dependencies.

---

## 📁 Folder Structure

```
Stopwatch-App/
│
├── index.html       ← Semantic HTML structure
├── style.css        ← All styling, themes, animations
├── script.js        ← All timer logic and interactions
└── README.md        ← Project documentation
```

---

## ⚙️ Installation

No installation required. This is a pure front-end project with zero dependencies.

**Clone the repository:**

```bash
git clone https://github.com/your-username/stopwatch-app.git
cd stopwatch-app
```

---

## ▶️ How to Run

**Option 1 — Open directly in browser:**

```
Double-click index.html
```

**Option 2 — Use VS Code Live Server:**

1. Open the project folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**

**Option 3 — Use a local HTTP server:**

```bash
# Python 3
python -m http.server 3000

# Then open: http://localhost:3000
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / Pause the timer |
| `R` | Reset the timer |
| `L` | Record a lap |
| `D` | Toggle Dark / Light mode |

---

## 🧠 How It Works

### Accurate Timing

Instead of incrementing a counter every second (which drifts), the app records the wall-clock time at start:

```js
state.startTime = Date.now() - state.elapsed;
```

On every tick, elapsed time is computed from real time:

```js
const now = Date.now() - state.startTime;
```

This keeps the display accurate even if the browser delays an interval tick.

### Theme System

All colors are defined as CSS custom properties under `[data-theme="dark"]` and `[data-theme="light"]`. Toggling the theme is a single attribute flip on `<html>`:

```js
document.documentElement.setAttribute('data-theme', 'light');
```

Every color in the UI transitions smoothly via CSS `transition` properties.

---

## 🌐 Live Demo

> [Live Demo Link](https://chaudharihet.github.io/Stopwatch-Webapp/) — _Add your deployed link here (GitHub Pages / Netlify / Vercel)_

---

## 📦 GitHub Repository

> [GitHub Repository Link](https://github.com/ChaudhariHet/Stopwatch-Webapp) — _Add your repository URL here_

---

## 🔮 Future Improvements

- [ ] Sound alert on each lap
- [ ] Export lap history as CSV
- [ ] Countdown Timer mode
- [ ] Custom accent color picker
- [ ] PWA support — install as a desktop / mobile app
- [ ] Animation for best / worst lap highlighting

---

## 💡 Git Commit History (Suggested)

```
git commit -m "Initial project setup"
git commit -m "Build stopwatch UI layout and card"
git commit -m "Implement timer core with accurate Date.now() approach"
git commit -m "Add lap recording with delta time display"
git commit -m "Implement dark and light mode with CSS variables"
git commit -m "Add keyboard shortcuts for all controls"
git commit -m "Improve responsiveness for tablet and mobile"
git commit -m "Polish animations and button transitions"
git commit -m "Update README with full documentation"
```

---

## 👨‍💻 Author

> Built as an internship project submission.  
> Designed and developed with attention to code quality, accessibility, and UI polish.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
