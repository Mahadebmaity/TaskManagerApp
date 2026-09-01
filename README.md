# 🚀 Your task — Smart Task Intelligence & Deep Work Workspace

<div align="center">

![Your task Banner](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge&logo=rocket)
![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-violet?style=for-the-badge)

<p align="center">
  <strong>An intelligent, high-performance productivity ecosystem combining natural language AI task parsing, drag-and-drop Kanban workflows, Zen Pomodoro timers, and an in-app Admin CMS.</strong>
</p>

[✨ Live Features](#-key-features) • [🛡️ Admin Portal](#-admin-cms--credentials) • [🌐 Bilingual Tour](#-interactive-bilingual-tour) • [💻 Getting Started](#-getting-started) • [👨‍💻 Creator](#-creator--developer)

</div>

---

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#-technology-stack)
- [🛡️ Admin CMS & Credentials](#-admin-cms--credentials)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Directory Structure](#-project-directory-structure)
- [👨‍💻 Creator & Developer](#-creator--developer)
- [📄 License](#-license)

---

## 🌟 Overview

**Your task** is a modern task management and deep-work platform built for developers, students, and busy professionals. It solves the friction of traditional task managers by combining zero-friction natural language input, visual Kanban project staging, ambient focus sprints, and comprehensive analytics.

---

## ✨ Key Features

### 1. 🧠 AI Natural Language Task Creation
- **Smart Parsing:** Type your stream of thought (e.g. `Finish quarterly review tomorrow at 4pm #work !high ~45m`).
- **Automatic Extraction:** Automatically detects **due dates**, **times**, **hashtags**, **duration estimates**, and **priority levels**.
- **Real-Time Typo Spellchecker:** Suggests live spelling corrections on common keywords (`tomorow` ➔ `tomorrow`, `priorty` ➔ `priority`).
- **🪄 AI Formalizer & Subtask Generator:** Cleans up messy raw thoughts and breaks complex projects into 3 actionable subtasks with a single click.

### 2. 📋 4-in-1 Adaptive Workspace Views
- **Kanban Board:** Multi-column workflow stages (`To Do`, `In Progress`, `Under Review`, `Completed`) with HTML5 Drag-and-Drop and dynamic content-adaptive card heights.
- **Interactive List View:** Rapid inline task editing, drag-and-drop reordering grip handles, **1-tap priority cyclers** (`HIGH ➔ MEDIUM ➔ LOW`), and creation timestamp indicators (`20m ago`).
- **Productivity Analytics & Eisenhower Matrix:** Interactive quadrant chart, XP points, focus minutes tracker, and streak metrics.
- **🕒 Deleted Tasks History Archive:** Dedicated recycle view storing all deleted tasks with **exact creation time**, **deletion time**, relative time ago (`Created 2h ago · Deleted 5m ago`), and **1-Click ♻️ Restore** back to active workspace!

### 3. ⏱️ Zen Focus Pomodoro Engine
- **Multi-Mode Sprints:** Focus (25m), Short Break (5m), and Long Break (15m).
- **Mutual Exclusivity:** Enforces single active session discipline (starting a break automatically pauses work).
- **Ambient Navbar Beacon:** Ticks live in the top navigation bar with a rhythmic breathing glow and shimmer.
- **Reload Protection:** Browser `beforeunload` warning prevents accidental timer disruption and preserves remaining seconds in `localStorage`.
- **Celebration Alarm:** 4-tone melodic chime + full-screen canvas confetti upon completion.

### 4. 🔦 Interactive Spotlight Tour (English & Bengali)
- **SVG Cutout Spotlight:** Darkens the background while spotlighting key UI buttons with a pulsing neon halo.
- **Smart Non-Overlapping Tooltips:** Automatically positions cards above or below highlighted elements so the target remains 100% visible.
- **🌐 Bilingual Toggle:** Instant switching between **English (`EN`)** and **Bengali (`বাংলা`)** with full native translations.
- **Replayable Anytime:** Accessible via the `?` icon in the Navbar or footer link.

### 5. 🚪 Unified User Entrance & Name Onboarding
- **First-Time Greeting:** Prompts visitors for their name upon first arrival.
- **Personalized Header:** Welcomes users dynamically (`👋 Hi, Alex`).
- **Automatic Registration:** Seamlessly logs visitors into the Admin User Registry.
- **Immediate Tour Trigger:** Launches the feature walkthrough directly after registration.

### 6. 🛡️ Protected Admin CMS & Developer Profile Manager
- **Secure Password Protection:** Private admin portal for workspace owner.
- **👥 Registered Users Tracker:** View all users who have joined, their last active time, and activity records.
- **🌐 Footer & Profile CMS:** Edit developer display name, role, initials, bio, and customize social connection links (LinkedIn, GitHub, Facebook, Twitter/X, Email, Custom Websites) with real-time live preview.
- **📊 Workspace Telemetry:** Live counters for total registered users, tasks created, and completion rates.

### 7. 🎵 Tactile Web Audio FX & Gamification
- **Zero-Dependency Audio Engine:** Generates synthesized click pops, completion chimes, and alarms directly via the Web Audio API.
- **XP & Streaks:** Earn +50 XP per completed task with animated level milestones.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Component architecture with hooks & state management |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Lightning-fast development & optimized production bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern glassmorphism, responsive grid & animations |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern, clean vector icons |
| **Sound FX** | Web Audio API | Client-side synthesized audio effects |
| **Celebration FX** | Canvas Confetti | Confetti burst upon goal achievement |
| **Persistence** | LocalStorage API | Local client-side state, user registry, and timer storage |

---

## 🛡️ Admin CMS & Credentials

To access the private Admin Management Dashboard:

1. Open the website or click **`Manage ✏️`** on the developer card in the footer.
2. In the Welcome / Login modal, switch to the **`Admin Portal`** tab.
3. Enter your configured credentials:

| Field | Configured Value |
| :--- | :--- |
| **Admin Name / Username** | `Mahadeb Maity` |
| **Admin Password** | `Maity@12345` |

> 🔒 *Admin credentials can also be changed inside the Security Settings tab of the Admin CMS.*

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- `npm` or `yarn` or `pnpm`

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Mahadeb-Maity/TaskManager.git

# 2. Navigate into the project folder
cd TaskManager

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Building for Production

```bash
# Compile and optimize assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Directory Structure

```text
TaskManager/
├── public/
├── src/
│   ├── components/
│   │   ├── AdminCMSModal.jsx        # Protected Admin CMS Dashboard & user tracker
│   │   ├── AnalyticsView.jsx        # Eisenhower Matrix & productivity charts
│   │   ├── FocusTimer.jsx           # Zen Pomodoro modal with sound & durations
│   │   ├── Footer.jsx               # Developer profile, social chips & CMS trigger
│   │   ├── KanbanBoard.jsx          # Drag-and-drop workflow stage columns
│   │   ├── ListView.jsx             # 1-tap priority cycler & drag reordering
│   │   ├── Logo.jsx                 # Dynamic gradient brand mark
│   │   ├── Navbar.jsx               # Responsive header, search & live timer beacon
│   │   ├── OnboardingTour.jsx       # 8-step bilingual spotlight tour (EN / BN)
│   │   ├── SmartTaskInput.jsx       # AI Natural Language parser & spellchecker
│   │   ├── TaskModal.jsx            # Detailed task creation & editing drawer
│   │   └── UserWelcomeModal.jsx     # Dual user entrance & admin login modal
│   ├── utils/
│   │   ├── aiEngine.js              # AI subtask generator & formalizer
│   │   ├── effects.js               # Web Audio synthesizer & confetti
│   │   ├── nlpParser.js             # Date, time, tag & priority NLP extractor
│   │   └── storage.js               # LocalStorage state persistence
│   ├── App.jsx                      # Root application & state orchestrator
│   ├── index.css                    # Design tokens, neon pulses & glassmorphism
│   └── main.jsx                     # React DOM entrypoint
├── index.html                       # HTML template with SEO tags & fonts
├── package.json                     # Dependencies and scripts
└── vite.config.js                   # Vite configuration
```

---

## 👨‍💻 Creator & Developer

**Mahadeb Maity**  
*Full-Stack Web Developer & UI Engineer*

- 💼 **LinkedIn:** [linkedin.com/in/mahadeb-maity](https://www.linkedin.com/in/mahadeb-maity/)
- 🐙 **GitHub:** [github.com/Mahadeb-Maity](https://github.com/Mahadeb-Maity)
- ✉️ **Email:** [mahadebmaity.dev@gmail.com](mailto:mahadebmaity.dev@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<div align="center">
  <sub>Crafted with ❤️ and precision by <strong>Mahadeb Maity</strong></sub>
</div>
#   T a s k M a n a g e r A p p  
 