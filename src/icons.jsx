import React from 'react';
// Cartoon icons — hand-drawn-ish, thick strokes
const Icon = {
  Game: ({size=64, color='currentColor'}) => (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 24 Q12 18 18 16 L46 16 Q52 18 50 24 L48 40 Q47 46 41 46 L23 46 Q17 46 16 40 Z" fill="#F9C74F"/>
      <circle cx="24" cy="30" r="3" fill={color}/>
      <circle cx="40" cy="30" r="3" fill={color}/>
      <path d="M22 36 Q32 42 42 36" />
      <path d="M14 22 L8 28 M50 22 L56 28" stroke="#C0392B" strokeWidth="4"/>
    </svg>
  ),
  Book: ({size=64, color='currentColor'}) => (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14 Q10 12 12 12 L30 14 Q32 14 32 16 L32 52 Q32 54 30 53 L12 51 Q10 51 10 49 Z" fill="#E67E22"/>
      <path d="M54 14 Q54 12 52 12 L34 14 Q32 14 32 16 L32 52 Q32 54 34 53 L52 51 Q54 51 54 49 Z" fill="#F9C74F"/>
      <path d="M16 22 L26 23 M16 28 L26 29 M16 34 L26 35" />
      <path d="M38 22 L48 23 M38 28 L48 29 M38 34 L48 35" />
    </svg>
  ),
  Math: ({size=64, color='currentColor'}) => (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="10" width="44" height="44" rx="10" fill="#2C7A51"/>
      <text x="32" y="40" textAnchor="middle" fontSize="26" fontWeight="900" fill="#FFF6E5" stroke="none" fontFamily="Fredoka, sans-serif">×÷</text>
      <path d="M14 14 Q20 12 26 14" stroke="#FFF6E5"/>
    </svg>
  ),
  Spell: ({size=64, color='currentColor'}) => (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="22" fill="#C0392B"/>
      <text x="32" y="40" textAnchor="middle" fontSize="22" fontWeight="900" fill="#FFF6E5" stroke="none" fontFamily="Cairo, sans-serif">أ ب</text>
    </svg>
  ),
  Star: ({size=24, color='#F9C74F', filled=true}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={filled?color:'none'} stroke={color} strokeWidth="2" strokeLinejoin="round">
      <path d="M12 3 L15 9.5 L22 10.5 L17 15.5 L18.5 22.5 L12 19 L5.5 22.5 L7 15.5 L2 10.5 L9 9.5 Z"/>
    </svg>
  ),
  Heart: ({size=24, color='#C0392B', filled=true}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={filled?color:'none'} stroke={color} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M12 21 C 8 17, 3 13, 3 8.5 A 5 5 0 0 1 12 6 A 5 5 0 0 1 21 8.5 C 21 13, 16 17, 12 21 Z"/>
    </svg>
  ),
  Lock: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <rect x="5" y="11" width="14" height="10" rx="2.5" fill={color} opacity=".15"/>
      <rect x="5" y="11" width="14" height="10" rx="2.5"/>
      <path d="M8 11 V 8 A 4 4 0 0 1 16 8 V 11"/>
      <circle cx="12" cy="16" r="1.5" fill={color}/>
    </svg>
  ),
  Mic: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="12" rx="3" fill={color}/>
      <path d="M5 11 A 7 7 0 0 0 19 11 M12 18 V 21 M8 21 H 16"/>
    </svg>
  ),
  Play: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M7 4 V 20 L 20 12 Z"/>
    </svg>
  ),
  Pause: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <rect x="6" y="4" width="4" height="16" rx="1.5"/>
      <rect x="14" y="4" width="4" height="16" rx="1.5"/>
    </svg>
  ),
  Back: ({size=24, color='currentColor', rtl=true}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{transform: rtl?'scaleX(-1)':'none'}}>
      <path d="M14 6 L 8 12 L 14 18"/>
    </svg>
  ),
  Crown: ({size=24, color='#F9C74F'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} stroke="#C0392B" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M3 9 L 7 13 L 12 5 L 17 13 L 21 9 L 19 19 H 5 Z"/>
      <circle cx="3" cy="9" r="1.5" fill="#C0392B"/>
      <circle cx="21" cy="9" r="1.5" fill="#C0392B"/>
      <circle cx="12" cy="5" r="1.5" fill="#C0392B"/>
    </svg>
  ),
  Sparkle: ({size=24, color='#F9C74F'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 2 L 13.5 10.5 L 22 12 L 13.5 13.5 L 12 22 L 10.5 13.5 L 2 12 L 10.5 10.5 Z"/>
    </svg>
  ),
  Cards: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round">
      <rect x="3" y="6" width="12" height="16" rx="2" fill="#FFF6E5"/>
      <rect x="9" y="2" width="12" height="16" rx="2" fill="#F9C74F" transform="rotate(8 15 10)"/>
    </svg>
  ),
  Settings: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  Users: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Brush: ({size=64, color='currentColor'}) => (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M42 6 L58 22 L24 54 Q14 60 8 56 Q10 46 18 36 Z" fill="#F9C74F" stroke={color} strokeWidth="3.5"/>
      <path d="M42 6 L58 22" stroke={color} strokeWidth="4"/>
      <path d="M36 12 L50 26" stroke="#FFF6E5" strokeWidth="2" opacity=".5"/>
      <circle cx="13" cy="51" r="7" fill={color}/>
    </svg>
  ),
  Home: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11 L 12 4 L 20 11 V 20 A 1 1 0 0 1 19 21 H 14 V 14 H 10 V 21 H 5 A 1 1 0 0 1 4 20 Z"/>
    </svg>
  ),
  Check: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12 L 10 17 L 19 7"/>
    </svg>
  ),
  Close: ({size=24, color='currentColor'}) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M6 6 L 18 18 M18 6 L 6 18"/>
    </svg>
  ),
};

