import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Rail, TopNav, Stars } from './layout.jsx';
import { TreeLogo } from './icons.jsx';
import { useApp } from './store.jsx';
import { Gate, Home } from './pages/Home.jsx';
import { Games, Lobby, BattleBus } from './pages/Core.jsx';
import { Profile, Locker, Store, Leaderboard, Friends, Groups, Videos } from './pages/Social.jsx';
import { Studio } from './pages/Studio.jsx';
import { Settings, Reality, Collaborations, Account, Parental, Support, Moderation, Redeem, Legal, Chat, NotFound } from './pages/Misc.jsx';
import { PlayerProfile, GroupDetail } from './pages/Player.jsx';

function Shell() {
  const { state, toast } = useApp();
  const loc = useLocation();

  if (!state.player || !state.welcomed) return <><Stars /><Gate /></>;

  return (
    <div className="shell">
      <Stars />
      <Rail />
      <div className="main">
        <TopNav />
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/battle-bus" element={<BattleBus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/locker" element={<Locker />} />
          <Route path="/store" element={<Store />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/player/:username" element={<PlayerProfile />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reality" element={<Reality />} />
          <Route path="/collaborations" element={<Collaborations />} />
          <Route path="/account" element={<Account />} />
          <Route path="/parental-controls" element={<Parental />} />
          <Route path="/support" element={<Support />} />
          <Route path="/moderation" element={<Moderation />} />
          <Route path="/redeem" element={<Redeem />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/videos/*" element={<Videos />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* custom PlayTree offline screen + offline mode entry (browser offline events) */
function OfflineGate() {
  const { notify } = useApp();
  const [off, setOff] = useState(typeof navigator !== 'undefined' && !navigator.onLine);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const on = () => { setOff(false); notify('BACK ONLINE — SYNCING'); };
    const of = () => setOff(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', of);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', of); };
  }, [notify]);

  if (!off || entered) return null;
  const retry = () => {
    if (navigator.onLine) { setOff(false); notify('BACK ONLINE — SYNCING'); } else notify('STILL OFFLINE — NO NETWORK');
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3200, background: 'radial-gradient(ellipse at center, #05210f, #010604)' }} className="center">
      <div className="panel glow" style={{ maxWidth: 420, padding: 30, textAlign: 'center' }}>
        <div style={{ animation: 'pt-spin 3s linear infinite', display: 'inline-block' }}><TreeLogo size={56} /></div>
        <div className="font-head" style={{ fontSize: '1.5rem', letterSpacing: 4, marginTop: 16 }}>YOU'RE OFFLINE</div>
        <div className="muted" style={{ marginTop: 10, lineHeight: 1.6, fontSize: '0.92rem' }}>
          No network detected — but PlayTree still runs. Your progress, games and locker are saved on this device.
        </div>
        <button className="btn primary block" style={{ marginTop: 20, padding: 13 }} onClick={() => { setEntered(true); notify('OFFLINE MODE ACTIVE'); }}>
          ENTER OFFLINE MODE
        </button>
        <button className="btn ghost block" style={{ marginTop: 10 }} onClick={retry}>RETRY CONNECTION</button>
        <div className="mono-label center" style={{ marginTop: 14 }}>PLAYTREE OFFLINE — GOSTUDIOS 2026</div>
      </div>
    </div>
  );
}

/* PWA install button (beforeinstallprompt) */
function InstallButton() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const h = () => setReady(true);
    window.addEventListener('pt-install-ready', h);
    if (window.__ptInstallPending) setReady(true);
    return () => window.removeEventListener('pt-install-ready', h);
  }, []);
  if (!ready) return null;
  return (
    <button className="btn primary" style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1500, boxShadow: '0 0 18px rgba(57,255,20,0.35)' }}
      onClick={() => { if (window.__ptInstall) window.__ptInstall(); }}>
      ⬇ ADD TO DESKTOP
    </button>
  );
}

export default function App() {
  return (
    <HashRouter>
      <OfflineGate />
      <InstallButton />
      <Shell />
    </HashRouter>
  );
}
