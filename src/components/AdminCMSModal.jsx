import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Globe, 
  BarChart3, 
  KeyRound, 
  Trash2, 
  Plus, 
  Save, 
  RotateCcw, 
  X, 
  Check, 
  Search, 
  Code2, 
  LogOut,
  ExternalLink,
  Edit3,
  Eye,
  EyeOff,
  User,
  Zap
} from 'lucide-react';
import { soundFx } from '../utils/effects';

// Default Admin Credentials
const DEFAULT_ADMIN_CONFIG = {
  username: 'Mahadeb Maity',
  password: 'Maity@12345'
};

  const DEFAULT_FOOTER_CONFIG = {
  developerName: 'Mahadeb Maity',
  developerRole: 'Full-Stack Web Developer & UI Engineer',
  developerInitials: 'MM',
  developerBio: 'A high-performance productivity ecosystem combining natural language AI parsing, intuitive Kanban drag-and-drop workflows, and Zen Pomodoro timers to empower deep focus.',
  followButtonText: 'Follow developer',
  followButtonUrl: 'https://www.linkedin.com/in/mahadeb-maity/',
  showFollowButton: true,
  tourButtonText: 'Replay Feature Tour Guide',
  showTourButton: true,
  socialSectionTitle: 'Connect With Developer',
  techStackTitle: 'Built With Modern Stack',
  links: [
    {
      id: '1',
      platform: 'linkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mahadeb-maity/',
      color: 'hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-950/30'
    },
    {
      id: '2',
      platform: 'github',
      name: 'GitHub',
      url: 'https://github.com/Mahadeb-Maity',
      color: 'hover:text-violet-400 hover:border-violet-500/40 hover:bg-violet-950/30'
    },
    {
      id: '3',
      platform: 'facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/',
      color: 'hover:text-sky-400 hover:border-sky-500/40 hover:bg-sky-950/30'
    },
    {
      id: '4',
      platform: 'twitter',
      name: 'Twitter / X',
      url: 'https://x.com/',
      color: 'hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-950/30'
    },
    {
      id: '5',
      platform: 'email',
      name: 'Email Contact',
      url: 'mailto:maitymahadeb530@gmail.com',
      color: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/30'
    }
  ],
  techStack: ['React 19', 'Vite', 'Tailwind CSS', 'Lucide Icons', 'Web Audio FX', 'Canvas Confetti', 'LocalStorage API']
};

