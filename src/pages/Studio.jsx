import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../icons.jsx';
import { Page } from '../layout.jsx';
import { useApp } from '../store.jsx';
import { ART_COLORS, GENRES } from '../data.js';

const COLS = 24, ROWS = 14;
const TILES = ['void', 'grass', 'wall', 'lava', 'coin', 'enemy', 'spawn', 'goal', 'water', 'gem'];
const TILE_INFO = {
  void: { icon: '⬜', label: 'VOID' }, grass: { icon: '🟩', label: 'GRASS' }, wall: { icon: '🧱', label: 'WALL' },
  lava: { icon: '🔥', label: 'LAVA' }, coin: { icon: '🪙', label: 'COIN' }, enemy: { icon: '👾', label: 'ENEMY' },
  spawn: { icon: '📍', label: 'SPAWN' }, goal: { icon: '🚩', label: 'GOAL' }, water: { icon: '💧', label: 'WATER' },
  gem: { icon: '💎', label: 'GEM' },
};

function blankLevel() {
  const g = Array(COLS * ROWS).fill('void');
  for (let y = 2; y < ROWS - 2; y++) for (let x = 2; x < COLS - 2; x++) g[y * COLS + x] = 'grass';
  const put = (x, y, t) => { g[y * COLS + x] = t; };
  put(2, 2, 'spawn');
  put(COLS - 3, ROWS - 3, 'goal');
  for (let x = 6; x < 6 + 8; x++) put(x, 5, 'wall');
  put(10, 8, 'lava'); put(14, 10, 'coin'); put(17, 4, 'gem'); put(19, 9, 'enemy');
  return g;
}

