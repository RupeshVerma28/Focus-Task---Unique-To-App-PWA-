# Focus Tasks - Focus-First To-Do PWA 🎯

> **A productivity app that doesn't just organize tasks — it helps you actually complete them.**

Focus Tasks is a Progressive Web App designed around a simple principle: **the best to-do list is the one that keeps you focused on doing, not organizing**. Unlike traditional task managers that overwhelm you with features, Focus Tasks combines task management with dedicated focus timers in an immersive, distraction-free experience.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](http://localhost:5173)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-enabled-blueviolet)](https://web.dev/progressive-web-apps/)

![Focus Tasks Banner](./docs/banner.png)

## 🌟 What Makes Focus Tasks Different?

### The Problem with Traditional To-Do Apps

Most task management apps suffer from the same issues:
- **Feature Overload**: Tags, priorities, projects, subtasks, reminders — so many options you spend more time organizing than doing
- **Scattered Focus**: Your task list competes with timers, widgets, and notifications
- **No Accountability**: You can mark tasks complete without actually working on them
- **Distraction-Prone**: Constantly switching between timer apps and task lists breaks flow state

### The Focus Tasks Approach

**1. Full-Screen Timer Experience**
- Click "Start Timer" on any task → Instant full-screen focus mode
- Large, prominent timer display keeps you in the moment
- Dark, minimal interface eliminates visual distractions
- Timer continues running even when you close the view

**2. Time-Tracked Productivity**
- Every task has an integrated focus timer
- See exactly how much time you've invested in each task
- Daily statistics show total focus time and completed tasks
- Historical data reveals your productivity patterns

**3. Distraction-Free Design**
- No cluttered interfaces or feature bloat
- Clean, dark theme optimized for extended focus sessions
- Smooth animations that guide, never distract
- Mobile-first design for on-the-go focus

**4. Quick Task Capture**
- Add new tasks directly from the timer view
- Never break focus to switch contexts
- Capture thoughts immediately before they're forgotten
- Timer keeps running — no interruptions

**5. Genuine Offline-First**
- Works completely offline — no internet required
- All data stored locally (IndexedDB)
- Install as native app on any device
- Your data stays private, on your device

## ✨ Key Features

### 🎯 Full-Screen Focus Mode
Transform any task into a dedicated focus session with one click. The full-screen timer provides:
- **Immersive Timer Display**: Large, readable time tracking (HH:MM:SS)
- **Complete Controls**: Pause, resume, stop, or mark complete
- **Persistent State**: Timer runs in background when you navigate away
- **Quick Access**: Close and reopen timer without losing progress

### 📝 Smart Task Management
- **Add, Edit, Delete**: Standard task operations done right
- **Inline Editing**: Edit titles and descriptions on the fly
- **Completion Tracking**: Mark tasks done with time automatically saved
- **Clean Cards**: Minimal design shows what matters

### 📊 Daily Statistics
- **Total Focus Time**: See how long you've worked today
- **Completed Tasks**: Track accomplishments, not just intentions
- **Task Breakdown**: Detailed time spent per task
- **Real-Time Updates**: Stats refresh as you work

### 📅 Historical Insights
- **Daily Archives**: Automatic midnight data archival
- **Long-Term Tracking**: Review past performance
- **Expandable Details**: Dive into any day's task breakdown
- **Motivation Tool**: See your consistency over time

### 💾 True Offline PWA
- **Install Anywhere**: Works on Desktop, iOS, Android
- **No Internet Needed**: Functions completely offline
- **Fast & Reliable**: Cached assets, instant loading
- **Private Storage**: All data stays on your device

## 🎨 Design Philosophy

### Focus Through Simplicity

**Dark, Professional Theme**
- Deep blue-black backgrounds reduce eye strain
- High-contrast text ensures readability
- Purple accent color guides attention
- Consistent spacing creates calm

**Purposeful Animations**
- Smooth transitions between states
- Subtle feedback for actions
- Breathing timer display
- Never gratuitous, always functional

**Mobile-First Approach**
- Touch-optimized interfaces
- Large tap targets (44px minimum)
- Responsive layouts
- Thumb-friendly navigation

## 🚀 Getting Started

### Installation

#### As Progressive Web App (Recommended)

**Desktop (Chrome/Edge):**
1. Visit the app URL
2. Click the install icon in address bar
3. Click "Install" in the prompt
4. App opens as standalone window

**Mobile (iOS/Android):**
1. Open app in browser
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

#### Local Development

```bash
# Clone repository
git clone https://github.com/RupeshVerma28/Focus-Task---Unique-To-App-PWA-.git
cd Focus-Task---Unique-To-App-PWA-

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Steps

1. **Add Your First Task**
   - Type task name in the input
   - Press Enter or click "Add Task"

2. **Start Focusing**
   - Click "Start Timer" on any task
   - Full-screen timer opens
   - Begin working

3. **Track Your Progress**
   - Check daily stats via menu
   - Review history over time
   - Stay motivated by data

## 🧠 How Focus Tasks Improves Concentration

### 1. **Reduces Decision Fatigue**
Traditional apps force constant decisions: "What priority? Which tag? What project?" Focus Tasks asks one question: "What are you working on RIGHT NOW?"

### 2. **Enforces Single-Tasking**
The full-screen timer physically blocks multitasking. You can't see your task list, email, or social media. Just you, the timer, and the task.

### 3. **Creates Accountability**
Timers don't lie. You can't mark a 5-hour task complete after 10 minutes. The time tracking keeps you honest and aware.

### 4. **Builds Flow State**
By eliminating interface clutter and context-switching, Focus Tasks helps you reach and maintain flow — that sweet spot where work feels effortless.

### 5. **Provides Immediate Feedback**
Real-time stats show you're making progress. Seeing focus time accumulate is incredibly motivating.

### 6. **Respects Your Attention**
No notifications. No badges. No "streaks" to manipulate you. The app serves you, not the other way around.

## 🛠️ Technology Stack

- **Framework**: React 18 (Functional components + Hooks)
- **Build Tool**: Vite 7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data**: IndexedDB (via idb)
- **PWA**: Vite Plugin PWA + Workbox
- **Styling**: CSS Custom Properties

## 📦 Project Structure

```
Focus-Task-PWA/
├── public/
│   └── icons/              # PWA icons (192x192, 512x512)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Top navigation
│   │   ├── Drawer.jsx      # Side menu
│   │   ├── TaskCard.jsx    # Individual task card
│   │   ├── FullScreenTimer.jsx  # Focus mode timer
│   │   ├── StatsPanel.jsx  # Daily statistics
│   │   └── HistoryView.jsx # Historical data
│   ├── db/
│   │   └── db.js           # IndexedDB operations
│   ├── utils/
│   │   └── timeUtils.js    # Time formatting helpers
│   ├── App.jsx             # Main app logic
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles & theme
├── index.html
├── vite.config.js          # Vite + PWA config
└── package.json
```

## 🎯 Use Cases

### For Students
- **Study Sessions**: Track time spent per subject
- **Project Work**: Stay focused on assignments
- **Exam Prep**: Build consistent study habits

### For Developers
- **Deep Work**: Code without context-switching
- **Bug Fixing**: Track time per issue
- **Learning**: Focus on documentation/tutorials

### For Writers
- **Writing Blocks**: Dedicated writing time
- **Research**: Separate research from writing
- **Editing**: Time-boxed revision sessions

### For Anyone Who Struggles to Focus
- **ADHD-Friendly**: Minimal interface, maximum focus
- **Pomodoro Technique**: Perfect for timed work intervals
- **Habit Building**: See your focus time grow daily

## 🔒 Privacy & Data

**100% Local, 100% Private**
- All data stored in browser's IndexedDB
- No server, no cloud sync, no tracking
- No account required
- No analytics or telemetry
- Your tasks never leave your device

**Data Portability**
- Export coming soon
- Browser data management tools work
- Clear data via browser settings

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 💬 Feedback

Found a bug? Have a feature request? [Open an issue](https://github.com/RupeshVerma28/Focus-Task---Unique-To-App-PWA-/issues)

---

**Built with 💜 for people who want to do more, not plan more.**

*Focus Tasks - Where productivity meets simplicity.*
