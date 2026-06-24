import React from 'react';

interface EliDentLogoProps {
  className?: string;
  size?: number | string;
}

export default function EliDentLogo({ className = '', size = 48 }: EliDentLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 240 280" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        {/* Deep blue to bright cobalt smooth gradient with gorgeous 3D lighting */}
        <linearGradient id="eliBlueGrad" x1="20" y1="20" x2="220" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="30%" stopColor="#1d4ed8" />
          <stop offset="70%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Realistic silver-chrome gradient with subtle metallic luster */}
        <linearGradient id="eliSilverGrad" x1="40" y1="120" x2="140" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="30%" stopColor="#cbd5e1" />
          <stop offset="65%" stopColor="#64748b" />
          <stop offset="105%" stopColor="#475569" />
        </linearGradient>

        {/* 3D Inner bevel-like shadows */}
        <filter id="eliDropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* 1. Left Three Silver/Chrome Wings (Organic curved root ribbons) */}
      {/* Top crescent wing */}
      <path 
        d="M60 120 C42 122, 35 140, 68 158 C78 163, 110 160, 130 156 C110 154, 75 146, 60 120 Z" 
        fill="url(#eliSilverGrad)" 
        opacity="0.95"
        stroke="#475569"
        strokeWidth="0.5"
      />
      {/* Middle crescent wing */}
      <path 
        d="M65 152 C48 155, 42 172, 75 188 C85 193, 112 188, 132 184 C112 182, 80 176, 65 152 Z" 
        fill="url(#eliSilverGrad)" 
        opacity="0.95"
        stroke="#475569"
        strokeWidth="0.5"
      />
      {/* Lower crescent wing */}
      <path 
        d="M72 185 C55 188, 50 203, 80 216 C88 220, 115 214, 131 210 C113 209, 85 204, 72 185 Z" 
        fill="url(#eliSilverGrad)" 
        opacity="0.95"
        stroke="#475569"
        strokeWidth="0.5"
      />

      {/* 2. Bottom Silver/Chrome Apex Tooth Tip */}
      <path 
        d="M84 230 C74 230, 70 242, 98 266 C105 264, 110 258, 114 252 C104 246, 94 238, 84 230 Z" 
        fill="url(#eliSilverGrad)" 
        opacity="0.95"
        stroke="#475569"
        strokeWidth="0.5"
      />

      {/* 3. Upper Wave 1 (Upper Right Crown segment) */}
      <path 
        d="M124 16 C155 16, 222 24, 224 45 C225 58, 203 98, 192 110 C194 92, 212 60, 198 42 C186 26, 142 28, 124 16 Z" 
        fill="url(#eliBlueGrad)" 
        filter="url(#eliDropShadow)"
      />

      {/* 4. Elegant Blue 'S' Swoosh - Solid Crown & Body Curve */}
      <path 
        d="M26 40 C32 15, 115 10, 132 30 C145 42, 105 85, 75 105 C35 131, 28 172, 72 208 C102 232, 185 240, 188 245 C190 248, 138 274, 132 272 C115 265, 132 235, 138 215 C146 185, 122 195, 110 198 C82 204, 45 186, 42 155 C38 118, 122 80, 150 68 C185 52, 202 36, 178 22 C158 12, 110 32, 85 52 C65 68, 38 68, 26 40 Z" 
        fill="url(#eliBlueGrad)" 
        filter="url(#eliDropShadow)"
      />
    </svg>
  );
}
