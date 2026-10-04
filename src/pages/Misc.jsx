import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../icons.jsx';
import { Page } from '../layout.jsx';
import { useApp } from '../store.jsx';
import {
  REALITY_MODES, REALITY_STEPS, COLLABS, PLATFORMS, HELP_ARTICLES, MOD_RULES, PROFILE_THEMES, BADGES, randomName,
} from '../data.js';

/* =============== SETTINGS =============== */
export function Settings() {
  const { state, update, notify } = useApp();
  const nav = useNavigate();
  const set = (k, v) => update((s) => ({ settings: { ...s.settings, [k]: v } }));

  const Toggle = ({ on, onChange }) => (
    <button onClick={() => onChange(!on)} style={{ width: 46, height: 24, borderRadius: 14, border: '1px solid ' + (on ? 'var(--accent)' : 'rgba(255,255,255,0.2)'), background: on ? 'rgba(57,255,20,0.25)' : 'rgba(255,255,255,0.06)', position: 'relative', cursor: 'pointer', flex: 'none' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 24 : 2, width: 18, height: 18, borderRadius: '50%', background: on ? 'var(--accent)' : 'rgba(255,255,255,0.5)', transition: 'left .15s' }} />
    </button>
  );

  const Row = ({ label, hint, children }) => (
    <div className="row between" style={{ padding: '13px 0', borderBottom: '1px solid var(--line-soft)' }}>
      <div>
        <div style={{ fontSize: '0.95rem' }}>{label}</div>
        {hint && <div className="mono-label" style={{ marginTop: 3 }}>{hint}</div>}
      </div>
      <div className="row" style={{ gap: 10 }}>{children}</div>
    </div>
  );

  return (
    <Page page="settings">
      <div className="row" style={{ gap: 14, marginBottom: 18 }}>
        <button className="icon-btn" onClick={() => nav(-1)}><Icon name="back" size={14} /></button>
        <div>
          <div className="font-head" style={{ letterSpacing: 5, fontSize: '1.4rem' }}>SETTINGS</div>
          <div className="mono-label">GOAI · PARENTAL CONTROLS &amp; SAFETY</div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="section-kicker" style={{ marginBottom: 14 }}>🛡 GOAI STATUS</div>
        <div className="panel" style={{ borderColor: 'rgba(0,191,255,0.4)', background: 'rgba(0,191,255,0.05)', marginBottom: 14 }}>
          <div className="row" style={{ gap: 12 }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid var(--cyan)', display: 'grid', placeItems: 'center' }}>🤖</span>
            <div>
              <div className="font-head" style={{ color: 'var(--cyan)', letterSpacing: 2 }}>{state.ageGroup.toUpperCase()} MODE ACTIVE</div>
              <div className="mono-label">GOAI MONITORING ACTIVE · 0 / 5 VIOLATIONS</div>
            </div>
          </div>
        </div>
        {[['Age Group', 'DETECTED BY GOAI FACE SCAN', state.ageGroup], ['Age Range', 'APPROXIMATE', '13–17 yrs'], ['Chat', 'CURRENT MODE', 'Filtered'], ['Chat Filter', 'BLOCKS BAD WORDS AUTOMATICALLY', 'ON'], ['Play Time Limit', 'DAILY CAP', '4h/day'], ['Violations', '5 VIOLATIONS = BAN', '0 / 5']].map(([k, h, v]) => (
          <Row key={k} label={k} hint={h}><span className="font-mono" style={{ color: 'var(--cyan)', fontSize: '0.8rem' }}>{v}</span></Row>
        ))}
        <button className="btn" style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)', marginTop: 14 }} onClick={() => notify('FACE RESCAN QUEUED')}>
          <Icon name="camera" size={13} /> RE-SCAN FACE
        </button>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="section-kicker" style={{ marginBottom: 14 }}>💬 CHAT &amp; SAFETY RULES</div>
        {[['Kid (3–12)', '#39ff14', 'CHAT: YES · FILTER: ON · PROFANITY: BLOCKED · SCREEN TIME: 2H'],
          ['Teen (13–17)', '#00bfff', 'CHAT: YES · FILTER: ON · PROFANITY: BLOCKED · SCREEN TIME: 4H'],
          ['Adult (18–64)', '#a78bfa', 'CHAT: YES · FILTER: OFF · PROFANITY: ALLOWED · SCREEN TIME: NO LIMIT'],
          ['Senior (65–99)', '#ffd60a', 'CHAT: YES · FILTER: OFF · PROFANITY: ALLOWED · SCREEN TIME: NO LIMIT']].map(([n, c, d]) => (
          <div key={n} className="row" style={{ gap: 12, padding: '11px 0', borderBottom: '1px solid var(--line-soft)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, flex: 'none' }} />
            <div>
              <div className="font-head" style={{ fontSize: '0.95rem', letterSpacing: 1 }}>{n}</div>
              <div className="mono-label" style={{ fontSize: '0.44rem', marginTop: 3 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid cols-2" style={{ marginBottom: 20 }}>
        <div className="panel">
          <div className="section-kicker" style={{ marginBottom: 12 }}>PARENT SAFETY &amp; STORE</div>
          <p className="muted" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
            Lock Games, Studio and Friends behind a parent PIN, or browse the avatar &amp; theme store.
          </p>
          <div className="stack" style={{ marginTop: 12 }}>
            <button className="btn block" onClick={() => nav('/parental-controls')}><Icon name="lock" size={12} /> PARENT CONTROLS</button>
            <button className="btn block" onClick={() => nav('/store')}>PLAYTREE STORE</button>
          </div>
        </div>
        <div className="panel">
          <div className="section-kicker" style={{ marginBottom: 12 }}>LEGAL</div>
          <p className="muted" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>The rules of the treehouse and how PlayTree handles your data.</p>
          <div className="stack" style={{ marginTop: 12 }}>
            <button className="btn block" onClick={() => nav('/terms')}>TERMS OF SERVICE</button>
            <button className="btn block" onClick={() => nav('/privacy')}>PRIVACY POLICY</button>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="section-kicker" style={{ marginBottom: 6 }}>UI THEME</div>
        <div className="muted" style={{ fontSize: '0.86rem', marginBottom: 14 }}>
          Pick a custom color theme for the entire app. Mobile Auto-Theme overrides this on phones.
        </div>
        <Row label="Classic Theme (1st Birthday)" hint="THE FLAT CLASSIC PLAYTREE LOOK WITH GREEN WORDMARK">
          <Toggle on={state.settings.classicTheme} onChange={(v) => set('classicTheme', v)} />
        </Row>
        <div className="chips" style={{ marginTop: 14 }}>
          {[['cyan', 'STORM CYAN', '#00bfff'], ['green', 'TOXIC GREEN', '#39ff14'], ['purple', 'VOID PURPLE', '#a78bfa'], ['gold', 'ANCIENT GOLD', '#ffd60a'], ['red', 'BLOOD RED', '#ff4d4d']].map(([id, label, c]) => (
            <button key={id} className={'pill click' + (state.settings.theme === id ? ' on' : '')} onClick={() => set('theme', id)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="section-kicker" style={{ marginBottom: 8 }}>MOBILE &amp; SCREEN</div>
        <Row label="Mobile Auto-Theme" hint="AUTO-DETECTS PHONE & APPLIES COMPACT THEME"><Toggle on={state.settings.mobileAuto} onChange={(v) => set('mobileAuto', v)} /></Row>
        <Row label="Auto-Fit Screen" hint="GAME & UI AUTO-SCALE TO ANY SCREEN SIZE"><Toggle on={state.settings.autoFit} onChange={(v) => set('autoFit', v)} /></Row>
        <Row label="Auto-Controls" hint="TOUCH, GAMEPAD, KEYBOARD & TILT AUTO-DETECTED IN-GAME"><Toggle on={state.settings.autoControls} onChange={(v) => set('autoControls', v)} /></Row>
        <Row label="Notifications" hint="STORM EVENTS, FRIEND ACTIVITY AND REWARDS"><Toggle on={state.settings.notifications} onChange={(v) => set('notifications', v)} /></Row>
      </div>

      <div className="panel">
        <div className="section-kicker" style={{ marginBottom: 10 }}>PLAYTREE SUPPORT</div>
        <p className="muted" style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
          Official software / game / studio support for PlayTree. Email us for account, moderation or technical help —
          the support team runs the official PlayTree account.
        </p>
        <div className="font-mono" style={{ color: 'var(--accent)', fontSize: '0.8rem', margin: '10px 0 14px' }}>GOSTUDIOSCORP@OUTLOOK.COM</div>
        <div className="grid cols-3">
          {[['Live Chat', 'ASK OUR AI ASSISTANT', 'mic'], ['Submit a Ticket', 'BUGS, ACCOUNT OR SAFETY', 'flag'], ['Track a Ticket', 'ENTER YOUR GS- CODE', 'hash']].map(([t, d, ic]) => (
            <button key={t} className="panel center" style={{ cursor: 'pointer' }} onClick={() => nav('/support')}>
              <Icon name={ic} size={20} color="var(--accent)" />
              <div className="font-head" style={{ marginTop: 8, letterSpacing: 1 }}>{t}</div>
              <div className="mono-label" style={{ marginTop: 4, fontSize: '0.44rem' }}>{d}</div>
            </button>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* =============== REALITY =============== */
export function Reality() {
  const { notify } = useApp();
  const [open, setOpen] = useState(null);
  const faqs = [
    ['Do I need special hardware?', 'No. Phone AR works on any Android 12+ or iOS 16+ device. AR glasses mode is optional and in beta.'],
    ['Is PlayTree Reality safe for kids?', 'Yes. GoAI applies the same age rules as the main app, camera frames are never stored, and parents can disable AR entirely from Parental Controls.'],
    ['Does it drain my battery?', 'Expect about 20–30 minutes of continuous AR play on a modern phone. We auto-drop the render rate when your battery hits 25%.'],
    ['Can I play with friends in the same room?', 'Yes — Holo-Squad Lobby lets you see each other as holograms on one shared surface with spatial voice chat.'],
  ];

  return (
    <Page page="reality">
      <div className="center" style={{ margin: '30px 0 44px' }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>— PLAYTREE REALITY —</div>
        <div className="page-title" style={{ marginTop: 14, lineHeight: 1.05 }}>
          THE ISLAND<br /><span className="hl">BECOMES REAL</span>
        </div>
        <p className="muted" style={{ maxWidth: 640, margin: '16px auto 0', lineHeight: 1.7 }}>
          Step into PlayTree like never before. Augmented reality brings the island into your world — loot on your desk,
          storms in your ceiling, and friends as holograms beside you.
        </p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 22 }}>
          <button className="btn cyan" style={{ padding: '14px 24px' }} onClick={() => notify('REQUESTING CAMERA ACCESS...')}>
            <Icon name="glasses" size={14} /> LAUNCH AR COMBAT
          </button>
          <button className="btn ghost" onClick={() => document.getElementById('modes')?.scrollIntoView({ behavior: 'smooth' })}>EXPLORE MODES</button>
        </div>
      </div>

      <div id="modes" className="center" style={{ marginBottom: 22 }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>— SIX WAYS TO EXPERIENCE REALITY —</div>
        <div className="page-title" style={{ fontSize: '2.2rem', marginTop: 10 }}>REALITY MODES</div>
      </div>

      <div className="grid cols-3" style={{ marginBottom: 34 }}>
        {REALITY_MODES.map((m) => (
          <div key={m.name} className="panel" style={{ borderColor: m.status === 'LIVE' ? 'rgba(57,255,20,0.35)' : undefined }}>
            <div className="row between">
              <span style={{ fontSize: '1.7rem' }}>{m.icon}</span>
              <span className={'tag ' + (m.status === 'LIVE' ? 'low' : m.status === 'BETA' ? 'medium' : 'medium')} style={m.status === 'COMING SOON' ? { background: 'rgba(255,255,255,0.14)', color: '#fff' } : {}}>{m.status}</span>
            </div>
            <div className="font-head" style={{ marginTop: 12, letterSpacing: 1.5, color: 'var(--accent)', fontSize: '1.05rem' }}>{m.name}</div>
            <div className="mono-label" style={{ marginTop: 3 }}>{m.kind}</div>
            <p className="muted" style={{ fontSize: '0.85rem', lineHeight: 1.6, marginTop: 10 }}>{m.desc}</p>
            <div className="divider" style={{ margin: '12px 0' }} />
            <div className="mono-label">SUPPORTED DEVICES</div>
            <div className="font-mono" style={{ fontSize: '0.66rem', marginTop: 4, color: 'rgba(255,255,255,0.7)' }}>{m.devices}</div>
          </div>
        ))}
      </div>

      <div className="center" style={{ marginBottom: 18 }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>— GETTING STARTED —</div>
        <div className="page-title" style={{ fontSize: '2.2rem', marginTop: 10 }}>HOW IT WORKS</div>
      </div>
      <div className="grid cols-4" style={{ marginBottom: 34 }}>
        {REALITY_STEPS.map((s) => (
          <div key={s.n} className="panel">
            <div className="font-head" style={{ fontSize: '1.9rem', color: 'var(--accent)', opacity: 0.85 }}>{s.n}</div>
            <div className="font-head" style={{ letterSpacing: 1, marginTop: 8 }}>{s.t}</div>
            <p className="muted" style={{ fontSize: '0.84rem', lineHeight: 1.6, marginTop: 6 }}>{s.d}</p>
          </div>
        ))}
      </div>

      <div className="center" style={{ marginBottom: 14 }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>— QUESTIONS &amp; ANSWERS —</div>
        <div className="page-title" style={{ fontSize: '2.2rem', marginTop: 10 }}>FAQ</div>
      </div>
      <div className="stack" style={{ maxWidth: 780, margin: '0 auto 30px' }}>
        {faqs.map(([q, a], i) => (
          <div key={q} className="panel" style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => setOpen(open === i ? null : i)}>
            <div className="row between">
              <span style={{ fontSize: '0.95rem' }}>{q}</span>
              <span style={{ color: 'var(--accent)' }}>{open === i ? '−' : '+'}</span>
            </div>
            {open === i && <p className="muted" style={{ fontSize: '0.88rem', lineHeight: 1.7, marginTop: 10 }}>{a}</p>}
          </div>
        ))}
      </div>

      <div className="panel center glow" style={{ padding: 30 }}>
        <div className="font-head" style={{ fontSize: '1.5rem', letterSpacing: 3 }}>READY TO STEP IN?</div>
        <p className="muted" style={{ marginTop: 8 }}>PlayTree Reality works right now on your phone. No headset required.</p>
        <button className="btn cyan" style={{ marginTop: 14 }} onClick={() => notify('OPENING AR COMBAT...')}><Icon name="glasses" size={13} /> BACK TO PLAYTREE</button>
      </div>
    </Page>
  );
}

/* =============== COLLABORATIONS =============== */
export function Collaborations() {
  const { notify } = useApp();
  const [filter, setFilter] = useState('ALL');
  const list = COLLABS.filter((c) => filter === 'ALL' || c.status === filter);

  return (
    <Page page="collaborations">
      <div className="center" style={{ marginBottom: 24 }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>— OFFICIAL PARTNERSHIPS —</div>
        <div className="page-title">COLLAB<span className="hl">ORATIONS</span></div>
        <div className="section-sub">OFFICIAL TEAM-UPS, CROSSOVER EVENTS &amp; CREATOR PARTNERSHIPS FOR PLAYTREE SEASON 1</div>
        <div className="chips" style={{ justifyContent: 'center', marginTop: 16 }}>
          {['ALL', 'LIVE', 'COMING SOON'].map((f) => <button key={f} className={'pill click' + (filter === f ? ' on' : '')} onClick={() => setFilter(f)}>{f}</button>)}
        </div>
      </div>

      <div className="stack" style={{ gap: 22 }}>
        {list.map((c) => (
          <div key={c.id} className="panel glow" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 210, background: `radial-gradient(circle at 30% 50%, ${c.colors[0]}, transparent 60%), radial-gradient(circle at 72% 50%, ${c.colors[1]}, transparent 60%), #05070a`, display: 'grid', placeItems: 'center', position: 'relative' }}>
              <div className="center">
                <div style={{ fontSize: '3rem' }}>{c.icon}</div>
                <div className="font-head" style={{ fontSize: '2rem', letterSpacing: 4, marginTop: 8, textShadow: '0 0 24px rgba(57,255,20,0.5)' }}>
                  PLAYTREE <span style={{ color: 'var(--gold)' }}>×</span> {c.title.replace('PlayTree × ', '').toUpperCase()}
                </div>
              </div>
              <div className="row" style={{ position: 'absolute', top: 14, left: 16 }}>
                <span className={'tag ' + (c.status === 'LIVE' ? 'low' : 'medium')}>{c.status}</span>
                <span className="tag" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>{c.platform}</span>
              </div>
            </div>
            <div style={{ padding: 22 }}>
              <div className="font-head" style={{ fontSize: '1.35rem', letterSpacing: 2 }}>{c.title.toUpperCase()}</div>
              <div className="mono-label" style={{ marginTop: 4 }}>{c.period}</div>
              <p className="muted" style={{ lineHeight: 1.7, marginTop: 12, fontSize: '0.92rem' }}>{c.desc}</p>
              <div className="row wrap" style={{ gap: 8, marginTop: 6 }}>
                {c.tags.map((t) => <span key={t} className="pill">{t}</span>)}
              </div>
              <div className="divider" />
              <div className="grid cols-2" style={{ gap: 20 }}>
                <div>
                  <div className="mono-label" style={{ marginBottom: 8 }}>COLLAB PERKS</div>
                  <div className="stack" style={{ gap: 6 }}>
                    {c.perks.map((p) => (
                      <div key={p} className="row" style={{ gap: 8 }}>
                        <Icon name="check" size={13} color="var(--accent)" />
                        <span style={{ fontSize: '0.9rem' }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="stack">
                  <button className="btn primary block" onClick={() => notify(c.status === 'LIVE' ? 'OPENING EVENT...' : 'ADDED TO WISHLIST')}>
                    {c.status === 'LIVE' ? '▶ PLAY GAME' : '🔔 NOTIFY ME'}
                  </button>
                  <button className="btn ghost block" onClick={() => notify('PROFILE OPENED')}>VIEW PROFILE</button>
                  <button className="btn ghost block" onClick={() => notify('EVENT PAGE OPENED')}>VIEW EVENT</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="center mono-label" style={{ marginTop: 30 }}>© 2026 PLAYTREE · GOSTUDIOS — ALL RIGHTS RESERVED</div>
    </Page>
  );
}

/* =============== ACCOUNT =============== */
export function Account() {
  const { state, update, notify } = useApp();
  const nav = useNavigate();
  const [tag, setTag] = useState(state.player?.username || '');

  return (
    <Page page="account">
      <div className="chips" style={{ marginBottom: 18 }}>
        <button className="pill click on">SIGN IN</button>
        <button className="pill click" onClick={() => notify('SIGN UP FLOWS THROUGH THE SAME PASS')}>SIGN UP</button>
      </div>

      <div className="section-kicker" style={{ marginBottom: 12 }}>CHOOSE PLATFORM</div>
      <div className="grid cols-3" style={{ marginBottom: 28 }}>
        {PLATFORMS.map((p) => (
          <button key={p.id} className="list-row" style={{ cursor: 'pointer', textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}
            onClick={() => notify('CONTINUING WITH ' + p.name.toUpperCase())}>
            <div className="row" style={{ gap: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
              <div>
                <div className="font-head" style={{ letterSpacing: 1, color: p.color }}>{p.name}</div>
                <div className="mono-label" style={{ marginTop: 2 }}>{p.sub}</div>
              </div>
            </div>
            <span style={{ color: 'var(--muted-2)' }}>›</span>
          </button>
        ))}
      </div>

      <div className="panel glow" style={{ maxWidth: 640 }}>
        <div className="row" style={{ gap: 12, marginBottom: 14 }}>
          <span style={{ fontSize: '1.7rem' }}>🎮</span>
          <div>
            <div className="font-head" style={{ letterSpacing: 2 }}>GoConsole Account ↔ PlayTree</div>
            <div className="mono-label">POWERED BY GOCONSOLE</div>
          </div>
        </div>
        <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
          Link your GoConsole Account to PlayTree to sync progress, cosmetics, and cross-play across all your devices.
          One account — every island.
        </p>
        <label className="label" style={{ marginTop: 14 }}>GOCONSOLE GAMERTAG</label>
        <input className="input" value={tag} maxLength={24} onChange={(e) => setTag(e.target.value)} placeholder="Enter username..." />
        <button className="btn primary block" style={{ marginTop: 12 }} onClick={() => {
          if (tag.trim().length < 3) return notify('GAMERTAG MUST BE 3+ CHARACTERS');
          update((s) => ({ points: s.points + 100, player: { ...s.player, username: tag.trim() } }));
          notify('LINKED · +100 TREE-POINTS · CODE GOCONSOLE100');
        }}>LINK NOW</button>
        <div className="mono-label" style={{ marginTop: 10 }}>LINKING GRANTS 100 TREE-POINTS — REDEEM CODE GOCONSOLE100 IN THE REDEEM PAGE.</div>
      </div>

      <div className="row" style={{ justifyContent: 'center', gap: 18, marginTop: 26 }}>
        <button className="btn ghost sm" onClick={() => nav('/lobby')}>← LOBBY</button>
        <button className="btn ghost sm" onClick={() => nav('/')}>→ HOME</button>
      </div>
    </Page>
  );
}

/* =============== PARENTAL =============== */
export function Parental() {
  const { state, update, notify } = useApp();
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [entry, setEntry] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const create = () => {
    if (pin.length < 4) return notify('PIN MUST BE 4+ DIGITS');
    if (pin !== confirm) return notify('PINS DO NOT MATCH');
    update({ parentalPin: pin });
    setPin(''); setConfirm(''); notify('PARENT PIN CREATED');
  };

  if (!state.parentalPin) {
    return (
      <Page page="parental">
        <div className="panel glow" style={{ maxWidth: 520, margin: '30px auto' }}>
          <div className="row" style={{ gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: '1.8rem' }}>👨‍👩‍👧</span>
            <div>
              <div className="font-head" style={{ letterSpacing: 3 }}>Create Parent PIN</div>
              <div className="mono-label">PROTECT YOUR CHILD'S PLAYTREE</div>
            </div>
          </div>
          <p className="muted" style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>
            Choose a PIN only a parent knows. You'll use it to lock and unlock the Games, Studio and Friends areas.
          </p>
          <label className="label" style={{ marginTop: 16 }}>PIN</label>
          <input className="input font-mono" type="password" inputMode="numeric" maxLength={8} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" />
          <label className="label" style={{ marginTop: 12 }}>CONFIRM PIN</label>
          <input className="input font-mono" type="password" inputMode="numeric" maxLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ''))} placeholder="••••" />
          <button className="btn primary block" style={{ marginTop: 16 }} onClick={create}>🔒 CREATE PIN</button>
        </div>
      </Page>
    );
  }

  if (!unlocked) {
    return (
      <Page page="parental">
        <div className="panel glow" style={{ maxWidth: 460, margin: '30px auto' }}>
          <div className="section-kicker" style={{ marginBottom: 12 }}>ENTER PARENT PIN</div>
          <p className="muted">Enter the parent PIN to manage locked areas.</p>
          <input className="input font-mono" type="password" inputMode="numeric" maxLength={8} value={entry}
            onChange={(e) => setEntry(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && (entry === state.parentalPin ? (setUnlocked(true), notify('UNLOCKED')) : notify('INCORRECT PIN'))}
            style={{ marginTop: 12, textAlign: 'center', letterSpacing: 8, fontSize: '1.3rem' }} placeholder="••••" />
          <button className="btn primary block" style={{ marginTop: 14 }} onClick={() => entry === state.parentalPin ? (setUnlocked(true), notify('UNLOCKED')) : notify('INCORRECT PIN. ASK A PARENT.')}>
            UNLOCK
          </button>
          <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => { update({ parentalPin: null }); notify('PIN REMOVED'); }}>RESET PIN</button>
        </div>
      </Page>
    );
  }

  const locks = [
    ['Games', 'LOCK THE GAME LIBRARY BEHIND THE PIN'],
    ['Studio', 'LOCK GAME CREATION BEHIND THE PIN'],
    ['Friends', 'LOCK ADDING FRIENDS BEHIND THE PIN'],
    ['Chat', 'DISABLE PUBLIC CHAT ENTIRELY'],
  ];

  return (
    <Page page="parental">
      <div className="section-kicker">PARENT ZONE · UNLOCKED</div>
      <div className="page-title">PARENTAL <span className="hl">CONTROLS</span></div>
      <div className="grid cols-2" style={{ marginTop: 20 }}>
        {locks.map(([k, h]) => {
          const on = !!state.settings['lock' + k];
          return (
            <div key={k} className="list-row">
              <div>
                <div className="font-head" style={{ letterSpacing: 1.5 }}>{k}</div>
                <div className="mono-label" style={{ marginTop: 3 }}>{h}</div>
              </div>
              <button onClick={() => update((s) => ({ settings: { ...s.settings, ['lock' + k]: !s.settings['lock' + k] } }))}
                style={{ width: 46, height: 24, borderRadius: 14, border: '1px solid ' + (on ? 'var(--accent)' : 'rgba(255,255,255,0.2)'), background: on ? 'rgba(57,255,20,0.25)' : 'rgba(255,255,255,0.06)', position: 'relative', cursor: 'pointer', flex: 'none' }}>
                <span style={{ position: 'absolute', top: 2, left: on ? 24 : 2, width: 18, height: 18, borderRadius: '50%', background: on ? 'var(--accent)' : 'rgba(255,255,255,0.5)', transition: 'left .15s' }} />
              </button>
            </div>
          );
        })}
      </div>
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="section-kicker" style={{ marginBottom: 10 }}>DAILY ALLOWANCE</div>
        <div className="chips">
          {['1H', '2H', '4H', 'NO LIMIT'].map((t) => (
            <button key={t} className={'pill click' + ((state.settings.allowance || '4H') === t ? ' on' : '')}
              onClick={() => update((s) => ({ settings: { ...s.settings, allowance: t } }))}>{t}</button>
          ))}
        </div>
      </div>
      <button className="btn danger" style={{ marginTop: 20 }} onClick={() => { setUnlocked(false); notify('LOCKED'); }}>
        <Icon name="lock" size={12} /> LOCK NOW
      </button>
    </Page>
  );
}

/* =============== SUPPORT =============== */
export function Support() {
  const { state, update, notify } = useApp();
  const [tab, setTab] = useState('OPEN');
  const [q, setQ] = useState('');
  const [ticket, setTicket] = useState({ subject: '', body: '' });
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');

  const openTickets = state.tickets.filter((t) => t.status === 'OPEN');
  const filtered = tab === 'OPEN' ? openTickets : state.tickets.filter((t) => t.status === tab.toUpperCase());

  const submit = () => {
    if (!ticket.subject.trim()) return notify('ADD A SUBJECT');
    const id = 'GS-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    update((s) => ({ tickets: [{ id, subject: ticket.subject, body: ticket.body, status: 'PENDING', created: new Date().toLocaleDateString('en-GB') }, ...s.tickets] }));
    setTicket({ subject: '', body: '' }); setShowForm(false); notify('TICKET CREATED · ' + id);
  };

  const articles = HELP_ARTICLES.filter((a) => !q || a.q.toLowerCase().includes(q.toLowerCase()) || a.a.toLowerCase().includes(q.toLowerCase()));

  return (
    <Page page="support">
      <div className="section-kicker">PLAYTREE SUPPORT</div>
      <div className="page-title">SUPPORT <span className="hl-cyan">DASHBOARD</span></div>
      <div className="muted" style={{ marginBottom: 6 }}>Every reported issue in one place — review, resolve, warn, timeout or ban.</div>
      <div className="mono-label" style={{ marginBottom: 18 }}>VIEW ONLY — ONLY THE OFFICIAL PLAYTREE SUPPORT ACCOUNT CAN HANDLE REPORTS</div>

      <div className="row between wrap" style={{ marginBottom: 14 }}>
        <span className="pill" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>{openTickets.length} OPEN</span>
        <div className="chips">
          {['OPEN', 'ALL', 'PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED'].map((t) => (
            <button key={t} className={'pill click' + (tab === t ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel center" style={{ padding: 36, marginBottom: 22 }}>
          <div style={{ fontSize: '2rem' }}>🌳</div>
          <div className="mono-label" style={{ marginTop: 10 }}>NO OPEN REPORTS — ALL CLEAR</div>
        </div>
      ) : (
        <div className="stack" style={{ marginBottom: 22 }}>
          {filtered.map((t) => (
            <div key={t.id} className="list-row">
              <div>
                <div className="font-head" style={{ letterSpacing: 1 }}>{t.subject}</div>
                <div className="mono-label" style={{ marginTop: 3 }}>{t.id} · {t.created}</div>
                <div className="muted" style={{ fontSize: '0.86rem', marginTop: 4 }}>{t.body}</div>
              </div>
              <span className="tag low">{t.status}</span>
            </div>
          ))}
        </div>
      )}

      <div className="panel glow" style={{ marginBottom: 22 }}>
        <div className="section-kicker" style={{ marginBottom: 12 }}>GOSTUDIOS HELP CENTER</div>
        <div className="muted" style={{ fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 14 }}>
          The official PlayTree help desk — chat with the assistant, open a ticket with the human team, or browse the knowledge base.
        </div>
        <div className="grid cols-3">
          {[['Live Chat', 'ASK OUR AI ASSISTANT — IT READS THE HELP CENTER AND CAN FILE TICKETS', 'mic', () => notify('GOAI ASSISTANT ONLINE')],
            ['Submit a Ticket', 'BUGS, ACCOUNT ISSUES OR SAFETY REPORTS — THE HUMAN TEAM', 'flag', () => setShowForm(true)],
            ['Track a Ticket', 'ENTER YOUR GS- CODE TO SEE WHERE YOUR REQUEST STANDS', 'hash', () => notify('ENTER A GS- CODE BELOW')]].map(([t, d, ic, fn]) => (
            <button key={t} className="panel center" style={{ cursor: 'pointer' }} onClick={fn}>
              <Icon name={ic} size={20} color="var(--cyan)" />
              <div className="font-head" style={{ marginTop: 8, letterSpacing: 1 }}>{t}</div>
              <div className="mono-label" style={{ marginTop: 5, fontSize: '0.44rem', lineHeight: 1.7 }}>{d}</div>
            </button>
          ))}
        </div>

        <div className="row" style={{ marginTop: 16 }}>
          <input className="input" placeholder="Enter your GS- code to see where your request stands" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          <button className="btn" onClick={() => {
            const t = state.tickets.find((x) => x.id === code);
            notify(t ? `TICKET ${t.id} · ${t.status}` : 'NO TICKET FOUND');
          }}>TRACK</button>
        </div>

        {showForm && (
          <div className="stack" style={{ marginTop: 18 }}>
            <label className="label">SUBJECT</label>
            <input className="input" value={ticket.subject} maxLength={60} onChange={(e) => setTicket({ ...ticket, subject: e.target.value })} placeholder="Brief summary" />
            <label className="label">WHAT HAPPENED?</label>
            <textarea className="textarea" rows={3} value={ticket.body} maxLength={400} onChange={(e) => setTicket({ ...ticket, body: e.target.value })} placeholder="Describe what happened..." />
            <div className="row">
              <button className="btn primary" onClick={submit}>SUBMIT TICKET</button>
              <button className="btn ghost" onClick={() => setShowForm(false)}>CANCEL</button>
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="section-kicker" style={{ marginBottom: 12 }}>HELP ARTICLES</div>
        <input className="input" placeholder="Search help articles..." value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 14 }} />
        <div className="stack" style={{ gap: 8 }}>
          {articles.map((a) => (
            <div key={a.q} className="list-row">
              <div>
                <div style={{ fontSize: '0.95rem' }}>{a.q}</div>
                <div className="muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>{a.a}</div>
              </div>
              <Icon name="check" size={15} color="var(--accent)" />
            </div>
          ))}
          {articles.length === 0 && <div className="mono-label center" style={{ padding: 20 }}>NO ARTICLES MATCH.</div>}
        </div>
      </div>
    </Page>
  );
}

/* =============== MODERATION =============== */
export function Moderation() {
  const { state, update, notify } = useApp();
  const [reason, setReason] = useState('');
  const [player, setPlayer] = useState('');

  const report = () => {
    if (!player.trim()) return notify('NAME THE PLAYER');
    update((s) => ({ reports: [{ id: 'R-' + Math.random().toString(36).slice(2, 7).toUpperCase(), player, reason: reason || 'Inappropriate behavior', status: 'REVIEWING', at: new Date().toLocaleDateString('en-GB') }, ...s.reports] }));
    setPlayer(''); setReason(''); notify('REPORT SENT TO GOAI');
  };

  return (
    <Page page="moderation">
      <div className="section-kicker">SAFETY</div>
      <div className="page-title">GOAI <span className="hl">MODERATION</span></div>
      <div className="muted" style={{ marginBottom: 22 }}>Community safety console — reports, rules and enforcement.</div>

      <div className="grid cols-2" style={{ marginBottom: 24 }}>
        <div className="panel stack">
          <div className="section-kicker">HANDLE REPORT</div>
          <label className="label">PLAYER</label>
          <input className="input" value={player} onChange={(e) => setPlayer(e.target.value)} placeholder="Enter username..." />
          <label className="label">REASON</label>
          <select className="select" value={reason} onChange={(e) => setReason(e.target.value)}>
            {['', 'Inappropriate language', 'Harassment', 'Cheating / Hacking', 'Griefing / Team Killing', 'Inappropriate Content'].map((r) => <option key={r} value={r}>{r || 'Select a reason'}</option>)}
          </select>
          <button className="btn primary" onClick={report}><Icon name="flag" size={12} /> SUBMIT REPORT</button>
          <div className="mono-label">FALSE REPORTS MAY RESULT IN ACTION AGAINST YOUR ACCOUNT</div>
        </div>

        <div className="panel">
          <div className="section-kicker" style={{ marginBottom: 12 }}>YOUR REPORTS ({state.reports.length})</div>
          {state.reports.length === 0 ? (
            <div className="mono-label center" style={{ padding: 26 }}>NO REPORTS FILED.</div>
          ) : (
            <div className="stack" style={{ gap: 8 }}>
              {state.reports.map((r) => (
                <div key={r.id} className="list-row">
                  <div>
                    <div className="font-head" style={{ letterSpacing: 1 }}>{r.player}</div>
                    <div className="mono-label" style={{ marginTop: 3 }}>{r.id} · {r.reason}</div>
                  </div>
                  <span className="tag medium">{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid cols-2">
        {MOD_RULES.map((m) => (
          <div key={m.t} className="panel">
            <div className="row" style={{ gap: 10 }}>
              <Icon name="shield" size={17} color="var(--accent)" />
              <div className="font-head" style={{ letterSpacing: 1 }}>{m.t}</div>
            </div>
            <p className="muted" style={{ fontSize: '0.87rem', lineHeight: 1.7, marginTop: 10 }}>{m.d}</p>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="section-kicker" style={{ marginBottom: 10 }}>ENFORCEMENT LADDER</div>
        <div className="row wrap" style={{ gap: 10 }}>
          {['WARN', '24H TIMEOUT', '7 DAY SUSPENSION', 'PERMANENT BAN'].map((s, i) => (
            <div key={s} className="pill" style={{ background: ['#39ff1422', '#ffd60a22', '#ff7a0022', '#ff4d4d22'][i], borderColor: ['#39ff14', '#ffd60a', '#ff7a00', '#ff4d4d'][i], color: ['#39ff14', '#ffd60a', '#ff7a00', '#ff4d4d'][i] }}>{i + 1}. {s}</div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* =============== REDEEM =============== */
export function Redeem() {
  const { state, update, notify, addPoints } = useApp();
  const [code, setCode] = useState('');
  const CODES = {
    GOCONSOLE100: 100, PLAYTREE2026: 200, SEASON2: 350, TREEHUGGER: 150, GOSTUDIOS: 250, BIRTHDAY: 500,
  };

  const redeem = () => {
    const c = code.trim().toUpperCase();
    if (!c) return notify('ENTER A CODE');
    if (state.redeemed.includes(c)) return notify('CODE ALREADY REDEEMED ON THIS ACCOUNT.');
    const val = CODES[c];
    if (!val) return notify('INVALID OR EXPIRED CODE. CHECK SPELLING AND TRY AGAIN.');
    update((s) => ({ points: s.points + val, redeemed: [...s.redeemed, c] }));
    setCode(''); notify(`+${val} TREE-POINTS`);
  };

  return (
    <Page page="redeem">
      <div className="center" style={{ maxWidth: 520, margin: '20px auto' }}>
        <div className="section-kicker b" style={{ justifyContent: 'center' }}>GIFT &amp; REWARDS</div>
        <div className="page-title">REDEEM <span className="hl-gold">CODES</span></div>
        <p className="muted">Enter a code to unlock skins, Tree-Points, and more.</p>
        <div className="row" style={{ marginTop: 18 }}>
          <input className="input font-mono" style={{ letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center', fontSize: '1.1rem' }}
            value={code} maxLength={20} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" />
          <button className="btn gold" onClick={redeem}>REDEEM</button>
        </div>
        <div className="row" style={{ justifyContent: 'center', marginTop: 16, gap: 14 }}>
          <span className="pill">🌳 {state.points} TREE-POINTS</span>
          <span className="pill">{state.redeemed.length} CODES USED</span>
        </div>
        <div className="panel" style={{ marginTop: 24, textAlign: 'left' }}>
          <div className="mono-label" style={{ marginBottom: 8 }}>TRY THESE DEMO CODES</div>
          <div className="chips">
            {Object.keys(CODES).map((c) => (
              <button key={c} className="pill click" onClick={() => setCode(c)}>{c} · +{CODES[c]}</button>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* =============== LEGAL =============== */
export function Legal({ kind }) {
  const isTerms = kind === 'terms';
  const sections = isTerms ? [
    ['Accepting these Terms', 'By creating a PlayTree account or playing any PlayTree game you agree to these terms. If you are under 18 you confirm a parent or guardian has read them with you.'],
    ['Your Account', 'One player name per account. Keep your parent PIN and sign-in details secret. You are responsible for anything that happens on your account.'],
    ['Content You Create', 'Studio games, clips, screenshots and group posts you publish belong to you, but you grant PlayTree a licence to host, show and promote them inside the service.'],
    ['Fair Play', 'Cheating, hacking, exploiting bugs for gain and harassment are not allowed. GoAI may warn, timeout, suspend or ban accounts that break these rules.'],
    ['Purchases & Tree-Points', 'Tree-Points are a virtual balance with no cash value and cannot be exchanged for money. Cosmetic items are licensed to you, not sold.'],
    ['Ending Access', 'We may suspend or close accounts that seriously or repeatedly break these terms, with notice where it is safe to give it.'],
  ] : [
    ['Information We Collect', 'PlayTree stores your player name, demo profile, game progress, cosmetics and settings locally on your device. Chat messages pass through the GoAI filter.'],
    ['Age Verification', 'The optional GoAI face scan estimates an age group on-device. Images are processed securely and never stored or uploaded.'],
    ['Local Storage & Cookies', 'Progress, preferences and Tree-Point balances are saved with local storage so the game works offline. Clearing app data resets your demo profile.'],
    ['Friends data', 'Your friends list, invites, and group memberships you create follow your account across devices you sign in on.'],
    ['Content you upload', 'Studio games, clips, and screenshots you publish are stored so other players can play them.'],
    ["Kids' Privacy & Parental Controls", 'Kids accounts default to filtered chat and a 2 hour screen time limit. Parents can set a PIN to lock Games, Studio and Friends.'],
    ['Changes to This Policy', 'We will post any changes here and, for material changes, notify you in the app before they take effect.'],
  ];

  return (
    <Page page={isTerms ? 'terms' : 'privacy'}>
      <div className="section-kicker">— LAST UPDATED: 04/10/2026</div>
      <div className="page-title">{isTerms ? 'TERMS OF' : 'PRIVACY'} <span className="hl">{isTerms ? 'SERVICE' : 'POLICY'}</span></div>
      <div className="stack" style={{ maxWidth: 820, marginTop: 22, gap: 14 }}>
        {sections.map(([t, d], i) => (
          <div key={t} className="panel">
            <div className="row" style={{ gap: 12 }}>
              <span className="font-head" style={{ color: 'var(--accent)', fontSize: '1.1rem', minWidth: 34 }}>{String(i + 1).padStart(2, '0')}</span>
              <span className="font-head" style={{ letterSpacing: 1.5, fontSize: '1.08rem' }}>{t}</span>
            </div>
            <p className="muted" style={{ lineHeight: 1.8, marginTop: 10, fontSize: '0.92rem' }}>{d}</p>
          </div>
        ))}
      </div>
      <div className="center mono-label" style={{ marginTop: 26 }}>© 2026 PLAYTREE · GOSTUDIOS — ALL RIGHTS RESERVED</div>
    </Page>
  );
}

/* =============== CHAT =============== */
export function Chat() {
  const { state, notify } = useApp();
  const [msgs, setMsgs] = useState([
    { id: 1, from: 'GoAI', bot: true, text: 'GoAI is monitoring chat. Keep it kind and safe.' },
    { id: 2, from: 'PlayTree', text: 'Anyone want to squad up?' },
    { id: 3, from: 'FrostPhantom53', text: 'dropping at crystal canopy in 2' },
  ]);
  const [text, setText] = useState('');
  const BAD = ['bad', 'stupid', 'hate', 'idiot'];

  const send = () => {
    const t = text.trim();
    if (!t) return;
    if (BAD.some((w) => t.toLowerCase().includes(w))) return notify('BLOCKED BY GOAI CHAT FILTER');
    setMsgs((m) => [...m, { id: Date.now(), from: state.player?.username || 'YOU', text: t, me: true }]);
    setText('');
    setTimeout(() => setMsgs((m) => [...m, { id: Date.now() + 1, from: 'GoAI', bot: true, text: 'Message relayed to your squad. 🌳' }]), 700);
  };

  return (
    <Page page="chat">
      <div className="panel glow" style={{ maxWidth: 760, margin: '10px auto', display: 'flex', flexDirection: 'column', height: '62vh' }}>
        <div className="row between" style={{ borderBottom: '1px solid var(--line-soft)', paddingBottom: 12 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>💬</span>
            <div>
              <div className="font-head" style={{ letterSpacing: 2 }}>SQUAD LIVE CHAT</div>
              <div className="mono-label">GOAI FILTER · {msgs.length} MESSAGES</div>
            </div>
          </div>
          <span className="tag low">ONLINE</span>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '14px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m) => (
            <div key={m.id} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
              <div className="mono-label" style={{ marginBottom: 3, textAlign: m.me ? 'right' : 'left', color: m.bot ? 'var(--cyan)' : 'var(--accent)' }}>
                {m.from.toUpperCase()}{m.bot ? ' 🤖' : ''}
              </div>
              <div style={{ background: m.me ? 'rgba(57,255,20,0.12)' : m.bot ? 'rgba(0,191,255,0.1)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (m.me ? 'rgba(57,255,20,0.35)' : m.bot ? 'rgba(0,191,255,0.3)' : 'var(--line-soft)'), padding: '9px 13px', borderRadius: 10, fontSize: '0.93rem', lineHeight: 1.5 }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="row" style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 12 }}>
          <input className="input" value={text} maxLength={180} placeholder="Type a message..." onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
          <button className="btn primary" onClick={send}><Icon name="send" size={13} /></button>
        </div>
        <div className="mono-label center" style={{ marginTop: 8 }}>GOAI IS MONITORING CHAT.</div>
      </div>
    </Page>
  );
}

/* =============== 404 =============== */
export function NotFound() {
  const nav = useNavigate();
  return (
    <Page page="home" bare>
      <div className="center" style={{ padding: '90px 0' }}>
        <div style={{ fontSize: '4rem' }}>🌳</div>
        <div className="page-title">404 · <span className="hl">LOST IN THE ROOTS</span></div>
        <p className="muted">That page grew away from the tree.</p>
        <button className="btn primary" style={{ marginTop: 16 }} onClick={() => nav('/')}>BACK TO PLAYTREE</button>
      </div>
    </Page>
  );
}
