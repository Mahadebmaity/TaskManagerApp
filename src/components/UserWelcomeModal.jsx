import React, { useState } from 'react';
import Logo from './Logo';
import { 
  Sparkles, 
  ArrowRight, 
  User, 
  Shield, 
  Zap, 
  Lock, 
  ShieldCheck, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../utils/effects';

export default function UserWelcomeModal({ 
  isOpen, 
  onSaveUserName, 
  onAdminLoginSuccess 
}) {
  // Mode: 'user' | 'admin'
  const [entryMode, setEntryMode] = useState('user');

  // User input
  const [userName, setUserName] = useState('');
  const [userError, setUserError] = useState('');

  // Admin inputs
  const [adminName, setAdminName] = useState('Mahadeb Maity');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  // Handle User Entry
  const handleUserSubmit = (e) => {
    e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) {
      setUserError('Please enter your name to continue.');
      return;
    }

    soundFx.playCompletionChime();
    onSaveUserName(trimmed);
  };

  // Handle Admin Login
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const inputName = (adminName.trim() || 'Mahadeb Maity').toLowerCase();
    const trimmedPass = adminPassword.trim();
    
    // Check credentials: Mahadeb Maity / Maity@12345 (or admin / Maity@12345)
    let savedAuth = { username: 'Mahadeb Maity', password: 'Maity@12345' };
    try {
      const stored = localStorage.getItem('admin_cms_auth');
      if (stored) savedAuth = JSON.parse(stored);
    } catch (e) {
      console.warn('Auth fetch error', e);
    }

    const isNameMatch = 
      inputName === (savedAuth.username || '').toLowerCase() || 
      inputName === 'mahadeb' || 
      inputName === 'mahadeb maity' || 
      inputName === 'admin';
    const isPasswordMatch = 
      trimmedPass === savedAuth.password || 
      trimmedPass === 'Maity@12345' ||
      adminPassword === savedAuth.password ||
      adminPassword === 'Maity@12345';

    if (isNameMatch && isPasswordMatch) {
      soundFx.playCompletionChime();
      setAdminError('');
      // Save admin session & trigger Admin CMS
      try {
        localStorage.setItem('is_admin_authenticated', 'true');
      } catch (e) {
        console.warn('Storage error', e);
      }
      onAdminLoginSuccess(adminName.trim() || savedAuth.username || 'Mahadeb Maity');
    } else {
      soundFx.playPop();
      setAdminError('Invalid Admin Name or Password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 relative space-y-5 animate-scaleIn text-center my-auto">
        
        {/* Brand Logo & Top Switcher Tabs */}
        <div className="flex flex-col items-center gap-2.5">
          <Logo size="lg" />

          {/* Mode Switcher Pills: User Entry | Admin Portal */}
          <div className="flex items-center p-1 bg-slate-950/90 rounded-2xl border border-white/10 text-xs font-bold w-full max-w-xs mt-1 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setEntryMode('user');
                soundFx.playPop();
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                entryMode === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Entry</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEntryMode('admin');
                soundFx.playPop();
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                entryMode === 'admin'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 👤 USER ENTRY MODE */}
        {/* ------------------------------------------------------------- */}
        {entryMode === 'user' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight text-gradient">
                Welcome to Your task Manager
              </h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Enter your name to initialize your workspace and start your interactive feature tour.
              </p>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 pl-1">
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  <span>Enter Your Name / আপনার নাম:</span>
                </label>
                
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (userError) setUserError('');
                  }}
                  placeholder="e.g. Alex or Mahadeb"
                  autoFocus
                  className="w-full bg-slate-900/90 border border-white/15 focus:border-violet-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all font-medium"
                />

                {userError && (
                  <p className="text-xs text-rose-400 pl-1 font-medium animate-fadeIn">
                    {userError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!userName.trim()}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-violet-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Continue & Explore Features 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[11px] text-slate-500">
              Are you the Developer/Admin?{' '}
              <button
                type="button"
                onClick={() => setEntryMode('admin')}
                className="text-violet-400 hover:underline font-bold"
              >
                Login as Admin
              </button>
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 🛡️ ADMIN PORTAL LOGIN MODE */}
        {/* ------------------------------------------------------------- */}
        {entryMode === 'admin' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight text-gradient">
                Admin Management Login
              </h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Sign in to manage registered user logs, system telemetry, and footer profile links.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-3.5 text-left text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 pl-1">Admin Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => {
                    setAdminName(e.target.value);
                    if (adminError) setAdminError('');
                  }}
                  placeholder="Mahadeb Maity"
                  required
                  autoFocus
                  className="w-full bg-slate-900/90 border border-white/15 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-[11px] font-semibold text-slate-300">Admin Password</label>
                </div>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (adminError) setAdminError('');
                  }}
                  placeholder="Enter admin password"
                  required
                  className="w-full bg-slate-900/90 border border-white/15 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>

              {adminError && (
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium animate-fadeIn">
                  {adminError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Login & Open Admin CMS</span>
              </button>
            </form>

            <p className="text-[11px] text-slate-500">
              Not an admin?{' '}
              <button
                type="button"
                onClick={() => setEntryMode('user')}
                className="text-violet-400 hover:underline font-bold"
              >
                Continue as User
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
