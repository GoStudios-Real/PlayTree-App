import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../icons.jsx';
import { Page } from '../layout.jsx';
import { useApp } from '../store.jsx';
import { GENRES, partyCode, randomName, DROP_ZONES, SEASON } from '../data.js';
import { GameCard } from './Home.jsx';
import GameModal from '../games.jsx';

/* =============== GAMES =============== */
export function Games() {
  const { allGames, notify, state } = useApp();
  const nav = useNavigate();
  const [genre, setGenre] = useState('ALL');
  const [sort, setSort] = useState('TRENDING');
  const [q, setQ] = useState('');
  const [playing, setPlaying] = useState(null);

  const games = allGames();
  const featured = games[0];
  const filtered = useMemo(() => {
    let list = games.filter((g) => (genre === 'ALL' || (g.genre || '').toUpperCase() === genre));
    if (q.trim()) list = list.filter((g) => g.title.toLowerCase().includes(q.trim().toLowerCase()));
    if (sort === 'TRENDING') list = [...list].sort((a, b) => (b.plays || 0) - (a.plays || 0));
    if (sort === 'MOST LIKED') list = [...list].sort((a, b) => ((state.liked.includes(b.id) ? 1 : 0) + (b.likes || 0)) - ((state.liked.includes(a.id) ? 1 : 0) + (a.likes || 0)));
    if (sort === 'NEWEST') list = [...list].reverse();
    return list;
  }, [games, genre, sort, q, state.liked]);

  return (
    <Page page="games">
      <div className="center" style={{ marginBottom: 24 }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>🎮 PLAYTREE GAMES</div>
        <div className="page-title">GAME <span className="hl">LIBRARY</span></div>
        <div className="muted">Browse and play games created by the PlayTree community.</div>
        <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
          <button className="btn" style={{ borderColor: 'rgba(167,139,250,0.6)', color: 'var(--purple)' }} onClick={() => nav('/studio')}>+ CREATE YOUR OWN IN STUDIO</button>
          <button className="btn primary" onClick={() => notify('ALL GAMES INSTALLED')}><Icon name="download" size={13} /> INSTALL ALL</button>
        </div>
      </div>

      {featured && (
        <div className="featured" style={{ marginBottom: 22 }}>
          <div className="featured-body">
            <div className="row" style={{ gap: 10 }}>
              <span style={{ fontSize: '1.5rem' }}>{featured.art?.icon}</span>
              <span className="pill" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>FEATURED · {featured.genre}</span>
            </div>
            <div className="featured-title" style={{ margin: '10px 0 4px' }}>{featured.title.toUpperCase()}</div>
            <div className="muted" style={{ marginBottom: 16 }}>by {featured.creator}</div>
            <div className="row">
              <button className="btn primary" onClick={() => setPlaying(featured)}><Icon name="play" size={13} /> PLAY NOW</button>
              <button className="btn ghost" onClick={() => notify('INSTALL STARTED')}><Icon name="download" size={13} /> Install</button>
            </div>
          </div>
          <div style={{ position: 'absolute', right: 56, top: 16, fontSize: 120, opacity: 0.3 }}>{featured.art?.icon}</div>
        </div>
      )}

      <div className="stack" style={{ gap: 12, marginBottom: 18 }}>
        <div className="row" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line-soft)', borderRadius: 6, padding: '2px 12px' }}>
          <Icon name="eye" size={15} color="rgba(255,255,255,0.4)" />
          <input className="input" style={{ border: 0, background: 'transparent' }} placeholder="Search games..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="chips" style={{ justifyContent: 'center' }}>
          {GENRES.map((g) => <button key={g} className={'pill click' + (genre === g ? ' on' : '')} onClick={() => setGenre(g)}>{g}</button>)}
        </div>
        <div className="chips" style={{ justifyContent: 'center' }}>
          {['TRENDING', 'MOST LIKED', 'NEWEST'].map((s) => (
            <button key={s} className={'pill click' + (sort === s ? ' on' : '')} onClick={() => setSort(s)}>
              {s === 'TRENDING' ? '🔥 ' : s === 'MOST LIKED' ? '❤ ' : '↑ '}{s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid cols-4">
        {filtered.map((g) => <GameCard key={g.id} g={g} onPlay={() => setPlaying(g)} />)}
      </div>
      {filtered.length === 0 && <div className="center muted" style={{ padding: 40 }}>NO GAMES MATCH YOUR SEARCH.</div>}

      {playing && <GameModal game={playing} onClose={() => setPlaying(null)} />}
    </Page>
  );
}

/* =============== LOBBY =============== */
export function Lobby() {
  const { state, update, notify } = useApp();
  const [tab, setTab] = useState('BROWSE');
  const [code, setCode] = useState('');
  const [playing, setPlaying] = useState(null);
  const games = useApp().allGames();

  const seedParties = useMemo(() => ([
    { id: 'p1', host: "PlayTree's Party", drop: 'Random Drop', game: 'Moo', code: partyCode(), players: 1 },
    { id: 'p2', host: "rhys.cotton20's Party", drop: 'Random Drop', game: 'Moo', code: partyCode(), players: 1 },
    { id: 'p3', host: "rhys.cotton20's Party", drop: 'Random Drop', game: 'Astro Zombie Girl Story', code: partyCode(), players: 4 },
    { id: 'p4', host: "rhys.cotton20's Party", drop: 'Random Drop', game: 'Moo', code: partyCode(), players: 4 },
  ]), []);

  const parties = [...state.parties, ...seedParties];
  const open = parties.filter((p) => p.players < 4);
  const [listed, setListed] = useState(open);

  const createParty = () => {
    const p = { id: 'own-' + Date.now(), host: (state.player?.username || 'You') + "'s Party", drop: 'Random Drop', game: games[0]?.title || 'Moo', code: partyCode(), players: 1, mine: true };
    update((s) => ({ parties: [p, ...s.parties] }));
    notify('PARTY CREATED · CODE ' + p.code);
    setTab('BROWSE');
  };

  const joinParty = (p) => {
    if (p.players >= 4) return notify('PARTY FULL');
    notify('JOINED ' + p.host.toUpperCase());
    const g = games.find((x) => x.title === p.game) || games[0];
    if (g) setPlaying(g);
  };

  return (
    <Page page="lobby">
      <div className="panel glow" style={{ marginBottom: 22 }}>
        <div className="row between wrap">
          <div className="row" style={{ gap: 12 }}>
            <span className="brand-chip">🌳</span>
            <div>
              <div className="font-head" style={{ letterSpacing: 4, color: 'var(--accent)' }}>PARTY LOBBY</div>
              <div className="mono-label">{SEASON_TXT}</div>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <span className="tag low">🌳 SEASON 2 IS LIVE!</span>
          </div>
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 18 }}>
        {[['BROWSE', '🌿 BROWSE PARTIES'], ['CREATE', '+ CREATE PARTY'], ['JOIN', '# JOIN BY CODE']].map(([k, l]) => (
          <button key={k} className={'pill click' + (tab === k ? ' on' : '')} style={{ padding: '10px 16px' }} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'BROWSE' && (
        <div className="stack" style={{ gap: 14 }}>
          <div className="row between">
            <span className="mono-label">{listed.length} OPEN PARTIES</span>
            <button className="btn ghost sm" onClick={() => { setListed(open); notify('REFRESHED'); }}><Icon name="refresh" size={12} /> REFRESH</button>
          </div>
          <div className="grid cols-2">
            {listed.map((p) => (
              <div key={p.id} className="list-row">
                <div>
                  <div className="font-head" style={{ letterSpacing: 1.5, fontSize: '1.05rem' }}>{p.host.toUpperCase()}</div>
                  <div className="mono-label" style={{ marginTop: 4 }}>🎯 {p.drop}</div>
                  <div className="mono-label" style={{ marginTop: 2, color: 'var(--purple)' }}>🎮 {p.game}</div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: 6, letterSpacing: 3 }}>CODE: {p.code}</div>
                </div>
                <div className="stack" style={{ alignItems: 'center', gap: 6 }}>
                  <div className="font-head" style={{ fontSize: '1.3rem', color: p.players >= 4 ? 'var(--muted)' : 'var(--accent)' }}>
                    {p.players}<span style={{ opacity: 0.5 }}>/4</span>
                  </div>
                  <div className="mono-label">PLAYERS</div>
                  <button className={'btn sm ' + (p.players >= 4 ? 'ghost' : 'primary')} disabled={p.players >= 4} onClick={() => joinParty(p)}>
                    {p.players >= 4 ? 'FULL' : 'JOIN'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'CREATE' && (
        <div className="panel stack" style={{ gap: 14, maxWidth: 520 }}>
          <div className="section-kicker">CREATE A PARTY</div>
          <p className="muted">Pick a game, get a 6 character code and share it with your squad. Up to 4 players.</p>
          <label className="label">GAME</label>
          <select className="select" defaultValue={games[0]?.title}>
            {games.map((g) => <option key={g.id}>{g.title}</option>)}
          </select>
          <label className="label">DROP ZONE</label>
          <select className="select" defaultValue="Random Drop">
            {['Random Drop', 'Bug Burrows', 'Root Ancient\'s Lair', 'Crystal Canopy', 'Nectar Bay'].map((d) => <option key={d}>{d}</option>)}
          </select>
          <button className="btn primary block" onClick={createParty}>CREATE PARTY</button>
        </div>
      )}

      {tab === 'JOIN' && (
        <div className="panel stack" style={{ gap: 14, maxWidth: 460 }}>
          <div className="section-kicker">JOIN BY CODE</div>
          <input className="input font-mono" style={{ letterSpacing: 8, textTransform: 'uppercase', fontSize: '1.3rem', textAlign: 'center' }}
            maxLength={6} placeholder="XXXXXX" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          <button className="btn primary block" disabled={code.length < 6}
            onClick={() => { notify('JOINING ' + code); const g = games[0]; if (g) setPlaying(g); }}>
            JOIN PARTY
          </button>
        </div>
      )}

      {playing && <GameModal game={playing} onClose={() => setPlaying(null)} />}
    </Page>
  );
}
const SEASON_TXT = `${SEASON.chapter} · ${SEASON.season} · ${SEASON.name}`;

/* =============== BATTLE BUS =============== */
export function BattleBus() {
  const { notify } = useApp();
  const nav = useNavigate();
  const [selected, setSelected] = useState(null);
  const zones = DROP_ZONES;

  return (
    <Page page="battlebus">
      <div className="section-kicker">— DROP PLANNING</div>
      <div className="page-title">BATTLE <span className="hl">BUS</span></div>
      <div className="section-sub" style={{ marginBottom: 20 }}>CHOOSE YOUR DROP ZONE · DEPLOY YOUR LEAFWING</div>

      <div className="panel" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div className="row between">
          <span className="mono-label">🌱 SEEDPOD FLIGHT PATH</span>
          <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, transparent, rgba(57,255,20,0.5), transparent)', margin: '0 14px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: -9, left: '30%', animation: 'none' }}>🌱</span>
          </div>
          <span className="mono-label">STORM INBOUND</span>
        </div>
      </div>

      <div className="grid cols-3">
        {zones.map((z) => (
          <div key={z.name} className="panel" style={{ cursor: 'pointer', borderColor: selected === z.name ? 'var(--accent)' : undefined }}
            onClick={() => setSelected(z.name)}>
            <div className="row between">
              <span style={{ fontSize: '1.5rem' }}>{z.icon}</span>
              <span className={'tag ' + z.tagClass}>{z.risk}</span>
            </div>
            <div className="mono-label" style={{ textAlign: 'right', marginTop: -18 }}>{z.players} PLAYERS LANDING</div>
            <div className="font-head" style={{ fontSize: '1.15rem', letterSpacing: 1.5, marginTop: 12, textTransform: 'uppercase' }}>{z.name}</div>
            <div className="muted" style={{ fontSize: '0.86rem', marginTop: 6, lineHeight: 1.5 }}>{z.desc}</div>
            <div className="divider" style={{ margin: '12px 0' }} />
            <div className="row between">
              <span className="mono-label">LOOT:</span>
              <span className="rarity" style={{ color: z.lootColor }}>{z.loot}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ justifyContent: 'center', gap: 20, marginTop: 26 }}>
        <button className="btn primary" disabled={!selected} onClick={() => { notify('DROPPING INTO ' + selected.toUpperCase()); nav('/lobby'); }}>
          <Icon name="play" size={13} /> DEPLOY
        </button>
        <button className="btn ghost" onClick={() => nav('/lobby')}>→ LOBBY</button>
        <button className="btn ghost" onClick={() => nav('/')}>→ HOME</button>
      </div>
    </Page>
  );
}

