import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../icons.jsx';
import { Page } from '../layout.jsx';
import { useApp } from '../store.jsx';
import {
  LOCKER_TABS, LOCKER_ITEMS, STORE_SECTIONS, BADGES, PROFILE_THEMES,
  LEADERBOARD_ROWS, PLATFORMS, DEFAULT_GAMES,
} from '../data.js';

const RARITY_COLOR = { LEGENDARY: '#ffd60a', EPIC: '#a78bfa', RARE: '#00bfff', UNCOMMON: '#39ff14', COMMON: '#9aa7b4', MYTHIC: '#ff4dad' };

/* =============== PROFILE =============== */
export function Profile() {
  const { state, update, notify, allGames } = useApp();
  const nav = useNavigate();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(state.player?.displayName || '');
  const games = allGames();
  const theme = PROFILE_THEMES.find((t) => t.id === (state.equipped.theme || 'cosmic')) || PROFILE_THEMES[0];
  const ownedBadges = BADGES.filter((b) => state.badges.includes(b.id));

  return (
    <Page page="profile">
      <div className="center" style={{ marginBottom: 26 }}>
        <div style={{ width: 92, height: 92, borderRadius: '50%', margin: '0 auto 14px', display: 'grid', placeItems: 'center', fontSize: '2.2rem', fontFamily: 'var(--font-head)', fontWeight: 700, color: '#fff', background: theme.bg, border: `3px solid ${state.equipped.frame === 'frame-birthday' ? '#ffd60a' : '#39ff14'}`, boxShadow: '0 0 30px rgba(57,255,20,0.35)' }}>
          {(state.player?.displayName || 'P').slice(0, 2).toUpperCase()}
        </div>
        <div className="row" style={{ justifyContent: 'center', gap: 12 }}>
          <div className="page-title" style={{ margin: 0 }}>{(state.player?.displayName || 'PLAYER').toUpperCase()}</div>
          <button className="btn ghost sm" onClick={() => (edit ? (update((s) => ({ player: { ...s.player, displayName: name } })), setEdit(false), notify('PROFILE UPDATED')) : setEdit(true))}>
            <Icon name="edit" size={11} /> {edit ? 'SAVE' : 'EDIT'}
          </button>
        </div>
        {edit && <input className="input" style={{ maxWidth: 320, margin: '10px auto' }} value={name} onChange={(e) => setName(e.target.value)} maxLength={20} />}
        <div className="row" style={{ justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <span className="brand-chip" style={{ width: 26, height: 26 }}>🌳</span>
          <span className="kicker">PLAYTREE</span>
        </div>
        <div className="mono-label" style={{ marginTop: 6 }}>{(state.player?.username || 'player').toLowerCase()}@playtree.demo</div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 26 }}>
        <div className="stat"><div className="v">{state.stats.matches}</div><div className="k">MATCHES</div></div>
        <div className="stat"><div className="v">{state.stats.wins}</div><div className="k">WINS</div></div>
        <div className="stat"><div className="v">{state.stats.kills}</div><div className="k">KILLS</div></div>
        <div className="stat"><div className="v">{state.stats.top10}</div><div className="k">TOP 10</div></div>
      </div>

      <section style={{ marginBottom: 26 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="section-kicker">🎮 CONTINUE PLAYING</div>
          <button className="btn ghost sm" onClick={() => nav('/games')}>See all ›</button>
        </div>
        <div className="grid cols-4">
          {games.slice(0, 7).map((g) => (
            <div key={g.id} className="gcard" onClick={() => nav('/games')}>
              <div className="gcard-art" style={{ background: `radial-gradient(circle at 50% 40%, ${g.art?.c1}, ${g.art?.c2})`, height: 92 }}>
                <span style={{ fontSize: '2rem' }}>{g.art?.icon}</span>
                <span className="gcard-age">{g.age}</span>
              </div>
              <div className="gcard-body">
                <div className="gcard-title" style={{ fontSize: '0.85rem' }}>{g.title}</div>
                <div className="gcard-meta">BY {g.creator}</div>
                <div className="gcard-stats"><span>👥 0</span><span>👍 0</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 26 }}>
        <div className="section-kicker" style={{ marginBottom: 6 }}>ACHIEVEMENTS · PLAYER BADGES</div>
        <p className="muted" style={{ fontSize: '0.88rem', marginBottom: 14 }}>
          Earn badges by mastering PlayTree. Each badge is minted on-chain and displayed on your profile forever.
        </p>
        <div className="grid cols-4">
          {BADGES.map((b) => {
            const on = state.badges.includes(b.id);
            return (
              <div key={b.id} className="panel center" style={{ padding: 14, opacity: on ? 1 : 0.42, borderColor: on ? b.color + '66' : undefined }}>
                <div style={{ fontSize: '1.6rem' }}>{b.icon}</div>
                <div className="font-head" style={{ fontSize: '0.92rem', letterSpacing: 1, marginTop: 6, color: b.color }}>{b.name}</div>
                <div className="mono-label" style={{ marginTop: 4, fontSize: '0.42rem' }}>{b.desc}</div>
                <span className="tag" style={{ background: b.color + '22', color: b.color, border: `1px solid ${b.color}55`, marginTop: 8, display: 'inline-block' }}>{b.rarity}</span>
              </div>
            );
          })}
        </div>
        <div className="mono-label" style={{ marginTop: 12 }}>
          {ownedBadges.length} BADGES EARNED · {BADGES.length - ownedBadges.length} LOCKED
        </div>
      </section>

      <section className="grid cols-2" style={{ marginBottom: 26 }}>
        <div className="panel">
          <div className="section-kicker" style={{ marginBottom: 12 }}>PROFILE THEMES</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {PROFILE_THEMES.map((t) => {
              const on = (state.equipped.theme || 'cosmic') === t.id;
              const locked = t.price && !state.owned.includes(t.id);
              return (
                <button key={t.id} className="btn sm" style={{ background: t.bg, border: on ? '2px solid var(--accent)' : '1px solid var(--line-soft)', height: 54, flexDirection: 'column', gap: 3 }}
                  onClick={() => {
                    if (locked) return notify('LOCKED — BUY IN STORE');
                    update((s) => ({ equipped: { ...s.equipped, theme: t.id } }));
                    notify('THEME EQUIPPED');
                  }}>
                  <span style={{ fontSize: '0.5rem', letterSpacing: 1.5 }}>{t.name}</span>
                  {t.price ? <span style={{ fontSize: '0.46rem', opacity: 0.8 }}>{t.price} TP</span> : on ? <span style={{ fontSize: '0.46rem' }}>EQUIPPED</span> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="section-kicker" style={{ marginBottom: 12 }}>ACCOUNT INFO</div>
          <div className="stack" style={{ gap: 0 }}>
            {[['ACCOUNT TYPE', 'Player'], ['ROLE', 'Player'], ['MEMBER SINCE', state.player?.since || '—'], ['PLATFORM', 'PlayTree'], ['USER ID', state.player?.id || '#PLAYER']].map(([k, v]) => (
              <div key={k} className="row between" style={{ padding: '9px 0', borderBottom: '1px solid var(--line-soft)' }}>
                <span className="mono-label">{k}</span>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="stack" style={{ marginTop: 16 }}>
            <button className="btn block" onClick={() => nav('/lobby')}>GO TO LOBBY</button>
            <button className="btn block" onClick={() => nav('/account')}>SWITCH PLATFORM</button>
            <button className="btn danger block" onClick={() => nav('/')}><Icon name="logout" size={12} /> SIGN OUT</button>
          </div>
        </div>
      </section>

      <div className="center mono-label">© 2026 PLAYTREE™ · GOSTUDIOS — ALL RIGHTS RESERVED</div>
    </Page>
  );
}

/* =============== LOCKER =============== */
export function Locker() {
  const { state, update, notify } = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState('SKINS');
  const [sel, setSel] = useState(null);
  const items = LOCKER_ITEMS[tab] || [];

  return (
    <Page page="locker">
      <div className="section-kicker">— COSMETICS</div>
      <div className="page-title">YOUR <span className="hl">LOCKER</span></div>

      <div className="chips" style={{ margin: '16px 0' }}>
        {LOCKER_TABS.map((t) => <button key={t} className={'pill click' + (tab === t ? ' on' : '')} onClick={() => { setTab(t); setSel(null); }}>{t}</button>)}
      </div>

      <div className="grid cols-4">
        <div className="grid cols-3" style={{ gridColumn: 'span 3' }}>
          {items.map((it) => {
            const equipped = state.equipped.skin === it.id;
            return (
              <div key={it.id} className="panel" style={{ cursor: 'pointer', borderColor: equipped ? 'var(--gold)' : sel?.id === it.id ? 'var(--accent)' : undefined, padding: 16 }}
                onClick={() => { setSel(it); update((s) => ({ equipped: { ...s.equipped, skin: it.id } })); notify(it.name.toUpperCase() + ' EQUIPPED'); }}>
                {equipped && <span className="tag" style={{ background: 'var(--gold)', color: '#1a1400', float: 'right' }}>EQUIPPED</span>}
                <div className="center" style={{ fontSize: '2.3rem', padding: '10px 0' }}>{it.icon}</div>
                <div className="font-head" style={{ color: it.color, letterSpacing: 1.5, fontSize: '1rem' }}>{it.name}</div>
                <div className="rarity" style={{ color: RARITY_COLOR[it.rarity], opacity: 0.8 }}>{it.rarity}</div>
              </div>
            );
          })}
        </div>
        <div className="panel center" style={{ minHeight: 170, display: 'grid', placeItems: 'center' }}>
          <div>
            <div className="mono-label" style={{ color: 'var(--accent)' }}>PREVIEW</div>
            {sel ? (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: '3rem' }}>{sel.icon}</div>
                <div className="font-head" style={{ marginTop: 8, color: sel.color }}>{sel.name}</div>
                <div className="rarity" style={{ color: RARITY_COLOR[sel.rarity] }}>{sel.rarity}</div>
              </div>
            ) : (
              <div className="mono-label" style={{ marginTop: 18, lineHeight: 2 }}>CLICK AN ITEM TO<br />PREVIEW</div>
            )}
          </div>
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'center', gap: 18, marginTop: 30 }}>
        <button className="btn ghost sm" onClick={() => nav('/profile')}>← PROFILE</button>
        <button className="btn ghost sm" onClick={() => nav('/')}>→ HOME</button>
      </div>
    </Page>
  );
}

/* =============== STORE =============== */
export function Store() {
  const { state, update, notify, addPoints } = useApp();
  const nav = useNavigate();
  const [msg, setMsg] = useState('');

  const buy = (item) => {
    const price = item.price || 0;
    if (state.owned.includes(item.id)) {
      update((s) => ({ equipped: { ...s.equipped, [item.type]: item.id } }));
      return notify(item.name.toUpperCase() + ' EQUIPPED');
    }
    if (price === 0) {
      update((s) => ({ owned: [...s.owned, item.id], equipped: { ...s.equipped, [item.type]: item.id } }));
      return notify('FREE ITEM EQUIPPED');
    }
    if (state.points < price) return notify('NOT ENOUGH TREE-POINTS');
    update((s) => ({ points: s.points - price, owned: [...s.owned, item.id], equipped: { ...s.equipped, [item.type]: item.id } }));
    notify('PURCHASED ' + item.name.toUpperCase());
  };

  return (
    <Page page="store">
      <div className="section-kicker">— STORE</div>
      <div className="page-title">PLAYTREE <span className="hl-gold">STORE</span></div>

      <div className="row wrap" style={{ margin: '14px 0 26px', gap: 12 }}>
        <span className="pill" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: '0.62rem', padding: '8px 14px' }}>🌳 {state.points} TREE-POINTS</span>
        <button className="btn sm" onClick={() => nav('/redeem')}>+ REDEEM CODES</button>
      </div>

      {STORE_SECTIONS.map((sec) => (
        <section key={sec.title} style={{ marginBottom: 30 }}>
          <div className="kicker" style={{ marginBottom: 12 }}>{sec.title}</div>
          <div className="grid cols-4">
            {sec.items.map((it) => {
              const owned = state.owned.includes(it.id) || (it.price === 0);
              const equipped = state.equipped[it.type] === it.id;
              return (
                <div key={it.id} className="panel center" style={{ padding: 16, borderColor: equipped ? 'var(--accent)' : undefined }}>
                  <div style={{ height: it.ring ? 64 : 74, width: it.ring ? 64 : '100%', borderRadius: it.ring ? '50%' : 6, display: 'grid', placeItems: 'center', background: it.bg || 'rgba(255,255,255,0.03)', marginBottom: 10, border: it.ring ? `3px solid ${it.ring}` : undefined, margin: it.ring ? '0 auto 10px' : undefined }}>
                    {it.type === 'frame' ? <span style={{ fontSize: '1.6rem' }}>👤</span> : <span style={{ fontSize: '2rem' }}>{it.icon}</span>}
                  </div>
                  <div className="font-head" style={{ letterSpacing: 1, fontSize: '0.98rem' }}>{it.name}</div>
                  <div className="mono-label" style={{ marginTop: 4 }}>
                    {it.price === 0 ? '🎁 FREE' : `🌳 ${it.price} TREE-POINTS`}
                  </div>
                  <button className={'btn sm block ' + (equipped ? 'primary' : owned ? 'ghost' : 'gold')} style={{ marginTop: 10 }} onClick={() => buy(it)}>
                    {equipped ? 'EQUIPPED' : owned ? 'EQUIP' : '🔒 BUY'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="center mono-label">© 2026 PLAYTREE™ · GOSTUDIOS — ALL RIGHTS RESERVED</div>
    </Page>
  );
}

/* =============== LEADERBOARD =============== */
export function Leaderboard() {
  const { state } = useApp();
  const nav = useNavigate();
  const [mode, setMode] = useState('SOLO');
  const [range, setRange] = useState('SEASON');
  const [sort, setSort] = useState('XP');

  const rows = useMemo(() => {
    const mine = { name: (state.player?.username || 'YOU').toUpperCase(), xp: state.xp, wins: state.stats.wins, kills: state.stats.kills, kd: state.stats.kills ? +(state.stats.kills / Math.max(1, state.stats.matches)).toFixed(2) : 0, played: state.stats.matches, av: '#39ff14', icon: '🌳', me: true };
    const all = [...LEADERBOARD_ROWS.filter((r) => r.name !== 'PlayTree'), mine]
      .sort((a, b) => (sort === 'XP' ? b.xp - a.xp : sort === 'WINS' ? b.wins - a.wins : sort === 'KILLS' ? b.kills - a.kills : sort === 'K/D' ? b.kd - a.kd : b.played - a.played));
    return all;
  }, [sort, state.xp, state.stats, state.player]);

  const podium = rows.slice(0, 3);
  const order = [podium[1], podium[0], podium[2]];

  return (
    <Page page="leaderboard">
      <div className="section-kicker">— RANKINGS</div>
      <div className="page-title">LEADER<span className="hl-gold">BOARD</span></div>

      <div className="row between wrap" style={{ margin: '16px 0 22px' }}>
        <div className="chips">
          {['SOLO', 'DUOS', 'TRIOS', 'SQUADS'].map((m) => <button key={m} className={'pill click' + (mode === m ? ' on' : '')} onClick={() => setMode(m)}>{m}</button>)}
        </div>
        <div className="chips">
          <button className={'pill click' + (range === 'SEASON' ? ' gold' : '')} onClick={() => setRange('SEASON')}>CHAPTER 1 SEASON 1</button>
          <button className={'pill click' + (range === 'ALL' ? ' on' : '')} onClick={() => setRange('ALL')}>ALL TIME</button>
        </div>
      </div>

      <div className="grid cols-3" style={{ marginBottom: 24, alignItems: 'end' }}>
        {order.map((r, i) => {
          if (!r) return <div key={i} />;
          const place = i === 1 ? 1 : i === 0 ? 2 : 3;
          const medal = ['🥇', '🥈', '🥉'][place - 1];
          const col = place === 1 ? 'var(--gold)' : place === 2 ? '#cfd8e3' : '#cd7f32';
          return (
            <div key={r.name} className="center">
              <div style={{ fontSize: '1.4rem' }}>{medal}</div>
              <div style={{ width: 58, height: 58, borderRadius: '50%', border: `2px solid ${col}`, display: 'grid', placeItems: 'center', margin: '8px auto', fontFamily: 'var(--font-head)', fontWeight: 700, color: col, boxShadow: place === 1 ? '0 0 26px rgba(255,214,10,0.5)' : 'none' }}>
                {r.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="font-head" style={{ color: col, letterSpacing: 1.5, fontSize: '0.95rem', cursor: 'pointer' }} onClick={() => nav(`/player/${encodeURIComponent(r.name)}`)}>{r.name.toUpperCase()}</div>
              <div className="mono-label" style={{ marginTop: 3 }}>{r.xp} XP</div>
              <div style={{ height: place === 1 ? 74 : 54, background: 'rgba(255,255,255,0.035)', borderTop: `2px solid ${col}`, borderRadius: '4px 4px 0 0', marginTop: 10, display: 'grid', placeItems: 'center' }}>
                <span style={{ fontSize: '1.1rem' }}>{r.icon}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row between wrap" style={{ marginBottom: 10 }}>
        <span className="mono-label">SORT BY:</span>
        <div className="chips">
          {['XP', 'WINS', 'KILLS', 'K/D', 'PLAYED'].map((s) => <button key={s} className={'pill click' + (sort === s ? ' on' : '')} onClick={() => setSort(s)}>{s}</button>)}
        </div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        {rows.map((r, i) => (
          <div key={r.name + i} className="list-row" style={{ borderColor: r.me ? 'var(--accent)' : undefined, cursor: 'pointer' }} onClick={() => nav(`/player/${encodeURIComponent(r.name)}`)}>
            <div className="row" style={{ gap: 14 }}>
              <span className="mono-label" style={{ width: 20 }}>{i + 1}</span>
              <span style={{ width: 34, height: 34, borderRadius: '50%', background: r.av + '22', border: `1px solid ${r.av}`, display: 'grid', placeItems: 'center' }}>{r.icon}</span>
              <span className="font-head" style={{ letterSpacing: 1.5, color: r.me ? 'var(--accent)' : '#fff' }}>{r.name.toUpperCase()}</span>
              {r.me && <span className="tag low">YOU</span>}
            </div>
            <div className="row" style={{ gap: 22 }}>
              {[['XP', r.xp], ['WINS', r.wins], ['KILLS', r.kills], ['K/D', r.kd], ['PLAYED', r.played]].map(([k, v]) => (
                <div key={k} className="center" style={{ minWidth: 52 }}>
                  <div className="font-head" style={{ fontSize: '1.02rem', color: k === 'XP' ? 'var(--gold)' : '#fff' }}>{v}</div>
                  <div className="mono-label" style={{ fontSize: '0.42rem' }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="panel center" style={{ marginTop: 26 }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>JOIN THE COMMUNITY</div>
        <div className="muted" style={{ marginTop: 8, fontSize: '0.9rem' }}>Discord servers — leaderboard, events and more inside the server.</div>
        <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
          <button className="btn" style={{ borderColor: '#5865F2', color: '#5865F2' }}><Icon name="share" size={12} /> JOIN SERVER</button>
          <button className="btn ghost"><Icon name="mic" size={12} /> LINK DISCORD</button>
        </div>
      </div>
    </Page>
  );
}

/* =============== FRIENDS =============== */
export function Friends() {
  const { state, update, notify } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('ALL');
  const [qr, setQr] = useState(false);

  const filtered = state.friends.filter((f) => tab === 'ALL' || (tab === 'ONLINE' ? f.online : !f.online));

  const add = () => {
    const n = q.trim();
    if (!n) return notify('ENTER A USERNAME');
    if (state.friends.some((f) => f.name.toLowerCase() === n.toLowerCase())) return notify('ALREADY ON YOUR FRIENDS LIST');
    update((s) => ({ friends: [...s.friends, { id: Date.now(), name: n, online: Math.random() > 0.4, since: new Date().toLocaleDateString('en-GB') }] }));
    setQ('');
    notify('FRIEND ADDED');
  };

  return (
    <Page page="friends">
      <div className="row between wrap" style={{ marginBottom: 18 }}>
        <div>
          <div className="section-kicker">FRIENDS LIST · SQUADMATES</div>
          <div className="section-sub" style={{ marginTop: 6 }}>SAVED TO YOUR ACCOUNT — FOLLOWS YOU ON EVERY DEVICE.</div>
        </div>
        <div className="row">
          <button className="btn sm" onClick={() => setQr(true)}><Icon name="qr" size={12} /> MY QR</button>
          <button className="btn sm" onClick={() => setQr(true)}><Icon name="eye" size={12} /> SCAN QR</button>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 14 }}>
        <input className="input" placeholder="Enter username..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button className="btn primary" onClick={add}><Icon name="plus" size={13} /> ADD</button>
      </div>

      <div className="chips" style={{ marginBottom: 16 }}>
        {['ALL', 'ONLINE', 'OFFLINE'].map((t) => <button key={t} className={'pill click' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {filtered.length === 0 ? (
        <div className="panel center" style={{ padding: 44 }}>
          <div style={{ fontSize: '2.4rem', opacity: 0.5 }}>👥</div>
          <div className="mono-label" style={{ marginTop: 12 }}>NO FRIENDS YET — ADD ONE ABOVE!</div>
        </div>
      ) : (
        <div className="grid cols-3">
          {filtered.map((f) => (
            <div key={f.id} className="list-row">
              <div className="row" style={{ gap: 12 }}>
                <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(57,255,20,0.12)', border: '1px solid var(--accent)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-head)' }}>
                  {f.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <div className="font-head" style={{ letterSpacing: 1, cursor: 'pointer' }} onClick={() => nav(`/player/${encodeURIComponent(f.name)}`)}>{f.name}</div>
                  <div className="mono-label" style={{ color: f.online ? 'var(--accent)' : 'var(--muted-2)' }}>
                    {f.online ? '● ONLINE' : '○ OFFLINE'}
                  </div>
                </div>
              </div>
              <button className="btn sm ghost" onClick={() => { update((s) => ({ friends: s.friends.filter((x) => x.id !== f.id) })); notify('REMOVED'); }}>
                <Icon name="close" size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {qr && <QRModal onClose={() => setQr(false)} name={state.player?.username || 'PLAYER'} />}
    </Page>
  );
}

function QRModal({ onClose, name }) {
  const cells = useMemo(() => Array.from({ length: 225 }, () => Math.random() > 0.5), []);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><span className="kicker">MY QR CODE</span><button className="icon-btn" onClick={onClose}><Icon name="close" size={14} /></button></div>
        <div className="modal-body center">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15,1fr)', width: 240, margin: '0 auto', gap: 1 }}>
            {cells.map((c, i) => <div key={i} style={{ aspectRatio: '1', background: c ? '#39ff14' : '#05070a' }} />)}
          </div>
          <div className="mono-label" style={{ marginTop: 14 }}>FRIENDS SCAN THIS TO ADD YOU</div>
          <div className="font-head" style={{ fontSize: '1.2rem', marginTop: 6, color: 'var(--accent)' }}>{name.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

/* =============== GROUPS =============== */
export function Groups() {
  const { state, update, notify } = useApp();
  const nav = useNavigate();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const seed = [{ id: 'g1', name: 'PLAYTREE', desc: 'HI THERE WELCOME', members: 2, owner: 'GUEST2050', icon: '🌳' }];
  const groups = [...state.groups, ...seed];

  const create = () => {
    if (!name.trim()) return notify('NAME YOUR GROUP');
    if (state.points < 150) return notify('NEED 150 TREE-POINTS');
    update((s) => ({ points: s.points - 150, groups: [{ id: Date.now(), name: name.toUpperCase(), desc: 'Freshly planted group', members: 1, owner: state.player?.username || 'YOU', icon: '🛡️' }, ...s.groups] }));
    setName(''); setCreating(false); notify('GROUP CREATED');
  };

  const toggleJoin = (g) => {
    const isOwner = (g.owner || '').toLowerCase() === (state.player?.username || '').toLowerCase();
    if (isOwner) return notify('YOU OWN THIS GROUP');
    const joined = (state.joinedGroups || []).some((id) => String(id) === String(g.id));
    update((s) => {
      const cur = s.joinedGroups || [];
      return { joinedGroups: joined ? cur.filter((id) => String(id) !== String(g.id)) : [...cur, g.id] };
    });
    notify(joined ? 'LEFT ' + g.name : 'JOINED ' + g.name);
  };

  return (
    <Page page="groups">
      <div className="section-kicker">GROUPS</div>
      <div className="page-title">YOUR <span className="hl">SQUADS</span></div>
      <div className="muted" style={{ marginBottom: 18 }}>Join squads, chat, post and play games together.</div>

      <button className="btn block" style={{ marginBottom: 18, borderStyle: 'dashed' }} onClick={() => setCreating((v) => !v)}>
        + CREATE YOUR OWN GROUP — 150 TREE-POINTS
      </button>

      {creating && (
        <div className="panel stack" style={{ marginBottom: 18, maxWidth: 480 }}>
          <label className="label">GROUP NAME</label>
          <input className="input" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="My Squad" />
          <button className="btn primary block" onClick={create}>CREATE GROUP (150 TP)</button>
        </div>
      )}

      <div className="grid cols-3">
        {groups.map((g) => {
          const joined = (state.joinedGroups || []).some((id) => String(id) === String(g.id));
          return (
            <div key={g.id} className="panel" style={{ cursor: 'pointer' }} onClick={() => nav(`/groups/${g.id}`)}>
              <div className="row between">
                <span style={{ fontSize: '1.8rem' }}>{g.icon}</span>
                <span className="pill">{g.members + (joined && (g.owner || '').toLowerCase() !== (state.player?.username || '').toLowerCase() ? 1 : 0)} MEMBERS</span>
              </div>
              <div className="font-head" style={{ fontSize: '1.15rem', letterSpacing: 2, marginTop: 12 }}>{g.name}</div>
              <div className="muted" style={{ fontSize: '0.86rem', marginTop: 4 }}>{g.desc}</div>
              <div className="mono-label" style={{ marginTop: 8 }}>OWNER: {g.owner}</div>
              <button className="btn primary sm block" style={{ marginTop: 12 }} onClick={(e) => { e.stopPropagation(); toggleJoin(g); }}>{joined ? 'LEAVE' : 'JOIN'}</button>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

/* =============== VIDEOS =============== */
export function Videos() {
  const { state, update, notify, addPoints } = useApp();
  const [title, setTitle] = useState('');
  const [cap, setCap] = useState('');

  const create = () => {
    if (!title.trim()) return notify('GIVE YOUR CLIP A TITLE');
    update((s) => ({ videos: [{ id: Date.now(), title: title.toUpperCase(), kind: 'SCREENSHOT', by: s.player?.username || 'YOU', caption: cap, icon: '📸', color: '#0b2a1e' }, ...s.videos] }));
    setTitle(''); setCap(''); addPoints(25); notify('+25 TP · CLIP PUBLISHED');
  };

  return (
    <Page page="videos">
      <div className="section-kicker">PLAYTREE VIDEOS</div>
      <div className="page-title">CLIPS &amp; <span className="hl">HIGHLIGHTS</span></div>
      <div className="muted" style={{ marginBottom: 18 }}>Create videos and screenshots of your games and share them with everyone.</div>

      <div className="panel stack" style={{ maxWidth: 560, marginBottom: 24 }}>
        <label className="label">TITLE</label>
        <input className="input" value={title} maxLength={30} onChange={(e) => setTitle(e.target.value)} placeholder="Give your upload a title." />
        <label className="label">CAPTION (OPTIONAL)</label>
        <input className="input" value={cap} maxLength={80} onChange={(e) => setCap(e.target.value)} placeholder="Describe the moment..." />
        <button className="btn primary" onClick={create}>+ CREATE VIDEO</button>
      </div>

      <div className="grid cols-3">
        {state.videos.map((v) => (
          <div key={v.id} className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 150, background: `radial-gradient(circle at 50% 45%, ${v.color}, #05070a)`, display: 'grid', placeItems: 'center', fontSize: '3rem' }}>{v.icon}</div>
            <div style={{ padding: 14 }}>
              <span className="tag low">{v.kind}</span>
              <div className="font-head" style={{ fontSize: '1.05rem', letterSpacing: 1, marginTop: 8 }}>{v.title}</div>
              <div className="mono-label" style={{ marginTop: 4 }}>BY {v.by}</div>
              <div className="muted" style={{ fontSize: '0.84rem', marginTop: 6 }}>{v.caption}</div>
              <button className="btn sm ghost block" style={{ marginTop: 10 }} onClick={() => { update((s) => ({ videos: s.videos.filter((x) => x.id !== v.id) })); notify('DELETED'); }}>
                <Icon name="trash" size={11} /> DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
