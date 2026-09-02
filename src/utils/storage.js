/**
 * LocalStorage state management and seed data for "Your task"
 */

const STORAGE_KEY = 'your_task_app_state_v1';

export const INITIAL_SAMPLE_TASKS = [
  {
    id: 'task-1',
    title: 'Design high-fidelity Dark Glassmorphism Landing Page',
    description: 'Create interactive hero section, feature showcases, and glowing UI components.',
    status: 'in_progress', // todo | in_progress | under_review | completed
    priority: 'high',
    tags: ['design', 'work'],
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // tomorrow
    estimatedMinutes: 45,
    completedMinutes: 20,
    subtasks: [
      { id: 101, title: 'Draft wireframe & hero typography layout', completed: true },
      { id: 102, title: 'Build responsive glassmorphism card grid', completed: true },
      { id: 103, title: 'Add interactive hover transitions & glows', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-2',
    title: 'Implement Smart NLP Task Parser with Live Preview',
    description: 'Extract tags (#), priority (!), estimated time (~), and dates from plain text input.',
    status: 'in_progress',
    priority: 'high',
    tags: ['dev', 'ai'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    estimatedMinutes: 60,
    completedMinutes: 30,
    subtasks: [
      { id: 201, title: 'Write regex tokenization logic', completed: true },
      { id: 202, title: 'Add instant live badge preview', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'task-3',
    title: 'Conduct weekly high-intensity workout & mobility session',
    description: 'Focus on core stability, leg press, and 20-min cardio interval sprint.',
    status: 'completed',
    priority: 'medium',
    tags: ['health', 'personal'],
    dueDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    estimatedMinutes: 45,
    completedMinutes: 45,
    subtasks: [
      { id: 301, title: 'Dynamic stretch warmup', completed: true },
      { id: 302, title: 'Compound lifts session', completed: true },
      { id: 303, title: 'Cardio cool-down', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'task-4',
    title: 'Review Q3 Financial Strategy & Subscription Audit',
    description: 'Audit cloud infrastructure costs, recurring SaaS licenses, and optimize monthly burn rate.',
    status: 'under_review',
    priority: 'medium',
    tags: ['finance', 'work'],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    estimatedMinutes: 30,
    completedMinutes: 15,
    subtasks: [
      { id: 401, title: 'Export transaction ledger CSV', completed: true },
      { id: 402, title: 'Identify unused subscription tiers', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'task-5',
    title: 'Prepare AI Product Roadmap & Deck presentation',
    description: 'Outline key milestones for Q4: subtask auto-breakdown, Pomodoro integration, and gamified streak system.',
    status: 'todo',
    priority: 'high',
    tags: ['work', 'ai'],
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    estimatedMinutes: 90,
    completedMinutes: 0,
    subtasks: [
      { id: 501, title: 'Gather user metrics and feature requests', completed: false },
      { id: 502, title: 'Structure slide outline', completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];

export function getFreshSampleTasks() {
  return JSON.parse(JSON.stringify(INITIAL_SAMPLE_TASKS));
}

export function getUserStorageKey(user) {
  if (!user) return 'your_task_app_state_guest';
  const nameOrId = typeof user === 'string' ? user : (user.name || user.id || 'guest');
  const cleanId = nameOrId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return `your_task_app_state_user_${cleanId}`;
}

export function getUserHistoryKey(user) {
  if (!user) return 'taskmanager_deleted_history_guest';
  const nameOrId = typeof user === 'string' ? user : (user.name || user.id || 'guest');
  const cleanId = nameOrId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return `taskmanager_deleted_history_${cleanId}`;
}

export function loadState(user) {
  try {
    const key = getUserStorageKey(user);
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.tasks)) {
        // If state was previously created with legacy placeholder values (320 XP / 4 streak / 65 mins), reset to 0 so users start from scratch
        if (parsed.userXP === 320 && parsed.streakDays === 4 && parsed.focusMinutesToday === 65) {
          parsed.userXP = 0;
          parsed.streakDays = 0;
          parsed.focusMinutesToday = 0;
          try {
            localStorage.setItem(key, JSON.stringify(parsed));
          } catch (e) {
            console.warn('Legacy reset error', e);
          }
        }
        return parsed;
      }
    }

    // If user is brand new or has no saved state yet, start metrics strictly from scratch!
    const freshTasks = getFreshSampleTasks();
    const initialState = {
      tasks: freshTasks,
      userXP: 0,
      streakDays: 0,
      focusMinutesToday: 0
    };

    // Save this fresh state under the user's dedicated key so it's isolated
    try {
      localStorage.setItem(key, JSON.stringify(initialState));
    } catch (e) {
      console.warn('Initial state save error', e);
    }

    return initialState;
  } catch (e) {
    console.error('Failed to load state', e);
    return { tasks: getFreshSampleTasks(), userXP: 0, streakDays: 0, focusMinutesToday: 0 };
  }
}

export function saveState(state, user) {
  try {
    const key = getUserStorageKey(user);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}
