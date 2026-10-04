import React, { useEffect, useRef, useState, useCallback } from 'react';
import Icon from './icons.jsx';
import { useApp } from './store.jsx';

/* ---------------- shared canvas helpers ---------------- */
function useCanvas(draw, deps) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.floor(r.width * dpr));
      cv.height = Math.max(1, Math.floor(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cv._w = r.width; cv._h = r.height;
    };
    fit();
    window.addEventListener('resize', fit);
    let raf = 0;
    const loop = (t) => { draw(ctx, cv, t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

function useKeys() {
  const keys = useRef({});
  useEffect(() => {
    const dn = (e) => { keys.current[e.key.toLowerCase()] = true; if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) e.preventDefault(); };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', dn, { passive: false });
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);
  return keys;
}

function useTouch(stageRef) {
  const pos = useRef({ x: 0.5, y: 0.5, active: false });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      if (!t) return;
      pos.current.x = Math.min(1, Math.max(0, (t.clientX - r.left) / r.width));
      pos.current.y = Math.min(1, Math.max(0, (t.clientY - r.top) / r.height));
      pos.current.active = true;
      if (e.cancelable) e.preventDefault();
    };
    const end = () => { pos.current.active = false; };
    el.addEventListener('touchstart', move, { passive: false });
    el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('mousemove', move);
    el.addEventListener('touchend', end);
    return () => {
      el.removeEventListener('touchstart', move);
      el.removeEventListener('touchmove', move);
      el.removeEventListener('mousemove', move);
      el.removeEventListener('touchend', end);
    };
  }, [stageRef]);
  return pos;
}

function drawBg(ctx, w, h, t, color = '#03080a') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(57,255,20,0.07)';
  ctx.lineWidth = 1;
  const step = 34;
  const off = (t / 60) % step;
  for (let x = -off; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = -off; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
}

