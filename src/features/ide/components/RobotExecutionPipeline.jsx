import React, { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Mic, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

/* ===========================================================================
   ROBO TEN KUTTY STORY — INTERACTIVE ROLEPLAY STORYBOARD
   Clean, vibrant storybook for children:
   - "Robo Ten Kutty Story" branding
   - Clean stage without camera/studio technical clutter
   - "TEN BLOCK STORE" in workshop
   - Cute "Hi! 👋", "Get Block! 🧩", "Bye Bye! 🚀" badges
   - Motorized spinning wheels for entrance & exit
   - Robo-Ten only rolls into screen when Auto-Play is clicked! Reset stays waiting.
   - Full Screen Theater Option (HTML5 Fullscreen API + Responsive Fullscreen Styling)
   =========================================================================== */

// Hero Robot SVG with dynamic expressions & motorized spinning wheel spokes
function HeroRobot({ expression = 'happy', holdingItem = null, isRolling = false, size = 95 }) {
    return (
        <svg width={size} height={size * 1.22} viewBox="0 0 100 122" fill="none">
            <defs>
                <linearGradient id="hbg1" x1="0" y1="0" x2="100" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38BDF8"/>
                    <stop offset="0.5" stopColor="#6366F1"/>
                    <stop offset="1" stopColor="#4338CA"/>
                </linearGradient>
                <linearGradient id="torchFlame" x1="50" y1="0" x2="50" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FEF3C7"/>
                    <stop offset="1" stopColor="#F59E0B"/>
                </linearGradient>
            </defs>

            {/* Antenna */}
            <line x1="50" y1="6" x2="50" y2="16" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round"/>
            <circle cx="50" cy="6" r="7" fill="#F59E0B" opacity="0.3"/>
            <circle cx="50" cy="6" r="5" fill="url(#torchFlame)"/>
            <circle cx="50" cy="6" r="2.5" fill="#FEF9C3"/>

            {/* Head */}
            <rect x="20" y="16" width="60" height="40" rx="14" fill="url(#hbg1)" stroke="#312E81" strokeWidth="1.5"/>
            {/* Visor screen */}
            <rect x="27" y="22" width="46" height="28" rx="8" fill="#0F172A"/>
            <path d="M31 25 Q44 22 69 25" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>

            {/* Eyes & Expressions */}
            {expression === 'happy' && (
                <g>
                    <circle cx="40" cy="35" r="5" fill="#38BDF8"/>
                    <circle cx="60" cy="35" r="5" fill="#38BDF8"/>
                    <circle cx="41.5" cy="33.5" r="1.5" fill="#FFFFFF"/>
                    <circle cx="61.5" cy="33.5" r="1.5" fill="#FFFFFF"/>
                    <path d="M36 43 Q40 47 45 43" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                    <path d="M55 43 Q60 47 64 43" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </g>
            )}
            {expression === 'talking' && (
                <g>
                    <circle cx="40" cy="34" r="5.5" fill="#38BDF8"/>
                    <circle cx="60" cy="34" r="5.5" fill="#38BDF8"/>
                    <circle cx="41.5" cy="32.5" r="1.5" fill="#FFFFFF"/>
                    <circle cx="61.5" cy="32.5" r="1.5" fill="#FFFFFF"/>
                    <ellipse cx="50" cy="43" rx="7" ry="4.5" fill="#38BDF8"/>
                    <ellipse cx="50" cy="43" rx="5" ry="2.5" fill="#0F172A"/>
                </g>
            )}
            {expression === 'surprised' && (
                <g>
                    <circle cx="40" cy="34" r="7" fill="#FDE047"/>
                    <circle cx="60" cy="34" r="7" fill="#FDE047"/>
                    <circle cx="40" cy="34" r="3.2" fill="#0F172A"/>
                    <circle cx="60" cy="34" r="3.2" fill="#0F172A"/>
                    <ellipse cx="50" cy="44" rx="5.5" ry="4" fill="#38BDF8"/>
                </g>
            )}
            {expression === 'winking_bonk' && (
                <g>
                    <path d="M33 34 Q40 28 47 34" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                    <circle cx="61" cy="34" r="6" fill="#38BDF8"/>
                    <circle cx="62.5" cy="32.5" r="2" fill="#FFFFFF"/>
                    <path d="M37 43 Q50 50 63 43" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </g>
            )}
            {expression === 'star_eyes' && (
                <g>
                    <polygon points="40,28 42,33 47,33 43,36 44,41 40,38 36,41 37,36 33,33 38,33" fill="#FDE047"/>
                    <polygon points="60,28 62,33 67,33 63,36 64,41 60,38 56,41 57,36 53,33 58,33" fill="#FDE047"/>
                    <path d="M37 46 Q50 52 63 46" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </g>
            )}

            {/* Cheeks */}
            <circle cx="24" cy="40" r="4" fill="#F472B6" opacity="0.6"/>
            <circle cx="76" cy="40" r="4" fill="#F472B6" opacity="0.6"/>

            {/* Neck */}
            <rect x="42" y="56" width="16" height="6" rx="2" fill="#64748B"/>

            {/* Torso */}
            <rect x="22" y="62" width="56" height="32" rx="10" fill="url(#hbg1)" stroke="#312E81" strokeWidth="1.5"/>
            <circle cx="50" cy="78" r="6" fill="#10B981"/>
            <circle cx="50" cy="78" r="3.5" fill="#A7F3D0"/>
            <circle cx="50" cy="78" r="1.5" fill="#FFFFFF"/>

            {/* Arms & Hands */}
            {holdingItem === 'block_swing' ? (
                <g>
                    <path d="M22 70 Q8 62 10 52" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                    <path d="M78 70 Q94 56 102 42" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                    <rect x="94" y="32" width="22" height="16" rx="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2"/>
                    <text x="98" y="44" fill="white" fontSize="9" fontWeight="bold">💡</text>
                </g>
            ) : holdingItem === 'block' ? (
                <g>
                    <path d="M22 70 Q8 78 12 90" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                    <path d="M78 70 Q94 65 92 54" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                    <rect x="84" y="44" width="20" height="15" rx="3" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5"/>
                    <text x="88" y="55" fill="white" fontSize="8" fontWeight="bold">💡</text>
                </g>
            ) : holdingItem === 'code' ? (
                <g>
                    <path d="M22 70 Q8 78 12 90" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                    <path d="M78 70 Q94 65 92 54" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                    <rect x="82" y="42" width="22" height="16" rx="3" fill="#1E1B4B" stroke="#A78BFA" strokeWidth="1.5"/>
                    <text x="84" y="53" fill="#38BDF8" fontSize="7" fontWeight="bold" fontFamily="monospace">Py</text>
                </g>
            ) : expression === 'star_eyes' ? (
                <g>
                    <path d="M22 70 Q6 54 10 40" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                    <path d="M78 70 Q94 54 90 40" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                </g>
            ) : (
                <g>
                    <path d="M22 70 Q8 62 10 50" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                    <path d="M78 70 Q92 78 88 90" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round"/>
                </g>
            )}

            {/* MOTORIZED WHEELS WITH ROTATING SPOKES */}
            {/* Left Wheel */}
            <Motion.g
                animate={isRolling ? { rotate: [0, 360] } : { rotate: 0 }}
                transition={isRolling ? { repeat: Infinity, duration: 0.5, ease: "linear" } : {}}
                style={{ transformOrigin: '36px 100px' }}
            >
                <circle cx="36" cy="100" r="10" fill="#1E293B" stroke="#475569" strokeWidth="2.5"/>
                <line x1="26" y1="100" x2="46" y2="100" stroke="#F1F5F9" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="36" y1="90" x2="36" y2="110" stroke="#F1F5F9" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="29" y1="93" x2="43" y2="107" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="29" y1="107" x2="43" y2="93" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="36" cy="100" r="4.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
                <circle cx="36" cy="100" r="2" fill="#FFFFFF"/>
            </Motion.g>

            {/* Right Wheel */}
            <Motion.g
                animate={isRolling ? { rotate: [0, 360] } : { rotate: 0 }}
                transition={isRolling ? { repeat: Infinity, duration: 0.5, ease: "linear" } : {}}
                style={{ transformOrigin: '64px 100px' }}
            >
                <circle cx="64" cy="100" r="10" fill="#1E293B" stroke="#475569" strokeWidth="2.5"/>
                <line x1="54" y1="100" x2="74" y2="100" stroke="#F1F5F9" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="64" y1="90" x2="64" y2="110" stroke="#F1F5F9" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="57" y1="93" x2="71" y2="107" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="57" y1="107" x2="71" y2="93" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="64" cy="100" r="4.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
                <circle cx="64" cy="100" r="2" fill="#FFFFFF"/>
            </Motion.g>
        </svg>
    );
}

// Cartoon Snake
function CartoonSnake({ knocked = false, size = 80 }) {
    if (knocked) {
        return (
            <svg width={size * 1.3} height={size * 0.8} viewBox="0 0 110 70" fill="none">
                <Motion.g
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                    style={{ transformOrigin: '35px 18px' }}
                >
                    <polygon points="35,6 37,12 43,12 38,16 40,22 35,18 30,22 32,16 27,12 33,12" fill="#FACC15"/>
                    <polygon points="52,14 53,18 57,18 54,21 55,25 52,22 49,25 50,21 47,18 51,18" fill="#F59E0B"/>
                    <polygon points="18,14 19,18 23,18 20,21 21,25 18,22 15,25 16,21 13,18 17,18" fill="#FACC15"/>
                </Motion.g>
                <text x="32" y="24" fontSize="12">💫</text>

                <path d="M 10 54 Q 28 46 48 54 Q 68 62 86 52 Q 98 48 106 54"
                    stroke="#10B981" strokeWidth="12" strokeLinecap="round" fill="none"/>
                <path d="M 12 54 Q 29 47 48 55 Q 67 63 85 53"
                    stroke="#FDE047" strokeWidth="4" strokeLinecap="round" fill="none"/>

                <g transform="translate(14, 38)">
                    <ellipse cx="12" cy="14" rx="13" ry="10" fill="#10B981" stroke="#047857" strokeWidth="1.5"/>
                    <line x1="6" y1="9" x2="11" y2="14" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="11" y1="9" x2="6" y2="14" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="14" y1="9" x2="19" y2="14" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="19" y1="9" x2="14" y2="14" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M 12 22 Q 14 28 8 30" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
                </g>

                <rect x="52" y="28" width="52" height="18" rx="9" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5"/>
                <text x="78" y="40" fill="#DC2626" fontSize="8.5" fontWeight="800" textAnchor="middle">KO'd! 💤</text>
            </svg>
        );
    }

    return (
        <svg width={size} height={size * 1.1} viewBox="-16 -16 98 108" fill="none">
            <path d="M 22 78 Q 12 62 28 54 Q 44 46 38 30 Q 32 18 50 12"
                stroke="#10B981" strokeWidth="14" strokeLinecap="round" fill="none"/>
            <path d="M 24 78 Q 15 63 30 55 Q 44 48 38 32"
                stroke="#D1FAE5" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <ellipse cx="30" cy="46" rx="4" ry="5" fill="#047857" opacity="0.4"/>
            <ellipse cx="36" cy="38" rx="3.5" ry="4.5" fill="#047857" opacity="0.4"/>
            <ellipse cx="40" cy="30" rx="3" ry="4" fill="#047857" opacity="0.4"/>

            {/* Snake Head */}
            <ellipse cx="50" cy="12" rx="13" ry="10" fill="#10B981" stroke="#047857" strokeWidth="1.5"/>

            {/* Left Eye — 100% Clear & Unobstructed */}
            <circle cx="44" cy="9" r="5.5" fill="white" stroke="#047857" strokeWidth="1"/>
            <Motion.circle
                animate={{ cx: [43, 45, 43] }} transition={{ repeat: Infinity, duration: 1.8 }}
                cy="9" r="2.8" fill="#0F172A"/>
            <circle cx="43.5" cy="7.5" r="1" fill="white"/>

            {/* Right Eye */}
            <circle cx="56" cy="9" r="5.5" fill="white" stroke="#047857" strokeWidth="1"/>
            <Motion.circle
                animate={{ cx: [55, 57, 55] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }}
                cy="9" r="2.8" fill="#0F172A"/>
            <circle cx="55.5" cy="7.5" r="1" fill="white"/>

            {/* Forked tongue */}
            <Motion.path
                animate={{ d: ["M 62 15 Q 70 16 74 14 M 74 14 L 78 11 M 74 14 L 78 17",
                               "M 62 15 Q 70 18 74 16 M 74 16 L 78 13 M 74 16 L 78 19"] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                stroke="#EF4444" strokeWidth="2" strokeLinecap="round" fill="none"/>

            <ellipse cx="22" cy="80" rx="5" ry="4" fill="#059669"/>
            <ellipse cx="22" cy="80" rx="3" ry="2.5" fill="#34D399"/>

            {/* HISSS Speech Bubble positioned above and to the left (Zero Eye Overlap!) */}
            <g transform="translate(-14, -14)">
                <rect x="0" y="0" width="46" height="18" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5"/>
                <text x="6" y="13" fill="#DC2626" fontSize="9" fontWeight="bold">HISSS! 🐍</text>
                <polygon points="36,18 42,23 39,18" fill="#FEF2F2"/>
                <path d="M 36 18 L 42 23 L 39 18" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
        </svg>
    );
}

// Station Worker
function StationWorker({ costume = 'shopkeeper', handItem = 'block', size = 85 }) {
    const configs = {
        shopkeeper: { body: '#F59E0B', hat: '#D97706', role: 'Store Elf' },
        coder: { body: '#8B5CF6', hat: '#6D28D9', role: 'Code Wizard' },
        electrician: { body: '#F97316', hat: '#EA580C', role: 'Spark Bot' },
        lightkeeper: { body: '#10B981', hat: '#059669', role: 'Light Hero' }
    };
    const cfg = configs[costume] || configs.shopkeeper;

    return (
        <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill="none">
            <defs>
                <linearGradient id={`wbody_${costume}`} x1="10" y1="10" x2="70" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor={cfg.body}/>
                    <stop offset="1" stopColor={cfg.hat}/>
                </linearGradient>
            </defs>

            {costume === 'shopkeeper' && (
                <g>
                    <ellipse cx="40" cy="20" rx="22" ry="7" fill={cfg.body} stroke="#B45309" strokeWidth="1"/>
                    <rect x="24" y="14" width="32" height="10" rx="4" fill={cfg.hat}/>
                    <text x="32" y="22" fontSize="9">🏪</text>
                </g>
            )}
            {costume === 'coder' && (
                <g>
                    <polygon points="40,2 24,20 56,20" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1.5"/>
                    <ellipse cx="40" cy="20" rx="18" ry="5" fill="#6D28D9"/>
                    <polygon points="40,10 38,14 44,14" fill="#FDE047"/>
                </g>
            )}
            {costume === 'electrician' && (
                <g>
                    <path d="M20 22 Q40 8 60 22 L62 26 L18 26 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1"/>
                    <rect x="16" y="24" width="48" height="5" rx="2" fill="#EAB308"/>
                    <polygon points="40,12 37,18 41,18 38,24 44,16 40,16" fill="#EF4444"/>
                </g>
            )}
            {costume === 'lightkeeper' && (
                <g>
                    <polygon points="40,4 44,14 55,14 46,21 50,32 40,25 30,32 34,21 25,14 36,14" fill="#10B981" stroke="#047857" strokeWidth="1.5"/>
                </g>
            )}

            <ellipse cx="40" cy="38" rx="18" ry="16" fill={`url(#wbody_${costume})`} stroke="#1E293B" strokeWidth="1.5"/>
            <rect x="27" y="30" width="26" height="18" rx="6" fill="#0F172A"/>

            {costume === 'shopkeeper' && (
                <g>
                    <circle cx="34" cy="39" r="4" fill="none" stroke="#FDE047" strokeWidth="1.5"/>
                    <circle cx="46" cy="39" r="4" fill="none" stroke="#FDE047" strokeWidth="1.5"/>
                    <circle cx="34" cy="39" r="2" fill="#38BDF8"/>
                    <circle cx="46" cy="39" r="2" fill="#38BDF8"/>
                </g>
            )}
            {costume === 'coder' && (
                <g>
                    <rect x="29" y="35" width="10" height="7" rx="2" fill="#06B6D4" stroke="white" strokeWidth="1"/>
                    <rect x="41" y="35" width="10" height="7" rx="2" fill="#06B6D4" stroke="white" strokeWidth="1"/>
                    <line x1="39" y1="38" x2="41" y2="38" stroke="white" strokeWidth="1"/>
                </g>
            )}
            {costume === 'electrician' && (
                <g>
                    <circle cx="34" cy="38" r="3.5" fill="#FACC15"/>
                    <circle cx="46" cy="38" r="3.5" fill="#FACC15"/>
                </g>
            )}
            {costume === 'lightkeeper' && (
                <g>
                    <polygon points="34,34 36,38 34,42 32,38" fill="#34D399"/>
                    <polygon points="46,34 48,38 46,42 44,38" fill="#34D399"/>
                </g>
            )}

            <path d="M35 44 Q40 48 45 44" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <rect x="24" y="56" width="32" height="26" rx="7" fill={`url(#wbody_${costume})`} stroke="#1E293B" strokeWidth="1.5"/>

            {handItem === 'block' && (
                <g>
                    <path d="M26 64 Q12 60 8 52" stroke={cfg.body} strokeWidth="6" strokeLinecap="round"/>
                    <rect x="0" y="44" width="22" height="15" rx="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5"/>
                    <text x="3" y="55" fill="white" fontSize="8" fontWeight="bold">💡 ON</text>
                </g>
            )}
            {handItem === 'code' && (
                <g>
                    <path d="M26 64 Q12 60 8 52" stroke={cfg.body} strokeWidth="6" strokeLinecap="round"/>
                    <rect x="0" y="42" width="26" height="17" rx="3.5" fill="#1E1B4B" stroke="#A78BFA" strokeWidth="1.5"/>
                    <text x="3" y="54" fill="#38BDF8" fontSize="7" fontWeight="bold" fontFamily="monospace">Py Code</text>
                </g>
            )}
            {handItem === 'spark' && (
                <polygon points="14,48 8,56 16,56 10,66 22,52 15,52" fill="#FACC15"/>
            )}
            {handItem === 'switch' && (
                <g>
                    <rect x="4" y="50" width="16" height="12" rx="3" fill="#10B981" stroke="#FFFFFF" strokeWidth="1"/>
                    <circle cx="12" cy="56" r="3.5" fill="#FFFFFF"/>
                </g>
            )}
        </svg>
    );
}

/* ===========================================================================
   SCENE STAGE BACKGROUNDS — WITH "TEN BLOCK STORE"
   =========================================================================== */
function SceneBackground({ env, ledOn = false }) {
    if (env === 'workshop') {
        return (
            <g>
                <rect width="100%" height="100%" fill="#FFFDF5"/>
                <rect y="74%" width="100%" height="26%" fill="#FEF3C7"/>
                <line x1="0" y1="74%" x2="100%" y2="74%" stroke="#FDE68A" strokeWidth="3"/>
                <rect x="6%" y="10%" width="22%" height="32%" rx="6" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="2"/>
                <line x1="17%" y1="10%" x2="17%" y2="42%" stroke="#BAE6FD" strokeWidth="2"/>
                <line x1="6%" y1="26%" x2="28%" y2="26%" stroke="#BAE6FD" strokeWidth="2"/>
                <circle cx="12%" cy="18%" r="4%" fill="#FDE047"/>
                <ellipse cx="22%" cy="20%" rx="3%" ry="2%" fill="#FFFFFF"/>
                <ellipse cx="24%" cy="21%" rx="4%" ry="2.5%" fill="#FFFFFF"/>
                <rect x="52%" y="16%" width="42%" height="4%" rx="2" fill="#D97706"/>
                <rect x="55%" y="8%" width="7%" height="8%" rx="2" fill="#3B82F6" stroke="#2563EB" strokeWidth="1"/>
                <rect x="64%" y="9%" width="7%" height="7%" rx="2" fill="#10B981" stroke="#059669" strokeWidth="1"/>
                <rect x="73%" y="7%" width="7%" height="9%" rx="2" fill="#EC4899" stroke="#DB2777" strokeWidth="1"/>
                <rect x="82%" y="9%" width="7%" height="7%" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
                
                {/* TEN BLOCK STORE BANNER ON DESK */}
                <rect x="54%" y="54%" width="42%" height="16%" rx="6" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5"/>
                <text x="56%" y="65%" fill="#334155" fontSize="9" fontWeight="bold">TEN BLOCK STORE 🏪</text>
            </g>
        );
    }

    if (env === 'python_lab') {
        return (
            <g>
                <rect width="100%" height="100%" fill="#F8FAFC"/>
                <rect y="74%" width="100%" height="26%" fill="#F1F5F9"/>
                <line x1="0" y1="74%" x2="100%" y2="74%" stroke="#E2E8F0" strokeWidth="2.5"/>
                <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4"/>
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4"/>
                <rect x="56%" y="12%" width="40%" height="45%" rx="8" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2"/>
                <rect x="58%" y="14%" width="36%" height="32%" rx="5" fill="#0F172A"/>
                <line x1="61%" y1="21%" x2="88%" y2="21%" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/>
                <line x1="61%" y1="27%" x2="79%" y2="27%" stroke="#34D399" strokeWidth="2" strokeLinecap="round"/>
                <line x1="61%" y1="33%" x2="85%" y2="33%" stroke="#FDE047" strokeWidth="2" strokeLinecap="round"/>
                <line x1="61%" y1="39%" x2="73%" y2="39%" stroke="#F472B6" strokeWidth="2" strokeLinecap="round"/>
                <rect x="73%" y="46%" width="6%" height="11%" fill="#94A3B8"/>
                <rect x="68%" y="57%" width="16%" height="3%" rx="1.5" fill="#64748B"/>
                <rect x="6%" y="14%" width="24%" height="16%" rx="6" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5"/>
                <text x="9%" y="26%" fill="#4F46E5" fontSize="9.5" fontWeight="bold">🐍 Python Engine</text>
            </g>
        );
    }

    if (env === 'cpu_chip') {
        return (
            <g>
                <rect width="100%" height="100%" fill="#FAF5FF"/>
                <rect y="74%" width="100%" height="26%" fill="#F3E8FF"/>
                <line x1="0" y1="74%" x2="100%" y2="74%" stroke="#D8B4FE" strokeWidth="2.5"/>
                <line x1="0" y1="32%" x2="48%" y2="32%" stroke="#A855F7" strokeWidth="2.5"/>
                <line x1="48%" y1="32%" x2="48%" y2="52%" stroke="#A855F7" strokeWidth="2.5"/>
                <line x1="48%" y1="52%" x2="68%" y2="52%" stroke="#A855F7" strokeWidth="2.5"/>
                <circle cx="48%" cy="32%" r="4" fill="#9333EA"/>
                <circle cx="48%" cy="52%" r="4" fill="#9333EA"/>
                <rect x="58%" y="12%" width="38%" height="52%" rx="8" fill="#581C87" stroke="#9333EA" strokeWidth="2.5"/>
                <line x1="58%" y1="22%" x2="52%" y2="22%" stroke="#FACC15" strokeWidth="3"/>
                <line x1="58%" y1="34%" x2="52%" y2="34%" stroke="#FACC15" strokeWidth="3"/>
                <line x1="58%" y1="46%" x2="52%" y2="46%" stroke="#FACC15" strokeWidth="3"/>
                <line x1="96%" y1="22%" x2="100%" y2="22%" stroke="#FACC15" strokeWidth="3"/>
                <line x1="96%" y1="34%" x2="100%" y2="34%" stroke="#FACC15" strokeWidth="3"/>
                <line x1="96%" y1="46%" x2="100%" y2="46%" stroke="#FACC15" strokeWidth="3"/>
                <text x="64%" y="36%" fill="#F5D0FE" fontSize="13" fontWeight="bold">ESP32</text>
                <text x="65%" y="48%" fill="#E9D5FF" fontSize="9" fontWeight="bold">🧠 CPU</text>
                <polygon points="26%,16% 24%,24% 28%,24% 23%,34% 32%,22% 27%,22%" fill="#F59E0B"/>
            </g>
        );
    }

    if (env === 'hardware_room') {
        return (
            <g>
                <rect width="100%" height="100%" fill={ledOn ? "#F0FDF4" : "#F8FAFC"}/>
                <rect y="74%" width="100%" height="26%" fill={ledOn ? "#DCFCE7" : "#F1F5F9"}/>
                <line x1="0" y1="74%" x2="100%" y2="74%" stroke={ledOn ? "#86EFAC" : "#CBD5E1"} strokeWidth="2.5"/>

                <rect x="62%" y="10%" width="32%" height="56%" rx="10"
                    fill={ledOn ? "#ECFDF5" : "#FFFFFF"}
                    stroke={ledOn ? "#10B981" : "#94A3B8"}
                    strokeWidth="2"/>

                <text x="68%" y="34%" fontSize="28">💡</text>
                <rect x="68%" y="42%" width="20%" height="12%" rx="4" fill={ledOn ? "#10B981" : "#E2E8F0"}/>
                <text x="70%" y="51%" fill={ledOn ? "#FFFFFF" : "#64748B"} fontSize="8.5" fontWeight="bold">PIN 4</text>
                <line x1="78%" y1="66%" x2="78%" y2="74%" stroke={ledOn ? "#10B981" : "#64748B"} strokeWidth="3"/>

                {ledOn && (
                    <g>
                        <circle cx="78%" cy="30%" r="14%" fill="#10B981" opacity="0.12"/>
                        <circle cx="78%" cy="30%" r="22%" fill="#34D399" opacity="0.08"/>
                        <line x1="78%" y1="12%" x2="78%" y2="2%" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
                        <line x1="88%" y1="18%" x2="96%" y2="10%" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
                        <line x1="68%" y1="18%" x2="60%" y2="10%" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="15%" cy="20%" r="3" fill="#EC4899"/>
                        <circle cx="28%" cy="14%" r="3.5" fill="#3B82F6"/>
                        <circle cx="44%" cy="24%" r="3" fill="#F59E0B"/>
                        <circle cx="54%" cy="12%" r="3.5" fill="#8B5CF6"/>
                    </g>
                )}
            </g>
        );
    }

    return <rect width="100%" height="100%" fill="#FFFFFF"/>;
}

/* ===========================================================================
   THE 13 ROBO TEN KUTTY STORY SLIDES
   =========================================================================== */
const STORY_SLIDES = [
    // --- 1. THE TEN BLOCK STORE ---
    {
        id: 's1_robot_enters',
        label: '1. Robo Arrives',
        env: 'workshop',
        activeSpeaker: 'robot',
        speakerRole: 'Student 1 as Robo-Ten 🤖',
        dialogue: "Beep-boop! Hello everyone! I am Robo-Ten! I have a big mission today: I want to light up an LED on Pin 4! But I don't have any code yet. Let's ask the Ten Block Store!",
        robotMotion: 'slow_enter',
        heroX: 28,
        heroExpression: 'talking',
        heroHolding: null,
        workerCostume: null,
        workerX: 78,
        workerHandItem: null,
        snakeState: null,
        badgeLabel: "Hi! 👋",
        accentColor: "#2563EB"
    },
    {
        id: 's2_store_elf_rises',
        label: '2. Store Elf Offers Block',
        env: 'workshop',
        activeSpeaker: 'worker',
        speakerRole: 'Student 2 as Store Elf 🏪',
        dialogue: "Welcome to Ten Block Store, Robo-Ten! Don't worry, coding is super easy with blocks! Here is a shiny colorful block: [Turn LED Pin 4 ON]! Take this over to the Python Engine!",
        robotMotion: 'idle',
        heroX: 28,
        heroExpression: 'happy',
        heroHolding: null,
        workerCostume: 'shopkeeper',
        workerX: 78,
        workerHandItem: 'block',
        snakeState: null,
        badgeLabel: "Get Block! 🧩",
        accentColor: "#D97706"
    },
    {
        id: 's3_robot_receives_and_moves',
        label: '3. Off to Python Engine!',
        env: 'workshop',
        activeSpeaker: 'robot',
        speakerRole: 'Student 1 as Robo-Ten 🤖',
        dialogue: "Thank you, Store Elf! I've got the block in my hands! Now rolling out to the Python Engine... Zoom! Watch me roll!",
        robotMotion: 'slow_exit',
        heroX: 28,
        heroExpression: 'talking',
        heroHolding: 'block',
        workerCostume: 'shopkeeper',
        workerX: 82,
        workerHandItem: null,
        snakeState: null,
        badgeLabel: "Bye Bye! 🚀",
        accentColor: "#2563EB"
    },

    // --- 2. PYTHON ENGINE & THE SNEAKY SNAKE ---
    {
        id: 's4_arrives_python_engine',
        label: '4. Python Engine',
        env: 'python_lab',
        activeSpeaker: 'robot',
        speakerRole: 'Student 1 as Robo-Ten 🤖',
        dialogue: "Here I am at the Python Engine! Hello inside the computer! Can you convert my colorful block into real code so the machine understands it?",
        robotMotion: 'room_enter',
        heroX: 24,
        heroExpression: 'talking',
        heroHolding: 'block',
        workerCostume: 'coder',
        workerX: 82,
        workerHandItem: null,
        snakeState: null,
        badgeLabel: "Python Engine 💻",
        accentColor: "#4F46E5"
    },
    {
        id: 's5_snake_pops_up',
        label: '5. Snake Jumps Out!',
        env: 'python_lab',
        activeSpeaker: 'robot',
        speakerRole: 'Student 1 as Robo-Ten 🤖',
        dialogue: "YIKES! 😱 A REAL SNAKE?! Why on earth is a snake slithering inside my computer program?! Get away from my block!",
        robotMotion: 'idle',
        heroX: 20,
        heroExpression: 'surprised',
        heroHolding: 'block',
        workerCostume: 'coder',
        workerX: 82,
        workerHandItem: null,
        snakeState: 'alive',
        badgeLabel: "Snake Alert! 🐍",
        accentColor: "#DC2626"
    },
    {
        id: 's6_wizard_shouts_warning',
        label: '6. Wizard Warning',
        env: 'python_lab',
        activeSpeaker: 'worker',
        speakerRole: 'Student 2 as Code Wizard 🧙‍♂️',
        dialogue: "Robo-Ten, watch out! People confuse Python with a wild reptile! Use your block to knock it out before it chews on our electric cables!",
        robotMotion: 'idle',
        heroX: 22,
        heroExpression: 'surprised',
        heroHolding: 'block',
        workerCostume: 'coder',
        workerX: 82,
        workerHandItem: null,
        snakeState: 'alive',
        badgeLabel: "Watch Out! ⚠️",
        accentColor: "#7C3AED"
    },
    {
        id: 's7_bonk_knockout',
        label: '7. BONK! 💥',
        env: 'python_lab',
        activeSpeaker: 'robot',
        speakerRole: 'Student 1 as Robo-Ten 🤖',
        dialogue: "BONK! 💥 Python is NOT a scary snake! It is a world-class coding language used by rocket scientists! Down you go, sleepy snake!",
        robotMotion: 'idle',
        heroX: 24,
        heroExpression: 'winking_bonk',
        heroHolding: 'block_swing',
        workerCostume: 'coder',
        workerX: 82,
        workerHandItem: null,
        snakeState: 'knocked',
        showBonkBurst: true,
        badgeLabel: "BONK! 💥",
        accentColor: "#DB2777"
    },
    {
        id: 's8_wizard_translates_code',
        label: '8. Real Python Code',
        env: 'python_lab',
        activeSpeaker: 'worker',
        speakerRole: 'Student 2 as Code Wizard 🧙‍♂️',
        dialogue: "Aha! Beautiful hit! Look closely: behind your colorful block, I have generated real Python text code: digital_write(4, 1)! Take this code to the ESP32 CPU Brain!",
        robotMotion: 'idle',
        heroX: 25,
        heroExpression: 'happy',
        heroHolding: 'code',
        workerCostume: 'coder',
        workerX: 80,
        workerHandItem: 'code',
        snakeState: 'knocked',
        badgeLabel: "Python Code 📜",
        accentColor: "#7C3AED"
    },

    // --- 3. ESP32 CPU BRAIN ---
    {
        id: 's9_arrives_esp32_brain',
        label: '9. ESP32 Brain',
        env: 'cpu_chip',
        activeSpeaker: 'robot',
        speakerRole: 'Student 1 as Robo-Ten 🤖',
        dialogue: "Greetings, ESP32 Microchip Brain! I have carried real Python code all the way from the engine: digital_write(4, 1)! Please execute this command!",
        robotMotion: 'room_enter',
        heroX: 24,
        heroExpression: 'talking',
        heroHolding: 'code',
        workerCostume: 'electrician',
        workerX: 80,
        workerHandItem: null,
        snakeState: null,
        badgeLabel: "ESP32 Brain 🧠",
        accentColor: "#9333EA"
    },
    {
        id: 's10_spark_bot_electric_pulse',
        label: '10. Electric Pulses ⚡',
        env: 'cpu_chip',
        activeSpeaker: 'worker',
        speakerRole: 'Student 2 as Spark Bot ⚡',
        dialogue: "Command received! Converting Python digital logic into 3.3 Volts of pure electrical energy! ZAP! Sending power down Pin 4 trace right now!",
        robotMotion: 'idle',
        heroX: 24,
        heroExpression: 'happy',
        heroHolding: 'code',
        workerCostume: 'electrician',
        workerX: 80,
        workerHandItem: 'spark',
        snakeState: null,
        badgeLabel: "3.3V Power! ⚡",
        accentColor: "#EA580C"
    },

    // --- 4. PIN 4 & THE BIG SHINE ---
    {
        id: 's11_arrives_at_pin4_led',
        label: '11. At Pin 4 LED',
        env: 'hardware_room',
        activeSpeaker: 'robot',
        speakerRole: 'Student 1 as Robo-Ten 🤖',
        dialogue: "Hello Pin 4! The electrical energy is flowing through the wires right to your socket! Are you ready to wake up and glow?",
        robotMotion: 'room_enter',
        heroX: 22,
        heroExpression: 'talking',
        heroHolding: null,
        workerCostume: 'lightkeeper',
        workerX: 78,
        workerHandItem: 'switch',
        snakeState: null,
        badgeLabel: "At Pin 4 🔌",
        accentColor: "#0284C7"
    },
    {
        id: 's12_light_hero_closes_circuit',
        label: '12. Flipping Switch',
        env: 'hardware_room',
        activeSpeaker: 'worker',
        speakerRole: 'Student 2 as Light Hero 💡',
        dialogue: "Switch flipped! Circuit closed! 3.3 Volts flowing into Pin 4 anode... Current surging through the semiconductor... 3... 2... 1... IGNITION!",
        robotMotion: 'idle',
        heroX: 22,
        heroExpression: 'happy',
        heroHolding: null,
        workerCostume: 'lightkeeper',
        workerX: 78,
        workerHandItem: 'switch',
        snakeState: null,
        badgeLabel: "Power ON! 💡",
        accentColor: "#059669"
    },
    {
        id: 's13_led_shines_victory',
        label: '13. THE BIG SHINE! 🌟',
        env: 'hardware_room',
        ledOn: true,
        activeSpeaker: 'both',
        speakerRole: 'Both Students in Chorus 🎉',
        dialogue: "HOORAY! THE LED IS SHINING BRIGHT! 🌟 From a simple colorful block, to Python code, to electrical voltage, to real hardware light! YOU ARE A REAL HARDWARE CODER!",
        robotMotion: 'idle',
        heroX: 24,
        heroExpression: 'star_eyes',
        heroHolding: null,
        workerCostume: 'lightkeeper',
        workerX: 78,
        workerHandItem: null,
        snakeState: null,
        badgeLabel: "Victory! 🌟",
        accentColor: "#16A34A"
    }
];

/* ===========================================================================
   MAIN COMPONENT
   =========================================================================== */
export default function RobotExecutionPipeline({ isPlayingDefault = false }) {
    const containerRef = useRef(null);

    const [slideIndex, setSlideIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(isPlayingDefault);
    const [readingPace, setReadingPace] = useState('dubbing');
    const [timerProgress, setTimerProgress] = useState(0);

    // Full screen state
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Motorized wheel spin state
    const [isRolling, setIsRolling] = useState(false);

    // Entrance gate: Robo-Ten only rolls in when Auto-Play is clicked!
    const [hasEntered, setHasEntered] = useState(false);

    const slideDuration = readingPace === 'dubbing' ? 8200 : 4200;
    const cur = STORY_SLIDES[slideIndex];

    // Toggle Full Screen (HTML5 API + CSS Fallback)
    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (containerRef.current?.requestFullscreen) {
                containerRef.current.requestFullscreen().catch(() => {});
            }
            setIsFullscreen(true);
        } else {
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
            setIsFullscreen(false);
        }
    };

    // Listen to browser fullscreen change event (e.g. Esc key pressed)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Also support keyboard Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    // Trigger motorized wheel rotation based on motion and playing state
    useEffect(() => {
        if (cur.robotMotion === 'slow_enter') {
            if (hasEntered || isPlaying) {
                setIsRolling(true);
                const t = setTimeout(() => setIsRolling(false), 2400);
                return () => clearTimeout(t);
            } else {
                setIsRolling(false);
            }
        } else if (cur.robotMotion === 'slow_exit') {
            setIsRolling(true);
        } else if (cur.robotMotion === 'room_enter') {
            setIsRolling(true);
            const t = setTimeout(() => setIsRolling(false), 1900);
            return () => clearTimeout(t);
        } else {
            setIsRolling(false);
        }
    }, [slideIndex, cur.robotMotion, hasEntered, isPlaying]);

    // Timer & Auto-advance with progress bar
    useEffect(() => {
        if (!isPlaying) {
            setTimerProgress(0);
            return;
        }

        const intervalMs = 100;
        let elapsed = 0;

        const interval = setInterval(() => {
            elapsed += intervalMs;
            setTimerProgress(Math.min(100, (elapsed / slideDuration) * 100));

            if (elapsed >= slideDuration) {
                setSlideIndex(prev => {
                    if (prev < STORY_SLIDES.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return 0;
                    }
                });
                elapsed = 0;
                setTimerProgress(0);
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, [isPlaying, slideIndex, slideDuration]);

    // Handlers
    const handleTogglePlay = () => {
        setIsPlaying(prev => {
            const next = !prev;
            if (next && slideIndex === 0) {
                setHasEntered(true);
            }
            return next;
        });
    };

    const handleReset = () => {
        setIsPlaying(false);
        setSlideIndex(0);
        setHasEntered(false);
        setIsRolling(false);
    };

    const targetX = 420 * (cur.heroX / 100) - 48;

    return (
        <div
            ref={containerRef}
            style={{
                background: '#FFFFFF',
                ...(isFullscreen ? {
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999999,
                    width: '100vw',
                    height: '100vh',
                    borderRadius: 0,
                    border: 'none',
                    boxShadow: 'none',
                    margin: 0
                } : {
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.06)'
                }),
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Outfit, sans-serif'
            }}
        >
            {/* Top Clean Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isFullscreen ? '12px 20px' : '9px 14px',
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                flexWrap: 'wrap',
                gap: '8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#EEF2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4F46E5'
                    }}>
                        <Sparkles size={15}/>
                    </div>
                    <div>
                        <div style={{ fontSize: isFullscreen ? '1rem' : '0.84rem', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Robo Ten Kutty Story 🌟
                            {isFullscreen && (
                                <span style={{
                                    fontSize: '0.66rem',
                                    fontWeight: '700',
                                    background: '#EEF2FF',
                                    color: '#4F46E5',
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    border: '1px solid #C7D2FE'
                                }}>
                                    Theater Mode
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: '0.67rem', color: '#64748B', fontWeight: '600' }}>
                            Story Part {slideIndex + 1} of {STORY_SLIDES.length}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* Reading Pace Selector */}
                    <div style={{
                        display: 'flex',
                        background: '#E2E8F0',
                        borderRadius: '999px',
                        padding: '2px',
                        fontSize: '0.68rem',
                        fontWeight: '700'
                    }}>
                        <button
                            onClick={() => setReadingPace('dubbing')}
                            style={{
                                padding: '3px 8px',
                                borderRadius: '999px',
                                border: 'none',
                                background: readingPace === 'dubbing' ? '#FFFFFF' : 'transparent',
                                color: readingPace === 'dubbing' ? '#4F46E5' : '#64748B',
                                cursor: 'pointer',
                                fontWeight: readingPace === 'dubbing' ? '800' : '600'
                            }}
                        >
                            🎙️ Read Aloud (8s)
                        </button>
                        <button
                            onClick={() => setReadingPace('quick')}
                            style={{
                                padding: '3px 8px',
                                borderRadius: '999px',
                                border: 'none',
                                background: readingPace === 'quick' ? '#FFFFFF' : 'transparent',
                                color: readingPace === 'quick' ? '#4F46E5' : '#64748B',
                                cursor: 'pointer',
                                fontWeight: readingPace === 'quick' ? '800' : '600'
                            }}
                        >
                            ⚡ Quick (4s)
                        </button>
                    </div>

                    <button
                        onClick={handleTogglePlay}
                        style={{
                            padding: '4px 11px',
                            background: isPlaying ? '#EF4444' : '#10B981',
                            border: 'none',
                            borderRadius: '999px',
                            color: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        {isPlaying ? <Pause size={12}/> : <Play size={12}/>}
                        {isPlaying ? 'Pause' : 'Auto-Play'}
                    </button>

                    <button
                        onClick={handleReset}
                        title="Restart story"
                        style={{
                            width: '26px',
                            height: '26px',
                            background: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            borderRadius: '50%',
                            color: '#475569',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <RotateCcw size={12}/>
                    </button>

                    {/* FULL SCREEN TOGGLE BUTTON */}
                    <button
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Screen Theater View"}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 9px',
                            background: isFullscreen ? '#4F46E5' : '#F1F5F9',
                            border: isFullscreen ? 'none' : '1px solid #CBD5E1',
                            borderRadius: '8px',
                            color: isFullscreen ? '#FFFFFF' : '#475569',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        {isFullscreen ? <Minimize2 size={13}/> : <Maximize2 size={13}/>}
                        <span>{isFullscreen ? 'Exit' : 'Full Screen'}</span>
                    </button>
                </div>
            </div>

            {/* Reading Timer Progress Bar */}
            <div style={{ width: '100%', height: '3px', background: '#F1F5F9', overflow: 'hidden' }}>
                <div style={{
                    width: `${timerProgress}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${cur.accentColor}, #4F46E5)`,
                    transition: 'width 0.1s linear'
                }}/>
            </div>

            {/* Story Part Selector Ribbon */}
            <div style={{
                display: 'flex',
                gap: '5px',
                padding: '7px 12px',
                overflowX: 'auto',
                background: '#FFFFFF',
                borderBottom: '1px solid #F1F5F9'
            }}>
                {STORY_SLIDES.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => {
                            setIsPlaying(false);
                            setSlideIndex(idx);
                            if (idx === 0) setHasEntered(true);
                        }}
                        style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: slideIndex === idx ? `1.5px solid ${s.accentColor}` : '1px solid #E2E8F0',
                            background: slideIndex === idx ? s.accentColor + '18' : '#F8FAFC',
                            color: slideIndex === idx ? s.accentColor : '#64748B',
                            fontSize: '0.64rem',
                            fontWeight: slideIndex === idx ? '800' : '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            transition: 'all 0.15s ease'
                        }}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* THE VISUAL STAGE — EXPANDS IN FULL SCREEN */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: isFullscreen ? 'calc(100vh - 215px)' : '225px',
                minHeight: isFullscreen ? '340px' : '225px',
                overflow: 'hidden',
                background: '#FFFFFF',
                flex: isFullscreen ? 1 : 'none'
            }}>
                {/* INVITATION PROMPT BEFORE AUTOPLAY ON SLIDE 0 */}
                {slideIndex === 0 && !hasEntered && !isPlaying && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}>
                        <Motion.button
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                            onClick={() => {
                                setHasEntered(true);
                                setIsPlaying(true);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: isFullscreen ? '14px 28px' : '10px 20px',
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '999px',
                                fontSize: isFullscreen ? '1rem' : '0.86rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                                letterSpacing: '0.3px'
                            }}
                        >
                            <Play size={isFullscreen ? 18 : 16} fill="white"/>
                            Click Auto-Play to Start Story!
                        </Motion.button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <Motion.div
                        key={cur.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <svg
                            width="100%" height="100%"
                            viewBox="0 0 420 220"
                            preserveAspectRatio="xMidYMid meet"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ display: 'block' }}
                        >
                            <SceneBackground env={cur.env} ledOn={cur.ledOn}/>

                            {/* Ground Shadows */}
                            {cur.workerCostume && (
                                <ellipse cx={420 * (cur.workerX / 100)} cy="180" rx="26" ry="7" fill="rgba(0,0,0,0.08)"/>
                            )}

                            {/* HERO ROBOT WITH ENTRANCE & EXIT MOTIONS */}
                            {cur.robotMotion === 'slow_enter' ? (
                                (hasEntered || isPlaying) ? (
                                    <Motion.g
                                        key={`enter_${hasEntered}`}
                                        initial={{ x: -90, y: 82 }}
                                        animate={{ x: targetX, y: 82 }}
                                        transition={{ duration: 2.3, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <HeroRobot
                                            expression={cur.heroExpression}
                                            holdingItem={cur.heroHolding}
                                            isRolling={isRolling}
                                            size={95}
                                        />
                                        <g transform="translate(18, -14)">
                                            <rect x="0" y="0" width="64" height="18" rx="9" fill="#FFFFFF" stroke={cur.accentColor} strokeWidth="1.5"
                                                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
                                            <text x="32" y="13" fill={cur.accentColor} fontSize="8.5" fontWeight="bold" textAnchor="middle">
                                                {cur.badgeLabel}
                                            </text>
                                        </g>
                                    </Motion.g>
                                ) : (
                                    <g transform="translate(-95, 82)">
                                        <HeroRobot
                                            expression="happy"
                                            holdingItem={null}
                                            isRolling={false}
                                            size={95}
                                        />
                                    </g>
                                )
                            ) : cur.robotMotion === 'slow_exit' ? (
                                <Motion.g
                                    initial={{ x: targetX, y: 82 }}
                                    animate={{ x: 470, y: 82 }}
                                    transition={{ duration: 4.6, ease: [0.3, 0, 0.7, 1], delay: 1.0 }}
                                >
                                    <HeroRobot
                                        expression={cur.heroExpression}
                                        holdingItem={cur.heroHolding}
                                        isRolling={isRolling}
                                        size={95}
                                    />
                                    <g transform="translate(18, -14)">
                                        <rect x="0" y="0" width="72" height="18" rx="9" fill="#FFFFFF" stroke={cur.accentColor} strokeWidth="1.5"
                                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
                                        <text x="36" y="13" fill={cur.accentColor} fontSize="8.5" fontWeight="bold" textAnchor="middle">
                                            {cur.badgeLabel}
                                        </text>
                                    </g>
                                </Motion.g>
                            ) : cur.robotMotion === 'room_enter' ? (
                                <Motion.g
                                    initial={{ x: -70, y: 82 }}
                                    animate={{ x: targetX, y: 82 }}
                                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <HeroRobot
                                        expression={cur.heroExpression}
                                        holdingItem={cur.heroHolding}
                                        isRolling={isRolling}
                                        size={95}
                                    />
                                    <g transform="translate(12, -14)">
                                        <rect x="0" y="0" width="84" height="18" rx="9" fill="#FFFFFF" stroke={cur.accentColor} strokeWidth="1.5"
                                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
                                        <text x="42" y="13" fill={cur.accentColor} fontSize="8" fontWeight="bold" textAnchor="middle">
                                            {cur.badgeLabel}
                                        </text>
                                    </g>
                                </Motion.g>
                            ) : (
                                <g transform={`translate(${targetX}, 82)`}>
                                    <HeroRobot
                                        expression={cur.heroExpression}
                                        holdingItem={cur.heroHolding}
                                        isRolling={false}
                                        size={95}
                                    />
                                    <g transform="translate(12, -14)">
                                        <rect x="0" y="0" width="84" height="18" rx="9" fill="#FFFFFF" stroke={cur.accentColor} strokeWidth="1.5"
                                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
                                        <text x="42" y="13" fill={cur.accentColor} fontSize="8" fontWeight="bold" textAnchor="middle">
                                            {cur.badgeLabel}
                                        </text>
                                    </g>
                                </g>
                            )}

                            {/* STATION WORKER (Far Right) */}
                            {cur.workerCostume && (
                                <g transform={`translate(${420 * (cur.workerX / 100) - 40}, 92)`}>
                                    <StationWorker
                                        costume={cur.workerCostume}
                                        handItem={cur.workerHandItem}
                                        size={82}
                                    />
                                </g>
                            )}

                            {/* ALIVE SNAKE (Center X: 185) */}
                            {cur.snakeState === 'alive' && (
                                <g transform="translate(185, 78)">
                                    <CartoonSnake knocked={false} size={76}/>
                                </g>
                            )}

                            {/* KNOCKED SNAKE (Center floor X: 150) */}
                            {cur.snakeState === 'knocked' && (
                                <g transform="translate(150, 130)">
                                    <CartoonSnake knocked={true} size={76}/>
                                </g>
                            )}

                            {/* BONK BURST */}
                            {cur.showBonkBurst && (
                                <g transform="translate(155, 48)">
                                    <polygon
                                        points="45,0 55,16 75,12 68,28 88,38 68,48 76,66 54,60 44,76 34,60 12,66 20,48 0,38 20,28 13,12 33,16"
                                        fill="#EF4444" stroke="#B91C1C" strokeWidth="2"
                                    />
                                    <text x="21" y="44" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="sans-serif">BONK!</text>
                                    <text x="70" y="32" fontSize="14">💥</text>
                                </g>
                            )}
                        </svg>
                    </Motion.div>
                </AnimatePresence>
            </div>

            {/* ROLEPLAY SCRIPT & CUE CARD — SCALES IN FULL SCREEN */}
            <div style={{ padding: isFullscreen ? '10px 20px 6px' : '9px 14px 4px' }}>
                <div style={{
                    background: cur.activeSpeaker === 'robot' ? '#EFF6FF' : cur.activeSpeaker === 'both' ? '#F0FDF4' : '#FAF5FF',
                    border: `1.5px solid ${cur.accentColor}40`,
                    borderLeft: `5px solid ${cur.accentColor}`,
                    borderRadius: '10px',
                    padding: isFullscreen ? '12px 18px' : '9px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: cur.accentColor,
                            color: '#FFFFFF',
                            fontSize: isFullscreen ? '0.78rem' : '0.68rem',
                            fontWeight: '800',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            letterSpacing: '0.3px'
                        }}>
                            <Mic size={isFullscreen ? 13 : 11}/>
                            🎭 Role: {cur.speakerRole}
                        </div>
                        <span style={{ fontSize: isFullscreen ? '0.74rem' : '0.67rem', color: '#64748B', fontWeight: '600' }}>
                            Your turn to read! 🌟
                        </span>
                    </div>

                    <div style={{
                        fontSize: isFullscreen ? '1.08rem' : '0.86rem',
                        color: '#0F172A',
                        fontWeight: '700',
                        lineHeight: '1.45',
                        padding: '2px 0'
                    }}>
                        “{cur.dialogue}”
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isFullscreen ? '10px 20px 14px' : '8px 14px 12px'
            }}>
                <button
                    onClick={() => { setIsPlaying(false); setSlideIndex(s => Math.max(0, s - 1)); }}
                    disabled={slideIndex === 0}
                    style={{
                        padding: isFullscreen ? '7px 16px' : '5px 12px',
                        background: slideIndex === 0 ? '#F8FAFC' : '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        color: slideIndex === 0 ? '#94A3B8' : '#1E293B',
                        fontSize: isFullscreen ? '0.82rem' : '0.74rem',
                        fontWeight: '700',
                        cursor: slideIndex === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <ChevronLeft size={14}/>
                    Previous Line
                </button>

                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {STORY_SLIDES.map((s, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setIsPlaying(false);
                                setSlideIndex(idx);
                                if (idx === 0) setHasEntered(true);
                            }}
                            title={s.label}
                            style={{
                                width: slideIndex === idx ? (isFullscreen ? '22px' : '16px') : (isFullscreen ? '8px' : '6px'),
                                height: isFullscreen ? '8px' : '6px',
                                borderRadius: '999px',
                                background: slideIndex === idx ? cur.accentColor : '#CBD5E1',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                padding: 0
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={() => {
                        setIsPlaying(false);
                        if (slideIndex === 0 && !hasEntered) {
                            setHasEntered(true);
                        } else {
                            setSlideIndex(s => s < STORY_SLIDES.length - 1 ? s + 1 : 0);
                        }
                    }}
                    style={{
                        padding: isFullscreen ? '7px 18px' : '5px 14px',
                        background: `linear-gradient(135deg, ${cur.accentColor}, #4F46E5)`,
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: isFullscreen ? '0.82rem' : '0.74rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: `0 2px 8px ${cur.accentColor}35`
                    }}
                >
                    {slideIndex === STORY_SLIDES.length - 1 ? 'Replay Story 🔄' : (slideIndex === 0 && !hasEntered) ? 'Start Story ▶️' : 'Next Line'}
                    {slideIndex !== STORY_SLIDES.length - 1 && <ChevronRight size={14}/>}
                </button>
            </div>
        </div>
    );
}