export function Studio() {
  const { state, update, notify, addPoints } = useApp();
  const nav = useNavigate();
  const [level, setLevel] = useState(blankLevel);
  const [tool, setTool] = useState('brush');
  const [tile, setTile] = useState('grass');
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState('My Awesome Game');
  const [desc, setDesc] = useState('');
  const [genre, setGenre] = useState('action');
  const [diff, setDiff] = useState('easy');
  const [cover, setCover] = useState(null);
  const [styleHint, setStyleHint] = useState('');
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const undoStack = useRef([]);

  const paint = (idx) => {
    if (idx < 0 || idx >= level.length) return;
    if (tool === 'fill') {
      undoStack.current.push([...level]);
      if (undoStack.current.length > 40) undoStack.current.shift();
      const from = level[idx];
      const next = [...level];
      const stack = [idx];
      while (stack.length) {
        const cur = stack.pop();
        if (next[cur] !== from) continue;
        next[cur] = tile;
        const x = cur % COLS, y = Math.floor(cur / COLS);
        if (x > 0) stack.push(cur - 1);
        if (x < COLS - 1) stack.push(cur + 1);
        if (y > 0) stack.push(cur - COLS);
        if (y < ROWS - 1) stack.push(cur + COLS);
      }
      setLevel(next);
      return;
    }
    if (tool === 'eraser') { setLevel((l) => { const n = [...l]; n[idx] = 'void'; return n; }); return; }
    setLevel((l) => { if (l[idx] === tile) return l; const n = [...l]; n[idx] = tile; return n; });
  };

  const idxFromEvent = (e) => {
    const cv = canvasRef.current;
    if (!cv) return -1;
    const r = cv.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    const cellW = r.width / COLS, cellH = r.height / ROWS;
    const x = Math.floor(cx / cellW), y = Math.floor(cy / cellH);
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return -1;
    return y * COLS + x;
  };

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || playing) return undefined;
    const dpr = window.devicePixelRatio || 1;
    const rect = cv.getBoundingClientRect();
    cv.width = rect.width * dpr; cv.height = rect.height * dpr;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cw = rect.width / COLS, ch = rect.height / ROWS;
    ctx.clearRect(0, 0, rect.width, rect.height);
    level.forEach((t, i) => {
      const x = (i % COLS) * cw, y = Math.floor(i / COLS) * ch;
      ctx.fillStyle = ART_COLORS[t] || '#05070a';
      ctx.fillRect(x, y, cw, ch);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
      const icons = { coin: '🪙', enemy: '👾', spawn: '📍', goal: '🚩', gem: '💎' };
      if (icons[t]) { ctx.font = `${Math.round(ch * 0.7)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(icons[t], x + cw / 2, y + ch / 2); }
    });
    return undefined;
  }, [level, playing]);

  useEffect(() => {
    const up = () => { drawing.current = false; };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  const undo = () => {
    const prev = undoStack.current.pop();
    if (prev) setLevel(prev); else notify('NOTHING TO UNDO');
  };

  const clearLevel = () => { undoStack.current.push([...level]); setLevel(Array(COLS * ROWS).fill('void')); notify('LEVEL CLEARED'); };

  const snapshot = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    try { setCover(cv.toDataURL('image/jpeg', 0.7)); notify('COVER CAPTURED'); } catch (e) { notify('SNAPSHOT FAILED'); }
  };

  const publish = () => {
    if (state.points < 250) return notify('NEED 250 TREE-POINTS');
    const palette = ['#39ff14', '#00bfff', '#a78bfa', '#ffd60a', '#ff4d4d'];
    const c1 = palette[Math.floor(Math.random() * palette.length)];
    const g = {
      id: 'mine-' + Date.now(), title: title || 'Untitled', creator: state.player?.username || 'YOU',
      genre: genre.toUpperCase(), difficulty: diff, plays: 0, likes: 0, kind: 'maze', age: 'All ages',
      art: { c1: c1 + '55', c2: '#05070a', icon: cover ? '🖼️' : '🎮' }, desc: desc || 'A custom PlayTree Studio level.',
    };
    update((s) => ({ points: s.points - 250, myGames: [g, ...s.myGames] }));
    notify('GAME PUBLISHED · +0 TP');
    nav('/games');
  };

  return (
    <Page page="studio">
      <div className="center" style={{ marginBottom: 24 }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>🛠️ PLAYTREE STUDIO</div>
        <div className="page-title" style={{ color: 'var(--cyan)' }}>CREATE <span className="hl-cyan">GAMES</span></div>
        <div className="muted" style={{ maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
          Design your own 2D PlayTree game — paint the level, test it, add cover art, and publish to the world.
        </div>
      </div>

      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="panel" style={{ borderColor: 'rgba(0,191,255,0.3)' }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <span className="font-head" style={{ color: 'var(--purple)', letterSpacing: 3 }}>🎮 2D LEVEL EDITOR</span>
            <button className="btn primary sm" onClick={() => setPlaying((v) => !v)}>{playing ? '■ STOP' : '▶ TEST PLAY'}</button>
          </div>

          {!playing && (
            <>
              <div className="chips" style={{ marginBottom: 8 }}>
                {TILES.map((t) => (
                  <button key={t} className={'pill click' + (tile === t ? ' on' : '')} onClick={() => { setTile(t); setTool('brush'); }}>
                    {TILE_INFO[t].icon} {TILE_INFO[t].label}
                  </button>
                ))}
              </div>
              <div className="chips" style={{ marginBottom: 12 }}>
                {[['brush', '🖌 BRUSH'], ['eraser', '🧽 ERASER'], ['fill', '🪣 FILL']].map(([k, l]) => (
                  <button key={k} className={'pill click' + (tool === k ? ' on' : '')} onClick={() => setTool(k)}>{l}</button>
                ))}
                <button className="pill click" onClick={undo}>↩ UNDO</button>
                <button className="pill click" onClick={clearLevel}>🗑 CLEAR</button>
              </div>
            </>
          )}

          <div style={{ background: '#1a1f26', padding: 10, borderRadius: 8 }}>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', aspectRatio: `${COLS}/${ROWS}`, display: 'block', borderRadius: 4, cursor: playing ? 'default' : 'crosshair', touchAction: 'none' }}
              onPointerDown={(e) => { if (playing) return; drawing.current = true; undoStack.current.push([...level]); if (undoStack.current.length > 40) undoStack.current.shift(); paint(idxFromEvent(e)); }}
              onPointerMove={(e) => { if (playing || !drawing.current) return; paint(idxFromEvent(e)); }}
            />
          </div>
          <div className="mono-label" style={{ marginTop: 10, lineHeight: 1.9 }}>
            CLICK / DRAG TO PAINT · WALLS &amp; SOLIDS BLOCK MOVEMENT · COINS, GEMS &amp; CHESTS SCORE ·
            ENEMIES, LAVA &amp; SPIKES HURT · REACH 🚩 TO WIN
          </div>
          {playing && <TestPlay level={level} onExit={() => setPlaying(false)} />}
        </div>

        <div className="panel stack" style={{ gap: 14 }}>
          <span className="font-head" style={{ color: 'var(--purple)', letterSpacing: 3 }}>GAME DETAILS</span>

          <div className="center" style={{ height: 150, borderRadius: 8, border: '1px dashed rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', overflow: 'hidden', background: '#05070a' }}>
            {cover ? <img src={cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
              <div className="mono-label"><Icon name="share" size={22} /><br />NO COVER ART</div>
            )}
          </div>

          <div className="chips">
            {['COVER', 'WIDE BANNER', 'APP ICON'].map((c, i) => <span key={c} className={'pill' + (i === 0 ? ' on' : '')}>{c}</span>)}
          </div>
          <input className="input" placeholder="Optional style ideas (e.g. neon jungle, robots...)" value={styleHint} onChange={(e) => setStyleHint(e.target.value)} />
          <button className="btn" style={{ borderColor: 'rgba(167,139,250,0.6)', color: 'var(--purple)' }} onClick={() => notify('AI COVER QUEUED · TRY SNAPSHOT INSTEAD')}>
            <Icon name="sparkle" size={12} /> GENERATE COVER
          </button>
          <button className="btn" style={{ borderColor: 'rgba(0,191,255,0.6)', color: 'var(--cyan)' }} onClick={snapshot}>
            <Icon name="camera" size={12} /> SNAPSHOT LEVEL AS COVER
          </button>

          <div>
            <label className="label">TITLE</label>
            <input className="input" value={title} maxLength={40} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">DESCRIPTION</label>
            <textarea className="textarea" rows={3} value={desc} maxLength={220} onChange={(e) => setDesc(e.target.value)} placeholder="Describe your game..." />
          </div>
          <div className="grid cols-2">
            <div>
              <label className="label">GENRE</label>
              <select className="select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                {GENRES.filter((g) => g !== 'ALL').map((g) => <option key={g} value={g.toLowerCase()}>{g.toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="label">DIFFICULTY</label>
              <select className="select" value={diff} onChange={(e) => setDiff(e.target.value)}>
                {['easy', 'medium', 'hard', 'extreme'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button className="btn primary block" onClick={publish}>PUBLISH GAME</button>
          <div className="mono-label center">🌳 NEW GAME: 250 TREE-POINTS · YOUR BALANCE: {state.points} TREE-POINTS</div>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div className="section-kicker" style={{ marginBottom: 12 }}>MY GAMES ({state.myGames.length})</div>
        {state.myGames.length === 0 ? (
          <div className="panel center mono-label" style={{ padding: 30 }}>NO GAMES YET. CREATE YOUR FIRST!</div>
        ) : (
          <div className="grid cols-4">
            {state.myGames.map((g) => (
              <div key={g.id} className="gcard">
                <div className="gcard-art" style={{ background: `radial-gradient(circle at 50% 40%, ${g.art.c1}, ${g.art.c2})` }}><span>{g.art.icon}</span></div>
                <div className="gcard-body">
                  <div className="gcard-title">{g.title}</div>
                  <div className="gcard-meta">{g.genre} · {g.difficulty.toUpperCase()}</div>
                  <div className="gcard-actions">
                    <button className="btn sm" onClick={() => nav('/games')}>VIEW</button>
                    <button className="btn sm danger" onClick={() => { update((s) => ({ myGames: s.myGames.filter((x) => x.id !== g.id) })); notify('DELETED'); }}>
                      <Icon name="trash" size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

function TestPlay({ level, onExit }) {
  const canvasRef = useRef(null);
  const [hud, setHud] = useState({ score: 0, lives: 3, over: false, won: false });
  const keys = useRef({});
  const stateRef = useRef({ x: 2.5, y: 2.5, score: 0, lives: 3, inv: 0, over: false, won: false, coyote: 0 });

  useEffect(() => {
    const dn = (e) => { keys.current[e.key.toLowerCase()] = true; if (e.key.startsWith('Arrow') || e.key === ' ') e.preventDefault(); };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', dn, { passive: false });
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return undefined;
    const dpr = window.devicePixelRatio || 1;
    const rect = cv.getBoundingClientRect();
    cv.width = rect.width * dpr; cv.height = rect.height * dpr;
    const ctx = cv.getContext('2d');
    const cell = Math.min(rect.width / COLS, rect.height / ROWS);
    const ox = (rect.width - cell * COLS) / 2, oy = (rect.height - cell * ROWS) / 2;
    let raf = 0;
    const s = stateRef.current;
    const pickups = new Set();

    const loop = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#03080a'; ctx.fillRect(0, 0, rect.width, rect.height);
      const speed = 0.075;
      let dx = 0, dy = 0;
      if (keys.current['arrowleft'] || keys.current['a']) dx = -speed;
      if (keys.current['arrowright'] || keys.current['d']) dx = speed;
      if (keys.current['arrowup'] || keys.current['w']) dy = -speed;
      if (keys.current['arrowdown'] || keys.current['s']) dy = speed;

      const solid = (x, y) => {
        const cx = Math.floor(x), cy = Math.floor(y);
        if (cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS) return true;
        const t = level[cy * COLS + cx];
        return t === 'wall' || t === 'void';
      };

      if (!s.over) {
        const nx = s.x + dx;
        if (!solid(nx, s.y)) s.x = nx;
        const ny = s.y + dy;
        if (!solid(s.x, ny)) s.y = ny;

        const ci = Math.floor(s.y) * COLS + Math.floor(s.x);
        const t = level[ci];
        if ((t === 'coin' || t === 'gem') && !pickups.has(ci)) { pickups.add(ci); s.score += t === 'gem' ? 50 : 20; }
        if (t === 'lava' && s.inv <= 0) { s.lives -= 1; s.inv = 1.2; }
        if (t === 'enemy') {
          const ex = ci % COLS + 0.5, ey = Math.floor(ci / COLS) + 0.5;
          if (Math.abs(ex - s.x) < 0.7 && Math.abs(ey - s.y) < 0.7 && s.inv <= 0) { s.lives -= 1; s.inv = 1.2; }
        }
        if (t === 'goal') { s.over = true; s.won = true; }
        if (s.lives <= 0) { s.over = true; s.won = false; }
        s.inv -= 1 / 60;
      }

      // draw
      level.forEach((t, i) => {
        const x = ox + (i % COLS) * cell, y = oy + Math.floor(i / COLS) * cell;
        ctx.fillStyle = ART_COLORS[t] || '#05070a';
        ctx.fillRect(x, y, cell + 0.5, cell + 0.5);
        const ic = { coin: '🪙', enemy: '👾', spawn: '📍', goal: '🚩', gem: '💎' }[t];
        if (ic && !(pickups.has(i) && (t === 'coin' || t === 'gem'))) {
          ctx.font = `${Math.round(cell * 0.66)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(ic, x + cell / 2, y + cell / 2);
        }
      });
      ctx.save();
      ctx.font = `${Math.round(cell * 0.78)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (!(s.inv > 0 && Math.floor(s.inv * 10) % 2 === 0)) ctx.fillText('🏃', ox + s.x * cell, oy + s.y * cell);
      ctx.restore();

      setHud({ score: s.score, lives: Math.max(0, s.lives), over: s.over, won: s.won });
      if (s.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.font = `700 ${Math.round(rect.width * 0.06)}px "Chakra Petch", sans-serif`;
        ctx.textAlign = 'center'; ctx.fillStyle = s.won ? '#39ff14' : '#ff4d4d';
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 24;
        ctx.fillText(s.won ? 'LEVEL CLEARED!' : 'GAME OVER', rect.width / 2, rect.height / 2 - 10);
        ctx.shadowBlur = 0;
        ctx.font = `600 ${Math.round(rect.width * 0.024)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = '#fff';
        ctx.fillText(`SCORE ${s.score}`, rect.width / 2, rect.height / 2 + 32);
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [level]);

  return (
    <div style={{ marginTop: 14 }}>
      <div className="row between" style={{ marginBottom: 8 }}>
        <span className="mono-label">SCORE {hud.score}</span>
        <span className="mono-label" style={{ color: 'var(--red)' }}>{'❤️'.repeat(hud.lives)}</span>
        <button className="btn sm ghost" onClick={onExit}>■ EXIT TEST</button>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', aspectRatio: `${COLS}/${ROWS}`, display: 'block', borderRadius: 6, background: '#03080a' }} />
      <div className="mono-label center" style={{ marginTop: 8 }}>ARROWS / WASD TO MOVE · REACH 🚩</div>
      {hud.over && (
        <div className="row" style={{ justifyContent: 'center', marginTop: 10 }}>
          <button className="btn primary sm" onClick={() => stateRef.current = { x: 2.5, y: 2.5, score: 0, lives: 3, inv: 0, over: false, won: false }}>RESTART</button>
        </div>
      )}
    </div>
  );
}
