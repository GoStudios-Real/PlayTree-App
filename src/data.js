export const C = {
  green: '#39ff14',
  teal: '#00e5c0',
  cyan: '#00bfff',
  gold: '#ffd60a',
  purple: '#a78bfa',
  red: '#ff4d4d',
};

export const SEASON = {
  chapter: 'CHAPTER 1',
  season: 'SEASON 2',
  name: 'THE VOID AWAKENS',
};

export const NAV = [
  { to: '/', label: 'HOME', icon: 'home' },
  { to: '/profile', label: 'PROFILE', icon: 'user' },
  { to: '/friends', label: 'FRIENDS', icon: 'users' },
  { to: '/groups', label: 'GROUPS', icon: 'boxes' },
  { to: '/games', label: 'GAMES', icon: 'gamepad' },
  { to: '/locker', label: 'LOCKER', icon: 'box' },
  { to: '/store', label: 'STORE', icon: 'store' },
  { to: '/videos', label: 'VIDEOS', icon: 'clapper' },
  { to: '/leaderboard', label: 'RANKS', icon: 'trophy' },
  { to: '/reality', label: 'REALITY', icon: 'glasses' },
  { to: '/moderation', label: 'MOD', icon: 'shield' },
  { to: '/support', label: 'SUPPORT', icon: 'life' },
];

export const TOP_NAV = [
  'FEATURES', 'ENEMIES', 'ARSENAL', 'MAP', 'BATTLE PASS', 'GAMES', 'STUDIO',
  'COLLABS', 'LOBBY', 'BUS', 'FRIENDS', 'LOCKER', 'REALITY', 'RANKS',
  'PROFILE', 'ACCOUNT', 'SAFETY',
];

export const TOP_NAV_ROUTES = {
  FEATURES: '/#features',
  ENEMIES: '/battle-bus',
  ARSENAL: '/locker',
  MAP: '/battle-bus',
  'BATTLE PASS': '/store',
  GAMES: '/games',
  STUDIO: '/studio',
  COLLABS: '/collaborations',
  LOBBY: '/lobby',
  BUS: '/battle-bus',
  FRIENDS: '/friends',
  LOCKER: '/locker',
  REALITY: '/reality',
  RANKS: '/leaderboard',
  PROFILE: '/profile',
  ACCOUNT: '/account',
  SAFETY: '/parental-controls',
};