function glowText(ctx, text, x, y, size, color, align = 'center') {
  ctx.font = `700 ${size}px "Chakra Petch", system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

/* ---------------- game kinds ---------------- */

// 1. CATCH — collect good drops, avoid bombs
function CatchGame({ onEnd, speed = 1 }) {
  const [hud, setHud] = useState({ score: 0, lives: 3, time: 45 });
  const g = useRef({ items: [], score: 0, lives: 3, time: 45, px: 0.5, spawn: 0, over: false });
  const touch = useTouch(useRef(null));
  const stageRef = useRef(null);
  const keys = useKeys();

  const ref = useCanvas((ctx, cv, t) => {
    const w = cv._w, h = cv._h;
    const s = g.current;
    drawBg(ctx, w, h, t);
    if (!s.over) {
      const dt = 1 / 60;
      s.time -= dt;
      s.spawn -= dt;
      if (s.spawn <= 0) {
        s.spawn = 0.55 / speed;
        const bad = Math.random() < 0.28;
        s.items.push({ x: Math.random() * 0.9 + 0.05, y: -0.06, v: (0.22 + Math.random() * 0.22) * speed, bad, emoji: bad ? '💣' : ['⭐', '🪙', '🌿', '💎'][Math.floor(Math.random() * 4)] });
      }
      if (touch.current.active) s.px = touch.current.x;
      if (keys.current['arrowleft'] || keys.current['a']) s.px -= 0.012;
      if (keys.current['arrowright'] || keys.current['d']) s.px += 0.012;
      s.px = Math.min(0.96, Math.max(0.04, s.px));

      s.items.forEach((it) => { it.y += it.v * dt; });
      const py = 0.87;
      s.items = s.items.filter((it) => {
        if (it.y > py - 0.05 && it.y < py + 0.07 && Math.abs(it.x - s.px) < 0.07) {
          if (it.bad) { s.lives -= 1; } else { s.score += 10; }
          return false;
        }
        return it.y < 1.1;
      });
      if (s.lives <= 0) { s.over = true; onEnd({ score: s.score, reason: 'lives' }); }
      if (s.time <= 0) { s.over = true; s.time = 0; onEnd({ score: s.score, reason: 'time' }); }
      setHud({ score: s.score, lives: s.lives, time: Math.ceil(Math.max(0, s.time)) });
    }

    s.items.forEach((it) => {
      ctx.font = `${Math.round(w * 0.045)}px serif`;
      ctx.textAlign = 'center';
      ctx.globalAlpha = it.bad ? 0.95 : 1;
      ctx.fillText(it.emoji, it.x * w, it.y * h);
      ctx.globalAlpha = 1;
    });

    // basket
    const bx = s.px * w, by = 0.9 * h;
    ctx.save();
    ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 20;
    ctx.strokeStyle = '#39ff14'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx - w * 0.07, by - h * 0.03);
    ctx.lineTo(bx + w * 0.07, by - h * 0.03);
    ctx.lineTo(bx + w * 0.05, by + h * 0.035);
    ctx.lineTo(bx - w * 0.05, by + h * 0.035);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgba(57,255,20,0.14)';
    ctx.fill();
    ctx.restore();

    if (s.over) glowText(ctx, 'GAME OVER', w / 2, h / 2, Math.round(w * 0.06), '#39ff14');
  }, []);

  useEffect(() => { stageRef.current = null; }, []);
  const stageRef2 = useRef(null);
  return (
    <GameShell hud={hud} stageRef={stageRef2} keys={keys} touchHolder={touch}>
      <canvas ref={ref} />
    </GameShell>
  );
}

// 2. SURVIVE — dodge falling hazards
function SurviveGame({ onEnd, speed = 1 }) {
  const [hud, setHud] = useState({ score: 0, lives: 3, time: 60 });
  const g = useRef({ foes: [], px: 0.5, inv: 0, score: 0, lives: 3, time: 60, spawn: 0, over: false, phase: 0 });
  const touch = useTouch(useRef(null));
  const keys = useKeys();
  const stageRef = useRef(null);

  const ref = useCanvas((ctx, cv, t) => {
    const w = cv._w, h = cv._h;
    const s = g.current;
    drawBg(ctx, w, h, t, '#05040a');
    if (!s.over) {
      const dt = 1 / 60;
      s.time -= dt; s.phase += dt; s.inv -= dt; s.spawn -= dt;
      if (s.spawn <= 0) {
        s.spawn = (0.45 - Math.min(0.25, s.phase / 260)) / speed;
        s.foes.push({ x: Math.random() * 0.9 + 0.05, y: -0.08, v: (0.26 + Math.random() * 0.3 + s.phase / 220) * speed, w: 0.05 + Math.random() * 0.03, e: ['👾', '🪲', '🍄', '💀'][Math.floor(Math.random() * 4)] });
      }
      if (touch.current.active) s.px = touch.current.x;
      if (keys.current['arrowleft'] || keys.current['a']) s.px -= 0.013;
      if (keys.current['arrowright'] || keys.current['d']) s.px += 0.013;
      s.px = Math.min(0.96, Math.max(0.04, s.px));

      s.foes.forEach((f) => { f.y += f.v * dt; });
      s.foes = s.foes.filter((f) => {
        if (f.y > 0.82 && f.y < 0.96 && Math.abs(f.x - s.px) < f.w + 0.045) {
          if (s.inv <= 0) { s.lives -= 1; s.inv = 1.4; }
          return false;
        }
        return f.y < 1.15;
      });
      s.score += 1;
      if (s.lives <= 0) { s.over = true; onEnd({ score: Math.floor(s.score), reason: 'lives' }); }
      if (s.time <= 0) { s.over = true; s.time = 0; onEnd({ score: Math.floor(s.score), reason: 'survived' }); }
      setHud({ score: Math.floor(s.score), lives: s.lives, time: Math.ceil(Math.max(0, s.time)) });
    }

    s.foes.forEach((f) => {
      ctx.font = `${Math.round(w * 0.05)}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(f.e, f.x * w, f.y * h);
    });

    const blink = s.inv > 0 && Math.floor(s.inv * 10) % 2 === 0;
    if (!blink) {
      ctx.save();
      ctx.shadowColor = '#00bfff'; ctx.shadowBlur = 22;
      ctx.fillStyle = '#00bfff';
      ctx.beginPath();
      ctx.arc(s.px * w, 0.89 * h, w * 0.028, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (s.over) glowText(ctx, 'ELIMINATED', w / 2, h / 2, Math.round(w * 0.06), '#ff4d4d');
  }, []);

  return (
    <GameShell hud={hud} stageRef={stageRef} keys={keys} touchHolder={touch}>
      <canvas ref={ref} />
    </GameShell>
  );
}

