import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Icon, { TreeLogo } from './icons.jsx';
import { NAV, BANNERS, TOP_NAV, TOP_NAV_ROUTES } from './data.js';
import { useApp } from './store.jsx';

export function Rail() {
  const loc = useLocation();
  return (
    <>
      <aside className="rail">
        <NavLink to="/" className="rail-logo" aria-label="PlayTree home"><TreeLogo size={26} /></NavLink>
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => 'rail-item' + (isActive || (n.to === '/' && loc.pathname === '/') ? ' active' : '')}>
            <Icon name={n.icon} size={19} />
            <span>{n.label}</span>
          </NavLink>
        ))}
        <div className="rail-spacer" />
        <div className="rail-bottom">
          <NavLink to="/settings" className={({ isActive }) => 'rail-item' + (isActive ? ' active' : '')}>
            <Icon name="settings" size={19} /><span>SETTINGS</span>
          </NavLink>
        </div>
      </aside>

      <nav className="bottom-nav">
        {NAV.slice(0, 5).map((n) => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => 'rail-item' + (isActive ? ' active' : '')}>
            <Icon name={n.icon} size={19} /><span>{n.label}</span>
          </NavLink>
        ))}
        <NavLink to="/settings" className={({ isActive }) => 'rail-item' + (isActive ? ' active' : '')}>
          <Icon name="settings" size={19} /><span>MORE</span>
        </NavLink>
      </nav>
    </>
  );
}

export function TopNav() {
  const nav = useNavigate();
  const loc = useLocation();
  const { state } = useApp();
  const activeLabel = Object.entries(TOP_NAV_ROUTES).find(([, r]) => r.split('#')[0] === loc.pathname)?.[0];

  return (
    <header className="topnav">
      <div className="row" style={{ gap: 16 }}>
        <div className="row" style={{ gap: 9, cursor: 'pointer' }} onClick={() => nav('/')}>
          <span className="brand-chip" style={{ width: 30, height: 30 }}><TreeLogo size={20} /></span>
          <span className="wordmark" style={{ fontSize: '1.15rem', letterSpacing: 5 }}>PlayTree</span>
        </div>
        <nav className="topnav-links">
          {TOP_NAV.map((t) => (
            <button
              key={t}
              className={'topnav-link' + (activeLabel === t ? ' on' : '')}
              onClick={() => nav(TOP_NAV_ROUTES[t] || '/')}
            >{t}</button>
          ))}
        </nav>
      </div>
      <div className="row" style={{ gap: 12 }}>
        <span className="mono-label" style={{ letterSpacing: 3 }}>{state.points} TP</span>
        <button className="play-cta" onClick={() => nav('/lobby')}>PLAY FREE</button>
      </div>
    </header>
  );
}

export function Banner({ page }) {
  const b = BANNERS[page] || BANNERS.home;
  return (
    <div className="banner" style={{ background: `radial-gradient(ellipse at 78% 40%, ${b.c1}, transparent 62%), linear-gradient(120deg, ${b.c2}, ${b.c1})` }}>
      <div style={{ position: 'absolute', right: 40, top: -14, fontSize: 118, opacity: 0.16, transform: 'rotate(-8deg)' }}>{b.icon}</div>
      <div className="banner-inner">
        <span className="banner-tag">{b.tag}</span>
        <h1>{b.title}</h1>
        <div className="sub">{b.sub}</div>
      </div>
    </div>
  );
}

export function BrandBar({ page }) {
  const label = (BANNERS[page] || BANNERS.home).title;
  return (
    <div className="brandbar">
      <div className="left">
        <span className="brand-chip"><TreeLogo size={20} /></span>
        <span className="name">PlayTree</span>
      </div>
      <span className="page-name">{label}</span>
    </div>
  );
}

export function Page({ page, children, bare }) {
  const nav = useNavigate();
  return (
    <div className="page">
      {!bare && <Banner page={page} />}
      {!bare && <BrandBar page={page} />}
      {children}
      <div className="back-btn">
        <button className="btn ghost sm" onClick={() => nav(-1)}><Icon name="back" size={13} /> BACK</button>
      </div>
    </div>
  );
}

export function Stars() {
  const dots = React.useMemo(() => Array.from({ length: 46 }, (_, i) => ({
    x: (i * 37.7) % 100, y: (i * 61.3) % 100, r: (i % 3) + 1, o: 0.15 + ((i * 13) % 40) / 100,
  })), []);
  return (
    <svg className="stars" viewBox="0 0 100 100" preserveAspectRatio="none">
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r * 0.04} fill="#39ff14" opacity={d.o} />)}
    </svg>
  );
}
