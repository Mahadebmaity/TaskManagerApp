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
  X,
  Sun,
  Moon
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
  taskStats = { completed: 0, total: 0 },
  pomodoro,
  onOpenTour,
  currentUser,
  onOpenAdminCMS,
  deletedHistoryCount = 0,
  isAdmin = false,
  isCloudConnected = false,
  onLogout,
  onSwitchUser,
  theme = 'dark',
  onToggleTheme,
  onResetHome
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);

  const activeMode = pomodoro?.runningMode || pomodoro?.mode || 'focus';
  const activeSession = pomodoro?.sessions ? pomodoro.sessions[activeMode] : pomodoro;
  const isAnyRunning = !!pomodoro?.runningMode;

  // Close user dropdown on outside click & Global search hotkey (/ or Ctrl+K)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userMenuRef.current && !userMenuRef.current.contains(e.target) &&
        mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
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
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Track scroll position to keep only website brand sticky on mobile while scrolling
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Shared User Dropdown Content Component
  const renderUserDropdown = () => (
    <div className="absolute right-0 top-full mt-2 w-60 glass-panel rounded-2xl border border-white/20 shadow-2xl p-2.5 z-50 animate-scaleIn backdrop-blur-2xl">
      <div className="p-2 border-b border-white/10 mb-1.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shrink-0">
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{currentUser?.name || 'User'}</h4>
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

      {/* Admin CMS Option - Visible ONLY to Admin */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => {
            setIsUserMenuOpen(false);
            if (onOpenAdminCMS) onOpenAdminCMS('users');
            soundFx.playPop();
          }}
          className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-800/80 text-cyan-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer text-left"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Admin CMS Dashboard</span>
        </button>
      )}

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
  );

  return (
    <header className={`sticky top-0 z-40 w-full glass-panel border-b border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 ${
      isScrolled ? 'py-1.5' : 'py-2'
    }`}>
      <div className="max-w-[1440px] w-full mx-auto px-2.5 sm:px-4 lg:px-6">
        
        {/* ========================================================================= */}
        {/* MOBILE VIEW (Screens < 768px): Structured cleanly into 4 distinct lines  */}
        {/* ========================================================================= */}
        <div className="flex md:hidden flex-col gap-1.5 w-full transition-all duration-300">
          
          {/* LINE 1: Brand Logo + Website Name + AI Powered (ALWAYS STICKY) */}
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={onResetHome}
              className="flex items-center gap-2 text-left cursor-pointer group focus:outline-none"
              title="Click to return to home view"
            >
              <Logo size="sm" />
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-base font-black tracking-tight text-white text-gradient truncate group-hover:opacity-90">
                  Your task Manager
                </span>
                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-sm shrink-0 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                  <span className="text-[8px]">AI</span>
                </span>
              </div>
            </button>
          </div>

          {/* Lines 2, 3, 4: Collapsible on scroll (hidden when scrolled, visible at top with smooth reveal effect) */}
          <div className={`flex flex-col gap-2 w-full transition-all duration-350 ease-out ${
            isScrolled 
              ? 'max-h-0 opacity-0 pointer-events-none -translate-y-2 overflow-hidden' 
              : isUserMenuOpen
              ? 'max-h-[350px] opacity-100 translate-y-0 overflow-visible relative z-50 animate-nav-reveal'
              : 'max-h-[350px] opacity-100 translate-y-0 overflow-visible animate-nav-reveal'
          }`}>
            {/* LINE 2: Actions Bar distributed evenly across full width */}
            <div className="flex items-center justify-between w-full p-1 rounded-2xl bg-slate-900/60 [html.light_&]:bg-slate-100/90 border border-white/10 [html.light_&]:border-slate-200/80 shadow-sm gap-1 transition-all duration-300">
              {/* Focus Timer Button - Flex growing with timer status */}
              <button
                type="button"
                onClick={onOpenFocusTimer}
                className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer ${
                  isAnyRunning
                    ? 'bg-emerald-950/80 text-emerald-300 animate-live-timer shadow-sm'
                    : activeSession?.timeLeft < activeSession?.totalDuration
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
                title="Focus Timer"
              >
                <Timer className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px] whitespace-nowrap">
                  {isAnyRunning || activeSession?.timeLeft < activeSession?.totalDuration
                    ? `${String(Math.floor(activeSession.timeLeft / 60)).padStart(2, '0')}:${String(activeSession.timeLeft % 60).padStart(2, '0')}`
                    : 'Timer'}
                </span>
              </button>

              <div className="w-px h-4 bg-white/10 [html.light_&]:bg-slate-300/80 shrink-0"></div>

              {/* Light & Dark Mode Toggle Button */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex-1 py-1.5 rounded-xl text-slate-300 [html.light_&]:text-slate-700 hover:text-amber-400 hover:bg-white/5 [html.light_&]:hover:bg-white/60 transition-colors flex items-center justify-center cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform active:rotate-90" />
                ) : (
                  <Moon className="w-4 h-4 text-violet-500 transition-transform active:-rotate-45" />
                )}
              </button>

              <div className="w-px h-4 bg-white/10 [html.light_&]:bg-slate-300/80 shrink-0"></div>

              {/* Mobile User Profile Trigger with Popover attached */}
              {currentUser && (
                <div className="flex-1 flex justify-center relative" ref={mobileUserMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      soundFx.playPop();
                    }}
                    className="w-full py-1 rounded-xl text-slate-200 flex items-center justify-center gap-1 text-xs font-bold cursor-pointer hover:bg-white/5 [html.light_&]:hover:bg-white/60 transition-colors"
                    title="User Profile & Logout"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-[10px] text-white shadow-sm ring-1 ring-white/20">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {/* Dropdown rendered right under the mobile avatar */}
                  {isUserMenuOpen && renderUserDropdown()}
                </div>
              )}

              <div className="w-px h-4 bg-white/10 [html.light_&]:bg-slate-300/80 shrink-0"></div>

              {/* Speaker / Audio Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex-1 py-1.5 rounded-xl text-slate-300 [html.light_&]:text-slate-700 hover:text-white hover:bg-white/5 [html.light_&]:hover:bg-white/60 transition-colors flex items-center justify-center cursor-pointer"
                title={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              <div className="w-px h-4 bg-white/10 [html.light_&]:bg-slate-300/80 shrink-0"></div>

              {/* Guide / Tour Button */}
              <button
                type="button"
                onClick={onOpenTour}
                className="flex-1 py-1.5 rounded-xl text-slate-300 [html.light_&]:text-slate-700 hover:text-violet-300 hover:bg-white/5 [html.light_&]:hover:bg-white/60 transition-colors flex items-center justify-center cursor-pointer"
                title="User Guide Tour"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <div className="w-px h-4 bg-white/10 [html.light_&]:bg-slate-300/80 shrink-0"></div>

              {/* Task Completed Stats Badge */}
              <div className="flex-1 flex items-center justify-center" title="Completed / Total Tasks">
                <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 [html.light_&]:bg-emerald-500/15 px-2 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                  <span className="text-[10px] font-mono">{taskStats.completed}/{taskStats.total}</span>
                </div>
              </div>
            </div>

          {/* LINE 3: Search Bar */}
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors pointer-events-none ${
              searchQuery ? 'text-cyan-400' : 'text-slate-400'
            }`} />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Task..."
              className="w-full bg-slate-950/85 border border-white/15 focus:border-cyan-500/60 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  soundFx.playPop();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md bg-slate-800 text-slate-400 hover:text-white"
                title="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* LINE 4: View Switcher (Kanban, List, Analytics, History) in single row */}
          <div 
            className="no-scrollbar flex items-center p-0.5 bg-slate-950/80 rounded-2xl border border-white/15 w-full justify-between overflow-x-auto shadow-inner gap-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              type="button"
              onClick={() => {
                setCurrentView('kanban');
                soundFx.playPop();
              }}
              className={`flex-1 py-1 px-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                currentView === 'kanban'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span>Kanban</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentView('list');
                soundFx.playPop();
              }}
              className={`flex-1 py-1 px-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                currentView === 'list'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5 shrink-0" />
              <span>List</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentView('analytics');
                soundFx.playPop();
              }}
              className={`flex-1 py-1 px-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                currentView === 'analytics'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentView('history');
                soundFx.playPop();
              }}
              className={`flex-1 py-1 px-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                currentView === 'history'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5 shrink-0" />
              <span>History</span>
              {deletedHistoryCount > 0 && (
                <span className={`px-1 rounded-full text-[8px] font-black leading-none ${
                  currentView === 'history' ? 'bg-white/25 text-white' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {deletedHistoryCount}
                </span>
              )}
            </button>
          </div>

        </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW (Screens >= 768px): High-density streamlined single row     */}
        {/* ========================================================================= */}
        <div className="hidden md:flex items-center justify-between gap-3 w-full">
          
          {/* Left: Brand Logo & Title (Click to return to home) */}
          <button
            type="button"
            onClick={onResetHome}
            className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group focus:outline-none"
            title="Click to return to home view"
          >
            <Logo size="md" />
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white text-gradient whitespace-nowrap group-hover:opacity-90">
                  Your task Manager
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-sm shrink-0 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                  <span>AI Powered</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap hidden xl:block">
                Smart Task Intelligence & Deep Work
              </p>
            </div>
          </button>

          {/* Center: Search Bar with Expand on Focus */}
          <div id="tour-search-bar" className="relative w-28 lg:w-40 xl:w-48 focus-within:w-44 lg:focus-within:w-56 shrink-0 transition-all duration-300 group">
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
                className="w-full bg-slate-950/85 border border-white/15 focus:border-cyan-500/60 rounded-xl pl-7 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              />

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
                  <span className="flex items-center px-1 py-0.2 rounded bg-slate-900 border border-white/10 text-[9px] font-mono font-bold text-slate-500 select-none pointer-events-none group-focus-within:border-cyan-500/30 group-focus-within:text-cyan-400">
                    /
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: View Switcher & Desktop Tools */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Main Navigation Views - Glass Capsule Switcher */}
            <div 
              id="tour-view-switcher" 
              className="no-scrollbar flex items-center p-0.5 bg-slate-950/80 rounded-2xl border border-white/15 overflow-x-auto shadow-inner shrink-0 gap-0.5"
            >
              <button
                type="button"
                onClick={() => {
                  setCurrentView('kanban');
                  soundFx.playPop();
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                  currentView === 'kanban'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span>Kanban</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('list');
                  soundFx.playPop();
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                  currentView === 'list'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <List className="w-3.5 h-3.5 shrink-0" />
                <span>List</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('analytics');
                  soundFx.playPop();
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                  currentView === 'analytics'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                <span>Analytics</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('history');
                  soundFx.playPop();
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                  currentView === 'history'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.35)]'
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

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-amber-400 transition-all text-xs shrink-0 cursor-pointer shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-violet-400" />}
            </button>

            {/* Desktop User Profile */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    soundFx.playPop();
                  }}
                  className="px-2 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-200 flex items-center gap-1 text-xs font-bold transition-all shadow-sm hover:border-violet-500/40 cursor-pointer shrink-0"
                  title="Click to view profile or logout"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="max-w-[75px] truncate text-slate-100">
                    Hi, {currentUser.name}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isUserMenuOpen ? 'rotate-180 text-violet-400' : ''
                  }`} />
                </button>

                {isUserMenuOpen && renderUserDropdown()}
              </div>
            )}

            {/* Desktop Focus Timer */}
            <button
              id="tour-focus-timer"
              onClick={onOpenFocusTimer}
              className={`px-2 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer relative overflow-hidden ${
                isAnyRunning
                  ? 'bg-emerald-950/80 border-emerald-400/90 text-emerald-300 animate-live-timer'
                  : activeSession?.timeLeft < activeSession?.totalDuration
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 shadow-lg shadow-emerald-500/10'
              }`}
              title={isAnyRunning ? `${activeMode.toUpperCase()} is Running - Click to view` : 'Launch Zen Pomodoro Timer'}
            >
              <div className="flex items-center gap-1 relative z-10">
                {isAnyRunning && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse"></span>
                )}
                <Timer className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>

              {isAnyRunning || activeSession?.timeLeft < activeSession?.totalDuration ? (
                <div className="flex items-center gap-1 font-mono relative z-10">
                  <span className="tracking-wider text-white text-[11px]">
                    {String(Math.floor(activeSession.timeLeft / 60)).padStart(2, '0')}:
                    {String(activeSession.timeLeft % 60).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase font-sans font-extrabold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {activeMode === 'focus' ? 'Focus' : activeMode === 'shortBreak' ? 'Short' : 'Long'}
                  </span>
                </div>
              ) : (
                <span className="relative z-10 hidden 2xl:inline">Focus Timer</span>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              id="tour-sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-white transition-all text-xs shrink-0 cursor-pointer"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {/* Tour / Guide Button */}
            <button
              onClick={onOpenTour}
              className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-violet-300 transition-all text-xs shrink-0 cursor-pointer"
              title="Feature Tour & User Guide"
              aria-label="User Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Stats Badge */}
            <div id="tour-stats-badge" className="flex items-center gap-1 pl-1 border-l border-white/10 text-xs shrink-0 whitespace-nowrap">
              <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px]">
                {taskStats.completed}/{taskStats.total}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