export const BANNERS = {
  home: { tag: 'CHAPTER 1 · SEASON 2', title: 'THE ISLAND AWAITS', sub: 'PLAY · BUILD · SURVIVE', c1: '#0a2a18', c2: '#03150d', icon: '🌳' },
  games: { tag: 'PLAYTREE HUB', title: 'GAME LIBRARY', sub: 'COMMUNITY-MADE WORLDS · PLAY, LIKE, INSTALL', c1: '#1a0b2e', c2: '#04121a', icon: '🎮' },
  lobby: { tag: 'PLAYTREE HUB', title: 'THE LOBBY', sub: 'SQUAD UP · CHOOSE YOUR DROP · JUMP IN', c1: '#0a2430', c2: '#03101a', icon: '🛰️' },
  store: { tag: 'COSMETICS', title: 'PLAYTREE STORE', sub: 'AVATARS · THEMES · FRAMES', c1: '#0d2b1c', c2: '#04120b', icon: '🛒' },
  locker: { tag: 'COSMETICS', title: 'THE LOCKER', sub: 'SKINS · EMOTES · REWARDS VAULT', c1: '#132a0c', c2: '#06120a', icon: '🎒' },
  leaderboard: { tag: 'PLAYTREE HUB', title: 'LEADERBOARD', sub: 'SEASON RANKINGS · EVERY MODE', c1: '#2a2405', c2: '#120e02', icon: '🏆' },
  studio: { tag: 'CREATE', title: 'PLAYTREE STUDIO', sub: 'BUILD IT · TEST IT · PUBLISH IT', c1: '#0a1f3a', c2: '#030d1c', icon: '🛠️' },
  battlebus: { tag: 'DEPLOY', title: 'BATTLE BUS', sub: 'ROUTE MAPPED · STORM INCOMING', c1: '#1a0b2e', c2: '#0a0318', icon: '🚌' },
  profile: { tag: 'PLAYER', title: 'PROFILE', sub: 'IDENTITY · STATS · BADGES', c1: '#0a2a24', c2: '#03120f', icon: '👤' },
  settings: { tag: 'CONTROL', title: 'SETTINGS', sub: 'SAFETY · APPEARANCE · DEVICE', c1: '#101a26', c2: '#050a10', icon: '⚙️' },
  reality: { tag: 'AUGMENTED', title: 'PLAYTREE REALITY', sub: 'AR COMBAT · THE VOID IN YOUR WORLD', c1: '#062b2b', c2: '#02100f', icon: '🥽' },
  friends: { tag: 'PLAYTREE HUB', title: 'FRIENDS', sub: 'YOUR CREW · WHO IS ONLINE NOW', c1: '#0a2a30', c2: '#031214', icon: '👥' },
  groups: { tag: 'COMMUNITY', title: 'GROUPS', sub: 'SQUADS · POSTS · TOGETHER', c1: '#1d0b2e', c2: '#0a0314', icon: '🛡️' },
  videos: { tag: 'MEDIA', title: 'PLAYTREE VIDEOS', sub: 'CLIPS · SCREENSHARES · HIGHLIGHTS', c1: '#26071a', c2: '#10020a', icon: '🎬' },
  collaborations: { tag: 'PARTNERS', title: 'COLLABORATIONS', sub: 'EVENTS · CROSSOVERS · ALLIANCES', c1: '#0a2a1e', c2: '#04120d', icon: '🤝' },
  account: { tag: 'ACCESS', title: 'ACCOUNT', sub: 'SIGN IN · LINK YOUR PLATFORMS', c1: '#0b1c30', c2: '#040b14', icon: '🔐' },
  parental: { tag: 'PARENT ZONE', title: 'PARENTAL CONTROLS', sub: 'PIN · LIMITS · SAFETY', c1: '#2b1a05', c2: '#120a02', icon: '👨‍👩‍👧' },
  moderation: { tag: 'SAFETY', title: 'MODERATION', sub: 'GOAI · REPORTS · RULES', c1: '#2b0a0a', c2: '#120303', icon: '🛡️' },
  support: { tag: 'HELP', title: 'SUPPORT', sub: 'TICKETS · ARTICLES · LIVE CHAT', c1: '#0a1f30', c2: '#030c14', icon: '🛟' },
  redeem: { tag: 'REWARDS', title: 'REDEEM', sub: 'ENTER CODES · CLAIM LOOT', c1: '#2b2405', c2: '#120f02', icon: '🎁' },
  terms: { tag: 'LEGAL', title: 'TERMS OF SERVICE', sub: 'THE RULES OF THE TREEHOUSE', c1: '#0e141a', c2: '#05080b', icon: '📜' },
  privacy: { tag: 'LEGAL', title: 'PRIVACY POLICY', sub: 'HOW PLAYTREE HANDLES YOUR DATA', c1: '#0e141a', c2: '#05080b', icon: '🔒' },
  chat: { tag: 'SOCIAL', title: 'LIVE CHAT', sub: 'SQUAD COMMS · GOAI FILTERED', c1: '#0a2a30', c2: '#031214', icon: '💬' },
};

export const GENRES = ['ALL', 'ACTION', 'ADVENTURE', 'PUZZLE', 'SHOOTER', 'RACING', 'RPG', 'STRATEGY', 'SPORTS', 'HORROR'];

const art = (c1, c2, icon) => ({ c1, c2, icon });

