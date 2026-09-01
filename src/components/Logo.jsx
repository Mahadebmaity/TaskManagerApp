import React from 'react';

/**
 * Modern stylized logo badge for "Your task" featuring the letter "T"
 */
export default function Logo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-sm rounded-lg',
    md: 'w-10 h-10 text-xl rounded-xl',
    lg: 'w-14 h-14 text-2xl rounded-2xl'
  };

  return (
    <div className={`relative flex items-center justify-center font-extrabold select-none transition-transform duration-300 hover:scale-105 group ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {/* Outer glowing ambient ring */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 rounded-xl blur-sm opacity-80 group-hover:opacity-100 transition duration-300"></div>
      
      {/* Main logo badge surface */}
      <div className="relative w-full h-full bg-slate-950/90 border border-white/20 rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
        {/* Subtle interior glow background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-indigo-500/20 to-cyan-400/30 opacity-70"></div>
        
        {/* Stylized letter "T" */}
        <span className="relative z-10 font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-cyan-400 drop-shadow-md">
          T
        </span>
        
        {/* Decorative corner accent node */}
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></div>
      </div>
    </div>
  );
}


