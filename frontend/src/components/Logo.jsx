import React from 'react';

/**
 * Modern Minimal FarmEye Logo SVG Component
 * Features abstract eye shape, cashew nut pupil (#F5B544), and leaf sprout.
 * Supports icon-only or horizontal wordmark variants.
 */
export const Logo = ({ variant = 'full', className = '', iconSize = 36 }) => {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block ${className}`}
        style={{ width: iconSize, height: iconSize }}
      >
        <defs>
          <linearGradient id="logoEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F5B544" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Eye Contour */}
        <path
          d="M 4 20 C 11 8, 29 8, 36 20 C 29 32, 11 32, 4 20 Z"
          stroke="url(#logoEmeraldGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#121816"
        />

        {/* Cashew Nut Pupil */}
        <path
          d="M 17.5 16 C 21 13.5, 25 16, 24.5 19.5 C 24 22.5, 20.5 24.5, 18 23 C 15.8 21.7, 15 18, 17.5 16 Z"
          fill="url(#logoGoldGrad)"
        />

        {/* Leaf Sprout */}
        <path
          d="M 30 11 C 34 6, 38 8, 36 13 C 33 14.5, 30 13, 30 11 Z"
          fill="url(#logoEmeraldGrad)"
        />
        <path
          d="M 31 11.5 C 33.5 9, 36 10, 36 10"
          stroke="#0B0F0E"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <defs>
          <linearGradient id="logoFullEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="logoFullGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F5B544" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#22C55E" floodOpacity="0.3" />
          </filter>
        </defs>

        <path
          d="M 4 20 C 11 8, 29 8, 36 20 C 29 32, 11 32, 4 20 Z"
          stroke="url(#logoFullEmerald)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#121816"
          filter="url(#logoGlow)"
        />
        <path
          d="M 17.5 16 C 21 13.5, 25 16, 24.5 19.5 C 24 22.5, 20.5 24.5, 18 23 C 15.8 21.7, 15 18, 17.5 16 Z"
          fill="url(#logoFullGold)"
        />
        <path
          d="M 30 11 C 34 6, 38 8, 36 13 C 33 14.5, 30 13, 30 11 Z"
          fill="url(#logoFullEmerald)"
        />
        <path
          d="M 31 11.5 C 33.5 9, 36 10, 36 10"
          stroke="#0B0F0E"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex items-baseline tracking-tight">
        <span className="text-xl font-bold text-white">Farm</span>
        <span className="text-xl font-extrabold text-emerald-500">Eye</span>
      </div>
    </div>
  );
};