export const DEFAULT_GAMES = [
  { id: 'g-moo', title: 'Moo', creator: 'rhys.cotton20', genre: 'PUZZLE', difficulty: 'extreme', plays: 4, likes: 0, kind: 'catch', age: 'Ages 13+', art: art('#0b3b2e', '#04140f', '🐄'), desc: 'A hologram cow roams a neon grid farm. Dodge the corruption and collect the data blocks.' },
  { id: 'g-astro', title: 'Astro Zombie Girl Story', creator: 'rhys.cotton20', genre: 'HORROR', difficulty: 'extreme', plays: 3, likes: 0, kind: 'survive', age: 'Ages 13+', art: art('#2b0b3a', '#0d0314', '🧟‍♀️'), desc: 'Survive the void hordes in a neon-drenched alien jungle.' },
  { id: 'g-storm', title: 'Storm', creator: 'Rhys Cotton', genre: 'SPORTS', difficulty: 'extreme', plays: 1, likes: 0, kind: 'survive', age: 'Ages 13+', art: art('#101a3a', '#04081a', '⛈️'), desc: 'Ride the storm front. Stay in the eye or get wiped out.' },
  { id: 'g-vine', title: 'Cosmic Vine Racing', creator: 'Rhys', genre: 'RACING', difficulty: 'easy', plays: 1, likes: 0, kind: 'race', age: 'All ages', art: art('#2a0b3a', '#0f0318', '🚀'), desc: 'Boost down the cosmic vineway and beat the ghost lap.' },
  { id: 'g-void', title: 'Void Storm Survival', creator: 'PlayTree', genre: 'SHOOTER', difficulty: 'hard', plays: 1, likes: 0, kind: 'shooter', age: 'Ages 13+', art: art('#0b1533', '#030714', '🌌'), desc: 'Hold the line against the void storm waves.' },
  { id: 'g-swarm', title: 'Swarm Hive Defense', creator: 'PlayTree', genre: 'STRATEGY', difficulty: 'extreme', plays: 0, likes: 0, kind: 'shooter', age: 'Ages 13+', art: art('#33260b', '#120d03', '🐝'), desc: 'Defend the root core from the Emperor Beetle swarm.' },
  { id: 'g-maze', title: 'Root Maze Escape', creator: 'Willow', genre: 'PUZZLE', difficulty: 'medium', plays: 0, likes: 0, kind: 'maze', age: 'Ages 9+', art: art('#0b3320', '#03140b', '🌿'), desc: 'Carve through the living root maze before the storm reaches you.' },
];

export const DROP_ZONES = [
  { name: 'Bug Burrows', icon: '🪲', risk: 'HIGH', tagClass: 'high', players: 12, desc: 'Dense insect nests — high enemy count, rich loot.', loot: 'RARE+', lootColor: '#ff7a00' },
  { name: 'Planet Gorath Crater', icon: '🪐', risk: 'EXTREME', tagClass: 'extreme', players: 18, desc: 'Alien crater with zero-gravity zones and cosmic loot.', loot: 'LEGENDARY', lootColor: '#b14dff' },
  { name: 'Thornwood Village', icon: '🌿', risk: 'MEDIUM', tagClass: 'medium', players: 8, desc: 'Dense forest village with decent mid-tier loot.', loot: 'UNCOMMON+', lootColor: '#ffd60a' },
  { name: 'Swarm Hive', icon: '🍯', risk: 'HIGH', tagClass: 'high', players: 14, desc: 'Emperor Beetle territory — dangerous but rewarding.', loot: 'EPIC+', lootColor: '#ff7a00' },
  { name: "Root Ancient's Lair", icon: '🌳', risk: 'BOSS', tagClass: 'boss', players: 20, desc: 'Final boss zone. Only for the most skilled players.', loot: 'MYTHIC', lootColor: '#ff4d4d' },
  { name: 'Spore Marshes', icon: '🍄', risk: 'LOW', tagClass: 'low', players: 5, desc: 'Quiet marshland — great for early-game looting.', loot: 'COMMON+', lootColor: '#39ff14' },
  { name: 'Crystal Canopy', icon: '💎', risk: 'MEDIUM', tagClass: 'medium', players: 9, desc: 'Elevated crystal trees — great sniping positions.', loot: 'RARE+', lootColor: '#ffd60a' },
  { name: 'Pollen Flats', icon: '🌾', risk: 'LOW', tagClass: 'low', players: 4, desc: 'Open plains — risky in the open but easy to loot.', loot: 'UNCOMMON+', lootColor: '#39ff14' },
  { name: 'Nectar Bay', icon: '🫙', risk: 'MEDIUM', tagClass: 'medium', players: 7, desc: 'Coastal bay with healing items and rare chests.', loot: 'RARE', lootColor: '#ffd60a' },
];