// Decorative shapes — Berber/zellige inspired
const Deco = {
  // Berber diamond pattern divider
  BerberStrip: ({color='#C0392B', size=20}) => (
    <svg height={size} width="100%" preserveAspectRatio="none" viewBox={`0 0 200 ${size}`}>
      <pattern id={`bp-${color.slice(1)}`} x="0" y="0" width="20" height={size} patternUnits="userSpaceOnUse">
        <path d={`M0 ${size/2} L 5 0 L 10 ${size/2} L 15 0 L 20 ${size/2} L 15 ${size} L 10 ${size/2} L 5 ${size} Z`} fill={color}/>
      </pattern>
      <rect width="100%" height={size} fill={`url(#bp-${color.slice(1)})`}/>
    </svg>
  ),
  // Hand-drawn squiggly underline
  Squiggle: ({color='#C0392B', width=120}) => (
    <svg viewBox="0 0 120 12" width={width} height="12" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M2 6 Q 15 1, 30 6 T 60 6 T 90 6 T 118 6"/>
    </svg>
  ),
  // Sun rays
  Sun: ({size=200, color='#F9C74F'}) => (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <g fill={color}>
        {[...Array(12)].map((_,i) => (
          <rect key={i} x="96" y="10" width="8" height="30" rx="3" transform={`rotate(${i*30} 100 100)`}/>
        ))}
        <circle cx="100" cy="100" r="48"/>
      </g>
    </svg>
  ),
  // Tassili-style mountain
  Mountains: ({color='#C0392B'}) => (
    <svg viewBox="0 0 400 100" width="100%" preserveAspectRatio="none" height="100">
      <path d={`M0 100 L 0 60 L 50 30 L 100 60 L 160 20 L 220 50 L 280 25 L 340 55 L 400 30 L 400 100 Z`} fill={color}/>
    </svg>
  ),
};

window.Icon = Icon;
window.Deco = Deco;
