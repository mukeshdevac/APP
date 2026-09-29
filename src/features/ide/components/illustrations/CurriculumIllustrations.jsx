import React from 'react';

/**
 * High-quality, ultra-lightweight vector illustrations for the Academy LMS.
 * 100% scalable SVG, zero bandwidth overhead, crisp on all screen resolutions.
 */

// 1. Friendly Robot Mascot (Robo-Ten) waving hello
export const RobotMascotIllustration = ({ isHappy = true, size = 140 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 8px 16px rgba(99, 102, 241, 0.2))' }}
        aria-label="Friendly Robot Mascot"
    >
        <defs>
            <linearGradient id="roboGrad" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="0.5" stopColor="#6366F1" />
                <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="screenGrad" x1="45" y1="45" x2="115" y2="105" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0F172A" />
                <stop offset="1" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="antennaGrad" x1="80" y1="10" x2="80" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#EF4444" />
            </linearGradient>
        </defs>

        {/* Antenna */}
        <line x1="80" y1="18" x2="80" y2="38" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="14" r="8" fill="url(#antennaGrad)" />
        <circle cx="80" cy="14" r="3" fill="#FEF3C7" />

        {/* Left Ear */}
        <rect x="24" y="55" width="8" height="20" rx="4" fill="#6366F1" />
        {/* Right Ear */}
        <rect x="128" y="55" width="8" height="20" rx="4" fill="#6366F1" />

        {/* Robot Head Body */}
        <rect x="30" y="36" width="100" height="74" rx="22" fill="url(#roboGrad)" stroke="#FFFFFF" strokeWidth="3" />

        {/* Gloss highlight */}
        <path d="M42 44 C55 40, 105 40, 118 44" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />

        {/* Screen Face */}
        <rect x="42" y="48" width="76" height="50" rx="14" fill="url(#screenGrad)" stroke="#334155" strokeWidth="2" />

        {/* Eyes (Friendly glowing cyan) */}
        {isHappy ? (
            <>
                {/* Cheerful inverted arc eyes */}
                <path d="M54 71 C54 64, 66 64, 66 71" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M94 71 C94 64, 106 64, 106 71" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" />
                {/* Blushing cheeks */}
                <circle cx="52" cy="82" r="4" fill="#F472B6" opacity="0.8" />
                <circle cx="108" cy="82" r="4" fill="#F472B6" opacity="0.8" />
                {/* Cute smile */}
                <path d="M74 80 Q80 86 86 80" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            </>
        ) : (
            <>
                <circle cx="60" cy="70" r="6" fill="#38BDF8" />
                <circle cx="100" cy="70" r="6" fill="#38BDF8" />
                <line x1="72" y1="82" x2="88" y2="82" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            </>
        )}

        {/* Neck */}
        <rect x="70" y="110" width="20" height="8" rx="2" fill="#94A3B8" />

        {/* Body Peek */}
        <path d="M45 118 C45 118, 55 116, 80 116 C105 116, 115 118, 115 118 L125 145 C125 150, 120 152, 110 152 L50 152 C40 152, 35 150, 35 145 Z" fill="url(#roboGrad)" stroke="#FFFFFF" strokeWidth="2" />
        
        {/* Core Heart Light */}
        <circle cx="80" cy="134" r="6" fill="#10B981" />
        <circle cx="80" cy="134" r="2.5" fill="#DCFCE7" />

        {/* Waving Arm Right */}
        <path d="M116 122 Q136 112 142 96" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" />
        <circle cx="142" cy="94" r="7" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
);

// 2. Visual Puzzle Blocks Interlocking (No Syntax Errors)
export const PuzzleSnapIllustration = ({ size = 150 }) => (
    <svg
        width={size}
        height={size * 0.72}
        viewBox="0 0 200 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 6px 12px rgba(16, 185, 129, 0.15))' }}
    >
        <defs>
            <linearGradient id="topBlockGrad" x1="10" y1="10" x2="190" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="bottomBlockGrad" x1="10" y1="65" x2="190" y2="125" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
            </linearGradient>
        </defs>

        {/* Top Block: Motion / Setup Block */}
        <path
            d="M 15 18 
               L 45 18 
               L 52 26 
               L 72 26 
               L 79 18 
               L 185 18 
               A 8 8 0 0 1 193 26 
               L 193 60 
               A 8 8 0 0 1 185 68 
               L 79 68 
               L 72 76 
               L 52 76 
               L 45 68 
               L 15 68 
               A 8 8 0 0 1 7 60 
               L 7 26 
               A 8 8 0 0 1 15 18 Z"
            fill="url(#topBlockGrad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
        />
        <text x="30" y="48" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
            🚀 1. Turn LED ON
        </text>

        {/* Glowing Snap Connector Zone Spark */}
        <circle cx="62" cy="72" r="14" fill="#FBBF24" opacity="0.35" />
        <path d="M62 65 L64 70 L69 72 L64 74 L62 79 L60 74 L55 72 L60 70 Z" fill="#F59E0B" />

        {/* Bottom Interlocking Block */}
        <path
            d="M 15 76 
               L 45 76 
               L 52 84 
               L 72 84 
               L 79 76 
               L 185 76 
               A 8 8 0 0 1 193 84 
               L 193 118 
               A 8 8 0 0 1 185 126 
               L 79 126 
               L 72 134 
               L 52 134 
               L 45 126 
               L 15 126 
               A 8 8 0 0 1 7 118 
               L 7 84 
               A 8 8 0 0 1 15 76 Z"
            fill="url(#bottomBlockGrad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
        />
        <text x="30" y="106" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
            ⏳ 2. Wait 1 Second
        </text>
    </svg>
);