export const LOCKER_TABS = ['SKINS', 'BACK BLINGS', 'GLIDERS', 'PICKAXES', 'EMOTES', 'WRAPS'];

export const LOCKER_ITEMS = {
  SKINS: [
    { id: 'rootwalker', name: 'Rootwalker', rarity: 'LEGENDARY', icon: '🌿', color: '#ffd60a' },
    { id: 'spore-knight', name: 'Spore Knight', rarity: 'EPIC', icon: '🍄', color: '#a78bfa' },
    { id: 'bug-baron', name: 'Bug Baron', rarity: 'RARE', icon: '🪲', color: '#00bfff' },
    { id: 'cosmic-seedling', name: 'Cosmic Seedling', rarity: 'EPIC', icon: '🌱', color: '#a78bfa' },
    { id: 'thornplate', name: 'Thornplate Trooper', rarity: 'UNCOMMON', icon: '🛡️', color: '#39ff14' },
    { id: 'nectar-nomad', name: 'Nectar Nomad', rarity: 'COMMON', icon: '🫙', color: '#9aa7b4' },
  ],
  'BACK BLINGS': [
    { id: 'living-vine', name: 'Living Vine', rarity: 'EPIC', icon: '🍃', color: '#a78bfa' },
    { id: 'spore-pack', name: 'Spore Pack', rarity: 'RARE', icon: '🍄', color: '#00bfff' },
    { id: 'beetle-shell', name: 'Beetle Shell', rarity: 'UNCOMMON', icon: '🪲', color: '#39ff14' },
    { id: 'void-leaf', name: 'Void Leaf', rarity: 'LEGENDARY', icon: '🍂', color: '#ffd60a' },
  ],
  GLIDERS: [
    { id: 'leafwing', name: 'Leafwing', rarity: 'RARE', icon: '🍃', color: '#00bfff' },
    { id: 'petal-chute', name: 'Petal Chute', rarity: 'EPIC', icon: '🌸', color: '#a78bfa' },
    { id: 'void-glider', name: 'Void Glider', rarity: 'LEGENDARY', icon: '🌌', color: '#ffd60a' },
  ],
  PICKAXES: [
    { id: 'root-hoe', name: 'Root Breaker', rarity: 'COMMON', icon: '⛏️', color: '#9aa7b4' },
    { id: 'thorn-blade', name: 'Thorn Blade', rarity: 'EPIC', icon: '🗡️', color: '#a78bfa' },
    { id: 'crystal-pick', name: 'Crystal Pick', rarity: 'RARE', icon: '💎', color: '#00bfff' },
  ],
  EMOTES: [
    { id: 'bug-dance', name: 'Bug Dance', rarity: 'RARE', icon: '🕺', color: '#00bfff' },
    { id: 'victory-bloom', name: 'Victory Bloom', rarity: 'EPIC', icon: '🌺', color: '#a78bfa' },
    { id: 'spore-spin', name: 'Spore Spin', rarity: 'COMMON', icon: '🌀', color: '#9aa7b4' },
  ],
  WRAPS: [
    { id: 'vine-wrap', name: 'Vine Wrap', rarity: 'RARE', icon: '🌿', color: '#00bfff' },
    { id: 'cosmic-wrap', name: 'Cosmic Wrap', rarity: 'EPIC', icon: '✨', color: '#a78bfa' },
  ],
};

