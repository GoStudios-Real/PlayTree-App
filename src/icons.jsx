import React from 'react';

const paths = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4 3.6-6 8-6s8 2 8 6',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 21c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16.5 11.5a3 3 0 1 0 0-6M18 15.5c2.5.6 4 2.4 4 5.5',
  boxes: 'M12 3 4 7v10l8 4 8-4V7l-8-4ZM4 7l8 4 8-4M12 11v10',
  gamepad: 'M6 9h12a4 4 0 0 1 4 4l-.6 4.2A2.8 2.8 0 0 1 17 19.4L15.5 17h-7L7 19.4a2.8 2.8 0 0 1-4.4-2.2L2 13a4 4 0 0 1 4-4Zm1.5 3v3M6 13.5h3M15.5 12.5h.01M18 14.5h.01',
  box: 'M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7ZM3 8.5 12 13m0 0 9-4.5M12 13v7',
  store: 'M4 8h16l-1 12H5L4 8Zm4 0V6a4 4 0 0 1 8 0v2',
  clapper: 'M4 9h16v11H4V9Zm0-3 14-3 1 3M9 6.5 10 3.5M14 5.5l1-3',
  trophy: 'M7 4h10v5a5 5 0 0 1-10 0V4Zm-3 1h3v3a3 3 0 0 1-3-3Zm16 0h-3v3a3 3 0 0 0 3-3ZM12 14v4m-4 3h8',
  glasses: 'M4 9a3 3 0 1 0 6 0 3 3 0 1 0-6 0Zm10 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0Zm-4 1h4M4 9v3a3 3 0 0 0 6 0m10-3v3a3 3 0 0 1-6 0',
  shield: 'M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Zm-3 9 2.2 2.2L15.5 10',
  life: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4v8m-4-4h8',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-3.5-.9-1.6 1.4-2.3-2-2-2.3 1.4L14.5 5 14 3h-4l-.5 2-1.7 1.1-2.3-1.4-2 2 1.4 2.3L4 12l.9 1.6-1.4 2.3 2 2 2.3-1.4L9.5 19l.5 2h4l.5-2 1.7-1.1 2.3 1.4 2-2-1.4-2.3L20 12Z',
  back: 'M11 5 4 12l7 7m-7-7h16',
  play: 'M7 4.5 19 12 7 19.5v-15Z',
  close: 'M6 6l12 12M18 6 6 18',
  heart: 'M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7C19 15.6 12 20 12 20Z',
  star: 'm12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.5l1.1-6L3.4 9.3l6-.8L12 3Z',
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
  check: 'M4 12.5 9.5 18 20 6.5',
  plus: 'M12 5v14M5 12h14',
  qr: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 3h3m3 0h-3m0 3h3m-6 0h3',
  camera: 'M4 8h3l1.5-2h7L17 8h3v11H4V8Zm8 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3.5 2',
  lock: 'M6 11h12v9H6v-9Zm3 0V7.5a3 3 0 0 1 6 0V11',
  logout: 'M15 4h4v16h-4M11 8l-4 4 4 4m-4-4h9',
  flag: 'M5 21V4m0 1h12l-2.5 3.5L17 12H5',
  chart: 'M4 20V9m5 11V4m5 16v-7m5 7V7',
  sword: 'M4 20 14 10m0 0 6-6-2 6-4 4m0 0 3 3m-3-3-4 4',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 11 .9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9L19 14Z',
  send: 'M4 12 20 4l-6 16-2.5-6.5L4 12Z',
  edit: 'M4 20h4L20 8l-4-4L4 16v4Zm11-13 4 4',
  trash: 'M5 7h14M10 7V5h4v2m-7 0 1 13h10l1-13',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  download: 'M12 4v10m0 0 4-4m-4 4-4-4M4 19h16',
  share: 'M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm13-7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 14a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM7.5 10.8l9-4.1m-9 6.5 9 4.1',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5',
  hash: 'M9 3 7 21M17 3l-2 18M4 8.5h16M3 15.5h16',
  pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  mic: 'M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm6-3a6 6 0 0 1-12 0m6 6v3m-4 0h8',
  bell: 'M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 9a2 2 0 0 0 4 0',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z',
};

export default function Icon({ name, size = 18, color, style, strokeWidth = 1.7 }) {
  const d = paths[name] || paths.star;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || 'currentColor'} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function TreeLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="tl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#39ff14" />
          <stop offset="100%" stopColor="#00e5c0" />
        </linearGradient>
      </defs>
      <path d="M32 6 44 24H37l9 14H35v8h-6v-8H18l9-14h-7L32 6Z" fill="url(#tl)" />
      <rect x="29" y="44" width="6" height="14" rx="2" fill="url(#tl)" />
    </svg>
  );
}