// 3. SHOOTER — hold the line, tap/click to fire
function ShooterGame({ onEnd, speed = 1 }) {
  const [hud, setHud] = useState({ score: 0, lives: 3, time: 60 });
  const g = useRef({ foes: [], shots: [], px: 0.5, score: 0, lives: 3, time: 60, spawn: 0, cool: 0, over: false, wave: 1 });
  const touch = useTouch(useRef(null));
  const keys = useKeys();
  const stageRef = useRef(null);
  const fire = useRef(() => {});

  const ref = useCanvas((ctx, cv, t) => {
    const w = cv._w, h = cv._h;
    const s = g.current;
    drawBg(ctx, w, h, t, '#04060f');
    if (!s.over) {
      const dt = 1 / 60;
      s.time -= dt; s.spawn -= dt; s.cool -= dt;
      s.wave = 1 + Math.floor((60 - s.time) / 15);
      if (s.spawn <= 0) {
        s.spawn = (0.75 - Math.min(0.4, s.wave * 0.09)) / speed;
        s.foes.push({ x: Math.random() * 0.9 + 0.05, y: -0.09, v: (0.16 + Math.random() * 0.16 + s.wave * 0.03) * speed, hp: s.wave > 2 ? 2 : 1, e: ['🛸', '👾', '🐛'][Math.floor(Math.random() * 3)] });
      }
      if (touch.current.active) s.px = touch.current.x;
      if (keys.current['arrowleft'] || keys.current['a']) s.px -= 0.013;
      if (keys.current['arrowright'] || keys.current['d']) s.px += 0.013;
      if (keys.current[' ']) fire.current();
      s.px = Math.min(0.96, Math.max(0.04, s.px));
      if (touch.current.active && s.cool <= 0) fire.current();

      s.shots.forEach((b) => { b.y -= 1.35 * dt; });
      s.shots = s.shots.filter((b) => b.y > -0.1);
      s.foes.forEach((f) => { f.y += f.v * dt; });
      s.foes = s.foes.filter((f) => {
        for (const b of s.shots) {
          if (Math.abs(b.x - f.x) < 0.05 && Math.abs(b.y - f.y) < 0.07) {
            f.hp -= 1; b.dead = true;
            if (f.hp <= 0) { s.score += 25; return false; }
          }
        }
        if (f.y > 0.84) { s.lives -= 1; return false; }
        return f.y < 1.15;
      });
      s.shots = s.shots.filter((b) => !b.dead);
      if (s.lives <= 0) { s.over = true; onEnd({ score: s.score, reason: 'lives' }); }
      if (s.time <= 0) { s.over = true; s.time = 0; onEnd({ score: s.score, reason: 'survived' }); }
      setHud({ score: s.score, lives: s.lives, time: Math.ceil(Math.max(0, s.time)), wave: s.wave });
    }

    s.shots.forEach((b) => {
      ctx.save(); ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#39ff14'; ctx.fillRect(b.x * w - 2, b.y * h - 10, 4, 12); ctx.restore();
    });
    s.foes.forEach((f) => {
      ctx.font = `${Math.round(w * 0.048)}px serif`; ctx.textAlign = 'center';
      ctx.fillText(f.e, f.x * w, f.y * h);
      if (f.hp > 1) { ctx.fillStyle = '#ff4d4d'; ctx.fillRect(f.x * w - 12, f.y * h + 6, 24 * (f.hp / 2), 3); }
    });

    ctx.save(); ctx.shadowColor = '#00e5c0'; ctx.shadowBlur = 20;
    ctx.strokeStyle = '#00e5c0'; ctx.lineWidth = 3;
    const bx = s.px * w, by = 0.9 * h;
    ctx.beginPath(); ctx.moveTo(bx - w * 0.035, by + h * 0.04); ctx.lineTo(bx, by - h * 0.04); ctx.lineTo(bx + w * 0.035, by + h * 0.04); ctx.closePath(); ctx.stroke();
    ctx.restore();

    if (s.over) glowText(ctx, 'BASE LOST', w / 2, h / 2, Math.round(w * 0.06), '#ff4d4d');
  }, []);

  fire.current = () => {
    const s = g.current;
    if (s.over || s.cool > 0) return;
    s.cool = 0.22;
    s.shots.push({ x: s.px, y: 0.84 });
  };

  const tap = () => fire.current();
  return (
    <GameShell hud={hud} stageRef={stageRef} keys={keys} touchHolder={touch} onTap={tap}>
      <canvas ref={ref} />
    </GameShell>
  );
}

