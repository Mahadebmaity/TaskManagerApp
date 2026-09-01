import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { 
  Heart, 
  Mail, 
  Code2, 
  ExternalLink, 
  HelpCircle, 
  Zap, 
  Globe, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  Edit3 
} from 'lucide-react';
import { soundFx } from '../utils/effects';

// High-fidelity brand SVG icons
const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.74a1.64 1.64 0 0 0-1.64 1.64c0 .9.74 1.64 1.64 1.64s1.64-.74 1.64-1.64c0-.9-.74-1.64-1.64-1.64Z" />
  </svg>
);

const GitHubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XTwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const ICON_MAP = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  facebook: FacebookIcon,
  twitter: XTwitterIcon,
  email: Mail,
  website: Globe
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
      url: 'mailto:mahadebmaity.dev@gmail.com',
      color: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/30'
    }
  ],
  techStack: ['React 19', 'Vite', 'Tailwind CSS', 'Lucide Icons', 'Web Audio FX', 'Canvas Confetti', 'LocalStorage API']
};

export default function Footer({ onOpenTour, onOpenAdminCMS, isAdmin }) {
  const currentYear = new Date().getFullYear();

  // Load customizable Footer Configuration from LocalStorage
  const [footerConfig, setFooterConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_footer_config');
      return saved ? { ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(saved) } : DEFAULT_FOOTER_CONFIG;
    } catch {
      return DEFAULT_FOOTER_CONFIG;
    }
  });

  // Admin Modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [formData, setFormData] = useState(footerConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync when config changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('admin_footer_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          setFooterConfig({ ...DEFAULT_FOOTER_CONFIG, ...parsed });
          setFormData({ ...DEFAULT_FOOTER_CONFIG, ...parsed });
        }
      } catch (err) {
        console.warn('Footer sync error', err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setFooterConfig(formData);
    try {
      localStorage.setItem('admin_footer_config', JSON.stringify(formData));
    } catch (err) {
      console.warn('Save error', err);
    }
    soundFx.playCompletionChime();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsAdminOpen(false);
    }, 1200);
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_FOOTER_CONFIG);
    soundFx.playPop();
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData({ ...formData, links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLink = {
      id: Date.now().toString(),
      platform: 'website',
      name: 'Custom Link',
      url: 'https://',
      color: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/30'
    };
    setFormData({ ...formData, links: [...formData.links, newLink] });
    soundFx.playPop();
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: updatedLinks });
    soundFx.playPop();
  };

  return (
    <footer className="w-full mt-12 border-t border-white/10 glass-panel relative z-20 backdrop-blur-2xl">
      {/* Ambient Top Glow Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Brand & Bio (Span 6) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-white text-gradient">
                  Your task Manager
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Smart Task Intelligence & Deep Work Workspace
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {footerConfig.developerBio}
            </p>

            {/* Developer Card with Connect Links */}
            <div id="tour-footer-connect" className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-3 max-w-md shadow-lg group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md ring-1 ring-white/20">
                  {footerConfig.developerInitials || 'MM'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200">{footerConfig.developerName}</span>
                    {isAdmin && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        Admin / Creator
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{footerConfig.developerRole}</p>
                </div>
              </div>

              {/* Developer Follow Button */}
              {footerConfig.showFollowButton !== false && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={footerConfig.followButtonUrl || footerConfig.links?.find((l) => l.platform === 'linkedin' || l.platform === 'github')?.url || 'https://www.linkedin.com/in/mahadeb-maity/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playPop()}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/35 hover:to-indigo-600/35 text-violet-300 hover:text-white border border-violet-500/30 hover:border-violet-400 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    title={footerConfig.followButtonText || "View Developer Portfolio & Profile"}
                  >
                    <span>{footerConfig.followButtonText || 'Follow developer'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
                  </a>

                  {/* Admin Manage button - ONLY visible if logged in as Admin */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAdminCMS) onOpenAdminCMS('footer');
                        else setIsAdminOpen(true);
                        soundFx.playPop();
                      }}
                      className="p-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 hover:border-violet-400 transition-all text-xs flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                      title="Admin: Edit Developer Profile & Social Links"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Connect & Social Links (Span 3) - Compact Inline Badges */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{footerConfig.socialSectionTitle || 'Connect With Developer'}</span>
            </h4>

            {/* Compact inline chips: icon + name only */}
            <div className="flex flex-wrap gap-2">
              {(footerConfig.links || []).map((social) => {
                const Icon = ICON_MAP[social.platform] || Globe;
                return (
                  <a
                    key={social.id || social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playPop()}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-xs font-semibold transition-all group ${social.color || 'hover:text-violet-400 hover:border-violet-500/40 hover:bg-violet-950/30'} shadow-sm hover:scale-105 active:scale-95`}
                    title={`Open ${social.name}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 3: Tech Stack & Tour Action (Span 3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{footerConfig.techStackTitle || 'Built With Modern Stack'}</span>
            </h4>

            <div className="flex flex-wrap gap-1.5">
              {(footerConfig.techStack || []).map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/10 text-slate-300 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            {footerConfig.showTourButton !== false && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    if (onOpenTour) onOpenTour();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                  <span>{footerConfig.tourButtonText || 'Replay Feature Tour Guide'}</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>© {currentYear}</span>
            <span className="font-bold text-slate-200">Your task Manager</span>
            <span>· All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <span className="font-bold text-slate-200">
              {footerConfig.developerName}
            </span>
            <button
              type="button"
              onClick={() => {
                if (onOpenAdminCMS) onOpenAdminCMS('footer');
                else setIsAdminOpen(true);
                soundFx.playPop();
              }}
              className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer transition-colors"
              title="Admin Footer & CMS Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🛡️ ADMIN FOOTER & DEVELOPER PROFILE MANAGEMENT MODAL */}
      {/* ========================================================================= */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/20 shadow-2xl p-5 sm:p-7 relative space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    Admin Footer & Profile Manager
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live customization of developer profile, bio & connection links.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              
              {/* Section 1: Developer Information */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-white/10">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Developer Identity</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold">Full Name / Display Name</label>
                    <input
                      type="text"
                      value={formData.developerName}
                      onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                      required
                      placeholder="e.g. Mahadeb Maity"
                      className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold">Avatar Initials</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={formData.developerInitials}
                      onChange={(e) => setFormData({ ...formData, developerInitials: e.target.value.toUpperCase() })}
                      placeholder="MM"
                      className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none uppercase font-bold text-center"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">Title / Professional Role</label>
                  <input
                    type="text"
                    value={formData.developerRole}
                    onChange={(e) => setFormData({ ...formData, developerRole: e.target.value })}
                    required
                    placeholder="e.g. Full-Stack Web Developer & UI Engineer"
                    className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">Workspace Bio / Tagline</label>
                  <textarea
                    rows={2}
                    value={formData.developerBio}
                    onChange={(e) => setFormData({ ...formData, developerBio: e.target.value })}
                    placeholder="Brief description about the workspace..."
                    className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Section 2: Social Links Management */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Connection & Social Links ({formData.links.length})</span>
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

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {formData.links.map((link, idx) => (
                    <div key={link.id || idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center gap-2">
                      <select
                        value={link.platform}
                        onChange={(e) => handleLinkChange(idx, 'platform', e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 font-medium text-[11px] focus:outline-none"
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="github">GitHub</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="email">Email</option>
                        <option value="website">Custom Website</option>
                      </select>

                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => handleLinkChange(idx, 'name', e.target.value)}
                        placeholder="Label"
                        className="w-28 bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] focus:outline-none"
                      />

                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] focus:outline-none font-mono"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdminOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
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
              </div>

            </form>

          </div>
        </div>
      )}

    </footer>
  );
}
