import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Rail, TopNav, Stars } from './layout.jsx';
import { useApp } from './store.jsx';
import { Gate, Home } from './pages/Home.jsx';
import { Games, Lobby, BattleBus } from './pages/Core.jsx';
import { Profile, Locker, Store, Leaderboard, Friends, Groups, Videos } from './pages/Social.jsx';
import { Studio } from './pages/Studio.jsx';
import { Settings, Reality, Collaborations, Account, Parental, Support, Moderation, Redeem, Legal, Chat, NotFound } from './pages/Misc.jsx';

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

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