// 4. RACE — lane dodging boost run
function RaceGame({ onEnd, speed = 1 }) {
  const [hud, setHud] = useState({ score: 0, lives: 3, time: 45 });
  const g = useRef({ lane: 1, target: 1, cars: [], score: 0, lives: 3, time: 45, spawn: 0, over: false, scroll: 0, inv: 0 });
  const keys = useKeys();
  const touch = useTouch(useRef(null));
  const stageRef = useRef(null);
  const lastTouchX = useRef(0.5);

  const ref = useCanvas((ctx, cv, t) => {
    const w = cv._w, h = cv._h;
    const s = g.current;
    ctx.fillStyle = '#06040f'; ctx.fillRect(0, 0, w, h);
    s.scroll += 0.03;
    if (!s.over) {
      const dt = 1 / 60;
      s.time -= dt; s.spawn -= dt; s.inv -= dt;
      if (s.spawn <= 0) { s.spawn = (0.65 - Math.min(0.35, s.score / 3000)) / speed; s.cars.push({ lane: Math.floor(Math.random() * 3), y: -0.12, e: ['🛸', '🚀', '🛞'][Math.floor(Math.random() * 3)] }); }
      if (keys.current['arrowleft'] || keys.current['a']) s.target = Math.max(0, s.target - 0.05);
      if (keys.current['arrowright'] || keys.current['d']) s.target = Math.min(2, s.target + 0.05);
      if (touch.current.active && Math.abs(touch.current.x - lastTouchX.current) > 0.02) {
        s.target += touch.current.x > lastTouchX.current ? 1 : -1;
        lastTouchX.current = touch.current.x;
        s.target = Math.min(2, Math.max(0, s.target));
      }
      s.lane += (s.target - s.lane) * 0.16;
      s.cars.forEach((c) => { c.y += (0.45 + s.score / 2600) * dt; });
      s.cars = s.cars.filter((c) => {
        if (c.y > 0.76 && c.y < 1.0 && Math.abs(c.lane - s.lane) < 0.4) {
          if (s.inv <= 0) { s.lives -= 1; s.inv = 1.5; }
          return false;
        }
        return c.y < 1.2;
      });
      s.score += 6;
      if (s.lives <= 0) { s.over = true; onEnd({ score: Math.floor(s.score), reason: 'crash' }); }
      if (s.time <= 0) { s.over = true; s.time = 0; onEnd({ score: Math.floor(s.score), reason: 'time' }); }
      setHud({ score: Math.floor(s.score), lives: s.lives, time: Math.ceil(Math.max(0, s.time)) });
    }

    // road
    const roadW = w * 0.62, roadX = (w - roadW) / 2;
    ctx.fillStyle = '#0c0d16'; ctx.fillRect(roadX, 0, roadW, h);
    ctx.strokeStyle = 'rgba(0,191,255,0.5)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(roadX, 0); ctx.lineTo(roadX, h); ctx.moveTo(roadX + roadW, 0); ctx.lineTo(roadX + roadW, h); ctx.stroke();
    ctx.setLineDash([26, 26]); ctx.lineDashOffset = -((s.scroll * 40) % 52);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
      const x = roadX + (roadW / 3) * i;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    ctx.setLineDash([]);

    s.cars.forEach((c) => {
      const x = roadX + (roadW / 3) * (c.lane + 0.5);
      ctx.font = `${Math.round(w * 0.055)}px serif`; ctx.textAlign = 'center';
      ctx.fillText(c.e, x, c.y * h);
    });
    const px = roadX + (roadW / 3) * (s.lane + 0.5);
    if (!(s.inv > 0 && Math.floor(s.inv * 10) % 2 === 0)) {
      ctx.save(); ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 24;
      ctx.font = `${Math.round(w * 0.06)}px serif`; ctx.textAlign = 'center';
      ctx.fillText('🏎️', px, 0.87 * h); ctx.restore();
    }
    if (s.over) glowText(ctx, 'RUN OVER', w / 2, h / 2, Math.round(w * 0.06), '#ffd60a');
  }, []);

  const tap = () => { const s = g.current; s.target = s.target >= 2 ? 0 : s.target + 1; };
  return (
    <GameShell hud={hud} stageRef={stageRef} keys={keys} touchHolder={touch} onTap={tap}>
      <canvas ref={ref} />
    </GameShell>
  );
}

