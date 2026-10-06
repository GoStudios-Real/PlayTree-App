import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store.jsx';
import { Page } from '../layout.jsx';
import Icon from '../icons.jsx';
import { LEADERBOARD_ROWS } from '../data.js';

/* =============== PLAYER PROFILE (/player/:username) =============== */
export function PlayerProfile() {
  const { username } = useParams();
  const nav = useNavigate();
  const { state, update, notify } = useApp();
  const name = decodeURIComponent(username || '');

  const profile = useMemo(() => {
    if (!name) return null;
    const me = state.player?.username || '';
    const isMe = me.toLowerCase() === name.toLowerCase();
    if (isMe) {
      const kd = state.stats.kills ? +(state.stats.kills / Math.max(1, state.stats.matches)).toFixed(2) : 0;
      return {
        name: me, display: state.player.displayName || me, icon: '🌳', av: '#39ff14',
        xp: state.xp, wins: state.stats.wins, kills: state.stats.kills, kd, played: state.stats.matches,
        online: true, me: true, guest: false, bio: 'Playing on PlayTree — dropping into matches and building in Studio.',
      };
    }
    const lb = LEADERBOARD_ROWS.find((r) => r.name.toLowerCase() === name.toLowerCase());
    const friend = state.friends.find((f) => f.name.toLowerCase() === name.toLowerCase());
    if (lb) {
      return {
        ...lb, display: lb.name, me: false, guest: true,
        online: !!friend?.online || lb.xp > 0 && !friend,
        bio: lb.icon + ' Here for the wins. Season grind never stops.',
        friend: !!friend,
      };
    }
    if (friend) {
      return {
        name: friend.name, display: friend.name, icon: '🎮', av: '#00bfff',
        xp: 0, wins: 0, kills: 0, kd: 0, played: 0,
        online: friend.online, me: false, guest: true, friend: true,
        bio: 'Squadmate since ' + friend.since + '.',
      };
    }
    return null;
  }, [name, state]);

  if (!profile) {
    return (
      <Page page="leaderboard" title={`${name || 'PLAYER'} ON PLAYTREE`} sub="PLAYER PROFILE">
        <div className="panel center" style={{ padding: 44, maxWidth: 560, margin: '40px auto' }}>
          <div style={{ fontSize: '2.4rem', opacity: 0.5 }}>🔍</div>
          <div className="font-head" style={{ fontSize: '1.3rem', marginTop: 12, letterSpacing: 2 }}>PLAYER NOT FOUND</div>
          <div className="muted" style={{ marginTop: 8, fontSize: '0.9rem' }}>No player named “{name}” lives on PlayTree yet.</div>
          <button className="btn primary" style={{ marginTop: 18 }} onClick={() => nav('/leaderboard')}>BACK TO LEADERBOARD</button>
        </div>
      </Page>
    );
  }

  const p = profile;
  const isFriend = state.friends.some((f) => f.name.toLowerCase() === p.name.toLowerCase());

  const addFriend = () => {
    if (isFriend) return;
    update((s) => ({ friends: [...s.friends, { id: Date.now(), name: p.name, online: p.online, since: new Date().toLocaleDateString('en-GB') }] }));
    notify('FRIEND ADDED');
  };

  return (
    <Page page="leaderboard" title={`${p.name} ON PLAYTREE`} sub={p.me ? 'YOUR PUBLIC PROFILE' : 'PLAYER PROFILE'}>
      <div className="row between wrap" style={{ marginBottom: 18 }}>
        <div>
          <div className="section-kicker">— PLAYER CARD</div>
          <div className="page-title">{(p.display || p.name).toUpperCase()}</div>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <span className={'pill' + (p.online ? ' on' : '')} style={{ borderColor: p.online ? 'var(--accent)' : 'rgba(255,255,255,0.18)' }}>
            {p.online ? '● PLAYING NOW' : '○ OFFLINE'}
          </span>
          {p.guest && <span className="pill" style={{ borderColor: 'rgba(0,191,255,0.5)', color: 'var(--cyan)' }}>GUEST</span>}
          {p.banned && <span className="pill" style={{ borderColor: 'rgba(255,34,34,0.5)', color: '#ff5b5b' }}>BANNED</span>}
          {p.suspended && <span className="pill" style={{ borderColor: 'rgba(255,34,34,0.5)', color: '#ff5b5b' }}>SUSPENDED</span>}
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <div className="row" style={{ gap: 18 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: p.online ? 'rgba(57,255,20,0.1)' : 'rgba(0,191,255,0.08)', border: `2px solid ${p.online ? 'var(--accent)' : 'rgba(0,191,255,0.5)'}`, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-head)', fontSize: '1.7rem', flexShrink: 0 }}>
            {p.icon && p.icon !== '🌳' ? p.icon : p.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="font-head" style={{ fontSize: '1.5rem', letterSpacing: 2 }}>{p.display || p.name}</div>
            <div className="mono-label" style={{ marginTop: 4 }}>@{p.name}{p.me ? ' · YOU' : ''}</div>
            <div className="muted" style={{ marginTop: 8, fontSize: '0.9rem', lineHeight: 1.7 }}>{p.bio}</div>
          </div>
        </div>

        <div className="grid cols-5" style={{ marginTop: 20 }}>
          {[['XP', (p.xp || 0).toLocaleString(), 'var(--gold)'], ['WINS', p.wins, '#fff'], ['KILLS', p.kills, '#fff'], ['K/D', p.kd, '#fff'], ['PLAYED', p.played, '#fff']].map(([k, v, c]) => (
            <div key={k} className="center" style={{ padding: '10px 4px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6 }}>
              <div className="font-head" style={{ fontSize: '1.2rem', color: c }}>{v}</div>
              <div className="mono-label" style={{ fontSize: '0.42rem', marginTop: 3 }}>{k}</div>
            </div>
          ))}
        </div>

        {!p.me && (
          <div className="row" style={{ gap: 10, marginTop: 20 }}>
            {!isFriend && <button className="btn primary" onClick={addFriend}><Icon name="plus" size={13} /> ADD FRIEND</button>}
            {isFriend && <button className="btn" onClick={() => nav('/chat')}><Icon name="share" size={12} /> MESSAGE</button>}
            <button className="btn ghost" onClick={() => notify('REPORT SENT — GOAI WILL REVIEW')}><Icon name="flag" size={12} /> REPORT</button>
          </div>
        )}
      </div>

      <div className="panel center">
        <div className="mono-label">© 2026 PLAYTREE™ · GOSTUDIOS — ALL RIGHTS RESERVED</div>
      </div>
    </Page>
  );
}

/* =============== GROUP DETAIL (/groups/:groupId) =============== */
export function GroupDetail() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const { state, update, notify } = useApp();

  const seed = { id: 'g1', name: 'PLAYTREE', desc: 'HI THERE WELCOME', members: 2, owner: 'GUEST2050', icon: '🌳' };
  const group = useMemo(() => [...state.groups, ...seed ? [seed] : []].find((x) => String(x.id) === String(groupId)), [state.groups, groupId]);

  const me = state.player?.username || 'YOU';
  const joined = !!group && (state.joinedGroups || []).some((id) => String(id) === String(group.id));

  const members = useMemo(() => {
    if (!group) return [];
    const pool = [group.owner, ...LEADERBOARD_ROWS.map((r) => r.name), ...state.friends.map((f) => f.name), me];
    return [...new Set(pool)].slice(0, 12);
  }, [group, state.friends, me]);

  if (!group) {
    return (
      <Page page="groups" title="GROUP NOT FOUND" sub="PLAYTREE GROUPS">
        <div className="panel center" style={{ padding: 44, maxWidth: 560, margin: '40px auto' }}>
          <div style={{ fontSize: '2.4rem', opacity: 0.5 }}>🛡️</div>
          <div className="font-head" style={{ fontSize: '1.3rem', marginTop: 12, letterSpacing: 2 }}>GROUP NOT FOUND</div>
          <button className="btn primary" style={{ marginTop: 18 }} onClick={() => nav('/groups')}>BACK TO GROUPS</button>
        </div>
      </Page>
    );
  }

  const isOwner = group.owner.toLowerCase() === me.toLowerCase();

  const toggleJoin = () => {
    if (isOwner) return notify('YOU OWN THIS GROUP');
    update((s) => {
      const cur = s.joinedGroups || [];
      const has = cur.some((id) => String(id) === String(group.id));
      return { joinedGroups: has ? cur.filter((id) => String(id) !== String(group.id)) : [...cur, group.id] };
    });
    notify(joined ? 'LEFT ' + group.name : 'JOINED ' + group.name);
  };

  return (
    <Page page="groups" title={`${group.name} ON PLAYTREE`} sub="GROUP">
      <div className="row between wrap" style={{ marginBottom: 18 }}>
        <div>
          <div className="section-kicker">— GROUP</div>
          <div className="page-title">{group.name}</div>
        </div>
        <span className="pill" style={{ borderColor: 'var(--accent)' }}>{group.members} {group.members === 1 ? 'MEMBER' : 'MEMBERS'}</span>
      </div>

      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <div className="panel">
          <div className="row" style={{ gap: 14 }}>
            <span style={{ fontSize: '2.2rem' }}>{group.icon}</span>
            <div>
              <div className="font-head" style={{ fontSize: '1.25rem', letterSpacing: 2 }}>{group.name}</div>
              <div className="muted" style={{ fontSize: '0.88rem', marginTop: 4 }}>{group.desc || 'No description yet.'}</div>
            </div>
          </div>
          <div className="mono-label" style={{ marginTop: 16 }}>
            OWNER:{' '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => nav(`/player/${encodeURIComponent(group.owner)}`)}>{group.owner}</span>
          </div>
          <div className="row" style={{ gap: 10, marginTop: 18 }}>
            {!isOwner && (
              <button className="btn primary" style={{ flex: 1 }} onClick={toggleJoin}>
                {joined ? 'LEAVE' : 'JOIN'}
              </button>
            )}
            <button className="btn ghost" onClick={() => nav('/groups')}>BACK TO GROUPS</button>
          </div>
          {!isOwner && !joined && <div className="mono-label" style={{ marginTop: 10 }}>YOU'RE OUTSIDE THIS GROUP</div>}
        </div>

        <div className="panel">
          <div className="mono-label" style={{ marginBottom: 12 }}>MEMBERS · {group.members}</div>
          <div className="chips">
            {members.map((k) => (
              <button key={k} className="pill click" onClick={() => nav(`/player/${encodeURIComponent(k)}`)}>
                {k.toLowerCase() === me.toLowerCase() ? `${k} (you)` : k}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