export const STORE_SECTIONS = [
  {
    title: 'AVATARS',
    items: [
      { id: 'lion-lord', name: 'Lion Lord', price: 400, icon: '🦁', type: 'avatar' },
      { id: 'birthday-dragon', name: 'Birthday Dragon', price: 600, icon: '🐲', type: 'avatar' },
      { id: 'neon-unicorn', name: 'Neon Unicorn', price: 500, icon: '🦄', type: 'avatar' },
      { id: 'crown-royalty', name: 'Crown Royalty', price: 800, icon: '👑', type: 'avatar' },
      { id: 'storm-shark', name: 'Storm Shark', price: 450, icon: '🦈', type: 'avatar' },
      { id: 'bamboo-panda', name: 'Bamboo Panda', price: 350, icon: '🐼', type: 'avatar' },
    ],
  },
  {
    title: 'PROFILE BACKGROUNDS',
    items: [
      { id: 'bg-birthday', name: '1st Birthday', price: 0, icon: '🎂', type: 'background', bg: 'linear-gradient(135deg,#0b3a12,#04160a)' },
      { id: 'bg-aurora', name: 'Aurora Lights', price: 700, icon: '🌌', type: 'background', bg: 'linear-gradient(135deg,#1a0b3a,#05031a)' },
      { id: 'bg-sakura', name: 'Sakura Bloom', price: 650, icon: '🌸', type: 'background', bg: 'linear-gradient(135deg,#3a0b22,#16040d)' },
    ],
  },
  {
    title: 'AVATAR FRAMES',
    items: [
      { id: 'frame-birthday', name: 'Birthday Crown', price: 0, icon: '🎂', type: 'frame', ring: '#ffd60a' },
      { id: 'frame-rainbow', name: 'Rainbow Ring', price: 900, icon: '🌈', type: 'frame', ring: '#ff4dad' },
      { id: 'frame-diamond', name: 'Diamond Ring', price: 1200, icon: '💎', type: 'frame', ring: '#7fdfff' },
      { id: 'frame-emerald', name: 'Emerald Ring', price: 750, icon: '🟢', type: 'frame', ring: '#39ff14' },
    ],
  },
];

export const BADGES = [
  { id: 'first-blood', name: 'First Blood', desc: 'GET YOUR FIRST ELIMINATION', rarity: 'COMMON', icon: '🎯', color: '#9aa7b4' },
  { id: 'victory-royale', name: 'Victory Royale', desc: 'WIN A MATCH', rarity: 'EPIC', icon: '🏆', color: '#a78bfa' },
  { id: 'flawless', name: 'Flawless', desc: 'WIN WITHOUT TAKING DAMAGE', rarity: 'LEGENDARY', icon: '✨', color: '#ffd60a' },
  { id: 'team-player', name: 'Team Player', desc: 'REVIVE 10 SQUADMATES', rarity: 'RARE', icon: '🤝', color: '#00bfff' },
  { id: 'master-creator', name: 'Master Creator', desc: 'PUBLISH A GAME IN STUDIO', rarity: 'RARE', icon: '🛠️', color: '#00bfff' },
  { id: 'veteran', name: 'Veteran', desc: 'PLAY FOR 30 DAYS', rarity: 'EPIC', icon: '📅', color: '#a78bfa' },
  { id: 'living-legend', name: 'Living Legend', desc: 'REACH LEVEL 100', rarity: 'LEGENDARY', icon: '🌟', color: '#ffd60a' },
  { id: 'mvp', name: 'MVP', desc: 'TOP FRAGGER IN A SQUAD MATCH', rarity: 'EPIC', icon: '🥇', color: '#a78bfa' },
  { id: 'survivor', name: 'Survivor', desc: 'SURVIVE 50 STORMS', rarity: 'RARE', icon: '⛈️', color: '#00bfff' },
  { id: 'sharpshooter', name: 'Sharpshooter', desc: '100 LONG-RANGE ELIMINATIONS', rarity: 'EPIC', icon: '🎯', color: '#a78bfa' },
  { id: 'star-player', name: 'Star Player', desc: 'FEATURED PLAYTREE STAR', rarity: 'MYTHIC', icon: '⭐', color: '#ff4dad' },
];