// 5. MAZE — collect gems, reach the goal
function MazeGame({ onEnd }) {
  const COLS = 15, ROWS = 9;
  const [hud, setHud] = useState({ score: 0, lives: 3, time: 60 });
  const build = useCallback(() => {
    const cells = Array(COLS * ROWS).fill(0);
    const wall = (x, y) => { if (x >= 0 && y >= 0 && x < COLS && y < ROWS) cells[y * COLS + x] = 1; };
    for (let x = 0; x < COLS; x++) { wall(x, 0); wall(x, ROWS - 1); }
    for (let y = 0; y < ROWS; y++) { wall(0, y); wall(COLS - 1, y); }
    const rng = (n) => Math.floor(Math.random() * n);
    for (let i = 0; i < 26; i++) {
      const x = 1 + rng(COLS - 2), y = 1 + rng(ROWS - 2);
      if ((x <= 2 && y <= 2) || (x >= COLS - 3 && y >= ROWS - 3)) continue;
      wall(x, y);
    }
    const gems = [];
    for (let i = 0; i < 10; i++) {
      const x = 1 + rng(COLS - 2), y = 1 + rng(ROWS - 2);
      if (!cells[y * COLS + x] && !(x <= 2 && y <= 2)) gems.push({ x, y, got: false });
    }
    return { cells, gems, px: 1.5, py: 1.5, dir: { x: 0, y: 0 }, score: 0, time: 60, over: false, won: false };
  }, []);
  const g = useRef(build());
  const keys = useKeys();
  const touch = useTouch(useRef(null));
  const stageRef = useRef(null);
  const lastStick = useRef(0);

  const ref = useCanvas((ctx, cv, t) => {
    const w = cv._w, h = cv._h;
    const s = g.current;
    drawBg(ctx, w, h, t, '#03110a');
    const cell = Math.min(w / COLS, h / ROWS);
    const ox = (w - cell * COLS) / 2, oy = (h - cell * ROWS) / 2;

    if (!s.over) {
      const dt = 1 / 60;
      s.time -= dt;
      let dx = 0, dy = 0;
      if (keys.current['arrowleft'] || keys.current['a']) dx = -1;
      else if (keys.current['arrowright'] || keys.current['d']) dx = 1;
      else if (keys.current['arrowup'] || keys.current['w']) dy = -1;
      else if (keys.current['arrowdown'] || keys.current['s']) dy = 1;
      if (touch.current.active) {
        const now = performance.now();
        if (now - lastStick.current > 240) {
          const cx = 0.5, cy = 0.5;
          const ddx = touch.current.x - cx, ddy = touch.current.y - cy;
          if (Math.abs(ddx) > Math.abs(ddy)) dx = Math.sign(ddx); else dy = Math.sign(ddy);
          lastStick.current = now;
        }
      }
      if (dx || dy) {
        s.px += dx * 0.035; s.py += dy * 0.035;
        const cx = Math.floor(s.px), cy = Math.floor(s.py);
        if (cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS || s.cells[cy * COLS + cx] === 1) {
          s.px -= dx * 0.035; s.py -= dy * 0.035;
        }
      }
      s.gems.forEach((gm) => {
        if (!gm.got && Math.abs(gm.x + 0.5 - s.px) < 0.45 && Math.abs(gm.y + 0.5 - s.py) < 0.45) { gm.got = true; s.score += 50; }
      });
      if (Math.abs(COLS - 1.5 - s.px) < 0.5 && Math.abs(ROWS - 1.5 - s.py) < 0.5) {
        s.over = true; s.won = true;
        onEnd({ score: s.score + Math.ceil(s.time) * 5, reason: 'escaped' });
      }
      if (s.time <= 0) { s.over = true; s.time = 0; onEnd({ score: s.score, reason: 'time' }); }
      setHud({ score: s.score, lives: 3, time: Math.ceil(Math.max(0, s.time)) });
    }

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const wx = ox + x * cell, wy = oy + y * cell;
        if (s.cells[y * COLS + x] === 1) {
          ctx.fillStyle = '#123a1c'; ctx.fillRect(wx + 1, wy + 1, cell - 2, cell - 2);
          ctx.strokeStyle = 'rgba(57,255,20,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(wx + 1.5, wy + 1.5, cell - 3, cell - 3);
        } else {
          ctx.fillStyle = 'rgba(57,255,20,0.05)'; ctx.fillRect(wx + 1, wy + 1, cell - 2, cell - 2);
        }
      }
    }
    s.gems.forEach((gm) => {
      if (gm.got) return;
      ctx.font = `${Math.round(cell * 0.55)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('💎', ox + (gm.x + 0.5) * cell, oy + (gm.y + 0.5) * cell);
    });
    ctx.font = `${Math.round(cell * 0.6)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🚩', ox + (COLS - 1.5) * cell, oy + (ROWS - 1.5) * cell);
    ctx.save(); ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 16;
    ctx.fillText('🏃', ox + s.px * cell, oy + s.py * cell); ctx.restore();

    if (s.over) glowText(ctx, s.won ? 'ESCAPED!' : 'TIME UP', w / 2, h / 2, Math.round(w * 0.06), s.won ? '#39ff14' : '#ff4d4d');
  }, []);

  const tap = () => {
    const s = g.current;
    const seq = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }];
    const i = seq.findIndex((d) => d.x === s.dir.x && d.y === s.dir.y);
    const n = seq[(i + 1) % seq.length];
    s.dir = n;
  };

  return (
    <GameShell hud={hud} stageRef={stageRef} keys={keys} touchHolder={touch} onTap={tap} hint="ARROWS / WASD / DRAG — COLLECT 💎 AND REACH 🚩">
      <canvas ref={ref} />
    </GameShell>
  );
}

