import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { 
  LayoutGrid, 
  List, 
  BarChart3, 
  Timer, 
  Volume2, 
  VolumeX, 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  User, 
  History,
  ChevronDown,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';
import { soundFx } from '../utils/effects';

export default function Navbar({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  soundEnabled,
  setSoundEnabled,
  onOpenFocusTimer,
  taskStats,
  pomodoro,
  onOpenTour,
  currentUser,
  onOpenAdminCMS,
  deletedHistoryCount = 0,
  isAdmin = false,
  onLogout,
  onSwitchUser
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const activeMode = pomodoro?.runningMode || pomodoro?.mode || 'focus';
  const activeSession = pomodoro?.sessions ? pomodoro.sessions[activeMode] : pomodoro;
  const isAnyRunning = !!pomodoro?.runningMode;

  // Close user dropdown on outside click & Global search hotkey (/ or Ctrl+K)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      // If user presses '/' or 'Ctrl+K' / 'Cmd+K' while not actively typing in an input or textarea
      if (
        (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        const searchInput = document.getElementById('navbar-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 py-2.5 shadow-xl backdrop-blur-xl">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
        
        {/* Left: Unshrinkable Brand Logo & Mobile Tools */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Logo size="md" />
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white text-gradient whitespace-nowrap">
                  Your task Manager
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-sm shrink-0 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                  <span>AI Powered</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap hidden sm:block">
                Smart Task Intelligence & Deep Work
              </p>
            </div>
          </div>

          {/* Quick Mobile Action Buttons (visible only on mobile) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenFocusTimer}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold relative overflow-hidden ${
                isAnyRunning
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 animate-live-timer'
                  : activeSession?.timeLeft < activeSession?.totalDuration
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
              }`}
              title="Focus Timer"
            >
              <Timer className="w-4 h-4 text-emerald-400 shrink-0" />
              {isAnyRunning || activeSession?.timeLeft < activeSession?.totalDuration ? (
                <span className="font-mono text-[11px]">
                  {String(Math.floor(activeSession.timeLeft / 60)).padStart(2, '0')}:
                  {String(activeSession.timeLeft % 60).padStart(2, '0')}
                </span>
              ) : null}
            </button>

            {/* Mobile User Profile Menu Trigger */}
            {currentUser && (
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  soundFx.playPop();
                }}
                className="p-1.5 rounded-xl bg-slate-900/90 border border-white/15 text-slate-200 flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="User Profile & Logout"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </button>
            )}

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white transition-all"
              title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={onOpenTour}
              className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-violet-300 transition-all"
              title="User Guide Tour"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Ultra-Compact Search Bar with Expand on Focus */}
        <div id="tour-search-bar" className="relative w-full md:w-28 lg:w-36 md:focus-within:w-44 lg:focus-within:w-48 shrink-0 transition-all duration-300 group">
          <div className="relative flex items-center">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors pointer-events-none ${
              searchQuery ? 'text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-400'
            }`} />
            
            <input
              id="navbar-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Task"
              className="w-full bg-slate-950/85 border border-white/15 focus:border-cyan-500/60 rounded-xl pl-7 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            />

            {/* Right side: 1-Click Clear Button OR Quick Slash Badge */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    soundFx.playPop();
                  }}
                  className="p-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Clear search query (Esc)"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <span className="hidden sm:flex items-center px-1 py-0.2 rounded bg-slate-900 border border-white/10 text-[9px] font-mono font-bold text-slate-500 select-none pointer-events-none group-focus-within:border-cyan-500/30 group-focus-within:text-cyan-400">
                  /
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: View Switcher & Desktop Tools */}
        <div className="flex items-center gap-1.5 lg:gap-2.5 w-full md:w-auto justify-between md:justify-end shrink-0">
          
          {/* Main Navigation Views - No Scrollbar Glass Capsule Switcher */}
          <div 
            id="tour-view-switcher" 
            className="no-scrollbar flex items-center p-0.5 sm:p-1 bg-slate-950/80 rounded-2xl border border-white/15 w-full sm:w-auto justify-between sm:justify-start overflow-x-auto shadow-inner shrink-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Kanban View Button */}
            <button
              type="button"
              onClick={() => {
                setCurrentView('kanban');
                soundFx.playPop();
              }}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                currentView === 'kanban'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span>Kanban</span>
            </button>

            {/* List View Button */}
            <button
              type="button"
              onClick={() => {
                setCurrentView('list');
                soundFx.playPop();
              }}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                currentView === 'list'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <List className="w-3.5 h-3.5 shrink-0" />
              <span>List</span>
            </button>

            {/* Analytics View Button */}
            <button
              type="button"
              onClick={() => {
                setCurrentView('analytics');
                soundFx.playPop();
              }}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                currentView === 'analytics'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>Analytics</span>
            </button>

            {/* History View Button with Badge Counter */}
            <button
              type="button"
              onClick={() => {
                setCurrentView('history');
                soundFx.playPop();
              }}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                currentView === 'history'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <History className="w-3.5 h-3.5 shrink-0" />
              <span>History</span>
              {deletedHistoryCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black leading-none ${
                  currentView === 'history' ? 'bg-white/25 text-white' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {deletedHistoryCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Right Tools */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">
            
            {/* Interactive User Profile & Logout Popover Button */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    soundFx.playPop();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-200 flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm hover:border-violet-500/40 cursor-pointer shrink-0"
                  title="Click to view profile or logout"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="max-w-[85px] lg:max-w-[110px] truncate text-slate-100">
                    Hi, {currentUser.name}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isUserMenuOpen ? 'rotate-180 text-violet-400' : ''
                  }`} />
                </button>

                {/* Glass User Profile Dropdown Popover */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-2xl border border-white/20 shadow-2xl p-2.5 z-50 animate-scaleIn backdrop-blur-2xl">
                    <div className="p-2 border-b border-white/10 mb-1.5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shrink-0">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Profile
                        </span>
                      </div>
                    </div>

                    {/* Switch User / Edit Name Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onSwitchUser) onSwitchUser();
                        soundFx.playPop();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer text-left"
                    >
                      <User className="w-3.5 h-3.5 text-violet-400" />
                      <span>Switch Profile / Edit Name</span>
                    </button>

                    {/* Admin CMS Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onOpenAdminCMS) onOpenAdminCMS('users');
                        soundFx.playPop();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isAdmin ? 'Admin CMS Dashboard' : 'Admin Portal Login'}</span>
                    </button>

                    <div className="border-t border-white/10 my-1"></div>

                    {/* Logout Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onLogout) onLogout();
                        soundFx.playPop();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer text-left border border-rose-500/20"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Logout Account</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Live Interactive Focus Timer in Navbar */}
            <button
              id="tour-focus-timer"
              onClick={onOpenFocusTimer}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer relative overflow-hidden ${
                isAnyRunning
                  ? 'bg-emerald-950/80 border-emerald-400/90 text-emerald-300 animate-live-timer'
                  : activeSession?.timeLeft < activeSession?.totalDuration
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 shadow-lg shadow-emerald-500/10'
              }`}
              title={isAnyRunning ? `${activeMode.toUpperCase()} is Running - Click to view` : 'Launch Zen Pomodoro Timer'}
            >
              {isAnyRunning && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent animate-timer-shimmer pointer-events-none"></div>
              )}

              <div className="flex items-center gap-1.5 relative z-10">
                {isAnyRunning && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse"></span>
                )}
                <Timer className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>

              {isAnyRunning || activeSession?.timeLeft < activeSession?.totalDuration ? (
                <div className="flex items-center gap-1 font-mono relative z-10">
                  <span className="tracking-wider text-white">
                    {String(Math.floor(activeSession.timeLeft / 60)).padStart(2, '0')}:
                    {String(activeSession.timeLeft % 60).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-sans font-extrabold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {activeMode === 'focus' ? 'Focus' : activeMode === 'shortBreak' ? 'Short' : 'Long'}
                  </span>
                </div>
              ) : (
                <span className="relative z-10 hidden xl:inline">Focus Timer</span>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              id="tour-sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 lg:p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs shrink-0 cursor-pointer"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Tour / Guide Button */}
            <button
              onClick={onOpenTour}
              className="p-1.5 lg:p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-violet-300 hover:border-violet-500/40 hover:bg-violet-950/30 transition-all text-xs shrink-0 cursor-pointer"
              title="Feature Tour & User Guide"
              aria-label="User Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Stats Badge */}
            <div id="tour-stats-badge" className="flex items-center gap-1 pl-1.5 border-l border-white/10 text-xs shrink-0 whitespace-nowrap">
              <span className="text-slate-400 hidden xl:inline">Done:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md text-[11px]">
                {taskStats.completed}/{taskStats.total}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