export const PROFILE_THEMES = [
  { id: 'cosmic', name: 'COSMIC', bg: 'linear-gradient(135deg,#0a1a3a,#050818)' },
  { id: 'storm', name: 'STORM CIRCUIT', bg: 'linear-gradient(135deg,#0a2f3a,#03141a)' },
  { id: 'toxic', name: 'TOXIC GROVE', bg: 'linear-gradient(135deg,#123a0a,#061603)' },
  { id: 'inferno', name: 'INFERNO ARENA', bg: 'linear-gradient(135deg,#3a1205,#160602)' },
  { id: 'gold', name: 'ANCIENT GOLD', bg: 'linear-gradient(135deg,#3a2f05,#161202)' },
  { id: 'blood', name: 'BLOOD MOON', bg: 'linear-gradient(135deg,#3a0510,#160206)' },
  { id: 'halloween', name: 'HALLOWEEN NIGHT', bg: 'linear-gradient(135deg,#2a0a3a,#100314)' },
  { id: 'frost', name: 'FROSTBITE', bg: 'linear-gradient(135deg,#0a2f3a,#021018)' },
  { id: 'sunset', name: 'NEON SUNSET', bg: 'linear-gradient(135deg,#3a0a2a,#140310)' },
  { id: 'matrix', name: 'MATRIX RAIN', bg: 'linear-gradient(135deg,#032010,#010a05)' },
  { id: 'royal', name: 'ROYAL VIOLET', bg: 'linear-gradient(135deg,#1a0a3a,#080314)' },
  { id: 'birthday', name: '1ST BIRTHDAY', bg: 'linear-gradient(135deg,#0b3a12,#04160a)', price: 700 },
];

export const REALITY_MODES = [
  { icon: '🥽', name: 'AR Glasses Mode', kind: 'MIXED REALITY', status: 'BETA', desc: 'Project the entire PlayTree island onto your real world. See bioluminescent trees grow from your living room floor. Hunt loot chests that appear on your coffee table. The Overgrowth Storm corrupts your actual walls.', devices: 'Apple Vision Pro · Meta Quest 3 · HoloLens' },
  { icon: '📱', name: 'Phone AR Mode', kind: 'MOBILE AR', status: 'LIVE', desc: 'Point your phone anywhere to spawn mini-games, practice your aim on holographic targets, or place decorative saplings around your room. Snap photos with botanical weapons and share to the feed.', devices: 'iOS 16+ · Android 12+ · LiDAR optional' },
  { icon: '📍', name: 'Geo-Reality Drops', kind: 'LOCATION BASED', status: 'LIVE', desc: 'Real-world loot drops at parks, landmarks, and PlayTree partner locations. Walk to a physical spot to claim exclusive geo-locked cosmetics. Weekly community meetups spawn world bosses at city centers.', devices: 'GPS enabled devices' },
  { icon: '👥', name: 'Holo-Squad Lobby', kind: 'SOCIAL AR', status: 'BETA', desc: 'See your friends as holographic avatars sitting on your couch. Share loot, plan drops, and watch live matches together in mixed reality. Voice chat with spatial audio.', devices: 'AR glasses · Phone AR' },
  { icon: '⛈️', name: 'Reality Storm Events', kind: 'LIVE EVENTS', status: 'COMING SOON', desc: 'The Overgrowth Storm spills into reality. Your room physically darkens, vines crawl across walls, and you must defend your space from corrupted plant zombies using AR weapons. Survive 5 waves.', devices: 'Phone AR · AR Glasses' },
  { icon: '👁️', name: 'Spectator Vision', kind: 'WATCH MODE', status: 'LIVE', desc: 'Watch live competitive matches as holographic dioramas on your desk. Scrub replays, see player stats floating in air, and switch between player POVs with a glance.', devices: 'AR glasses · Phone AR' },
];

