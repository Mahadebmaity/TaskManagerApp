import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Timer, Volume2, VolumeX, Settings2, Plus, Minus, Check } from 'lucide-react';
import { soundFx } from '../utils/effects';

const FOCUS_PRESETS = [15, 25, 30, 45, 50, 60, 90];
const CIRCUMFERENCE = 2 * Math.PI * 80; // ~502.6548

export default function FocusTimer({
  tasks,
  isOpen,
  onClose,
  pomodoro,
  onToggleTimer,
  onResetTimer,
  onChangeMode,
  onSaveDurations,
  onAdjustMinutes,
  onSelectTask,
  onDismissAlert,
  onReplayAlarm
}) {
  const [ambientSound, setAmbientSound] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const audioContextRef = useRef(null);
  const noiseNodeRef = useRef(null);

  const {
    mode = 'focus',
    timeLeft = 25 * 60,
    totalDuration = 25 * 60,
    isRunning = false,
    durations = { focus: 25, shortBreak: 5, longBreak: 15 },
    selectedTaskId = '',
    isCompletedAlert = false
  } = pomodoro || {};

  // Ambient sound synthesis toggle
  useEffect(() => {
    if (ambientSound) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContextRef.current) audioContextRef.current = new AudioContext();

        const bufferSize = audioContextRef.current.sampleRate * 2;
        const noiseBuffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioContextRef.current.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioContextRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, audioContextRef.current.currentTime);

        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.setValueAtTime(0.04, audioContextRef.current.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
      } catch (err) {
        console.warn('Ambient audio error', err);
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.stop();
        } catch {
          // ignore
        }
        noiseNodeRef.current = null;
      }
    }

    return () => {
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [ambientSound]);

  const handleSaveDuration = (newDurations) => {
    if (onSaveDurations) {
      onSaveDurations(newDurations);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Progress fraction (1.0 at start down to 0.0 at finish)
  const progressRatio = totalDuration > 0 ? Math.max(0, Math.min(1, timeLeft / totalDuration)) : 0;
  const strokeOffset = CIRCUMFERENCE * (1 - progressRatio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/15 shadow-2xl p-4 sm:p-6 relative space-y-3 sm:space-y-4 text-center my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Background glowing blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {isSettingsOpen ? 'Timer Settings' : 'Zen Focus Pomodoro'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Settings View Toggle Button */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-1.5 rounded-xl border transition-all ${
                isSettingsOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-white/10'
              }`}
              title={isSettingsOpen ? 'Back to Timer' : 'Customize Durations'}
              aria-label="Customize Timer"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/10"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Settings View */}
        {isSettingsOpen ? (
          <div className="space-y-4 text-left py-1 animate-fadeIn relative z-20">
            {/* Focus Presets */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <span>Focus Duration Presets:</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {FOCUS_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSaveDuration({ ...durations, focus: preset })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      durations.focus === preset
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    {preset} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Minutes Inputs */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-slate-200">Custom Durations (minutes):</span>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-medium">Focus</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={durations.focus}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      handleSaveDuration({ ...durations, focus: val });
                    }}
                    className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl px-2.5 py-1.5 text-xs text-white text-center font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-medium">Short Break</label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={durations.shortBreak}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      handleSaveDuration({ ...durations, shortBreak: val });
                    }}
                    className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl px-2.5 py-1.5 text-xs text-white text-center font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-medium">Long Break</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={durations.longBreak}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      handleSaveDuration({ ...durations, longBreak: val });
                    }}
                    className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl px-2.5 py-1.5 text-xs text-white text-center font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Done / Return Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Save & Back to Timer
            </button>
          </div>
        ) : (
          /* Main Timer View */
          <>
            {/* Mode Switcher Tabs with Live Active Session Indicators */}
            <div className="flex items-center justify-center p-1 bg-slate-950/80 rounded-2xl border border-white/10 relative z-10 gap-1">
              {[
                { id: 'focus', label: `Focus (${durations.focus}m)` },
                { id: 'shortBreak', label: `Short (${durations.shortBreak}m)` },
                { id: 'longBreak', label: `Long (${durations.longBreak}m)` }
              ].map((tab) => {
                const isTabRunning = pomodoro?.sessions?.[tab.id]?.isRunning;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onChangeMode(tab.id)}
                    className={`flex-1 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
                      mode === tab.id
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isTabRunning && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Informative Notice if another mode is actively running */}
            {pomodoro?.runningMode && pomodoro.runningMode !== mode && (
              <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 text-[11px] font-semibold flex items-center justify-between gap-2 animate-fadeIn text-left">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
                  <span>
                    {pomodoro.runningMode === 'focus' 
                      ? 'Focus Sprint' 
                      : pomodoro.runningMode === 'shortBreak' 
                      ? 'Short Break' 
                      : 'Long Break'} is running ({String(Math.floor((pomodoro.sessions?.[pomodoro.runningMode]?.timeLeft || 0) / 60)).padStart(2, '0')}:
                    {String((pomodoro.sessions?.[pomodoro.runningMode]?.timeLeft || 0) % 60).padStart(2, '0')})
                  </span>
                </span>
                <span className="text-[10px] text-amber-200/90 font-medium hidden sm:inline">
                  Pause it to start this {mode.replace(/([A-Z])/, ' $1').toLowerCase()}
                </span>
              </div>
            )}

            {/* Completed Session Celebration Banner */}
            {isCompletedAlert && (
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 animate-bounce">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🎉</span> Time's up! Session complete.
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={onReplayAlarm}
                    className="px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-extrabold hover:bg-emerald-400 transition-colors"
                  >
                    Replay Chime
                  </button>
                  <button
                    type="button"
                    onClick={onDismissAlert}
                    className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Circular Timer Display with Precision Progress Ring */}
            <div className="relative my-2 flex flex-col items-center justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-white/5 flex flex-col items-center justify-center bg-slate-950/80 shadow-2xl relative">
                
                {/* SVG Circular Progress Gauge */}
                <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="emeraldTimerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <filter id="glowGauage">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.6"/>
                    </filter>
                  </defs>

                  {/* Background Track */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="rgba(16, 185, 129, 0.12)"
                    strokeWidth="8"
                    fill="none"
                  />

                  {/* Moving Active Progress Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="url(#emeraldTimerGrad)"
                    strokeWidth="8"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    fill="none"
                    transform="rotate(-90 100 100)"
                    filter="url(#glowGauage)"
                    style={{
                      transition: isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease-out'
                    }}
                  />
                </svg>

                {/* Digital Clock Display */}
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-white drop-shadow-md relative z-10">
                  {formatTime}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-emerald-400 mt-1 relative z-10">
                  {mode.replace(/([A-Z])/, ' $1')}
                </span>
              </div>

              {/* Quick Increment / Decrement Buttons (+1m, +5m, -5m) */}
              <div className="flex items-center gap-1.5 mt-2 relative z-10">
                <button
                  type="button"
                  onClick={() => onAdjustMinutes(-5)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  title="Subtract 5 minutes"
                >
                  <Minus className="w-3 h-3 text-slate-400" /> 5m
                </button>
                <button
                  type="button"
                  onClick={() => onAdjustMinutes(1)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  title="Add 1 minute"
                >
                  <Plus className="w-3 h-3 text-emerald-400" /> 1m
                </button>
                <button
                  type="button"
                  onClick={() => onAdjustMinutes(5)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  title="Add 5 minutes"
                >
                  <Plus className="w-3 h-3 text-emerald-400" /> 5m
                </button>
              </div>
            </div>

            {/* Task Link Selector */}
            <div className="space-y-1 relative z-10 text-left">
              <label className="text-[11px] font-semibold text-slate-400">Link Active Task</label>
              <select
                value={selectedTaskId}
                onChange={(e) => onSelectTask(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">No task linked (General Focus)</option>
                {tasks
                  .filter((t) => t.status !== 'completed')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* Ambient Sound Toggle & Main Controls */}
            <div className="flex items-center justify-between pt-1 relative z-10 gap-2">
              <button
                onClick={() => setAmbientSound(!ambientSound)}
                className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ambientSound
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-white/10'
                }`}
              >
                {ambientSound ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <span className="text-[11px]">Rain Noise</span>
              </button>

              {/* Start/Pause and Reset Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onResetTimer}
                  className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-all active:scale-95 cursor-pointer"
                  title="Reset Timer"
                  aria-label="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {(() => {
                  const isOtherModeRunning = !!pomodoro?.runningMode && pomodoro.runningMode !== mode;

                  return (
                    <button
                      type="button"
                      disabled={isOtherModeRunning}
                      onClick={() => {
                        if (isOtherModeRunning) return;
                        soundFx.init();
                        onToggleTimer();
                      }}
                      className={`px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all transform ${
                        isOtherModeRunning
                          ? 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 active:scale-95 cursor-pointer'
                      }`}
                      title={
                        isOtherModeRunning
                          ? `${pomodoro.runningMode === 'focus' ? 'Focus' : pomodoro.runningMode === 'shortBreak' ? 'Short Break' : 'Long Break'} is already running. Pause it first.`
                          : isRunning ? 'Pause Timer' : 'Start Timer'
                      }
                    >
                      {isRunning ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isRunning ? 'PAUSE' : 'START'}</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}



