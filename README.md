# ⚡ TaskManager — Smart Task Intelligence & Deep Work Ecosystem

<div align="center">

![TaskManager Banner](https://img.shields.io/badge/Status-Production%20Ready-10b981?style=for-the-badge&logo=rocket)
![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite 8](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Database-Firebase_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge)

<p align="center">
  <strong>An intelligent, high-performance task management and productivity workspace featuring AI-powered Natural Language Parsing, dynamic 4-in-1 workspace views, Zen Pomodoro deep work timers, real-time Cloud Database synchronization, and an in-app Admin CMS.</strong>
</p>

[✨ Live Features](#-key-features) • [☁️ Database Architecture](#-database-architecture--why-firebase) • [🛠️ Tech Stack](#️-technology-stack) • [🛡️ Admin Portal](#-admin-cms--credentials) • [🚀 Quick Start](#-getting-started) • [👨‍💻 Creator](#-creator--developer)

</div>

---

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
  - [1. AI Natural Language Task Creation](#1-ai-natural-language-task-creation)
  - [2. 4-in-1 Adaptive Workspace Views](#2-4-in-1-adaptive-workspace-views)
  - [3. Zen Focus Pomodoro Engine](#3-zen-focus-pomodoro-engine)
  - [4. Interactive Spotlight Tour (Bilingual EN / বাংলা)](#4-interactive-spotlight-tour-bilingual-en--বাংলা)
  - [5. Personalized User Onboarding](#5-personalized-user-onboarding)
  - [6. Protected Admin CMS & Developer Profile Manager](#6-protected-admin-cms--developer-profile-manager)
  - [7. Tactile Web Audio FX & Gamification](#7-tactile-web-audio-fx--gamification)
- [☁️ Database Architecture & Why Firebase](#-database-architecture--why-firebase)
  - [Why Firebase Cloud Firestore?](#-why-firebase-cloud-firestore-over-traditional-databases)
  - [Hybrid Offline-First Sync Workflow](#-hybrid-offline-first-sync-workflow)
  - [Database Environment Variables](#-database-environment-variables)
- [🛠️ Technology Stack](#️-technology-stack)
- [🛡️ Admin CMS & Credentials](#-admin-cms--credentials)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Directory Structure](#-project-directory-structure)
- [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts)
- [👨‍💻 Creator & Developer](#-creator--developer)
- [📄 License](#-license)

---

## 🌟 Overview

**TaskManager** is designed from the ground up to eliminate task management friction. Instead of navigating tedious forms and endless dropdowns, users can rapidly dump raw thoughts using natural language, organize tasks effortlessly across multiple interactive visual boards, enter hyper-focus states with built-in ambient Pomodoro timers, and sync data seamlessly across multiple devices through a robust cloud database.

---

## ✨ Key Features

### 1. 🧠 AI Natural Language Task Creation
- **Smart Stream-of-Thought Parsing:** Simply type `Submit quarterly report tomorrow at 4pm #work !high ~45m`.
- **Automatic Extraction:** Detects and structures **due dates**, **target times**, **tags/categories**, **estimated durations**, and **priority flags** automatically.
- **Real-Time Typo Spellchecker:** Dynamic suggestions fix common task keywords on the fly (`tomorow` ➔ `tomorrow`, `priorty` ➔ `priority`).
- **🪄 AI Formalizer & Subtask Generator:** Cleans unformatted thoughts into professional task descriptions and generates 3 actionable subtasks with a single click.

### 2. 📋 4-in-1 Adaptive Workspace Views
- **Kanban Board:** 4-stage workflow pipeline (`To Do`, `In Progress`, `Under Review`, `Completed`) with smooth HTML5 drag-and-drop mechanics and responsive column cards.
- **Interactive List View:** Rapid inline editing, drag-and-drop reordering grip handles, **1-tap priority cycler** (`HIGH` ➔ `MEDIUM` ➔ `LOW`), and relative creation timestamps.
- **Productivity Analytics & Eisenhower Matrix:** Interactive 4-quadrant urgency matrix, XP telemetry, focus time distribution, and task completion velocity metrics.
- **🕒 Deleted Tasks History Archive:** Dedicated recycle archive tracking **creation timestamps**, **deletion timestamps**, relative time labels (`Created 2h ago · Deleted 5m ago`), with **1-Click ♻️ Restore** back to the active workspace.

### 3. ⏱️ Zen Focus Pomodoro Engine
- **Dedicated Sprint Modes:** Focus (25m), Short Break (5m), and Long Break (15m) with customizable duration presets.
- **Synthesized Ambient Noise:** Optional built-in brown/white noise generator powered by the Web Audio API for distraction-free focus.
- **Live Navbar Beacon:** Real-time countdown timer in the header with ambient breathing glow indicators.
- **Reload Protection & State Persistence:** Active timer countdowns persist across page reloads in `localStorage`.
- **Celebration Alarm:** 4-tone melodic completion chime accompanied by full-screen confetti bursts.

### 4. 🔦 Interactive Spotlight Tour (Bilingual EN / বাংলা)
- **SVG Cutout Spotlight Engine:** Dims the background while focusing directly on core UI features with a pulsing neon halo.
- **Smart Viewport Positioning:** Tooltip cards dynamically position above or below target elements to ensure zero occlusion.
- **🌐 Instant Bilingual Toggle:** Seamlessly switch between **English (`EN`)** and **Bengali (`বাংলা`)** at any step.
- **Replayable Anytime:** Launch on demand from the `?` icon in the navigation bar.

### 5. 🚪 Personalized User Onboarding
- **First-Time Welcome Modal:** Collects user names to personalize workspace greetings (`👋 Hi, Alex`).
- **Automatic Registry Sync:** Connects registered visitors directly to the Admin User Management telemetry.

### 6. 🛡️ Protected Admin CMS & Developer Profile Manager
- **Secure Authentication:** Protected login gateway for the workspace owner.
- **👥 User Activity Logs:** Real-time tracking of visitor entries, session counts, and timestamps.
- **🌐 Live Footer CMS:** Modify developer name, professional role, avatar initials, workspace bio, and manage dynamic social connection links (LinkedIn, GitHub, Email, Portfolio) with live preview.
- **🔐 Credentials Management:** Easily change administrative passwords with live feedback.

### 7. 🎵 Tactile Web Audio FX & Gamification
- **Synthesized Audio Engine:** Native Web Audio API sound effects for pops, toggles, success chimes, and alarm signals without external audio files.
- **Level & XP Progress:** Earn +50 XP per completed task with milestone celebratory feedback.

---

## ☁️ Database Architecture & Why Firebase

This project uses **Google Cloud Firestore (Firebase)** paired with an **Offline-First Local Storage Engine**.

```text
 ┌───────────────────────────────────────────────────────────────┐
 │                      TaskManager Client                       │
 └───────────────┬───────────────────────────────┬───────────────┘
                 │                               │
        (Active Cloud Sync)              (Offline Fallback)
                 ▼                               ▼
 ┌───────────────────────────────┐ ┌───────────────────────────┐
 │   Google Cloud Firestore      │ │   HTML5 LocalStorage      │
 │  - Real-Time Websocket Listen │ │  - Zero Latency Instant   │
 │  - Multi-Device Live Sync     │ │  - Works without Network  │
 └───────────────────────────────┘ └───────────────────────────┘
```

### 🎯 Why Firebase Cloud Firestore over traditional databases?

1. **⚡ Real-Time Multi-Device Synchronization (`onSnapshot`):**
   - When you create or complete a task on your laptop, Firestore pushes the update over WebSockets instantly. Your phone or tablet displays the changes in real-time without needing a manual page reload.
2. **🛡️ Offline-First Resiliency & Zero Latency:**
   - The application writes immediately to local storage and synchronizes with Firestore in the background. Even if the user is offline or Firebase keys are not yet configured, the app remains 100% functional.
3. **🚀 Serverless Architecture (No Backend Overhead):**
   - By leveraging the official Firebase SDK directly within React, we eliminate the need for a separate Node.js/Express server, reducing hosting costs, latency, and operational maintenance.
4. **🔒 Enterprise-Grade Security & Scalability:**
   - Powered by Google Cloud infrastructure with global replication, automatic scaling, and encryption at rest and in transit.

### 🔄 Hybrid Offline-First Sync Workflow

- **Connected Mode (`☁️ Cloud Sync`):** Reads and writes directly to Firestore documents under `taskmanager_workspaces/{workspace_id}`.
- **Local Mode (`💾 Local`):** Automatically activated when Firebase credentials are not provided, storing data cleanly in browser `localStorage`.

### 🔑 Database Environment Variables

To activate Cloud Database sync, configure your environment variables:

```env
# .env or Vercel Environment Variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **UI Framework** | [React 19](https://react.dev/) | Modern functional components with React Hooks |
| **Bundler & Server** | [Vite 8](https://vitejs.dev/) | Lightning-fast HMR and optimized production bundle |
| **Cloud Database** | [Google Cloud Firestore](https://firebase.google.com/docs/firestore) | Real-time NoSQL cloud database for cross-device sync |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) | Glassmorphism, CSS variables, dark palette & dynamic gradients |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, lightweight SVG icon system |
| **Sound FX** | Web Audio API | Client-side synthesized sound design |
| **Celebrations** | [Canvas Confetti](https://github.com/catdad/canvas-confetti) | Particle celebration animations |
| **Local Cache** | HTML5 `localStorage` | Offline-first state persistence and fallback |

---

## 🛡️ Admin CMS & Credentials

To access the private Admin Management Portal:

1. Click **`Manage ✏️`** on the developer card in the footer (or select **`Admin Portal`** in the welcome dialog).
2. Enter the configured administrator credentials:

| Field | Initial Configured Value |
| :--- | :--- |
| **Admin Username** | `Mahadeb Maity` |
| **Admin Password** | `Maity@12345` |

> 🔒 *Admin credentials can be customized at any time inside the Security Settings tab of the Admin CMS.*

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- `npm` / `yarn` / `pnpm`

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/Mahadebmaity/TaskManagerApp.git

# 2. Navigate into the project directory
cd TaskManagerApp

# 3. Install project dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Directory Structure

```text
TaskManager/
├── public/
│   ├── favicon.svg              # Application brand icon
│   └── icons.svg                # Vector resources
├── src/
│   ├── components/
│   │   ├── AdminCMSModal.jsx    # Secure Admin CMS, User Tracker & Profile Manager
│   │   ├── AnalyticsView.jsx    # Eisenhower Matrix, charts & XP telemetry
│   │   ├── FocusTimer.jsx       # Zen Pomodoro modal with presets & ambient audio
│   │   ├── Footer.jsx           # Dynamic developer card, social links & CMS trigger
│   │   ├── HistoryView.jsx      # Recycle archive with creation/deletion timestamps
│   │   ├── KanbanBoard.jsx      # Drag-and-drop workflow stage pipeline
│   │   ├── ListView.jsx         # 1-tap priority cycler & drag reordering
│   │   ├── Logo.jsx             # Dynamic gradient brand mark
│   │   ├── Navbar.jsx           # Responsive navigation, search & live timer beacon
│   │   ├── OnboardingTour.jsx   # 8-step bilingual spotlight tour (EN / BN)
│   │   ├── SmartTaskInput.jsx   # AI NLP parser & live spellchecker
│   │   ├── TaskModal.jsx        # Detailed task drawer editor
│   │   └── UserWelcomeModal.jsx # Visitor onboarding & admin login modal
│   ├── utils/
│   │   ├── aiEngine.js          # AI formalizer & subtask breakdown generator
│   │   ├── effects.js           # Web Audio synthesizer & confetti effects
│   │   ├── firebase.js          # Firebase Cloud Firestore real-time sync & fallback
│   │   ├── nlpParser.js         # Date, time, tag & priority NLP extractor
│   │   ├── spellChecker.js      # Real-time keyword spellchecker
│   │   └── storage.js           # LocalStorage state sync & persistence
│   ├── App.jsx                  # Root orchestrator & global state
│   ├── index.css                # Tailwind CSS v4 design tokens & keyframes
│   └── main.jsx                 # React DOM root entrypoint
├── .env.example                 # Template for Firebase Cloud environment keys
├── index.html                   # HTML template with SEO meta tags
├── package.json                 # Project dependencies & build scripts
└── vite.config.js               # Vite build configuration
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>/</kbd> | Focus global task search bar |
| <kbd>Esc</kbd> | Close active modal or clear search query |
| <kbd>Enter</kbd> | Submit and create task in Smart Input |

---

## 👨‍💻 Creator & Developer

**Mahadeb Maity**  
*Full-Stack Web Developer & UI Engineer*

- 💼 **LinkedIn:** [linkedin.com/in/mahadeb-maity](https://www.linkedin.com/in/mahadeb-maity/)
- 🐙 **GitHub:** [github.com/Mahadebmaity](https://github.com/Mahadebmaity)
- ✉️ **Email:** [mahadebmaity.dev@gmail.com](mailto:mahadebmaity.dev@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">
  <sub>Crafted with ❤️ and precision by <strong>Mahadeb Maity</strong></sub>
</div>