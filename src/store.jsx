import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_GAMES, loadState, saveState, randomName, STORAGE_KEY } from './data.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const initial = {
  player: null,
  welcomed: false,
  scan: null,
  points: 500,
  xp: 225,
  stats: { matches: 0, wins: 0, kills: 0, top10: 0 },
  owned: [],
  equipped: { avatar: null, background: 'bg-birthday', frame: 'frame-birthday', skin: 'rootwalker' },
  liked: [],
  installed: [],
  badges: ['star-player'],
  friends: [],
  groups: [],
  videos: [
    { id: 'v-1', title: 'Nah uh', kind: 'SCREENSHOT', by: 'rhys.cotton20', caption: 'Hehe nah uh', icon: '😂', color: '#2b0b3a' },
  ],
  myGames: [],
  parties: [],
  settings: { theme: 'green', mobileAuto: false, autoFit: true, autoControls: true, classicTheme: false, notifications: false },
  ageGroup: 'Teen',
  parentalPin: null,
  redeemed: [],
  tickets: [],
  reports: [],
  dailyClaimed: false,
  discord: '',
  published: [],
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => ({ ...initial, ...(loadState() || {}) }));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => { saveState(state); }, [state]);

  useEffect(() => {
    const themes = {
      green: ['#39ff14', '#00e5c0'],
      cyan: ['#00bfff', '#00e5c0'],
      purple: ['#a78bfa', '#00bfff'],
      gold: ['#ffd60a', '#ff9d00'],
      red: ['#ff4d4d', '#ff9d00'],
    };
    const [a, b] = themes[state.settings.theme] || themes.green;
    const r = document.documentElement;
    r.style.setProperty('--accent', state.settings.classicTheme ? '#39ff14' : a);
    r.style.setProperty('--accent-2', state.settings.classicTheme ? '#39ff14' : b);
  }, [state.settings.theme, state.settings.classicTheme]);

  const notify = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const api = useMemo(() => ({
    state,
    setState,
    update: (patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })),
    notify,
    toast,
    signIn: (name, guest) => {
      setState((s) => ({
        ...s,
        welcomed: true,
        player: {
          username: name || randomName(),
          displayName: name || randomName(),
          guest: !!guest,
          since: new Date().toLocaleDateString('en-GB'),
          id: '#' + Math.random().toString(36).slice(2, 7).toUpperCase(),
        },
      }));
    },
    signOut: () => setState({ ...initial, settings: state.settings, welcomed: false, player: null }),
    addPoints: (n) => setState((s) => ({ ...s, points: Math.max(0, s.points + n) })),
    addXp: (n) => setState((s) => ({ ...s, xp: s.xp + n })),
    bumpStat: (key, n = 1) => setState((s) => ({ ...s, stats: { ...s.stats, [key]: (s.stats[key] || 0) + n } })),
    toggleLike: (id) => setState((s) => ({ ...s, liked: s.liked.includes(id) ? s.liked.filter((x) => x !== id) : [...s.liked, id] })),
    toggleInstall: (id) => setState((s) => ({ ...s, installed: s.installed.includes(id) ? s.installed.filter((x) => x !== id) : [...s.installed, id] })),
    allGames: () => [...DEFAULT_GAMES, ...state.myGames, ...state.published],
    reset: () => { localStorage.removeItem(STORAGE_KEY); setState({ ...initial }); },
  }), [state, toast]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