// 3. Step Flow Sequence (Top to Bottom Like a Recipe)
export const StepFlowIllustration = ({ size = 160 }) => (
    <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Step 1 Node */}
        <rect x="25" y="10" width="150" height="32" rx="10" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="2" />
        <circle cx="45" cy="26" r="9" fill="#8B5CF6" />
        <text x="42" y="30" fill="#FFFFFF" fontSize="11" fontWeight="bold">1</text>
        <text x="65" y="30" fill="#4C1D95" fontSize="12" fontWeight="bold">Step 1: Check Sensor</text>

        {/* Arrow Down */}
        <line x1="100" y1="42" x2="100" y2="58" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="3 3" />
        <polygon points="95,58 100,64 105,58" fill="#8B5CF6" />

        {/* Step 2 Node */}
        <rect x="25" y="65" width="150" height="32" rx="10" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="2" />
        <circle cx="45" cy="81" r="9" fill="#06B6D4" />
        <text x="42" y="85" fill="#FFFFFF" fontSize="11" fontWeight="bold">2</text>
        <text x="65" y="85" fill="#164E63" fontSize="12" fontWeight="bold">Step 2: Think / Decide</text>

        {/* Arrow Down */}
        <line x1="100" y1="97" x2="100" y2="113" stroke="#06B6D4" strokeWidth="3" strokeDasharray="3 3" />
        <polygon points="95,113 100,119 105,113" fill="#06B6D4" />

        {/* Step 3 Node */}
        <rect x="25" y="119" width="150" height="30" rx="10" fill="#DCFCE7" stroke="#10B981" strokeWidth="2" />
        <circle cx="45" cy="134" r="9" fill="#10B981" />
        <text x="42" y="138" fill="#FFFFFF" fontSize="11" fontWeight="bold">3</text>
        <text x="65" y="138" fill="#064E3B" fontSize="12" fontWeight="bold">Step 3: Move Robot! 🤖</text>
    </svg>
);

// 4. Visual Block to Real Python Code Bridge
export const BlockToCodeBridgeIllustration = ({ size = 180 }) => (
    <svg
        width={size}
        height={size * 0.65}
        viewBox="0 0 240 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 6px 16px rgba(124, 58, 237, 0.15))' }}
    >
        <defs>
            <linearGradient id="bridgeGrad" x1="0" y1="70" x2="240" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#10B981" />
            </linearGradient>
        </defs>

        {/* Left Side: Visual Block */}
        <rect x="10" y="35" width="90" height="70" rx="12" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2" />
        <text x="22" y="60" fill="#FFFFFF" fontSize="11" fontWeight="bold">🧩 Visual Block</text>
        <rect x="18" y="70" width="74" height="24" rx="6" fill="#4338CA" />
        <text x="24" y="86" fill="#E0E7FF" fontSize="10" fontWeight="bold">Print "Hello!"</text>

        {/* Magic Bridge Center Arrow */}
        <circle cx="120" cy="70" r="18" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
        <text x="113" y="75" fontSize="14">✨</text>
        <path d="M102 70 L108 70" stroke="#F59E0B" strokeWidth="3" />
        <path d="M132 70 L138 70" stroke="#F59E0B" strokeWidth="3" />

        {/* Right Side: Real Python Output */}
        <rect x="140" y="35" width="92" height="70" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        <text x="150" y="55" fill="#38BDF8" fontSize="10" fontWeight="bold">🐍 Python Code</text>
        <rect x="146" y="66" width="80" height="28" rx="6" fill="#1E293B" />
        <text x="150" y="84" fill="#A7F3D0" fontSize="9" fontFamily="monospace">print("Hello!")</text>
    </svg>
);