/* ---------------- shell ---------------- */
function GameShell({ hud, stageRef, keys, touchHolder, onTap, hint, children }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div
        className="game-stage"
        ref={stageRef}
        onPointerDown={() => { if (onTap) onTap(); }}
        onKeyDown={(e) => e.preventDefault()}
        tabIndex={0}
      >
        {children}
        <div className="hud">
          <span>SCORE {hud.score}</span>
          <span className="lives">{'❤️'.repeat(Math.max(0, hud.lives || 0))}</span>
          <span style={{ color: (hud.time || 0) <= 10 ? '#ff4d4d' : '#fff' }}>{hud.time}s</span>
        </div>
      </div>
      <div className="mono-label" style={{ textAlign: 'center' }}>
        {hint || 'ARROWS / WASD TO MOVE · TOUCH AND DRAG ON MOBILE'}
      </div>
    </div>
  );
}

const KINDS = { catch: CatchGame, survive: SurviveGame, shooter: ShooterGame, race: RaceGame, maze: MazeGame };

export default function GameModal({ game, onClose }) {
  const { update, notify, addXp, bumpStat, state } = useApp();
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(!!game.autoStart);
  const Kind = KINDS[game.kind] || SurviveGame;

  const handleEnd = (r) => {
    if (result) return;
    setResult(r);
    const xp = Math.max(10, Math.round(r.score / 2));
    addXp(xp);
    bumpStat('matches');
    if (r.reason === 'escaped' || r.reason === 'survived') bumpStat('wins');
    bumpStat('kills', Math.floor(r.score / 50));
    update((s) => {
      const earned = Math.max(5, Math.round(r.score / 10));
      return { points: s.points + earned };
    });
    notify(`+${xp} XP · MATCH COMPLETE`);
  };

  return (
    <div className="overlay" onClick={() => { if (result) onClose(); }}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="row" style={{ gap: 12 }}>
            <span style={{ fontSize: '1.6rem' }}>{game.art?.icon || '🎮'}</span>
            <div>
              <div className="font-head" style={{ fontSize: '1.2rem', letterSpacing: 2, textTransform: 'uppercase' }}>{game.title}</div>
              <div className="mono-label">BY {String(game.creator || 'PLAYTREE').toUpperCase()} · {game.genre || 'ACTION'}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={15} /></button>
        </div>

        <div className="modal-body stack" style={{ gap: 16 }}>
          {!started ? (
            <div className="center stack" style={{ gap: 16, padding: '18px 0' }}>
              <div style={{ fontSize: '3.4rem' }}>{game.art?.icon || '🎮'}</div>
              <p className="muted" style={{ maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>{game.desc || 'Drop in and play.'}</p>
              <div className="row wrap" style={{ justifyContent: 'center' }}>
                <span className="pill">{game.age || 'All ages'}</span>
                <span className="pill">DIFFICULTY · {(game.difficulty || 'medium').toUpperCase()}</span>
                <span className="pill">{game.kind || 'survive'} MODE</span>
              </div>
              <button className="btn primary" style={{ padding: '14px 34px' }} onClick={() => setStarted(true)}>
                <Icon name="play" size={14} /> PLAY NOW
              </button>
              <div className="mono-label">BEST THIS SESSION · {state.stats.wins} WINS · {state.stats.kills} KILLS</div>
            </div>
          ) : !result ? (
            <Kind onEnd={handleEnd} autoStart />
          ) : (
            <div className="center stack" style={{ gap: 14, padding: '12px 0' }}>
              <div className="kicker">{result.reason === 'escaped' || result.reason === 'survived' ? 'LEVEL CLEARED' : 'GAME OVER'}</div>
              <div className="page-title" style={{ margin: 0 }}><span className="hl">{result.score}</span></div>
              <div className="mono-label">FINAL SCORE</div>
              <div className="row wrap" style={{ justifyContent: 'center' }}>
                <span className="pill">+{Math.max(10, Math.round(result.score / 2))} XP</span>
                <span className="pill">+{Math.max(5, Math.round(result.score / 10))} TREE-POINTS</span>
              </div>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button className="btn primary" onClick={() => { setResult(null); }}><Icon name="refresh" size={13} /> PLAY AGAIN</button>
                <button className="btn ghost" onClick={onClose}>EXIT</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
