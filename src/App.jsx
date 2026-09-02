import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import SmartTaskInput from './components/SmartTaskInput';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import AnalyticsView from './components/AnalyticsView';
import HistoryView from './components/HistoryView';
import TaskModal from './components/TaskModal';
import FocusTimer from './components/FocusTimer';
import OnboardingTour from './components/OnboardingTour';
import Footer from './components/Footer';
import UserWelcomeModal from './components/UserWelcomeModal';
import AdminCMSModal from './components/AdminCMSModal';

import { loadState, saveState, getUserHistoryKey, INITIAL_SAMPLE_TASKS } from './utils/storage';
import { isFirebaseConfigured, syncWorkspaceToCloud, subscribeWorkspace } from './utils/firebase';
import { triggerCompletionConfetti, soundFx } from './utils/effects';
import { Bell, X, Coffee, Sparkles } from 'lucide-react';

const DEFAULT_DURATIONS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15
};

export default function App() {
  // User Profile & Registry State (for Admin tracking) - loaded first to key user workspaces
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('taskmanager_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [appState, setAppState] = useState(() => loadState(currentUser));
  const [currentView, setCurrentView] = useState('list'); // 'kanban' | 'list' | 'analytics' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);

  // Light / Dark Theme State
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('taskmanager_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('taskmanager_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    } catch (e) {
      console.warn('Theme storage error', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    soundFx.playPop();
  };

  const handleResetHome = () => {
    setCurrentView('kanban');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundFx.playPop();
  };

  // Deleted Tasks History Archive State (isolated per user)
  const [deletedTasks, setDeletedTasks] = useState(() => {
    try {
      const key = getUserHistoryKey(currentUser);
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const key = getUserHistoryKey(currentUser);
      localStorage.setItem(key, JSON.stringify(deletedTasks));
    } catch (e) {
      console.warn('Save deleted history error', e);
    }
  }, [deletedTasks, currentUser]);

  // When user switches or logs in, load that user's specific workspace and deleted history
  useEffect(() => {
    const userWorkspace = loadState(currentUser);
    setAppState(userWorkspace);

    try {
      const key = getUserHistoryKey(currentUser);
      const savedHistory = localStorage.getItem(key);
      setDeletedTasks(savedHistory ? JSON.parse(savedHistory) : []);
    } catch (e) {
      setDeletedTasks([]);
    }
  }, [currentUser?.name, currentUser?.id]);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('app_registered_users_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('is_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Welcome modal: Opens if no user profile is registered yet
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(!currentUser);

  // Admin CMS Portal Modal
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState(false);
  const [adminCMSTab, setAdminCMSTab] = useState('users');

  const handleOpenAdminCMS = (tab = 'users') => {
    setAdminCMSTab(tab);
    setIsAdminCMSOpen(true);
  };

  // Customizable Footer Config state
  const [footerConfig, setFooterConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_footer_config');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Guided Feature Onboarding Tour (Auto-opens after name input or if not completed)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const handleOpenTour = () => {
    // Switch to list or kanban so task cards and inputs are active
    if (currentView !== 'list' && currentView !== 'kanban') {
      setCurrentView('list');
    }
    setSearchQuery('');
    if (!appState.tasks || appState.tasks.length === 0) {
      setAppState((prev) => ({
        ...prev,
        tasks: INITIAL_SAMPLE_TASKS
      }));
    }
    setIsOnboardingOpen(true);
  };

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('taskmanager_onboarding_completed', 'true');
    } catch (e) {
      console.warn('Onboarding storage error', e);
    }
  };

  // Save new user name from welcome modal and launch feature tour!
  const handleSaveUserName = (name) => {
    const newUser = {
      id: Date.now().toString(),
      name,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    setCurrentUser(newUser);
    try {
      localStorage.setItem('taskmanager_user_profile', JSON.stringify(newUser));
    } catch (e) {
      console.warn('User profile storage error', e);
    }

    setRegisteredUsers((prev) => {
      const updated = [newUser, ...prev.filter((u) => u.name.toLowerCase() !== name.toLowerCase())];
      try {
        localStorage.setItem('app_registered_users_list', JSON.stringify(updated));
      } catch (err) {
        console.warn('Users list error', err);
      }
      return updated;
    });

    setIsWelcomeModalOpen(false);

    // Prompt the feature tour right after saving name
    setTimeout(() => {
      handleOpenTour();
    }, 350);
  };

  // Clear or delete users from Admin CMS
  const handleClearUsers = () => {
    setRegisteredUsers([]);
    try {
      localStorage.removeItem('app_registered_users_list');
    } catch (e) {
      console.warn('Clear error', e);
    }
  };

  const handleDeleteUser = (userId) => {
    setRegisteredUsers((prev) => {
      const updated = prev.filter((u) => u.id !== userId);
      try {
        localStorage.setItem('app_registered_users_list', JSON.stringify(updated));
      } catch (e) {
        console.warn('Delete user error', e);
      }
      return updated;
    });
  };

  const handleSaveFooterConfig = (newConfig) => {
    setFooterConfig(newConfig);
    try {
      localStorage.setItem('admin_footer_config', JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Footer config error', e);
    }
  };

  // Global Pomodoro State (persists across views and modal open/close)
  const [pomodoroDurations, setPomodoroDurations] = useState(() => {
    try {
      const saved = localStorage.getItem('pomodoro_durations');
      return saved ? JSON.parse(saved) : DEFAULT_DURATIONS;
    } catch {
      return DEFAULT_DURATIONS;
    }
  });

  const [pomodoroMode, setPomodoroMode] = useState('focus'); // focus | shortBreak | longBreak

  // Independent session states for each mode with auto-restore on reload
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('pomodoro_sessions_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedTime = parsed.timestamp || Date.now();
        const elapsedSecs = Math.floor((Date.now() - savedTime) / 1000);
        
        const restored = { ...parsed.sessions };
        Object.keys(restored).forEach((k) => {
          if (restored[k]?.isRunning) {
            restored[k].timeLeft = Math.max(0, restored[k].timeLeft - elapsedSecs);
          }
        });
        return restored;
      }
    } catch (e) {
      console.warn('Session restore error', e);
    }
    return {
      focus: {
        timeLeft: (pomodoroDurations.focus || 25) * 60,
        totalDuration: (pomodoroDurations.focus || 25) * 60,
        isRunning: false
      },
      shortBreak: {
        timeLeft: (pomodoroDurations.shortBreak || 5) * 60,
        totalDuration: (pomodoroDurations.shortBreak || 5) * 60,
        isRunning: false
      },
      longBreak: {
        timeLeft: (pomodoroDurations.longBreak || 15) * 60,
        totalDuration: (pomodoroDurations.longBreak || 15) * 60,
        isRunning: false
      }
    };
  });

  const [pomodoroTaskId, setPomodoroTaskId] = useState('');
  const [pomodoroAlert, setPomodoroAlert] = useState(null); // { message, type }
  const timerIntervalRef = useRef(null);

  const [isCloudConnected, setIsCloudConnected] = useState(isFirebaseConfigured());

  // Real-time Cloud Firestore Workspace Listener
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setIsCloudConnected(false);
      return;
    }

    const workspaceKey = currentUser?.name ? currentUser.name : 'shared_workspace';
    const unsubscribe = subscribeWorkspace(workspaceKey, (cloudData) => {
      if (cloudData && Array.isArray(cloudData.tasks)) {
        setAppState((prev) => ({
          ...prev,
          ...cloudData
        }));
        setIsCloudConnected(true);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Sync state changes to LocalStorage and Firebase Cloud
  useEffect(() => {
    saveState(appState, currentUser);
    if (isFirebaseConfigured()) {
      const workspaceKey = currentUser?.name ? currentUser.name : 'shared_workspace';
      syncWorkspaceToCloud(workspaceKey, appState);
    }
  }, [appState, currentUser]);

  // Sync sound manager enabled state
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Save sessions state with timestamp for resilience
  useEffect(() => {
    try {
      localStorage.setItem(
        'pomodoro_sessions_state',
        JSON.stringify({
          sessions,
          timestamp: Date.now()
        })
      );
    } catch (e) {
      console.warn('Save sessions error', e);
    }
  }, [sessions]);

  // Warn user with confirmation modal if they attempt to refresh/close while timer is running!
  useEffect(() => {
    const hasRunningSession = Object.values(sessions).some((s) => s.isRunning);

    const handleBeforeUnload = (e) => {
      if (hasRunningSession) {
        e.preventDefault();
        e.returnValue = 'You have an active timer running. Are you sure you want to refresh or leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessions]);

  // Global Background Timer Interval Engine for active running sessions
  useEffect(() => {
    // Check if any session is running
    const hasRunningSession = Object.values(sessions).some((s) => s.isRunning);

    if (hasRunningSession) {
      timerIntervalRef.current = setInterval(() => {
        setSessions((prev) => {
          const updated = { ...prev };
          let finishedMode = null;

          Object.keys(updated).forEach((modeKey) => {
            const sess = updated[modeKey];
            if (sess.isRunning) {
              if (sess.timeLeft <= 1) {
                // Finished
                updated[modeKey] = {
                  ...sess,
                  timeLeft: 0,
                  isRunning: false
                };
                finishedMode = modeKey;
              } else {
                updated[modeKey] = {
                  ...sess,
                  timeLeft: sess.timeLeft - 1
                };
              }
            }
          });

          if (finishedMode) {
            clearInterval(timerIntervalRef.current);
            soundFx.playTimerAlarm();
            triggerCompletionConfetti();

            if (finishedMode === 'focus') {
              setAppState((curr) => ({
                ...curr,
                focusMinutesToday: curr.focusMinutesToday + (pomodoroDurations.focus || 25),
                userXP: curr.userXP + 30
              }));
              setPomodoroAlert({
                title: '🎉 Focus Session Completed!',
                message: `Great job! ${pomodoroDurations.focus}m logged (+30 XP). Time for a well-deserved break.`,
                mode: 'focus'
              });
            } else {
              setPomodoroAlert({
                title: '☕ Break Finished!',
                message: 'Break complete. Ready to begin your next focus sprint?',
                mode: 'break'
              });
            }
          }

          return updated;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [sessions, pomodoroDurations.focus]);

  // Active session helper
  const currentSession = sessions[pomodoroMode] || {
    timeLeft: 25 * 60,
    totalDuration: 25 * 60,
    isRunning: false
  };

  // Toggle active mode's running state with strict single-timer exclusivity
  const handleTogglePomodoro = () => {
    setSessions((prev) => {
      const willBeRunning = !prev[pomodoroMode].isRunning;
      const updated = { ...prev };

      // Pause all other modes so only one timer runs at any moment
      Object.keys(updated).forEach((k) => {
        if (k !== pomodoroMode) {
          updated[k] = { ...updated[k], isRunning: false };
        }
      });

      updated[pomodoroMode] = {
        ...updated[pomodoroMode],
        isRunning: willBeRunning
      };

      return updated;
    });
    soundFx.playPop();
  };

  // Reset active mode only
  const handleResetPomodoro = () => {
    const defaultSecs = (pomodoroDurations[pomodoroMode] || 25) * 60;
    setSessions((prev) => ({
      ...prev,
      [pomodoroMode]: {
        timeLeft: defaultSecs,
        totalDuration: defaultSecs,
        isRunning: false
      }
    }));
    soundFx.playPop();
  };

  // Switch mode without losing timer progress or stopping running sessions!
  const handleChangePomodoroMode = (newMode) => {
    if (newMode === pomodoroMode) return;
    setPomodoroMode(newMode);
    soundFx.playPop();
  };

  // Save durations without resetting active progress
  const handleSavePomodoroDurations = (newDurations) => {
    setPomodoroDurations(newDurations);
    try {
      localStorage.setItem('pomodoro_durations', JSON.stringify(newDurations));
    } catch (e) {
      console.warn('Storage error', e);
    }

    // Update totalDurations for untouched/non-running sessions
    setSessions((prev) => {
      const updated = { ...prev };
      ['focus', 'shortBreak', 'longBreak'].forEach((m) => {
        if (!updated[m].isRunning && updated[m].timeLeft === updated[m].totalDuration) {
          const newSecs = (newDurations[m] || 25) * 60;
          updated[m] = {
            timeLeft: newSecs,
            totalDuration: newSecs,
            isRunning: false
          };
        }
      });
      return updated;
    });

    soundFx.playPop();
  };

  // Adjust active mode minutes (+1m, +5m, -5m) without clearing session
  const handleAdjustPomodoroMinutes = (deltaMinutes) => {
    const deltaSeconds = deltaMinutes * 60;
    setSessions((prev) => {
      const sess = prev[pomodoroMode];
      const newTime = Math.max(10, sess.timeLeft + deltaSeconds);
      const newTotal = Math.max(10, sess.totalDuration + deltaSeconds);
      return {
        ...prev,
        [pomodoroMode]: {
          ...sess,
          timeLeft: newTime,
          totalDuration: newTotal
        }
      };
    });
    setPomodoroAlert(null);
    soundFx.playPop();
  };

  const { tasks, userXP, streakDays, focusMinutesToday } = appState;

  // Add Task handler
  const handleAddTask = (parsedData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: parsedData.title,
      description: '',
      status: 'todo',
      priority: parsedData.priority || 'medium',
      tags: parsedData.tags || ['general'],
      dueDate: parsedData.dueDate,
      estimatedMinutes: parsedData.estimatedMinutes || 30,
      completedMinutes: 0,
      subtasks: parsedData.subtasks || [],
      createdAt: new Date().toISOString()
    };

    setAppState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    soundFx.playPop();
  };

  // Update Task status
  const handleUpdateStatus = (taskId, newStatus) => {
    setAppState((prev) => {
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id === taskId) {
          const wasCompleted = task.status === 'completed';
          const isNowCompleted = newStatus === 'completed';

          if (!wasCompleted && isNowCompleted) {
            triggerCompletionConfetti();
            soundFx.playCompletionChime();
          }

          return { ...task, status: newStatus };
        }
        return task;
      });

      const newlyCompleted = prev.tasks.find((t) => t.id === taskId)?.status !== 'completed' && newStatus === 'completed';
      const addedXP = newlyCompleted ? 50 : 0;

      return {
        ...prev,
        tasks: updatedTasks,
        userXP: prev.userXP + addedXP
      };
    });
  };

  // Reorder tasks (e.g. from Drag & Drop)
  const handleReorderTasks = (newTasks) => {
    setAppState((prev) => ({
      ...prev,
      tasks: newTasks
    }));
  };

  // Move task via drag and drop
  const handleMoveTask = (taskId, targetStatus, targetIndex = null) => {
    setAppState((prev) => {
      const taskToMove = prev.tasks.find((t) => t.id !== taskId ? null : t);
      if (!taskToMove) return prev;

      const wasCompleted = taskToMove.status === 'completed';
      const isNowCompleted = targetStatus === 'completed';

      if (!wasCompleted && isNowCompleted) {
        triggerCompletionConfetti();
        soundFx.playCompletionChime();
      }

      const updatedTask = { ...taskToMove, status: targetStatus };
      const otherTasks = prev.tasks.filter((t) => t.id !== taskId);

      let newTasks;
      if (targetIndex !== null && targetIndex >= 0) {
        newTasks = [...otherTasks];
        newTasks.splice(targetIndex, 0, updatedTask);
      } else {
        newTasks = [updatedTask, ...otherTasks];
      }

      const newlyCompleted = !wasCompleted && isNowCompleted;
      const addedXP = newlyCompleted ? 50 : 0;

      return {
        ...prev,
        tasks: newTasks,
        userXP: prev.userXP + addedXP
      };
    });
    soundFx.playPop();
  };

  // Save modified Task
  const handleSaveTask = (updatedTask) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    }));
    soundFx.playPop();
  };

  // Delete Task -> Archive with Deletion Timestamp into History
  const handleDeleteTask = (taskId) => {
    const taskToDelete = appState.tasks.find((t) => t.id === taskId);
    if (taskToDelete) {
      const archivedTask = {
        ...taskToDelete,
        deletedAt: new Date().toISOString()
      };
      setDeletedTasks((prev) => [archivedTask, ...prev]);
    }

    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId)
    }));
    soundFx.playPop();
  };

  // Restore task from History archive back to active workspace
  const handleRestoreTask = (taskToRestore) => {
    const { deletedAt: _deletedAt, ...cleanTask } = taskToRestore;
    setAppState((prev) => ({
      ...prev,
      tasks: [cleanTask, ...prev.tasks]
    }));
    setDeletedTasks((prev) => prev.filter((t) => t.id !== taskToRestore.id));
    triggerCompletionConfetti();
    soundFx.playCompletionChime();
  };

  // Permanently delete single task from History
  const handlePermanentDeleteTask = (taskId) => {
    setDeletedTasks((prev) => prev.filter((t) => t.id !== taskId));
    soundFx.playPop();
  };

  // Clear all archived deleted tasks from History
  const handleClearAllHistory = () => {
    setDeletedTasks([]);
    soundFx.playPop();
  };

  // Search filter
  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchesTitle = t.title.toLowerCase().includes(query);
    const matchesTag = t.tags && t.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesPriority = t.priority.toLowerCase().includes(query);
    return matchesTitle || matchesTag || matchesPriority;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length
  };

  const runningMode = Object.keys(sessions).find((k) => sessions[k].isRunning) || null;

  // Package pomodoro state for children
  const pomodoroState = {
    mode: pomodoroMode,
    timeLeft: currentSession.timeLeft,
    totalDuration: currentSession.totalDuration,
    isRunning: currentSession.isRunning,
    runningMode,
    sessions,
    durations: pomodoroDurations,
    selectedTaskId: pomodoroTaskId,
    isCompletedAlert: !!pomodoroAlert
  };

  // Logout user and reopen welcome modal
  const handleLogoutUser = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem('taskmanager_user_profile');
      localStorage.removeItem('is_admin_authenticated');
    } catch (e) {
      console.warn('Logout error', e);
    }
    setIsWelcomeModalOpen(true);
    soundFx.playPop();
  };

  // Switch profile / edit name
  const handleSwitchUser = () => {
    setIsWelcomeModalOpen(true);
    soundFx.playPop();
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100 selection:bg-violet-500 selection:text-white relative">
      
      {/* Global Ambient Timer Completion Banner */}
      {pomodoroAlert && (
        <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-4 py-2.5 shadow-2xl text-white flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 animate-spin text-amber-300 shrink-0" />
            <span>{pomodoroAlert.title}</span>
            <span className="font-normal opacity-90 hidden sm:inline">{pomodoroAlert.message}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => soundFx.playTimerAlarm()}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-all flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5" /> Replay Sound
            </button>
            {pomodoroAlert.mode === 'focus' && (
              <button
                onClick={() => {
                  handleChangePomodoroMode('shortBreak');
                  setIsFocusTimerOpen(true);
                  setPomodoroAlert(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-white text-emerald-900 text-xs font-extrabold transition-all hover:bg-emerald-50 flex items-center gap-1"
              >
                <Coffee className="w-3.5 h-3.5" /> Take Break
              </button>
            )}
            <button
              onClick={() => setPomodoroAlert(null)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
        onOpenTour={handleOpenTour}
        taskStats={taskStats}
        pomodoro={pomodoroState}
        currentUser={currentUser}
        onOpenAdminCMS={handleOpenAdminCMS}
        deletedHistoryCount={deletedTasks.length}
        isAdmin={isAdmin}
        isCloudConnected={isCloudConnected}
        onLogout={handleLogoutUser}
        onSwitchUser={handleSwitchUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onResetHome={handleResetHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-3 sm:px-6 pt-6 space-y-6">
        {/* Smart NLP Task Input (Top persistent bar on list and kanban workspace) */}
        {(currentView === 'list' || currentView === 'kanban') && (
          <SmartTaskInput onAddTask={handleAddTask} />
        )}

        {/* View Switcher Output */}
        {currentView === 'kanban' && (
          <KanbanBoard
            tasks={filteredTasks}
            allTasks={tasks}
            onUpdateStatus={handleUpdateStatus}
            onMoveTask={handleMoveTask}
            onReorderTasks={handleReorderTasks}
            onDeleteTask={handleDeleteTask}
            onSelectTask={(task) => setSelectedTask(task)}
          />
        )}

        {currentView === 'list' && (
          <ListView
            tasks={filteredTasks}
            allTasks={tasks}
            onUpdateStatus={handleUpdateStatus}
            onReorderTasks={handleReorderTasks}
            onDeleteTask={handleDeleteTask}
            onSelectTask={(task) => setSelectedTask(task)}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            tasks={tasks}
            userXP={userXP}
            streakDays={streakDays}
            focusMinutesToday={focusMinutesToday}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            deletedTasks={deletedTasks}
            onRestoreTask={handleRestoreTask}
            onPermanentDeleteTask={handlePermanentDeleteTask}
            onClearAllHistory={handleClearAllHistory}
            onNavigateBack={() => setCurrentView('list')}
          />
        )}
      </main>

      {/* Modern Developer & App Footer - Displayed ONLY on Landing / Main Home Workspace */}
      {(currentView === 'list' || currentView === 'kanban') && (
        <Footer 
          onOpenTour={handleOpenTour} 
          onOpenAdminCMS={handleOpenAdminCMS}
          isAdmin={isAdmin}
        />
      )}

      {/* Full Task Editor Drawer / Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Zen Focus Pomodoro Timer Modal */}
      <FocusTimer
        tasks={tasks}
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        pomodoro={pomodoroState}
        onToggleTimer={handleTogglePomodoro}
        onResetTimer={handleResetPomodoro}
        onChangeMode={handleChangePomodoroMode}
        onSaveDurations={handleSavePomodoroDurations}
        onAdjustMinutes={handleAdjustPomodoroMinutes}
        onSelectTask={(taskId) => setPomodoroTaskId(taskId)}
        onDismissAlert={() => setPomodoroAlert(null)}
        onReplayAlarm={() => soundFx.playTimerAlarm()}
      />

      {/* Interactive Feature Onboarding Guide Tour */}
      <OnboardingTour
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
        currentView={currentView}
        onSwitchView={setCurrentView}
        onEnsureTasks={() => {
          if (!appState.tasks || appState.tasks.length === 0) {
            setAppState((prev) => ({
              ...prev,
              tasks: INITIAL_SAMPLE_TASKS
            }));
          }
        }}
      />

      {/* First-Time User Welcome & Name Onboarding Modal */}
      <UserWelcomeModal
        isOpen={isWelcomeModalOpen}
        initialName={currentUser?.name || ''}
        onClose={currentUser ? () => setIsWelcomeModalOpen(false) : undefined}
        onSaveUserName={handleSaveUserName}
        onAdminLoginSuccess={(adminName) => {
          const adminProfile = {
            id: 'admin_creator',
            name: adminName || 'Mahadeb Maity',
            joinedAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          setCurrentUser(adminProfile);
          setIsAdmin(true);
          try {
            localStorage.setItem('taskmanager_user_profile', JSON.stringify(adminProfile));
            localStorage.setItem('is_admin_authenticated', 'true');
          } catch (e) {
            console.warn('Storage error', e);
          }
          setIsWelcomeModalOpen(false);
          handleOpenAdminCMS('users');
        }}
      />

      {/* Protected Admin CMS Portal Modal */}
      <AdminCMSModal
        isOpen={isAdminCMSOpen}
        onClose={() => setIsAdminCMSOpen(false)}
        registeredUsers={registeredUsers}
        onClearUsers={handleClearUsers}
        onDeleteUser={handleDeleteUser}
        footerConfig={footerConfig}
        onSaveFooterConfig={handleSaveFooterConfig}
        totalTasksCount={tasks.length}
        completedTasksCount={tasks.filter((t) => t.status === 'completed').length}
        initialTab={adminCMSTab}
        onLoginSuccess={() => {
          setIsAdmin(true);
          try {
            localStorage.setItem('is_admin_authenticated', 'true');
          } catch (e) {
            console.warn('Storage error', e);
          }
        }}
        onLogoutSuccess={() => {
          setIsAdmin(false);
          try {
            localStorage.removeItem('is_admin_authenticated');
          } catch (e) {
            console.warn('Storage error', e);
          }
        }}
      />
    </div>
  );
}

