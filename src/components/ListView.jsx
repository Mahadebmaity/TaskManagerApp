import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Trash2, GripVertical, Pencil, Calendar } from 'lucide-react';
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

function formatCreationDateTime(dateString) {
  if (!dateString) return 'Today';
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export default function ListView({ tasks, allTasks = [], onUpdateStatus, onReorderTasks, onDeleteTask, onSelectTask }) {
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);

  // Extract all unique tags
  const allTags = ['all', ...Array.from(new Set(tasks.flatMap((t) => t.tags || [])))];

  const filteredTasks = tasks.filter((t) => {
    if (selectedTag !== 'all' && (!t.tags || !t.tags.includes(selectedTag))) return false;
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

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

  // Drag and Drop reordering handlers
  const handleDragStart = (e, taskId) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    soundFx.playPop();
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDragOver = (e, targetTaskId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTaskId !== targetTaskId) {
      setDragOverTaskId(targetTaskId);
    }
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    const sourceTaskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    setDraggingTaskId(null);
    setDragOverTaskId(null);

    if (!sourceTaskId || sourceTaskId === targetTaskId) return;

    const currentList = allTasks.length > 0 ? [...allTasks] : [...tasks];
    const sourceIndex = currentList.findIndex((t) => t.id === sourceTaskId);
    const targetIndex = currentList.findIndex((t) => t.id === targetTaskId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const [movedTask] = currentList.splice(sourceIndex, 1);
      currentList.splice(targetIndex, 0, movedTask);
      if (onReorderTasks) {
        onReorderTasks(currentList);
      }
      soundFx.playPop();
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-3.5 sm:p-5 border border-white/10 space-y-4 sm:space-y-5 w-full">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/10">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {['all', 'todo', 'in_progress', 'under_review', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all border shrink-0 ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Priority & Tag Dropdowns */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-900/80 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 sm:px-3 py-1.5 focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-900/80 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 sm:px-3 py-1.5 focus:outline-none focus:border-violet-500 capitalize"
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Tags' : `#${tag}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Items */}
      <div id="tour-list-container" className="space-y-2.5 sm:space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs sm:text-sm">
            No matching tasks found. Adjust your filters or add a new task!
          </div>
        ) : (
          filteredTasks.map((task, idx) => {
            const isDone = task.status === 'completed';
            const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;
            const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
            const isDraggingThis = draggingTaskId === task.id;
            const isDragOverThis = dragOverTaskId === task.id && draggingTaskId !== task.id;

            return (
              <div
                key={task.id}
                id={idx === 0 ? "tour-list-first-task" : undefined}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, task.id)}
                onDrop={(e) => handleDrop(e, task.id)}
                onClick={() => onSelectTask(task)}
                className={`glass-card rounded-xl p-3 sm:p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-grab active:cursor-grabbing group transition-[background-color,border-color,box-shadow,opacity] duration-200 select-none ${
                  isDraggingThis
                    ? 'opacity-30 border-dashed border-violet-400 scale-[0.98]'
                    : isDragOverThis
                    ? 'border-violet-400 bg-violet-950/30 ring-2 ring-violet-500/50'
                    : 'border-white/10 hover:border-violet-500/40'
                }`}
              >
                {/* Left: Drag Handle, Checkbox & Details */}
                <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                  <span className="mt-1 text-slate-600 group-hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors shrink-0" title="Drag to reorder">
                    <GripVertical className="w-4 h-4" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(task.id, isDone ? 'todo' : 'completed');
                    }}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors p-0.5 shrink-0"
                    aria-label={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className={`text-xs sm:text-sm font-semibold leading-tight text-slate-100 ${isDone ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h4>

                    {/* Meta info tags & duration */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400">
                      {/* Priority (Clickable to change) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const pList = ['high', 'medium', 'low'];
                          const nextP = pList[(pList.indexOf(task.priority) + 1) % pList.length];
                          // Update priority
                          onSelectTask({ ...task, priority: nextP });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] uppercase font-bold border transition-all cursor-pointer ${priorityBadges[task.priority]}`}
                        title="Click to cycle priority"
                      >
                        {task.priority}
                      </button>

                      {/* Status (Clickable to cycle) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const sList = ['todo', 'in_progress', 'under_review', 'completed'];
                          const nextS = sList[(sList.indexOf(task.status) + 1) % sList.length];
                          onUpdateStatus(task.id, nextS);
                          soundFx.playPop();
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] uppercase font-bold border transition-all cursor-pointer ${statusBadges[task.status]}`}
                        title="Click to advance status"
                      >
                        {task.status.replace('_', ' ')}
                      </button>

                      {/* Due Date */}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                          <Clock className="w-2.5 h-2.5 text-cyan-400" />
                          {new Date(task.dueDate).toLocaleString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.map((tag) => (
                        <span key={tag} className="text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                          #{tag}
                        </span>
                      ))}

                      {/* Subtasks Count */}
                      {totalSubtasks > 0 && (
                        <span className="text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-white/5">
                          {completedSubtasks}/{totalSubtasks} subtasks
                        </span>
                      )}

                      {/* Estimated time */}
                      {task.estimatedMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {task.estimatedMinutes}m
                        </span>
                      )}

                      {/* Created Time Ago for mobile view */}
                      <span className="flex md:hidden items-center gap-1 text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-white/10 font-mono text-[9px]" title={`Created: ${formatCreationDateTime(task.createdAt || task.dueDate)}`}>
                        <Clock className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{formatTimeAgo(task.createdAt || task.dueDate)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center-Right: Dedicated Creation Date & Relative Time Ago (Uses remaining horizontal space) */}
                <div className="hidden md:flex items-center gap-2.5 text-xs shrink-0 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-sm" title="Task Creation Timestamp">
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{formatTimeAgo(task.createdAt || task.dueDate)}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatCreationDateTime(task.createdAt || task.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Right: Actions (Edit & Delete Buttons) */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Edit Task Button */}
                  <button
                    onClick={() => {
                      onSelectTask(task);
                      soundFx.playPop();
                    }}
                    className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-violet-600/20 text-slate-400 hover:text-violet-300 border border-white/10 hover:border-violet-500/30 transition-all active:scale-95"
                    title="Edit Task Details"
                    aria-label="Edit Task"
                  >
                    <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Delete Task Button */}
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all active:scale-95"
                    title="Delete Task"
                    aria-label="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}