export const REALITY_STEPS = [
  { n: '01', t: 'Allow Camera & Space', d: 'Grant AR permissions so PlayTree can map your environment and place objects on real surfaces.' },
  { n: '02', t: 'Scan Your Space', d: 'Move your device around so it learns the room. Floors, walls, and furniture become part of the island.' },
  { n: '03', t: 'Choose a Reality Mode', d: 'Pick AR Glasses, Phone AR, Geo-Drops, or Spectator Vision — each transforms your space differently.' },
  { n: '04', t: 'Play in Reality', d: 'Drop in. Loot spawns on your table, storm clouds fill your ceiling, and friends appear as holograms beside you.' },
];

export const COLLABS = [
  {
    id: 'linkin', status: 'COMING SOON', platform: 'MULTI-PLATFORM', icon: '⚔️',
    title: 'PlayTree × Linkin Games', period: 'TBA — 2026',
    desc: 'Two worlds collide! PlayTree Games joins forces with Linkin Games in an epic crossover event. A green fantasy adventurer meets futuristic armored warriors — exclusive rewards, limited cosmetics, and cross-platform challenges await.',
    perks: ['Exclusive Crossover Skin', 'Dual-Game Challenges', 'Limited Cosmetics', 'Special Event Badge'],
    colors: ['#123a0a', '#0a1f3a'], tags: ['CROSSOVER', 'MULTI-PLATFORM'],
  },
  {
    id: 'bossnow', status: 'LIVE', platform: 'ROBLOX', icon: '🎮',
    title: 'PlayTree × BossNowGames', period: 'Apr 3, 2026 — Jul 2, 2026',
    desc: 'PlayTree has officially landed on Roblox! BossNowGames is hosting the official PlayTree Event 4 Team Up — a limited-time crossover where players can jump into the Roblox version of the island, complete challenges, and earn exclusive crossover cosmetics.',
    perks: ['Exclusive Roblox Badge', 'Limited Crossover Cosmetics', 'Double XP Weekend', 'Community Leaderboard'],
    colors: ['#3a1205', '#180602'], tags: ['BATTLE ROYALE', 'SHOOTER', 'CROSS-PLATFORM'],
  },
  {
    id: 'pipeline', status: 'COMING SOON', platform: 'TBA', icon: '🔮',
    title: 'More Collabs Incoming', period: 'TBA — 2026',
    desc: 'The PlayTree team is actively working with several creators and platforms on future collaboration events. Stay tuned to the News & Updates section and follow official channels to be the first to know.',
    perks: ['Exclusive Rewards', 'Limited-Time Events', 'Crossover Cosmetics', 'Creator Drops'],
    colors: ['#1a0b3a', '#0a0318'], tags: ['UPCOMING', 'SECRET', 'STAY TUNED'],
  },
];

export const LEADERBOARD_ROWS = [
  { name: 'PlayTree', xp: 225, wins: 0, kills: 0, kd: 0, played: 0, av: '#39ff14', icon: '🌳' },
  { name: 'GoStudios', xp: 125, wins: 0, kills: 0, kd: 0, played: 0, av: '#00bfff', icon: '🛠️' },
  { name: 'FrostPhantom53', xp: 125, wins: 0, kills: 0, kd: 0, played: 0, av: '#7fdfff', icon: '❄️' },
  { name: 'rhys.cotton20', xp: 125, wins: 0, kills: 0, kd: 0, played: 0, av: '#ffd60a', icon: '🧊' },
  { name: 'FrostWolf10', xp: 0, wins: 0, kills: 0, kd: 0, played: 0, av: '#a78bfa', icon: '🐺' },
  { name: 'CyberViper81', xp: 0, wins: 0, kills: 0, kd: 0, played: 0, av: '#39ff14', icon: '🐍' },
  { name: 'StormNinja79', xp: 0, wins: 0, kills: 0, kd: 0, played: 0, av: '#00bfff', icon: '🥷' },
];

