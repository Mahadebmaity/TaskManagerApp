import React, { useState } from 'react';
import { Clock, ChevronRight, ChevronLeft, Trash2, Layers, GripVertical, Pencil } from 'lucide-react';
import { soundFx } from '../utils/effects';

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

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
  { id: 'in_progress', title: 'In Progress', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
  { id: 'under_review', title: 'Under Review', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'completed', title: 'Completed', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' }
];

export default function KanbanBoard({ tasks, onUpdateStatus, onMoveTask, onDeleteTask, onSelectTask }) {
  const [mobileActiveCol, setMobileActiveCol] = useState('all'); // 'all' | 'todo' | 'in_progress' | 'under_review' | 'completed'
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverColId, setDragOverColId] = useState(null);

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const moveTask = (task, direction) => {
    const statusOrder = ['todo', 'in_progress', 'under_review', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < statusOrder.length) {
      if (onMoveTask) {
        onMoveTask(task.id, statusOrder[newIndex]);
      } else {
        onUpdateStatus(task.id, statusOrder[newIndex]);
      }
    }
  };

  // Drag handlers
  const handleDragStart = (e, taskId) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    soundFx.playPop();
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColId(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverColId === colId && !e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    setDraggingTaskId(null);
    setDragOverColId(null);

    if (taskId) {
      if (onMoveTask) {
        onMoveTask(taskId, targetStatus);
      } else {
        onUpdateStatus(taskId, targetStatus);
      }
    }
  };

  const priorityBadges = {
    high: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    low: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  };

  const displayColumns = mobileActiveCol === 'all'
    ? COLUMNS
    : COLUMNS.filter((col) => col.id === mobileActiveCol);

  return (
    <div className="space-y-4 w-full">
      {/* Mobile Column Quick Switcher (visible on small/medium mobile screens) */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 px-0.5 no-scrollbar">
        <button
          onClick={() => setMobileActiveCol('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
            mobileActiveCol === 'all'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md'
              : 'bg-slate-900/60 text-slate-400 border-white/10'
          }`}
        >
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            All ({tasks.length})
          </span>
        </button>
        {COLUMNS.map((col) => {
          const count = getTasksByStatus(col.id).length;
          return (
            <button
              key={col.id}
              onClick={() => setMobileActiveCol(col.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 ${
                mobileActiveCol === col.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-white/10'
              }`}
            >
              <span>{col.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/80 border border-white/5">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Grid with Dynamic Natural Content Height */}
      <div className="grid gap-3.5 sm:gap-5 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start">
        {displayColumns.map((col) => {
          const colTasks = getTasksByStatus(col.id);
          const isDropActive = dragOverColId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col glass-panel rounded-2xl p-3 sm:p-3.5 border transition-all duration-200 h-fit ${
                isDropActive
                  ? 'border-violet-400/80 bg-violet-950/20 ring-2 ring-violet-500/40 shadow-xl'
                  : 'border-white/10'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 sm:pb-2.5 mb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full border ${col.color.split(' ')[0]} ${col.color.split(' ')[2]}`}></span>
                  <h3 className="font-bold text-slate-200 text-xs sm:text-sm tracking-wide">{col.title}</h3>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-400 border border-white/5">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-2 sm:space-y-2.5">
                {colTasks.length === 0 ? (
                  <div className={`flex flex-col items-center justify-center py-4 sm:py-5 border border-dashed rounded-xl text-xs text-center px-3 transition-colors ${
                    isDropActive ? 'border-violet-400/60 bg-violet-500/10 text-violet-300' : 'border-white/10 text-slate-500'
                  }`}>
                    <span>{isDropActive ? 'Drop task here' : `No tasks in ${col.title}`}</span>
                  </div>
                ) : (
                  colTasks.map((task, taskIdx) => {
                    const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;
                    const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
                    const progressPct = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
                    const isDraggingThis = draggingTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        id={taskIdx === 0 ? "tour-list-first-task" : undefined}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectTask(task)}
                        className={`glass-card rounded-xl p-2.5 sm:p-3 border transition-all duration-200 shadow-md cursor-grab active:cursor-grabbing select-none group relative space-y-1.5 ${
                          isDraggingThis
                            ? 'opacity-40 border-dashed border-violet-400 scale-95 shadow-2xl'
                            : 'border-white/10 hover:border-violet-500/40 active:scale-[0.99]'
                        }`}
                      >
                        {/* Priority & Move Controls */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="cursor-grab active:cursor-grabbing text-slate-500 group-hover:text-slate-300 transition-colors" title="Drag to move task">
                              <GripVertical className="w-3.5 h-3.5" />
                            </span>
                            <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md border ${priorityBadges[task.priority]}`}>
                              {task.priority}
                            </span>
                          </div>

                          {/* Move status arrows & Delete */}
                          <div className="flex items-center gap-0.5 opacity-85 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            {task.status !== 'todo' && (
                              <button
                                onClick={() => moveTask(task, 'prev')}
                                className="p-0.5 sm:p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 active:bg-violet-600"
                                title="Move Left"
                                aria-label="Move Task Back"
                              >
                                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </button>
                            )}
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => moveTask(task, 'next')}
                                className="p-0.5 sm:p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 active:bg-violet-600"
                                title="Move Right"
                                aria-label="Move Task Forward"
                              >
                                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                onSelectTask(task);
                                soundFx.playPop();
                              }}
                              className="p-0.5 sm:p-1 rounded bg-slate-900/90 hover:bg-violet-600/20 text-slate-400 hover:text-violet-300 border border-white/5 transition-colors"
                              title="Edit Task"
                              aria-label="Edit Task"
                            >
                              <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-0.5 sm:p-1 rounded bg-slate-900/90 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-white/5 transition-colors"
                              title="Delete Task"
                              aria-label="Delete Task"
                            >
                              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Task Title */}
                        <h4 className={`text-xs sm:text-[13px] font-semibold text-slate-100 leading-snug ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h4>

                        {/* Subtask Progress Bar (Only rendered if subtasks exist) */}
                        {totalSubtasks > 0 && (
                          <div className="pt-0.5 space-y-0.5">
                            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-medium">
                              <span>Subtasks</span>
                              <span>{completedSubtasks}/{totalSubtasks} ({progressPct}%)</span>
                            </div>
                            <div className="w-full bg-slate-950/80 rounded-full h-1 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Footer Info: Tags & Created Time Ago */}
                        <div className="flex flex-wrap items-center justify-between gap-1 pt-1.5 border-t border-white/5 text-[9.5px] text-slate-400">
                          {/* Tags */}
                          <div className="flex items-center gap-1 flex-wrap">
                            {task.tags && task.tags.map((tag) => (
                              <span key={tag} className="text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded text-[9px] border border-violet-500/20">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Created Time Ago & Duration */}
                          <div className="flex items-center gap-1.5 ml-auto text-slate-500 font-mono text-[9px]">
                            <span className="flex items-center gap-0.5 text-slate-400" title="Creation Time">
                              <Clock className="w-2.5 h-2.5 text-cyan-400" />
                              <span>{formatTimeAgo(task.createdAt || task.dueDate)}</span>
                            </span>
                            {task.estimatedMinutes && (
                              <span className="text-slate-500">
                                · {task.estimatedMinutes}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


