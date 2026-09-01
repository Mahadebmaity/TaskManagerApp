import React, { useState } from 'react';
import { 
  History, 
  RotateCcw, 
  Trash2, 
  Search, 
  Clock, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Layers,
  Filter
} from 'lucide-react';
import { soundFx } from '../utils/effects';

// Helper for readable relative time ago (e.g. 20m ago, 2h ago, 2d ago)
function formatTimeAgo(dateString) {
  if (!dateString) return 'Just now';
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.max(0, Math.floor((now - date) / 1000));

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

function formatFullDateTime(dateString) {
  if (!dateString) return 'Today';
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

const priorityBadges = {
  high: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  low: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
};

const statusBadges = {
  todo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  in_progress: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  under_review: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
};

export default function HistoryView({ 
  deletedTasks = [], 
  onRestoreTask, 
  onPermanentDeleteTask, 
  onClearAllHistory,
  onNavigateBack 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'

  const filteredHistory = deletedTasks.filter((t) => {
    if (selectedFilter !== 'all' && t.priority !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchTags = t.tags?.some((tag) => tag.toLowerCase().includes(q));
      return matchTitle || matchTags;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600/30 to-amber-600/30 border border-rose-500/30 text-rose-400 shadow-md">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Deleted Tasks History
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                {deletedTasks.length} archived
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review all removed tasks with exact creation & deletion timestamps. Restore anytime!
            </p>
          </div>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-slate-950/70 border border-white/10 focus:border-rose-500 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Clear All History Button */}
          {deletedTasks.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to permanently delete all archived tasks? This action cannot be undone.')) {
                  onClearAllHistory();
                  soundFx.playPop();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Empty Trash Archive"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Trash</span>
            </button>
          )}
        </div>

      </div>

      {/* Main List / Table */}
      {filteredHistory.length === 0 ? (
        /* Empty History State */
        <div className="glass-card rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-md mx-auto my-8 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-center mx-auto text-slate-500 shadow-inner">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">No Deleted Tasks Found</h3>
            <p className="text-xs text-slate-400">
              {deletedTasks.length === 0 
                ? 'Your trash archive is clean. Deleted tasks will automatically appear here with full timestamps.' 
                : 'No deleted tasks match your search filter.'}
            </p>
          </div>
        </div>
      ) : (
        /* History Task Rows */
        <div className="space-y-3">
          {filteredHistory.map((task) => (
            <div
              key={task.id}
              className="glass-card rounded-2xl p-3.5 sm:p-4 border border-white/10 hover:border-rose-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5 group shadow-md"
            >
              {/* Left: Task Identity & Tags */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0 mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                    {task.title}
                  </h4>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    {/* Priority */}
                    {task.priority && (
                      <span className={`px-1.5 py-0.5 rounded uppercase font-bold border ${priorityBadges[task.priority] || priorityBadges.medium}`}>
                        {task.priority}
                      </span>
                    )}

                    {/* Status */}
                    {task.status && (
                      <span className={`px-1.5 py-0.5 rounded uppercase font-bold border ${statusBadges[task.status] || statusBadges.todo}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.map((tag) => (
                      <span key={tag} className="text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                        #{tag}
                      </span>
                    ))}

                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <span className="text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-white/5">
                        {task.subtasks.length} subtasks
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle: Creation & Deletion Timestamps */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 py-2 px-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs shrink-0">
                
                {/* Creation Timestamp */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>Created</span>
                  </span>
                  <div className="font-mono text-[11px] text-slate-300 font-semibold">
                    {formatTimeAgo(task.createdAt || task.dueDate)}
                  </div>
                  <div className="text-[9.5px] text-slate-500 font-mono">
                    {formatFullDateTime(task.createdAt || task.dueDate)}
                  </div>
                </div>

                {/* Deletion Timestamp */}
                <div className="space-y-0.5 pl-3 sm:pl-4 border-l border-white/10">
                  <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" />
                    <span>Deleted</span>
                  </span>
                  <div className="font-mono text-[11px] text-rose-300 font-semibold">
                    {formatTimeAgo(task.deletedAt || new Date().toISOString())}
                  </div>
                  <div className="text-[9.5px] text-slate-500 font-mono">
                    {formatFullDateTime(task.deletedAt || new Date().toISOString())}
                  </div>
                </div>

              </div>

              {/* Right: Actions (Restore & Permanent Delete) */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {/* Restore Button */}
                <button
                  type="button"
                  onClick={() => {
                    onRestoreTask(task);
                    soundFx.playCompletionChime();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                  title="Restore task to active workspace"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>

                {/* Permanent Delete Button */}
                <button
                  type="button"
                  onClick={() => {
                    onPermanentDeleteTask(task.id);
                    soundFx.playPop();
                  }}
                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
                  title="Delete Permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