export const PLATFORMS = [
  { id: 'goconsole', name: 'GoConsole', sub: 'GOCONSOLE ACCOUNT', icon: '🎮', color: '#39ff14' },
  { id: 'xbox', name: 'Xbox / Microsoft', sub: 'MICROSOFT ACCOUNT', icon: '❎', color: '#39ff14' },
  { id: 'ps', name: 'PlayStation / Sony', sub: 'PLAYSTATION NETWORK', icon: '🎮', color: '#00bfff' },
  { id: 'nintendo', name: 'Nintendo Switch', sub: 'NINTENDO ACCOUNT', icon: '🔴', color: '#ff4d4d' },
  { id: 'android', name: 'Android / Google', sub: 'GOOGLE ACCOUNT', icon: '🤖', color: '#39ff14' },
  { id: 'ios', name: 'iPhone / iOS', sub: 'APPLE ACCOUNT', icon: '📱', color: '#9aa7b4' },
  { id: 'mac', name: 'macOS', sub: 'APPLE ACCOUNT', icon: '💻', color: '#9aa7b4' },
  { id: 'win', name: 'Windows 11', sub: 'MICROSOFT ACCOUNT', icon: '🪟', color: '#00bfff' },
  { id: 'linux', name: 'Linux', sub: 'LINUX / STEAMOS', icon: '🐧', color: '#ffd60a' },
  { id: 'playtree', name: 'PlayTree', sub: 'PLAYTREE ACCOUNT', icon: '🌳', color: '#39ff14' },
];

export const HELP_ARTICLES = [
  { q: 'How do I create an account?', a: 'Pick a player name on the home screen and press ENTER PLAYTREE. Your demo account is created instantly — no email or password needed.' },
  { q: 'How do I publish my own game?', a: 'Open PlayTree Studio, paint a 2D level with the brush tools, hit TEST PLAY, then add a title and press PUBLISH GAME. It costs 250 Tree-Points.' },
  { q: 'How does GoAI keep me safe?', a: 'GoAI filters chat, reviews reports, and applies age-group rules. Kids get a 2 hour screen time limit, teens 4 hours, adults unlimited.' },
  { q: 'How do I join a party?', a: 'Go to the Lobby, press BROWSE PARTIES and hit JOIN, or use JOIN BY CODE with the 6 character party code a friend shares.' },
  { q: 'What are Tree-Points?', a: 'Tree-Points are the PlayTree currency. You earn them from daily rewards, matches and redeem codes, and spend them in the Store or on Studio publishes.' },
  { q: 'Which devices work with PlayTree Reality?', a: 'Phone AR works on Android 12+ and iOS 16+. AR Glasses mode is in beta on Vision Pro, Quest 3 and HoloLens.' },
];

export const MOD_RULES = [
  { t: 'Community Rules & GoAI Moderation', d: 'Be kind, keep chat clean, and never share personal info. GoAI monitors every public channel and auto-flags bad words.' },
  { t: 'Reporting a Player', d: 'Open a player card and press REPORT. Choose a reason — GoAI reviews it instantly and can warn, timeout or ban.' },
  { t: 'Enforcement & Bans', d: 'Warnings → 24h timeout → 7 day suspension → permanent ban. Cheating and harassment escalate straight to suspension.' },
  { t: "Kids' Privacy & Parental Controls", d: 'Parents can set a PIN to lock Games, Studio and Friends, cap screen time, and disable chat entirely.' },
];

export const ART_COLORS = {
  grass: '#2fbf4a',
  void: '#05070a',
  wall: '#4a5a6a',
  lava: '#ff5a1f',
  coin: '#ffd60a',
  enemy: '#ff4d4d',
  spawn: '#00bfff',
  goal: '#39ff14',
  water: '#1f6fbf',
  gem: '#c04dff',
};

export const STORAGE_KEY = 'pt_state_v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

export function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

export function randomName() {
  const a = ['Void', 'Storm', 'Root', 'Neon', 'Frost', 'Cyber', 'Turbo', 'Shadow', 'Crystal', 'Solar', 'Wild', 'Mega'];
  const b = ['Drifter', 'Ranger', 'Titan', 'Wolf', 'Viper', 'Ninja', 'Pulse', 'Blaze', 'Fang', 'Wisp', 'Spark', 'Ghost'];
  return a[Math.floor(Math.random() * a.length)] + b[Math.floor(Math.random() * b.length)] + Math.floor(10 + Math.random() * 90);
}

export function partyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
