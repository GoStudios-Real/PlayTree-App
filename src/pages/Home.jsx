import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon, { TreeLogo } from '../icons.jsx';
import { Stars } from '../layout.jsx';
import { useApp } from '../store.jsx';
import { randomName, SEASON, DEFAULT_GAMES, BANNERS } from '../data.js';
import GameModal from '../games.jsx';

/* ---------------- Gate (welcome / age scan) ---------------- */
export function Gate() {
  const { state, signIn, notify } = useApp();
  const [name, setName] = useState(() => randomName());
  const [phase, setPhase] = useState(state.player && state.welcomed ? 'scan' : 'welcome');
  const [prog, setProg] = useState(0);

  useEffect(() => {
    if (phase !== 'scan') return undefined;
    let p = 0;
    const id = setInterval(() => {
      p += 4 + Math.random() * 9;
      if (p >= 100) { p = 100; clearInterval(id); }
      setProg(p);
    }, 130);
    return () => clearInterval(id);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className="gate">
      <Stars />
      <div className="gate-card">
        {phase === 'welcome' ? (
          <>
            <div className="gate-head">
              <div className="gate-logo"><TreeLogo size={34} /></div>
              <div className="gate-title">PLAYTREE</div>
              <div className="gate-sub">{SEASON.chapter} · {SEASON.season}</div>
            </div>
            <div className="gate-body stack" style={{ gap: 16 }}>
              <p className="muted" style={{ margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}>
                Choose your player name and jump in. Your account is created instantly — no email, no password.
              </p>
              <div className="row" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line-soft)', borderRadius: 6, padding: '4px 12px' }}>
                <Icon name="user" size={16} color="rgba(255,255,255,0.45)" />
                <input className="input" style={{ border: 0, background: 'transparent', padding: '10px 6px' }} value={name} maxLength={20} onChange={(e) => setName(e.target.value)} placeholder="Player name" />
                <button className="icon-btn" style={{ border: 0 }} title="Random name" onClick={() => setName(randomName())}><Icon name="refresh" size={15} /></button>
              </div>
              <button className="btn primary block" style={{ padding: '13px' }} onClick={() => { if (!name.trim()) return notify('Pick a name first'); setPhase('scan'); }}>
                + ENTER PLAYTREE
              </button>
              <button className="btn ghost block" onClick={() => { setName('Guest' + Math.floor(1000 + Math.random() * 9000)); setPhase('scan'); }}>
                <Icon name="lock" size={12} /> PLAY AS GUEST
              </button>
              <div className="mono-label center" style={{ letterSpacing: 2 }}>
                {BANNERS.home.tag} — GOAI WILL SCAN YOUR AGE WHEN YOU ENTER.
              </div>
            </div>
          </>
        ) : (
          <div className="gate-body" style={{ textAlign: 'left' }}>
            <div className="row" style={{ gap: 12, marginBottom: 14 }}>
              <span style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--cyan)', display: 'grid', placeItems: 'center', fontSize: '1.2rem' }}>🤖</span>
              <div>
                <div className="font-head" style={{ letterSpacing: 4, color: 'var(--cyan)', fontSize: '1.1rem' }}>GOAI</div>
                <div className="mono-label">AGE VERIFICATION SYSTEM V2.6</div>
              </div>
            </div>
            <div className="divider" />
            <p className="muted" style={{ lineHeight: 1.6, fontSize: '0.92rem' }}>
              GoAI will scan your face to estimate your age group and activate the appropriate safety features.
              Your image is processed securely and never stored.
            </p>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', margin: '14px 0' }}>
              <div style={{ height: '100%', width: prog + '%', background: 'linear-gradient(90deg,var(--cyan),var(--green))', transition: 'width .15s' }} />
            </div>
            <div className="mono-label" style={{ marginBottom: 12 }}>{prog < 100 ? 'ANALYZING BIOMETRIC DATA...' : 'SCAN COMPLETE · TEEN MODE ACTIVE'}</div>
            <button className="btn block" style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }} disabled={prog < 100} onClick={() => { signIn(name.trim() || randomName()); }}>
              <Icon name="camera" size={13} /> {prog < 100 ? 'SCANNING…' : 'CONTINUE'}
            </button>
            <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => signIn(name.trim() || randomName())}>SKIP SCAN</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Home ---------------- */
export function Home() {
  const nav = useNavigate();
  const { state, update, notify, addPoints, allGames } = useApp();
  const [playing, setPlaying] = useState(null);
  const games = allGames();
  const hero = DEFAULT_GAMES[0];

  const news = [
    { t: 'SEASON 2 IS LIVE', d: 'THE VOID AWAKENS — new drop zones, new battle pass and the Root Ancient boss raid.', c: '#39ff14' },
    { t: 'DOUBLE XP WEEKEND', d: 'Every match from Friday to Sunday grants double XP and bonus Tree-Points.', c: '#00bfff' },
    { t: 'STUDIO UPDATE', d: 'Level editor gains water tiles, gems and one-tap level snapshots for cover art.', c: '#a78bfa' },
    { t: 'REALITY MODE BETA', d: 'Phone AR mode is now live — spawn mini-games anywhere in your room.', c: '#ffd60a' },
  ];

  const chapters = [
    { n: '01', t: 'THE GROVE', d: 'Learn the roots. Collect your first loot and meet the island.', s: 'LIVE', c: '#39ff14' },
    { n: '02', t: 'THE VOID AWAKENS', d: 'Corruption spreads across the map. Boss raids unlock.', s: 'LIVE', c: '#a78bfa' },
    { n: '03', t: 'STORM CIRCUIT', d: 'Racing league, cosmic vineways and ranked time trials.', s: 'COMING SOON', c: '#00bfff' },
  ];

  const events = [
    { t: 'HALLOWEEN HAUNT', d: 'Survive 5 waves of corrupted vines', icon: '🎃', c1: '#3a1205', c2: '#160602', live: true },
    { t: 'GAME DEV NIGHT', d: 'Build and publish with the community', icon: '🛠️', c1: '#0a1f3a', c2: '#030d1c', live: false },
    { t: 'ROOT RAID', d: '20-player boss fight at the Ancient Lair', icon: '🌳', c1: '#0b3a12', c2: '#04160a', live: true },
    { t: 'COSMIC CUP', d: 'Ranked racing tournament', icon: '🏆', c1: '#2a2405', c2: '#120e02', live: false },
  ];

  const claimDaily = () => {
    if (state.dailyClaimed) return notify('COME BACK TOMORROW');
    update({ dailyClaimed: true });
    addPoints(100);
    notify('+100 TREE-POINTS CLAIMED');
  };

  return (
    <div className="page">
      <div className="banner" style={{ background: `radial-gradient(ellipse at 75% 45%, ${BANNERS.home.c1}, transparent 60%), linear-gradient(120deg,#03150d,#05210f)` }}>
        <div style={{ position: 'absolute', right: 46, top: -10, fontSize: 120, opacity: 0.18 }}>🌳</div>
        <div className="banner-inner">
          <span className="banner-tag">{SEASON.chapter} · {SEASON.season}</span>
          <h1>THE ISLAND AWAITS</h1>
          <div className="sub">PLAY · BUILD · SURVIVE</div>
        </div>
      </div>

      <div className="brandbar">
        <div className="left">
          <span className="brand-chip"><TreeLogo size={20} /></span>
          <span className="name">PlayTree</span>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <span className="mono-label">{state.points} TREE-POINTS</span>
          <span className="mono-label">LVL {Math.floor(state.xp / 100) + 1}</span>
        </div>
      </div>

      {/* hero */}
      <section className="featured" style={{ marginBottom: 24 }}>
        <div className="featured-body">
          <span className="pill" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>▶ {SEASON.season} LIVE</span>
          <div className="featured-title" style={{ marginTop: 12, color: '#fff' }}>DROp IN <span style={{ color: 'var(--accent)' }}>NOW</span></div>
          <div className="mono-label" style={{ marginTop: 6, letterSpacing: 4 }}>
            {SEASON.chapter} · {SEASON.season} · {SEASON.name}
          </div>
          <div className="row wrap" style={{ marginTop: 18 }}>
            <button className="btn primary" onClick={() => setPlaying(hero)}><Icon name="play" size={13} /> PLAY MAIN GAME</button>
            <button className="btn" style={{ borderColor: 'rgba(0,191,255,0.5)', color: 'var(--cyan)' }} onClick={() => nav('/games')}>BROWSE GAMES</button>
            <button className="btn ghost" onClick={() => nav('/lobby')}>SQUAD UP</button>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 60, top: 20, fontSize: 110, opacity: 0.35 }}>🎮</div>
      </section>

      {/* quick stats */}
      <div className="grid cols-4" style={{ marginBottom: 26 }}>
        <div className="stat"><div className="v">{state.points}</div><div className="k">TREE-POINTS</div></div>
        <div className="stat"><div className="v">{state.xp}</div><div className="k">TOTAL XP</div></div>
        <div className="stat"><div className="v">{state.stats.wins}</div><div className="k">WINS</div></div>
        <div className="stat"><div className="v">{state.badges.length}</div><div className="k">BADGES</div></div>
      </div>

      {/* daily reward */}
      <section className="panel glow" style={{ marginBottom: 26 }}>
        <div className="row between wrap">
          <div className="row" style={{ gap: 14 }}>
            <span style={{ fontSize: '2rem' }}>🎁</span>
            <div>
              <div className="kicker">DAILY REWARDS</div>
              <div className="muted" style={{ fontSize: '0.9rem' }}>Claim today's Tree-Points on the home page.</div>
            </div>
          </div>
          <button className={'btn ' + (state.dailyClaimed ? 'ghost' : 'primary')} onClick={claimDaily} disabled={state.dailyClaimed}>
            {state.dailyClaimed ? 'CLAIMED ✓' : 'CLAIM +100 TP'}
          </button>
        </div>
      </section>

      {/* chapters */}
      <section style={{ marginBottom: 26 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="section-kicker">CHAPTERS &amp; SEASONS</div>
          <button className="btn ghost sm" onClick={() => nav('/store')}>BATTLE PASS</button>
        </div>
        <div className="grid cols-3">
          {chapters.map((c) => (
            <div key={c.n} className="panel" style={{ borderColor: c.c + '55' }}>
              <div className="row between">
                <span className="mono-label" style={{ color: c.c }}>CH {c.n}</span>
                <span className="tag" style={{ background: c.s === 'LIVE' ? c.c : 'rgba(255,255,255,0.12)', color: c.s === 'LIVE' ? '#04120a' : '#fff' }}>{c.s}</span>
              </div>
              <div className="font-head" style={{ fontSize: '1.25rem', letterSpacing: 2, marginTop: 10 }}>{c.t}</div>
              <div className="muted" style={{ fontSize: '0.88rem', marginTop: 6, lineHeight: 1.5 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* news */}
      <section style={{ marginBottom: 26 }}>
        <div className="section-kicker" style={{ marginBottom: 12 }}>LATEST NEWS</div>
        <div className="grid cols-2">
          {news.map((n) => (
            <div key={n.t} className="list-row">
              <div>
                <div className="font-head" style={{ letterSpacing: 1.5, fontSize: '1.02rem', color: n.c }}>{n.t}</div>
                <div className="muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>{n.d}</div>
              </div>
              <Icon name="bolt" size={17} color={n.c} />
            </div>
          ))}
        </div>
      </section>

      {/* events */}
      <section style={{ marginBottom: 26 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="section-kicker">LIMITED-TIME EVENTS</div>
          <button className="btn ghost sm" onClick={() => nav('/collaborations')}>ALL EVENTS</button>
        </div>
        <div className="grid cols-4">
          {events.map((e) => (
            <div key={e.t} className="panel" style={{ background: `linear-gradient(150deg, ${e.c1}, ${e.c2})`, cursor: 'pointer' }} onClick={() => nav('/collaborations')}>
              <div className="row between">
                <span style={{ fontSize: '1.7rem' }}>{e.icon}</span>
                <span className="tag" style={{ background: e.live ? '#39ff14' : 'rgba(255,255,255,0.15)', color: e.live ? '#04120a' : '#fff' }}>{e.live ? 'LIVE' : 'SOON'}</span>
              </div>
              <div className="font-head" style={{ marginTop: 10, letterSpacing: 1.5, fontSize: '1rem' }}>{e.t}</div>
              <div className="muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>{e.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* continue playing */}
      <section>
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="section-kicker">CONTINUE PLAYING</div>
          <button className="btn ghost sm" onClick={() => nav('/games')}>SEE ALL</button>
        </div>
        <div className="grid cols-4">
          {games.slice(0, 4).map((g) => <GameCard key={g.id} g={g} onPlay={() => setPlaying(g)} />)}
        </div>
      </section>

      <div className="center" style={{ marginTop: 34 }}>
        <div className="mono-label">© 2026 PLAYTREE™ · GOSTUDIOS — ALL RIGHTS RESERVED</div>
      </div>

      {playing && <GameModal game={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}

/* ---------------- shared game card ---------------- */
export function GameCard({ g, onPlay }) {
  const { state, toggleLike, toggleInstall, notify } = useApp();
  const liked = state.liked.includes(g.id);
  const installed = state.installed.includes(g.id);
  return (
    <div className="gcard">
      <div className="gcard-art" style={{ background: `radial-gradient(circle at 50% 40%, ${g.art?.c1 || '#123'}, ${g.art?.c2 || '#05070a'})` }} onClick={onPlay}>
        <span>{g.art?.icon || '🎮'}</span>
        <span className="gcard-age">{g.age || 'All ages'}</span>
        <span className="gcard-badge">{g.genre || 'ACTION'}</span>
      </div>
      <div className="gcard-body">
        <div className="gcard-title">{g.title}</div>
        <div className="gcard-meta">BY {g.creator} · {(g.difficulty || 'medium').toUpperCase()}</div>
        <div className="gcard-stats">
          <span>▶ {g.plays || 0}</span>
          <button style={{ background: 'none', border: 0, cursor: 'pointer', color: liked ? 'var(--accent)' : 'inherit', padding: 0, display: 'flex', gap: 4, alignItems: 'center' }}
            onClick={() => { toggleLike(g.id); notify(liked ? 'UNLIKED' : 'LIKED'); }}>
            <Icon name="heart" size={12} /> {liked ? 1 : g.likes || 0}
          </button>
        </div>
        <div className="gcard-actions">
          <button className="btn primary" onClick={onPlay}><Icon name="play" size={11} /> PLAY</button>
          <button className="btn" onClick={() => { toggleInstall(g.id); notify(installed ? 'REMOVED' : 'INSTALLED'); }}>
            <Icon name="download" size={11} /> {installed ? 'ADDED' : 'INSTALL'}
          </button>
          <button className="btn" onClick={() => notify('REPORT SENT TO GOAI')} title="Report"><Icon name="flag" size={11} /></button>
        </div>
      </div>
    </div>
  );
}
