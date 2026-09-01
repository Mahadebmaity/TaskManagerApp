import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trash2, CheckSquare, Square } from 'lucide-react';
import { generateAISubtasks, evaluateTaskPriority } from '../utils/aiEngine';

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description || '' : '');
  const [priority, setPriority] = useState(task ? task.priority : 'medium');
  const [status, setStatus] = useState(task ? task.status : 'todo');
  const [estimatedMinutes, setEstimatedMinutes] = useState(task ? task.estimatedMinutes || 30 : 30);
  const [tagsInput, setTagsInput] = useState(task && task.tags ? task.tags.join(', ') : '');
  const [subtasks, setSubtasks] = useState(task && task.subtasks ? task.subtasks : []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      setEstimatedMinutes(task.estimatedMinutes || 30);
      setTagsInput(task.tags ? task.tags.join(', ') : '');
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  if (!task) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: Date.now(), title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskId) => {
    setSubtasks(
      subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
  };

  const handleGenerateAISubtasks = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const generated = generateAISubtasks(title, tagsInput);
      setSubtasks((prev) => [...prev, ...generated]);
      setIsGeneratingAI(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace('#', ''))
      .filter(Boolean);

    onSave({
      ...task,
      title,
      description,
      priority,
      status,
      estimatedMinutes: Number(estimatedMinutes),
      tags: updatedTags.length > 0 ? updatedTags : ['general'],
      subtasks
    });
    onClose();
  };

  const priorityEvaluation = evaluateTaskPriority(priority, task.dueDate, estimatedMinutes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl p-4 sm:p-6 relative space-y-4 sm:space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 sm:p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Task Intelligence Editor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/10"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-900/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description / Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Add key objectives, notes, or links..."
              className="w-full bg-slate-900/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none"
            ></textarea>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Estimated Minutes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Duration (mins)</label>
              <input
                type="number"
                min="5"
                max="480"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="work, design, dev, health"
              className="w-full bg-slate-900/80 border border-white/10 focus:border-violet-500 rounded-xl px-3 sm:px-4 py-2 text-xs text-slate-200"
            />
          </div>

          {/* AI Eisenhower Evaluation Card */}
          <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">Eisenhower Priority Matrix:</span>
              <div className="font-bold text-violet-300">{priorityEvaluation.quadrant}</div>
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-cyan-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-white/5">
              {priorityEvaluation.score}/100
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Action Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
              </h3>
              <button
                type="button"
                onClick={handleGenerateAISubtasks}
                disabled={isGeneratingAI}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAI ? 'Generating...' : 'AI Auto-Breakdown'}</span>
              </button>
            </div>

            {/* Subtask Items List */}
            <div className="space-y-2 max-h-36 sm:max-h-44 overflow-y-auto pr-0.5">
              {subtasks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">No subtasks yet. Add one below or click AI Auto-Breakdown!</p>
              ) : (
                subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-200"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(subtask.id)}
                      className="flex items-center gap-2 text-left flex-1 min-w-0"
                    >
                      {subtask.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className={`break-words ${subtask.completed ? 'line-through text-slate-400' : ''}`}>
                        {subtask.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
                      aria-label="Delete Subtask"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Subtask Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add actionable subtask step..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 sm:pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="order-2 sm:order-1 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-center"
            >
              Delete Task
            </button>
            <div className="order-1 sm:order-2 flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/10 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