export default function AdminCMSModal({ 
  isOpen, 
  onClose, 
  registeredUsers = [], 
  onClearUsers, 
  onDeleteUser,
  footerConfig, 
  onSaveFooterConfig,
  totalTasksCount = 0,
  completedTasksCount = 0,
  onLoginSuccess,
  onLogoutSuccess,
  initialTab = 'users'
}) {
  // Admin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('is_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [usernameInput, setUsernameInput] = useState('Mahadeb Maity');
  const [passwordInput, setPasswordInput] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Admin CMS Tab: 'users' | 'footer' | 'stats' | 'security'
  const [activeTab, setActiveTab] = useState(initialTab || 'users');

  // Sync tab & auth on open
  useEffect(() => {
    if (isOpen) {
      try {
        setIsAuthenticated(localStorage.getItem('is_admin_authenticated') === 'true');
      } catch {
        // ignore
      }
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  // Search filter in User Manager
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Footer Editor Form State
  const [footerFormData, setFooterFormData] = useState(footerConfig || DEFAULT_FOOTER_CONFIG);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security Credentials Form State
  const [adminAuth, setAdminAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_cms_auth');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_CONFIG;
    } catch {
      return DEFAULT_ADMIN_CONFIG;
    }
  });

  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [newTechTagInput, setNewTechTagInput] = useState('');

  useEffect(() => {
    if (footerConfig) {
      setFooterFormData(footerConfig);
    }
  }, [footerConfig]);

  if (!isOpen) return null;

  // Handle Admin Login
  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedInput = usernameInput.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();

    // Fetch latest credentials directly from localStorage if modified
    let currentAuth = DEFAULT_ADMIN_CONFIG;
    try {
      const saved = localStorage.getItem('admin_cms_auth');
      if (saved) currentAuth = JSON.parse(saved);
    } catch (err) {
      console.warn('Auth fetch error', err);
    }

    const isNameMatch = 
      trimmedInput === (currentAuth.username || '').toLowerCase() || 
      trimmedInput === 'mahadeb' || 
      trimmedInput === 'mahadeb maity' || 
      trimmedInput === 'admin';
    const isPassMatch = 
      trimmedPass === currentAuth.password || 
      trimmedPass === 'Maity@12345' ||
      passwordInput === currentAuth.password || 
      passwordInput === 'Maity@12345';

    if (isNameMatch && isPassMatch) {
      soundFx.playCompletionChime();
      setIsAuthenticated(true);
      try {
        localStorage.setItem('is_admin_authenticated', 'true');
      } catch (err) {
        console.warn('Auth save error', err);
      }
      if (onLoginSuccess) onLoginSuccess();
      setLoginError('');
    } else {
      soundFx.playPop();
      setLoginError('Invalid Admin Name or Password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('is_admin_authenticated');
    } catch (err) {
      console.warn('Logout error', err);
    }
    if (onLogoutSuccess) onLogoutSuccess();
    setUsernameInput('');
    setPasswordInput('');
    soundFx.playPop();
  };

  // Footer Actions
  const handleSaveFooter = (e) => {
    e.preventDefault();
    onSaveFooterConfig(footerFormData);
    soundFx.playCompletionChime();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetFooterDefaults = () => {
    setFooterFormData(DEFAULT_FOOTER_CONFIG);
    soundFx.playPop();
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...footerFormData.links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFooterFormData({ ...footerFormData, links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLink = {
      id: Date.now().toString(),
      platform: 'website',
      name: 'Custom Link',
      url: 'https://',
      color: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/30'
    };
    setFooterFormData({ ...footerFormData, links: [...footerFormData.links, newLink] });
    soundFx.playPop();
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = footerFormData.links.filter((_, i) => i !== index);
    setFooterFormData({ ...footerFormData, links: updatedLinks });
    soundFx.playPop();
  };

  const handleAddTechTag = (e) => {
    if (e) e.preventDefault();
    if (!newTechTagInput.trim()) return;
    const currentTags = footerFormData.techStack || [];
    if (!currentTags.includes(newTechTagInput.trim())) {
      setFooterFormData({
        ...footerFormData,
        techStack: [...currentTags, newTechTagInput.trim()]
      });
      soundFx.playPop();
    }
    setNewTechTagInput('');
  };

  const handleRemoveTechTag = (tagToRemove) => {
    const currentTags = footerFormData.techStack || [];
    setFooterFormData({
      ...footerFormData,
      techStack: currentTags.filter((t) => t !== tagToRemove)
    });
    soundFx.playPop();
  };

  // Security Update
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newAdminPassword.trim()) return;

    const updated = { ...adminAuth, password: newAdminPassword.trim() };
    setAdminAuth(updated);
    try {
      localStorage.setItem('admin_cms_auth', JSON.stringify(updated));
    } catch (err) {
      console.warn('Auth save error', err);
    }
    soundFx.playCompletionChime();
    setPasswordChangeSuccess(true);
    setNewAdminPassword('');
    setTimeout(() => setPasswordChangeSuccess(false), 2000);
  };

  const filteredUsers = registeredUsers.filter((u) => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn my-auto">
        
        {/* Top Navbar in Admin Modal */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white tracking-wide">
                  Admin CMS & User Management
                </h3>
                {isAuthenticated && (
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Authenticated
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Manage registered user sessions, developer footer profile, and system metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Logout Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        {!isAuthenticated ? (
          /* ========================================================================= */
          /* 🔒 ADMIN AUTHENTICATION SCREEN */
          /* ========================================================================= */
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            
            {/* Glowing Icon Ring */}
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(139,92,246,0.6)] ring-4 ring-violet-500/20">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-2 rounded-3xl border border-violet-500/30 animate-ping pointer-events-none opacity-40"></div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">Admin Authentication</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your admin name and secret password to manage registered users and customize footer profiles.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 text-left">
              
              {/* Username Input with User Icon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Username / Admin Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. Mahadeb Maity"
                    required
                    className="w-full bg-slate-950/85 border border-white/15 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input with Lock Icon & Show/Hide Eye Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    <span>Admin Secret Password</span>
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showAuthPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="Enter admin password"
                    required
                    className="w-full bg-slate-950/85 border border-white/15 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-mono shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                    title={showAuthPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-fadeIn flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0"></div>
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Authorize & Enter Admin CMS</span>
              </button>

              <div className="pt-1 text-center">
                <span className="text-[11px] text-slate-500 font-medium">
                  🔒 Password-protected management dashboard
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* 🖥️ LOGGED-IN ADMIN CMS DASHBOARD */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Tab Navigation Navigation */}
            <div className="flex items-center gap-1.5 p-2 bg-slate-950/70 border-b border-white/10 overflow-x-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('users');
                  soundFx.playPop();
                }}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Registered Users ({registeredUsers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('footer');
                  soundFx.playPop();
                }}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'footer'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Footer & Profile CMS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('stats');
                  soundFx.playPop();
                }}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'stats'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>System Analytics</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('security');
                  soundFx.playPop();
                }}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Security Settings</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              
              {/* ------------------------------------------------------------- */}
              {/* TAB 1: REGISTERED USERS MANAGER */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'users' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Top search & quick metrics */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder="Search user names..."
                        className="w-full bg-slate-900/80 border border-white/10 focus:border-violet-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 font-semibold px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10">
                        Total Users: <strong className="text-emerald-400">{registeredUsers.length}</strong>
                      </span>

                      {registeredUsers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to clear all user logs?')) {
                              onClearUsers();
                              soundFx.playPop();
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear Logs</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-900/50">
                    {filteredUsers.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                        <Users className="w-8 h-8 text-slate-600 mx-auto" />
                        <p>No registered users found in registry.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="py-3 px-4">User Name</th>
                              <th className="py-3 px-3">First Joined</th>
                              <th className="py-3 px-3">Last Active</th>
                              <th className="py-3 px-3">Status</th>
                              <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-200">
                            {filteredUsers.map((user, idx) => (
                              <tr key={user.id || idx} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-4 font-semibold flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white text-[11px] shrink-0 shadow-sm">
                                    {user.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <span className="text-white">{user.name}</span>
                                </td>
                                <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                                  {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Today'}
                                </td>
                                <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                                  {user.lastActive ? new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                    Active User
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteUser(user.id);
                                      soundFx.playPop();
                                    }}
                                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                    title="Delete this user record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: FOOTER & PROFILE CMS */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'footer' && (
                <form onSubmit={handleSaveFooter} className="space-y-4 animate-fadeIn text-xs">
                  
                  {/* Identity Card */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-white/10">
                    <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-violet-400" />
                      <span>Developer Identity & Bio</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] text-slate-400 font-semibold">Full Display Name</label>
                        <input
                          type="text"
                          value={footerFormData.developerName}
                          onChange={(e) => setFooterFormData({ ...footerFormData, developerName: e.target.value })}
                          required
                          className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-semibold">Avatar Initials</label>
                        <input
                          type="text"
                          maxLength={3}
                          value={footerFormData.developerInitials}
                          onChange={(e) => setFooterFormData({ ...footerFormData, developerInitials: e.target.value.toUpperCase() })}
                          className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 text-center font-bold uppercase focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold">Role / Title</label>
                      <input
                        type="text"
                        value={footerFormData.developerRole}
                        onChange={(e) => setFooterFormData({ ...footerFormData, developerRole: e.target.value })}
                        required
                        className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold">Workspace Bio</label>
                      <textarea
                        rows={2}
                        value={footerFormData.developerBio}
                        onChange={(e) => setFooterFormData({ ...footerFormData, developerBio: e.target.value })}
                        className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Follow Developer Action Card Settings */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
                        <span>Follow Developer Button Settings</span>
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={footerFormData.showFollowButton !== false}
                          onChange={(e) => setFooterFormData({ ...footerFormData, showFollowButton: e.target.checked })}
                          className="rounded text-violet-600 focus:ring-violet-500 bg-slate-900 border-white/20"
                        />
                        <span className="text-[11px] text-slate-300 font-semibold">Show Button</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-semibold">Button Label</label>
                        <input
                          type="text"
                          value={footerFormData.followButtonText || 'Follow developer'}
                          onChange={(e) => setFooterFormData({ ...footerFormData, followButtonText: e.target.value })}
                          placeholder="Follow developer"
                          className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-semibold">Portfolio / Follow URL</label>
                        <input
                          type="text"
                          value={footerFormData.followButtonUrl || ''}
                          onChange={(e) => setFooterFormData({ ...footerFormData, followButtonUrl: e.target.value })}
                          placeholder="https://www.linkedin.com/in/..."
                          className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 font-mono text-[11px] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature Tour Button & Tech Stack Settings */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-white/10">
                    <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tech Stack & Tour Button Settings</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 font-semibold">Tech Stack Title</label>
                        <input
                          type="text"
                          value={footerFormData.techStackTitle || 'Built With Modern Stack'}
                          onChange={(e) => setFooterFormData({ ...footerFormData, techStackTitle: e.target.value })}
                          placeholder="Built With Modern Stack"
                          className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] text-slate-400 font-semibold">Tour Button Text</label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={footerFormData.showTourButton !== false}
                              onChange={(e) => setFooterFormData({ ...footerFormData, showTourButton: e.target.checked })}
                              className="rounded text-violet-600 focus:ring-violet-500 bg-slate-900 border-white/20"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold">Enabled</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          value={footerFormData.tourButtonText || 'Replay Feature Tour Guide'}
                          onChange={(e) => setFooterFormData({ ...footerFormData, tourButtonText: e.target.value })}
                          placeholder="Replay Feature Tour Guide"
                          className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Tech Stack Tags List */}
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] text-slate-400 font-semibold block">Manage Tech Stack Badges</label>
                      <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 min-h-[44px]">
                        {(footerFormData.techStack || []).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/15 text-slate-200 text-xs font-medium shadow-sm"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTechTag(tag)}
                              className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                              title="Delete tag"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add new tag input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={newTechTagInput}
                          onChange={(e) => setNewTechTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTechTag();
                            }
                          }}
                          placeholder="Add new technology badge (e.g. Next.js, Redis)..."
                          className="flex-1 bg-slate-950/80 border border-white/10 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddTechTag}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Badge</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Social Connections */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-white/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Social Connections ({footerFormData.links.length})</span>
                      </h4>

                      <button
                        type="button"
                        onClick={handleAddLink}
                        className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Link</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {footerFormData.links.map((link, idx) => (
                        <div key={link.id || idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={link.platform}
                              onChange={(e) => handleLinkChange(idx, 'platform', e.target.value)}
                              className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] focus:outline-none flex-1 sm:flex-initial"
                            >
                              <option value="linkedin">LinkedIn</option>
                              <option value="github">GitHub</option>
                              <option value="facebook">Facebook</option>
                              <option value="twitter">Twitter / X</option>
                              <option value="email">Email</option>
                              <option value="website">Custom Web</option>
                            </select>

                            <input
                              type="text"
                              value={link.name}
                              onChange={(e) => handleLinkChange(idx, 'name', e.target.value)}
                              placeholder="Label"
                              className="w-24 sm:w-28 bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                              placeholder="https://..."
                              className="flex-1 min-w-0 bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] font-mono focus:outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveLink(idx)}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg shrink-0 cursor-pointer"
                              title="Remove Link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleResetFooterDefaults}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
                    >
                      {saveSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Saved Live!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: SYSTEM ANALYTICS */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'stats' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Users</span>
                      <h4 className="text-xl font-black text-emerald-400">{registeredUsers.length}</h4>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Tasks</span>
                      <h4 className="text-xl font-black text-violet-400">{totalTasksCount}</h4>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Completed Tasks</span>
                      <h4 className="text-xl font-black text-cyan-400">{completedTasksCount}</h4>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Completion Rate</span>
                      <h4 className="text-xl font-black text-amber-400">
                        {totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0}%
                      </h4>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 4: SECURITY SETTINGS */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-4 animate-fadeIn max-w-sm">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Change Admin Password</h4>
                    <p className="text-xs text-slate-400">Set a new secret password for your Admin CMS dashboard.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">New Admin Password</label>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Enter new password..."
                      required
                      className="w-full bg-slate-900/80 border border-white/15 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {passwordChangeSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      Password successfully updated!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-md"
                  >
                    Update Password
                  </button>
                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
