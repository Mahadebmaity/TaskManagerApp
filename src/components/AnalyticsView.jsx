import React from 'react';
import { 
  Flame, 
  Clock, 
  Target, 
  PieChart, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Brain, 
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Award
} from 'lucide-react';

export default function AnalyticsView({ tasks = [], userXP = 0, streakDays = 1, focusMinutesToday = 0 }) {
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const underReviewTasks = tasks.filter((t) => t.status === 'under_review');
  
  const highPriorityIncomplete = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed');
  const mediumPriorityIncomplete = tasks.filter((t) => t.priority === 'medium' && t.status !== 'completed');
  const lowPriorityIncomplete = tasks.filter((t) => t.priority === 'low' && t.status !== 'completed');

  const completedCount = completedTasks.length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Calculate Level and XP
  const level = Math.floor(userXP / 100) + 1;
  const currentXP = userXP % 100;

  // Total Estimated Minutes Remaining
  const remainingEstimatedMinutes = tasks
    .filter((t) => t.status !== 'completed')
    .reduce((acc, curr) => acc + (Number(curr.estimatedMinutes) || 30), 0);

  // Category breakdown
  const categoryCounts = {};
  tasks.forEach((t) => {
    const mainTag = t.tags && t.tags.length > 0 ? t.tags[0] : 'general';
    categoryCounts[mainTag] = (categoryCounts[mainTag] || 0) + 1;
  });

  // Dynamic AI Productivity Coach Insights
  const getProductivityAdvice = () => {
    if (highPriorityIncomplete.length > 3) {
      return {
        type: 'warning',
        title: 'High Priority Overload Alert',
        text: `You have ${highPriorityIncomplete.length} urgent high-priority tasks pending. Consider tackling "${highPriorityIncomplete[0]?.title}" first using a 25-minute Zen Pomodoro sprint.`,
        action: 'Focus on Top Urgent Task'
      };
    }
    if (completionRate >= 80 && totalCount > 0) {
      return {
        type: 'success',
        title: 'Outstanding Work Velocity! 🚀',
        text: `You have achieved an ${completionRate}% completion rate today. Your flow state is at peak performance!`,
        action: 'Maintain Flow State'
      };
    }
    if (focusMinutesToday >= 60) {
      return {
        type: 'info',
        title: 'Healthy Deep Work Streak 🔥',
        text: `You have logged ${focusMinutesToday} minutes of deep focus today. Be sure to schedule a 5-minute break to avoid cognitive fatigue.`,
        action: 'Take a Short Breather'
      };
    }
    return {
      type: 'neutral',
      title: 'Ready for Next Sprint',
      text: `You have ${tasks.filter((t) => t.status !== 'completed').length} active tasks left (~${remainingEstimatedMinutes}m total work). Start with high-impact items.`,
      action: 'Launch 25m Focus'
    };
  };

  const advice = getProductivityAdvice();

  return (
    <div className="space-y-6 w-full animate-fadeIn pb-12">
      
      {/* Top Banner: Level & XP Progress + Streak + Focus Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Mastery Level Card */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/10 flex items-center gap-3.5 sm:gap-4 shadow-lg">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg shadow-indigo-500/30 shrink-0">
            L{level}
          </div>
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-200 uppercase tracking-wider text-[11px]">Mastery Level</span>
              <span className="text-violet-300 font-bold font-mono">{currentXP}/100 XP</span>
            </div>
            <div className="w-full bg-slate-900/90 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentXP}%` }}
              ></div>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">+50 XP per completed task!</p>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/10 flex items-center gap-3.5 sm:gap-4 shadow-lg">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 shrink-0">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 fill-amber-300 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Productivity Streak</span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{streakDays} {streakDays === 1 ? 'Day' : 'Days'}</h3>
            <p className="text-[10px] sm:text-[11px] text-amber-400 font-bold">
              {streakDays > 0 ? 'Keep the fire burning!' : 'Complete a task to ignite streak!'}
            </p>
          </div>
        </div>

        {/* Focus Minutes Today */}
        <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/10 flex items-center gap-3.5 sm:gap-4 sm:col-span-2 lg:col-span-1 shadow-lg">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Deep Work Time</span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{focusMinutesToday} mins</h3>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-bold">
              {focusMinutesToday > 0 ? 'Logged in Zen Pomodoro' : 'Start Focus Timer to track time'}
            </p>
          </div>
        </div>

      </div>

      {/* AI Smart Productivity Advice Card - Restructured layout: Icon & Name top, heading title below, then reason & advice */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/15 bg-gradient-to-r from-violet-950/40 via-slate-900/80 to-indigo-950/40 shadow-xl space-y-3">
        {/* Top: Brain Logo + AI Productivity Coach Name Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shrink-0">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-violet-200" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              AI Productivity Coach
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Workload Remaining</span>
            <span className="text-xs sm:text-sm font-black font-mono text-cyan-400">~{remainingEstimatedMinutes} mins</span>
          </div>
        </div>

        {/* Middle: Heading Name */}
        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {advice.title}
        </h4>

        {/* Bottom: Reason & Smart Actionable Guidance */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {advice.text}
        </p>
      </div>

      {/* Eisenhower Matrix & Workload Urgency Quadrants */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 px-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-200 whitespace-nowrap overflow-hidden text-ellipsis">
              Eisenhower Priority Matrix & Workload Health
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-400 font-medium pl-6 sm:pl-0">
            {totalCount} Total Registered Tasks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Quadrant 1: Urgent & High Priority */}
          <div className="glass-card rounded-2xl p-4 border border-rose-500/30 bg-rose-950/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Do First (High)
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold font-mono">
                {highPriorityIncomplete.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Immediate action items requiring prompt focus today.
            </p>
          </div>

          {/* Quadrant 2: Important (Medium Priority) */}
          <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-950/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Schedule (Med)
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                {mediumPriorityIncomplete.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Key development milestones to structure into calendar sprints.
            </p>
          </div>

          {/* Quadrant 3: Low Urgency / Quick Wins */}
          <div className="glass-card rounded-2xl p-4 border border-slate-500/30 bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Delegate / Later
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold font-mono">
                {lowPriorityIncomplete.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Low-urgency tasks, small quick wins, and backlog ideas.
            </p>
          </div>

          {/* Quadrant 4: Completed Goals */}
          <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                {completedCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Finished tasks contributing to your Mastery XP and streaks.
            </p>
          </div>

        </div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Task Completion Velocity Ring */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-200 text-sm">Completion Velocity</h3>
            </div>
            <span className="text-xs font-semibold text-indigo-300 font-mono">{completedCount} of {totalCount} done</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            {/* Circular Velocity Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              {(() => {
                const radius = 58;
                const circumference = 2 * Math.PI * radius; // ~364.424
                const strokeOffset = circumference - (circumference * Math.min(100, Math.max(0, completionRate))) / 100;

                return (
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
                    <circle 
                      cx="72" 
                      cy="72" 
                      r={radius} 
                      stroke="currentColor" 
                      strokeWidth="10" 
                      className="text-slate-900/90" 
                      fill="transparent" 
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="url(#gradient-analytics)"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient-analytics" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                );
              })()}
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white">{completionRate}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Velocity</span>
              </div>
            </div>

            {/* Quick Breakdown Metrics */}
            <div className="space-y-2.5 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-6 text-xs p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span> Completed
                </span>
                <span className="font-bold text-white font-mono">{completedCount}</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-xs p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></span> In Progress
                </span>
                <span className="font-bold text-white font-mono">{inProgressTasks.length}</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-xs p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span> Under Review
                </span>
                <span className="font-bold text-white font-mono">{underReviewTasks.length}</span>
              </div>
              <div className="flex items-center justify-between gap-6 text-xs p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50"></span> To Do
                </span>
                <span className="font-bold text-white font-mono">{todoTasks.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tag Distribution */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-200 text-sm">Hashtag & Category Distribution</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{Object.keys(categoryCounts).length} Categories</span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(categoryCounts).length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No categorized tasks found yet.</p>
            ) : (
              Object.entries(categoryCounts).map(([tag, count]) => {
                const pct = Math.round((count / totalCount) * 100);
                return (
                  <div key={tag} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-violet-300 capitalize">#{tag}</span>
                      <span className="text-slate-400 font-mono">{count} tasks ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
