import React, { useState, useEffect, useRef } from 'react';
import { parseNaturalLanguageTask, formalizeTaskThought } from '../utils/nlpParser';
import { generateAISubtasks } from '../utils/aiEngine';
import { checkSpelling } from '../utils/spellChecker';
import { Sparkles, Calendar, Clock, Tag, AlertCircle, Plus, Zap, Lightbulb, X, Wand2, CheckCircle2, ChevronDown, SpellCheck } from 'lucide-react';
import { soundFx } from '../utils/effects';

export default function SmartTaskInput({ onAddTask }) {
  const [input, setInput] = useState('');
  const [spellingSuggestion, setSpellingSuggestion] = useState(null);
  const [parsed, setParsed] = useState({
    title: '',
    tags: [],
    priority: 'medium',
    dueDate: null,
    estimatedMinutes: 30
  });

  // State for AI Task Structuring Drawer
  const [isStructuredMode, setIsStructuredMode] = useState(false);
  const [structuredTitle, setStructuredTitle] = useState('');
  const [structuredPriority, setStructuredPriority] = useState('medium');
  const [structuredTags, setStructuredTags] = useState([]);
  const [structuredMinutes, setStructuredMinutes] = useState(30);
  const [structuredDueDate, setStructuredDueDate] = useState('');
  const [structuredSubtasks, setStructuredSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const inputRef = useRef(null);

  // Real-time NLP parsing and spell checking
  useEffect(() => {
    if (input.trim()) {
      setParsed(parseNaturalLanguageTask(input));
      setSpellingSuggestion(checkSpelling(input));
    } else {
      setParsed({
        title: '',
        tags: [],
        priority: 'medium',
        dueDate: null,
        estimatedMinutes: 30
      });
      setSpellingSuggestion(null);
    }
  }, [input]);

  // Clear Input Button
  const handleClear = () => {
    setInput('');
    soundFx.playPop();
    if (inputRef.current) inputRef.current.focus();
  };

  // Submit standard task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const taskData = parseNaturalLanguageTask(input);
    const subtasks = generateAISubtasks(taskData.title, taskData.tags[0] || 'general');

    onAddTask({
      ...taskData,
      subtasks
    });

    setInput('');
    setIsStructuredMode(false);
  };

  // Cycle / Override Priority
  const handleCyclePriority = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const priorities = ['high', 'medium', 'low'];
    const currentIdx = priorities.indexOf(parsed.priority);
    const nextPriority = priorities[(currentIdx + 1) % priorities.length];

    // Replace or append explicit priority in input string
    let updatedInput = input.replace(/!(high|urgent|p1|low|p3|med|medium|p2)\b/i, '').trim();
    updatedInput = `${updatedInput} !${nextPriority}`;
    setInput(updatedInput);
    soundFx.playPop();
  };

  // Open Structured AI Formalizer Mode
  const handleOpenStructuredMode = () => {
    const raw = input.trim() || 'Review product roadmap & specifications';
    const formalized = formalizeTaskThought(raw);
    const parsedData = parseNaturalLanguageTask(raw);
    const generated = generateAISubtasks(formalized, parsedData.tags[0] || 'general');

    setStructuredTitle(formalized);
    setStructuredPriority(parsedData.priority || 'medium');
    setStructuredTags(parsedData.tags.length > 0 ? parsedData.tags : ['work']);
    setStructuredMinutes(parsedData.estimatedMinutes || 30);
    setStructuredDueDate(parsedData.dueDate ? parsedData.dueDate.slice(0, 16) : '');
    setStructuredSubtasks(generated);
    setIsStructuredMode(true);
    soundFx.playPop();
  };

  // Save Structured Task
  const handleSaveStructuredTask = () => {
    if (!structuredTitle.trim()) return;

    onAddTask({
      title: structuredTitle.trim(),
      priority: structuredPriority,
      tags: structuredTags,
      estimatedMinutes: structuredMinutes,
      dueDate: structuredDueDate ? new Date(structuredDueDate).toISOString() : null,
      subtasks: structuredSubtasks
    });

    setInput('');
    setIsStructuredMode(false);
    soundFx.playPop();
  };

  const appendShortcut = (shortcut) => {
    setInput((prev) => {
      const clean = prev.trim();
      return clean ? `${clean} ${shortcut}` : shortcut;
    });
    soundFx.playPop();
  };

  const fillExample = () => {
    setInput('Review product launch tomorrow at 3pm #work !high ~45m');
    soundFx.playPop();
  };

  const priorityColors = {
    high: 'border-rose-500/50 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20',
    medium: 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20',
    low: 'border-slate-500/50 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20'
  };

  return (
    <div id="tour-smart-input" className="w-full glass-panel rounded-2xl p-3.5 sm:p-5 border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Background ambient glow */}
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <form onSubmit={handleSubmit} className="relative z-10 space-y-3">
        {/* Main Input Row */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>

          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type naturally e.g. 'Fix critical bug tomorrow at 4pm #dev ~45m'..."
              className="w-full bg-slate-900/60 border border-white/10 focus:border-violet-500 rounded-xl pl-3.5 pr-10 sm:pr-11 py-2.5 sm:py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-xs sm:text-sm md:text-base font-medium transition-all"
            />
            {/* Quick Cross (Clear) Button */}
            {input.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 sm:right-3 p-1 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-white/10 transition-all active:scale-95"
                title="Clear input text (Esc/Clear)"
                aria-label="Clear input text"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

          {/* AI Formalize & Structure Button (Only shown when user writes a task) */}
          {input.trim().length > 0 && (
            <button
              type="button"
              onClick={handleOpenStructuredMode}
              className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-600/30 to-indigo-600/30 hover:from-violet-600/50 hover:to-indigo-600/50 border border-violet-400/50 text-violet-200 font-semibold flex items-center gap-1.5 shadow-md shadow-violet-500/20 transition-all duration-200 shrink-0 text-xs sm:text-sm active:scale-95 animate-fadeIn"
              title="Formalize and structure this task with AI subtasks"
            >
              <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-300 animate-pulse" />
              <span className="hidden sm:inline">Formalize</span>
            </button>
          )}

          {/* Add Task Button */}
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0 text-xs sm:text-sm active:scale-95"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {/* Real-time English Spelling Typo Detection Banner (Optional for user) */}
        {spellingSuggestion && (
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-fadeIn shadow-sm">
            <div className="flex items-center gap-1.5 flex-wrap">
              <SpellCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">Spelling suggestion:</span>
              {spellingSuggestion.typos.map((t, idx) => (
                <span key={idx} className="bg-slate-900/90 px-2 py-0.5 rounded-lg border border-amber-500/20 text-[11px] font-medium">
                  <span className="line-through text-slate-400">{t.rawWord}</span> ➔ <span className="font-bold text-emerald-400">{t.suggestion}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setInput(spellingSuggestion.correctedSentence);
                  setSpellingSuggestion(null);
                  soundFx.playPop();
                }}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Click to auto-correct misspelled words"
              >
                Fix Spelling ✨
              </button>
              <button
                type="button"
                onClick={() => setSpellingSuggestion(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Ignore suggestion"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Stable Height Container (prevents card shrinking/jumping while typing) */}
        <div className="min-h-[52px] sm:min-h-[56px] flex flex-col justify-center pt-1.5 border-t border-white/10 transition-all duration-200">
          {input.trim() ? (
            /* Real-time NLP Live Badges Preview with Glowing Micro-animations */
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs px-0.5 animate-fadeIn">
              <span className="text-violet-300 font-bold flex items-center gap-1.5 text-[11px] sm:text-xs bg-violet-950/50 px-2 py-1 rounded-lg border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>AI Live Preview:</span>
              </span>
              
              {/* Clean Title preview */}
              <span className="bg-slate-800/90 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-medium max-w-[160px] sm:max-w-[240px] truncate text-[11px] shadow-sm">
                "{parsed.cleanText || input}"
              </span>

              {/* Clickable / Customizable Priority Override */}
              <button
                type="button"
                onClick={handleCyclePriority}
                className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 text-[11px] transition-all cursor-pointer shadow-sm ${priorityColors[parsed.priority]}`}
                title="Click to cycle Priority (High ➔ Medium ➔ Low)"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{parsed.priority.toUpperCase()} Priority</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Due Date */}
              {parsed.dueDate && (
                <span className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] shadow-sm shadow-cyan-500/10 animate-fadeIn">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  {new Date(parsed.dueDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}

              {/* Estimated Duration */}
              {parsed.estimatedMinutes && (
                <span className="bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] shadow-sm shadow-indigo-500/10 animate-fadeIn">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  {parsed.estimatedMinutes}m duration
                </span>
              )}

              {/* Tags */}
              {parsed.tags.map((tag) => (
                <span key={tag} className="bg-violet-500/10 border border-violet-500/40 text-violet-300 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] shadow-sm shadow-violet-500/10 animate-fadeIn">
                  <Tag className="w-3 h-3 text-violet-400" />
                  #{tag}
                </span>
              ))}
            </div>
          ) : (
            /* Friendly User Guide & Clickable Smart Tag Chips */
            <div className="space-y-1.5 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span>Quick Smart Tags</span>
                  <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">(Click to add or type naturally):</span>
                </div>

                {/* Try sample button for new users */}
                <button
                  type="button"
                  onClick={fillExample}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg transition-all"
                  title="Auto-fill a sample smart task"
                >
                  <Lightbulb className="w-3 h-3 text-cyan-300" />
                  <span>Try an example</span>
                </button>
              </div>

              {/* Intuitive Clickable Chips */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                {/* Priority Chips */}
                <button
                  type="button"
                  onClick={() => appendShortcut('!high')}
                  className="group flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all text-[11px] font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                  <span>Priority:</span>
                  <code className="font-bold text-rose-200 group-hover:underline">!high</code>
                </button>

                {/* Category Tag Chips */}
                <button
                  type="button"
                  onClick={() => appendShortcut('#work')}
                  className="group flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 transition-all text-[11px] font-medium"
                >
                  <Tag className="w-3 h-3 text-violet-400" />
                  <span>Tag:</span>
                  <code className="font-bold text-violet-200 group-hover:underline">#work</code>
                </button>

                <button
                  type="button"
                  onClick={() => appendShortcut('#design')}
                  className="group hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 transition-all text-[11px] font-medium"
                >
                  <Tag className="w-3 h-3 text-purple-400" />
                  <span>Tag:</span>
                  <code className="font-bold text-purple-200 group-hover:underline">#design</code>
                </button>

                {/* Duration Chip */}
                <button
                  type="button"
                  onClick={() => appendShortcut('~45m')}
                  className="group flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition-all text-[11px] font-medium"
                >
                  <Clock className="w-3 h-3 text-indigo-400" />
                  <span>Time:</span>
                  <code className="font-bold text-indigo-200 group-hover:underline">~45m</code>
                </button>

                {/* Due Date Chip */}
                <button
                  type="button"
                  onClick={() => appendShortcut('tomorrow at 4pm')}
                  className="group flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all text-[11px] font-medium"
                >
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>Due:</span>
                  <code className="font-bold text-cyan-200 group-hover:underline">tomorrow at 4pm</code>
                </button>
              </div>
            </div>
          )}
        </div>

      </form>

      {/* AI Structured Task Drawer / Creator */}
      {isStructuredMode && (
        <div className="mt-4 pt-4 border-t border-violet-500/30 bg-slate-950/70 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-violet-200">AI Formalized & Structured Task</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsStructuredMode(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Title Input */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Formalized Task Title</label>
              <input
                type="text"
                value={structuredTitle}
                onChange={(e) => setStructuredTitle(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            {/* Priority Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Priority</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['high', 'medium', 'low'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setStructuredPriority(p)}
                    className={`py-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                      structuredPriority === p
                        ? p === 'high'
                          ? 'bg-rose-500 text-slate-950 border-rose-400'
                          : p === 'medium'
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-600 text-white border-slate-400'
                        : 'bg-slate-900 text-slate-400 border-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Minutes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Estimated Duration (mins)</label>
              <input
                type="number"
                min="5"
                max="360"
                step="5"
                value={structuredMinutes}
                onChange={(e) => setStructuredMinutes(parseInt(e.target.value) || 30)}
                className="w-full bg-slate-900 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>

            {/* Due Date Picker */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Due Date & Time</label>
              <input
                type="datetime-local"
                value={structuredDueDate}
                onChange={(e) => setStructuredDueDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
              <input
                type="text"
                value={structuredTags.join(', ')}
                onChange={(e) =>
                  setStructuredTags(
                    e.target.value
                      .split(',')
                      .map((t) => t.trim().replace(/^#/, ''))
                      .filter(Boolean)
                  )
                }
                className="w-full bg-slate-900 border border-white/10 focus:border-violet-500 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          {/* AI Subtasks Checklist */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Actionable Subtask Breakdown ({structuredSubtasks.length}):</span>
            </label>
            
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {structuredSubtasks.map((st, idx) => (
                <div key={st.id || idx} className="flex items-center gap-2 bg-slate-900/90 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs text-slate-200">
                  <span className="w-4 text-slate-500 text-[10px] font-mono">{idx + 1}.</span>
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => {
                      const updated = [...structuredSubtasks];
                      updated[idx].title = e.target.value;
                      setStructuredSubtasks(updated);
                    }}
                    className="flex-1 bg-transparent text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStructuredSubtasks(structuredSubtasks.filter((_, i) => i !== idx));
                    }}
                    className="text-slate-500 hover:text-rose-400 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Subtask Input */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newSubtaskText.trim()) {
                      setStructuredSubtasks([...structuredSubtasks, { id: Date.now(), title: newSubtaskText.trim(), completed: false }]);
                      setNewSubtaskText('');
                    }
                  }
                }}
                placeholder="+ Add another subtask..."
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (newSubtaskText.trim()) {
                    setStructuredSubtasks([...structuredSubtasks, { id: Date.now(), title: newSubtaskText.trim(), completed: false }]);
                    setNewSubtaskText('');
                  }
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 border border-white/10"
              >
                Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsStructuredMode(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold border border-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStructuredTask}
              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save Structured Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



