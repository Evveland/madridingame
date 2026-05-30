import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, MapPin, Gift, Star, QrCode, Users, CheckCircle2, Lock, ArrowLeft, Search, BadgeCheck, Sparkles, Ticket, Target, Crown, MessageCircleQuestion, Store, UserRound, Home, LayoutDashboard, Mail, Download, Save, Eye, Pencil, BarChart3, Phone } from 'lucide-react';

const MIG_LOGO = 'data:image/jpeg;base64,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zKq9/GrXvavMqvMqvMrtDbn5Ebc/IjbnsWt436GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66GfXQz66IdSreVX+Q25+RG3PyI257gsGOazbGWvMrGbenmWmB5AFCXTSE2Q+2hbi32HmF0OMQRV7eF6fGIYTQ7DxC+lyNPDEM/Zhh59ao2QTa9r2va173IHfHuOISRbpkjTrTrV+2Nue5jjS3Iq7K0XWM6luc5eM5IvdY5zk+AxKtjgkvHxQwoDBW5x8P10rkTLMnF1gHLyOSSTB4OU3cVlcS0LWC8xI5GeLK5gww/Fg736g7vBlXRHe6pWo2fHklZJF9MN7Q257l3bWwaFtFLj450RGWz3MxnJF7rHOcyY14DJSJeOZBwp5wggrc4gMoSIxVEkPJZKF6GVwDl5rlq/fgGC8wuJhS5XNTXLug736g7vCeL+2a/7QnaG3PcX4ewcQW206yNo5tP8zGckXusc5zOearAfy2OsqVyOWciK90S9T1rS+O4By8tGSLknG45IEu5aeO2LgvMTa1tTzlkZJj4drpP+oO7wi17xnSZSoTGyFP5fKIPM7Q257mLmBOhWhDU0v08cwW9cgqM5IvdCPrGJkjn5AiouTKjqBOeDMNJdMJoCVLCGjJAiOI90ytFz8oSio05+PfKeWSRGSBMc8QW48ZKSRMkuKly41HumVo+YkDU9sbc92zz1qUq6r1b9L/ADbn5Ebc/Ijbn5Ebc/Ijbn5Ebc/Ijbn5Ebc/Ijbn5Ebc/Ijbn5Ebc6blablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablDNueo/8QAJhEAAgEDAgUFAQAAAAAAAAAAAQIDAAQREkETITFAUSJwgJGhwf/aAAgBAwEBPwH2fLAVHMjNhuQqeExNjtpLSa7IjjbSu5owwRnhQfZ6mprZsZz0p5mkMIGwOfztpp2SIpsatoIAuUfmdjV3MIgB5OKVeFKUPbEA8jV1buq6oevirULdD15Vh5H9pYsNqJ+Qv//EACQRAAED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';

const startups = [
  {
    id: '101',
    name: '101 Experience',
    category: 'Experiential Gaming',
    founder: 'Luis Villar',
    booth: 'MiG Stand · Booth A1',
    xp: 100,
    color: 'from-pink-500 to-orange-400',
    description: 'Interactive experiences that connect audiences, culture and immersive storytelling.',
    mission: 'Discover how live experiences can become playable moments.',
    question: 'Ask the founder: What type of experience first inspired 101 Experience?',
    answer: 'festival',
    accepted: ['festival', 'live event', 'event', 'cultural event'],
    socialTask: 'Scan their project QR or follow their social channel.',
  },
  {
    id: 'cyberzen',
    name: 'Cyberzen Games',
    category: 'Wellbeing Games',
    founder: 'Natalia Linetzka, Founder',
    booth: 'MiG Stand · Booth A2',
    xp: 100,
    color: 'from-cyan-500 to-blue-600',
    description: 'Games designed to help people regulate emotions, focus and wellbeing.',
    mission: 'Learn how games can support better mental states.',
    question: 'Ask the founder: What emotional state does Cyberzen most want to help players improve?',
    answer: 'calm',
    accepted: ['calm', 'stress', 'anxiety', 'focus', 'wellbeing'],
    socialTask: 'Follow Cyberzen or scan their demo QR.',
  },
  {
    id: 'gamestrategies',
    name: 'Game Strategies',
    category: 'Corporate Gamification',
    founder: 'Ibrahim Jabary, Founder',
    booth: 'MiG Stand · Booth A3',
    xp: 100,
    color: 'from-emerald-500 to-lime-500',
    description: 'Game-based solutions for learning, strategy and corporate transformation.',
    mission: 'Find out how companies can train better through games.',
    question: 'Ask the founder: What corporate skill is easier to teach through games?',
    answer: 'leadership',
    accepted: ['leadership', 'teamwork', 'negotiation', 'strategy', 'compliance'],
    socialTask: 'Ask for a business card or scan the company QR.',
  },
  {
    id: 'neuhera',
    name: 'Neuhera',
    category: 'Health · VR · AI',
    founder: 'Beatriz Fagundo, Founder',
    booth: 'MiG Stand · Booth B1',
    xp: 100,
    color: 'from-violet-500 to-fuchsia-600',
    description: 'Immersive VR and AI therapies focused on child development and attention.',
    mission: 'Discover how immersive technology can support therapy.',
    question: 'Ask the founder: What child-development challenge is Neuhera focused on?',
    answer: 'ADHD',
    accepted: ['adhd', 'tdah', 'attention', 'attention deficit'],
    socialTask: "Scan Neuhera's demo QR at the booth.",
  },
  {
    id: 'unreality',
    name: 'Unreality',
    category: 'Platform · Puzzle · Survival',
    founder: 'Founder name TBC',
    booth: 'MiG Stand · Booth B2',
    xp: 100,
    color: 'from-red-500 to-rose-600',
    description: 'A platform, puzzle and survival game world inspired by atmospheric environments.',
    mission: "Explore the world behind Unreality's game concept.",
    question: 'Ask the founder: What country inspired the world of Unreality?',
    answer: 'Japan',
    accepted: ['japan', 'japon', 'japón'],
    socialTask: 'Watch the short demo trailer at the booth.',
  },
  {
    id: 'cherrytree',
    name: 'Cherry Tree Studio',
    category: 'Card Combat Game',
    founder: 'Founder name TBC',
    booth: 'MiG Stand · Booth B3',
    xp: 100,
    color: 'from-red-400 to-pink-500',
    description: 'Indie studio creating Project Node, a card-combat game experience.',
    mission: 'Meet the team behind Project Node.',
    question: 'Ask the founder: What is the name of Cherry Tree Studio\'s card-combat game?',
    answer: 'Project Node',
    accepted: ['project node', 'node'],
    socialTask: 'Ask to see one card or character from the game.',
  },
  {
    id: 'evveland',
    name: 'Evveland',
    category: 'Telegram MiniApps · AI · Web3',
    founder: 'Rafael Bonnelly',
    booth: 'MiG Stand · Booth C1',
    xp: 100,
    color: 'from-green-400 to-emerald-600',
    description: 'Gamified Telegram MiniApps that turn audiences into digital economies.',
    mission: 'Discover how brands can transform passive audiences into players.',
    question: 'Ask the founder: What is the core channel where Evveland builds gamified audience economies?',
    answer: 'Telegram',
    accepted: ['telegram', 'telegram miniapps', 'telegram mini apps'],
    socialTask: 'Open the Evveland demo MiniApp.',
  },
  {
    id: 'goldengamers',
    name: 'Golden Gamers Go',
    category: 'Games for Seniors',
    founder: 'Gloria Sánchez, Co-Founder/CEO',
    booth: 'MiG Stand · Booth C2',
    xp: 100,
    color: 'from-yellow-400 to-amber-600',
    description: 'Uses video games to improve wellbeing and cognitive activity among older adults.',
    mission: 'Learn how games can serve older communities.',
    question: 'Ask the founder: What audience does Golden Gamers Go mainly serve?',
    answer: 'seniors',
    accepted: ['seniors', 'older adults', 'elderly', 'mayores', 'older people'],
    socialTask: 'Ask to see one example of a senior-friendly game session.',
  },
  {
    id: 'nomoretrolls',
    name: 'No More Trolls',
    category: 'Runner · Platform Game',
    founder: 'Javier García, Producer',
    booth: 'MiG Stand · Booth C3',
    xp: 100,
    color: 'from-slate-600 to-zinc-900',
    description: 'A third-person platform runner with humor, challenge and anti-troll energy.',
    mission: 'Find out how the team turns internet culture into gameplay.',
    question: 'Ask the founder: What type of game is No More Trolls building?',
    answer: 'runner',
    accepted: ['runner', 'platform runner', 'third-person runner', 'platformer'],
    socialTask: 'Watch one gameplay clip at the booth.',
  },
  {
    id: 'xperiencesvr',
    name: 'Xperiences VR',
    category: 'VR · AI Training',
    founder: 'David Hernández Cela',
    booth: 'MiG Stand · Booth D1',
    xp: 100,
    color: 'from-indigo-500 to-sky-500',
    description: 'Skills training experiences powered by virtual reality and artificial intelligence.',
    mission: 'See how immersive simulations can train real-world skills.',
    question: 'Ask the founder: What two technologies does Xperiences VR combine for training?',
    answer: 'VR and AI',
    accepted: ['vr and ai', 'virtual reality and artificial intelligence', 'vr ai', 'ai and vr'],
    socialTask: 'Try or watch one VR training demo.',
  },
];

const profiles = ['Investor', 'Startup founder', 'Corporate / brand', 'Publisher / gaming industry', 'Student / talent', 'Visitor / curious'];

const rewards = [
  { xp: 300, name: 'Sticker Pack', icon: Star },
  { xp: 600, name: 'Madrid in Game Pin', icon: BadgeCheck },
  { xp: 1000, name: 'T-Shirt', icon: Gift },
  { xp: 1500, name: 'Limited Merch', icon: Crown },
  { xp: 2000, name: 'VIP Raffle Entry', icon: Ticket },
];

const startupContacts = {
  '101': [
    { name: 'Ana García', type: 'Investor', company: 'Impact Angels', email: 'ana@impactangels.com', interest: 'Experiential campaigns', status: 'Hot lead' },
    { name: 'Mario Ruiz', type: 'Corporate / brand', company: 'RetailCo', email: 'mario@retailco.es', interest: 'Brand activation', status: 'Follow up' },
  ],
  cyberzen: [
    { name: 'Clara Martín', type: 'Health partner', company: 'WellLab', email: 'clara@welllab.io', interest: 'Mental wellbeing pilots', status: 'Hot lead' },
    { name: 'Jon Pérez', type: 'Publisher', company: 'IndieHub', email: 'jon@indiehub.gg', interest: 'Distribution', status: 'New' },
  ],
  gamestrategies: [
    { name: 'Laura Campos', type: 'Corporate / brand', company: 'TalentWorks', email: 'laura@talentworks.com', interest: 'Training gamification', status: 'Follow up' },
  ],
  neuhera: [
    { name: 'Sofía León', type: 'Investor', company: 'HealthTech Fund', email: 'sofia@healthtechfund.com', interest: 'VR therapy', status: 'Hot lead' },
    { name: 'David Muñoz', type: 'Clinical partner', company: 'NeuroKids', email: 'david@neurokids.es', interest: 'Pilot program', status: 'Follow up' },
  ],
  unreality: [
    { name: 'Kenji Ito', type: 'Publisher', company: 'PlayBridge', email: 'kenji@playbridge.gg', interest: 'Game publishing', status: 'New' },
  ],
  cherrytree: [
    { name: 'Marta Gil', type: 'Investor', company: 'SeedPlay', email: 'marta@seedplay.vc', interest: 'Card combat games', status: 'New' },
  ],
  evveland: [
    { name: 'Tomás Pérez', type: 'Corporate / brand', company: 'FanMedia', email: 'tomas@fanmedia.com', interest: 'Telegram MiniApp', status: 'Hot lead' },
    { name: 'Irene Salas', type: 'Startup founder', company: 'CreatorOS', email: 'irene@creatoros.app', interest: 'Audience economy', status: 'Follow up' },
    { name: 'Alex Novak', type: 'Investor', company: 'Web3 Ventures', email: 'alex@web3ventures.vc', interest: 'Demo request', status: 'Hot lead' },
  ],
  goldengamers: [
    { name: 'Patricia Gómez', type: 'Public sector', company: 'Madrid Salud', email: 'patricia@madridsalud.es', interest: 'Senior wellbeing', status: 'Follow up' },
  ],
  nomoretrolls: [
    { name: 'Nico Torres', type: 'Publisher', company: 'Runner Games', email: 'nico@runnergames.gg', interest: 'Gameplay demo', status: 'New' },
  ],
  xperiencesvr: [
    { name: 'Bea Torres', type: 'Corporate / brand', company: 'SkillUp', email: 'bea@skillup.com', interest: 'VR training', status: 'Hot lead' },
    { name: 'Hugo Ferrer', type: 'Investor', company: 'Immersive Capital', email: 'hugo@immersive.capital', interest: 'AI simulation', status: 'Follow up' },
  ],
};

function classNames(...items) {
  return items.filter(Boolean).join(' ');
}

export default function MadridInGameQuestPrototype() {
  const [screen, setScreen] = useState('splash');
  const [profile, setProfile] = useState('');
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState({});
  const [answers, setAnswers] = useState({});
  const [socialDone, setSocialDone] = useState({});
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [redeemed, setRedeemed] = useState(false);
  const [dashboardStartupId, setDashboardStartupId] = useState('evveland');
  const [savedDashboard, setSavedDashboard] = useState(false);

  const completedCount = Object.keys(completed).length;
  const xp = 50 + completedCount * 100 + Object.keys(socialDone).length * 50 + (completedCount === startups.length ? 500 : 0);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = q
      ? startups.filter((s) => `${s.name} ${s.category} ${s.description}`.toLowerCase().includes(q))
      : startups;
    return [...list].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  }, [query]);

  const current = startups.find((s) => s.id === selected);
  const dashboardStartup = startups.find((s) => s.id === dashboardStartupId) || startups[0];

  function submitAnswer() {
    if (!current) return;
    const value = (answers[current.id] || '').toLowerCase().trim();
    const valid = current.accepted.some((a) => value.includes(a.toLowerCase()));
    if (!valid) {
      setError('Not quite. Ask the founder again and try the secret answer.');
      return;
    }
    setCompleted((prev) => ({ ...prev, [current.id]: true }));
    setError('');
    setScreen('success');
  }

  function markSocialDone() {
    if (!current) return;
    setSocialDone((prev) => ({ ...prev, [current.id]: true }));
  }

  return (
    <div className="min-h-screen bg-[#060816] text-white flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-[#111735] via-[#080b1a] to-black relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute top-48 -right-32 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-8 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 min-h-screen pb-24">
          <TopBar xp={xp} completedCount={completedCount} />

          <AnimatePresence mode="wait">
            {screen === 'splash' && (
              <motion.div key="splash" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-cyan-100 mb-6">
                  <Sparkles size={14} /> South Summit Quest
                </div>
                <div className="rounded-3xl bg-[#1f2020] border border-white/10 p-6 shadow-2xl flex justify-center">
                  <img src={MIG_LOGO} alt="Madrid in Game official logo" className="w-64 max-w-full object-contain" />
                </div>
                <h1 className="text-4xl font-black leading-none tracking-tight mt-6">
                  South Summit <span className="text-cyan-300">Quest</span>
                </h1>
                <p className="text-white/70 mt-5 text-lg leading-relaxed">
                  Meet the startups shaping the future of gaming, AI, VR and audience economies. Complete booth quests, earn XP and redeem merch.
                </p>
                <div className="mt-8 rounded-3xl p-5 bg-white/10 border border-white/10 backdrop-blur shadow-xl">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <Stat value="10" label="Startups" />
                    <Stat value="2K" label="Max XP" />
                    <Stat value="5" label="Rewards" />
                  </div>
                </div>
                <button onClick={() => setScreen('onboarding')} className="mt-8 w-full rounded-2xl bg-cyan-400 text-slate-950 font-black py-4 shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition">
                  Start Quest
                </button>
                <button onClick={() => setScreen('map')} className="mt-3 w-full rounded-2xl bg-white/10 border border-white/10 text-white font-semibold py-4">
                  Preview Startup Map
                </button>
              </motion.div>
            )}

            {screen === 'onboarding' && (
              <motion.div key="onboarding" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-5">
                <h2 className="text-3xl font-black">Choose your player type</h2>
                <p className="text-white/60 mt-2">This helps Madrid in Game understand who is discovering the ecosystem.</p>
                <div className="mt-6 space-y-3">
                  {profiles.map((p) => (
                    <button
                      key={p}
                      onClick={() => setProfile(p)}
                      className={classNames('w-full flex items-center gap-3 rounded-2xl px-4 py-4 border transition', profile === p ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-white/10 border-white/10')}
                    >
                      <UserRound size={20} />
                      <span className="font-bold">{p}</span>
                    </button>
                  ))}
                </div>
                <button disabled={!profile} onClick={() => setScreen('map')} className={classNames('mt-6 w-full rounded-2xl font-black py-4 transition', profile ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30' : 'bg-white/10 text-white/30')}>
                  Enter Mission Map
                </button>
              </motion.div>
            )}

            {screen === 'map' && (
              <motion.div key="map" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black">Mission Map</h2>
                    <p className="text-white/60 mt-1">Complete all startup quests to unlock the bonus.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-cyan-300">{completedCount}/10</div>
                    <div className="text-xs text-white/50">visited</div>
                  </div>
                </div>
                <Progress value={completedCount / startups.length} />
                <div className="mt-5 relative">
                  <Search size={17} className="absolute left-4 top-4 text-white/40" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search startups..." className="w-full rounded-2xl bg-white/10 border border-white/10 pl-11 pr-4 py-3 outline-none text-sm" />
                </div>
                <div className="mt-5 space-y-3">
                  {filtered.map((s) => (
                    <StartupCard
                      key={s.id}
                      startup={s}
                      completed={!!completed[s.id]}
                      socialDone={!!socialDone[s.id]}
                      onClick={() => {
                        setSelected(s.id);
                        setScreen('startup');
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {screen === 'startup' && current && (
              <motion.div key="startup" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="px-5 pt-4">
                <Back onClick={() => setScreen('map')} />
                <div className={classNames('mt-4 h-36 rounded-3xl bg-gradient-to-br p-5 shadow-xl relative overflow-hidden', current.color)}>
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-xl" />
                  <div className="relative">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/75">{current.category}</div>
                    <h2 className="text-3xl font-black mt-2">{current.name}</h2>
                    <div className="flex items-center gap-2 mt-3 text-sm font-semibold">
                      <MapPin size={16} /> {current.booth}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm font-semibold">
                      <UserRound size={16} /> Founder: {current.founder}
                    </div>
                  </div>
                </div>
                <div className="mt-5 rounded-3xl bg-white/10 border border-white/10 p-5">
                  <h3 className="font-black text-xl">Startup Mission</h3>
                  <div className="mt-3 rounded-2xl bg-black/20 border border-white/10 px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/15 text-cyan-300 flex items-center justify-center">
                      <UserRound size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold">Founder</div>
                      <div className="text-sm font-black text-white">{current.founder}</div>
                    </div>
                  </div>
                  <p className="text-white/70 mt-4 leading-relaxed">{current.description}</p>
                  <p className="text-cyan-200 mt-4 font-bold">{current.mission}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniTask icon={QrCode} title="Visit Booth" subtitle="Scan booth QR" done />
                  <MiniTask icon={MessageCircleQuestion} title="Ask Founder" subtitle={`+${current.xp} XP`} done={!!completed[current.id]} />
                  <MiniTask icon={Users} title="Social Task" subtitle="Optional +50 XP" done={!!socialDone[current.id]} />
                  <MiniTask icon={Gift} title="Merch" subtitle="Redeem XP" done={xp >= 300} />
                </div>
                <button onClick={() => setScreen('question')} className="mt-5 w-full rounded-2xl bg-cyan-400 text-slate-950 font-black py-4 shadow-lg shadow-cyan-500/30">
                  Start Founder Question
                </button>
                {!socialDone[current.id] && (
                  <button onClick={markSocialDone} className="mt-3 w-full rounded-2xl bg-white/10 border border-white/10 font-bold py-4">
                    Complete Optional Social Task +50 XP
                  </button>
                )}
              </motion.div>
            )}

            {screen === 'question' && current && (
              <motion.div key="question" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="px-5 pt-4">
                <Back onClick={() => setScreen('startup')} />
                <div className="mt-6 rounded-3xl bg-white/10 border border-white/10 p-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center mb-5">
                    <MessageCircleQuestion size={28} />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-cyan-200 font-bold">Founder Secret Question</div>
                  <h2 className="text-2xl font-black mt-3 leading-tight">{current.question}</h2>
                  <div className="mt-4 rounded-2xl bg-black/20 border border-white/10 px-4 py-3 flex items-center gap-3">
                    <UserRound size={18} className="text-cyan-300" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold">Ask</div>
                      <div className="text-sm font-black text-white">{current.founder}</div>
                    </div>
                  </div>
                  <p className="text-white/60 mt-4">Go to the booth, ask the founder, and type the answer below.</p>
                  <input
                    value={answers[current.id] || ''}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }));
                      setError('');
                    }}
                    placeholder="Type founder answer..."
                    className="mt-6 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-4 outline-none"
                  />
                  {error && <p className="text-rose-300 text-sm mt-3">{error}</p>}
                  <button onClick={submitAnswer} className="mt-5 w-full rounded-2xl bg-cyan-400 text-slate-950 font-black py-4">
                    Submit Answer · +{current.xp} XP
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'success' && current && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-5 pt-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 12 }} className="mx-auto w-24 h-24 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={54} />
                </motion.div>
                <h2 className="text-4xl font-black mt-6">Quest Complete!</h2>
                <p className="text-white/70 mt-3">You discovered {current.name} and earned <span className="text-cyan-300 font-black">{current.xp} XP</span>.</p>
                <div className="mt-6 rounded-3xl bg-white/10 border border-white/10 p-5">
                  <div className="text-sm text-white/60">Current Balance</div>
                  <div className="text-5xl font-black text-cyan-300 mt-1">{xp} XP</div>
                </div>
                <button onClick={() => setScreen('map')} className="mt-6 w-full rounded-2xl bg-cyan-400 text-slate-950 font-black py-4">
                  Visit Next Startup
                </button>
                <button onClick={() => setScreen('store')} className="mt-3 w-full rounded-2xl bg-white/10 border border-white/10 font-bold py-4">
                  View Merch Rewards
                </button>
              </motion.div>
            )}

            {screen === 'store' && (
              <motion.div key="store" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4">
                <Back onClick={() => setScreen('map')} />
                <h2 className="text-3xl font-black mt-4">XP Store</h2>
                <p className="text-white/60 mt-1">Redeem XP for Madrid in Game merch at the booth.</p>
                <div className="mt-5 rounded-3xl bg-cyan-400 text-slate-950 p-5">
                  <div className="text-sm font-bold opacity-70">Your Balance</div>
                  <div className="text-5xl font-black mt-1">{xp} XP</div>
                </div>
                <div className="mt-5 space-y-3">
                  {rewards.map((r) => {
                    const Icon = r.icon;
                    const unlocked = xp >= r.xp;
                    return (
                      <div key={r.name} className={classNames('rounded-2xl p-4 border flex items-center gap-4', unlocked ? 'bg-white/15 border-cyan-300/40' : 'bg-white/5 border-white/10 opacity-60')}>
                        <div className={classNames('w-12 h-12 rounded-2xl flex items-center justify-center', unlocked ? 'bg-cyan-400 text-slate-950' : 'bg-white/10')}>
                          {unlocked ? <Icon size={24} /> : <Lock size={22} />}
                        </div>
                        <div className="flex-1">
                          <div className="font-black">{r.name}</div>
                          <div className="text-sm text-white/60">{r.xp} XP required</div>
                        </div>
                        {unlocked && <span className="text-xs font-black text-cyan-200">UNLOCKED</span>}
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setRedeemed(true)} disabled={xp < 300 || redeemed} className={classNames('mt-5 w-full rounded-2xl font-black py-4', xp >= 300 && !redeemed ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-white/40')}>
                  {redeemed ? 'Redemption Code Used' : 'Generate Redemption Code'}
                </button>
                {redeemed && (
                  <div className="mt-4 rounded-3xl bg-white text-slate-950 p-6 text-center">
                    <QrCode className="mx-auto" size={86} />
                    <div className="mt-3 text-xs font-bold text-slate-500">SHOW THIS AT THE BOOTH</div>
                    <div className="text-2xl font-black">MIG-{String(xp).padStart(4, '0')}</div>
                  </div>
                )}
              </motion.div>
            )}

            {screen === 'leaderboard' && (
              <motion.div key="leaderboard" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4">
                <h2 className="text-3xl font-black">Leaderboard</h2>
                <p className="text-white/60 mt-1">Top South Summit explorers today.</p>
                <div className="mt-6 space-y-3">
                  {[
                    ['Ana G.', 1850, 10],
                    ['Miguel R.', 1600, 9],
                    ['You', xp, completedCount],
                    ['Laura C.', 850, 6],
                    ['Carlos M.', 600, 4],
                  ].sort((a, b) => b[1] - a[1]).map((row, i) => (
                    <div key={row[0]} className={classNames('rounded-2xl p-4 border flex items-center gap-4', row[0] === 'You' ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-white/10 border-white/10')}>
                      <div className="text-2xl font-black w-8">#{i + 1}</div>
                      <div className="flex-1">
                        <div className="font-black">{row[0]}</div>
                        <div className={classNames('text-sm', row[0] === 'You' ? 'text-slate-700' : 'text-white/60')}>{row[2]} startups visited</div>
                      </div>
                      <div className="font-black">{row[1]} XP</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {screen === 'dashboard' && (
              <StartupDashboard
                startup={dashboardStartup}
                contacts={startupContacts[dashboardStartup.id] || []}
                startups={startups}
                dashboardStartupId={dashboardStartupId}
                setDashboardStartupId={(id) => {
                  setDashboardStartupId(id);
                  setSavedDashboard(false);
                }}
                savedDashboard={savedDashboard}
                onSave={() => {
                  setSavedDashboard(true);
                  setTimeout(() => setSavedDashboard(false), 1800);
                }}
              />
            )}
          </AnimatePresence>
        </div>

        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TopBar({ xp, completedCount }) {
  return (
    <div className="relative z-20 px-5 pt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#1f2020] border border-white/10 flex items-center justify-center overflow-hidden">
          <img src={MIG_LOGO} alt="Madrid in Game official logo" className="w-11 h-11 object-cover" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-white/40 font-bold">Madrid in Game</div>
          <div className="font-black text-lg">Quest Passport</div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-white/10 border border-white/10 px-3 py-2">
        <Trophy size={18} className="text-cyan-300" />
        <div className="leading-none">
          <div className="font-black text-cyan-300">{xp}</div>
          <div className="text-[10px] text-white/50">XP · {completedCount}/10</div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    ['splash', Home, 'Home'],
    ['map', Target, 'Quests'],
    ['store', Store, 'Store'],
    ['leaderboard', Trophy, 'Rank'],
    ['dashboard', LayoutDashboard, 'Startup'],
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
      <div className="rounded-3xl bg-black/70 backdrop-blur-xl border border-white/10 p-2 grid grid-cols-5 gap-1 shadow-2xl">
        {items.map(([id, Icon, label]) => (
          <button key={id} onClick={() => setScreen(id)} className={classNames('rounded-2xl py-3 flex flex-col items-center gap-1 text-xs font-bold transition', screen === id ? 'bg-cyan-400 text-slate-950' : 'text-white/60')}>
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-2xl font-black text-cyan-300">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
    </div>
  );
}

function Progress({ value }) {
  return (
    <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.round(value * 100))}%` }}
        className="h-full bg-cyan-400 rounded-full"
      />
    </div>
  );
}

function Back({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-white/60 font-bold text-sm hover:text-white transition">
      <ArrowLeft size={18} /> Back
    </button>
  );
}

function StartupCard({ startup, completed, socialDone, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-3xl bg-white/10 border border-white/10 p-4 flex items-center gap-4 active:scale-[0.98] transition"
    >
      <div className={classNames('w-12 h-12 rounded-2xl bg-gradient-to-br flex-shrink-0 flex items-center justify-center shadow-lg', startup.color)}>
        {completed ? <CheckCircle2 size={24} className="text-white" /> : <Target size={24} className="text-white/80" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-black truncate">{startup.name}</div>
        <div className="text-xs text-white/50 mt-0.5">{startup.category}</div>
        <div className="text-xs text-white/40 mt-0.5">{startup.booth}</div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className={classNames('text-xs font-black px-2 py-1 rounded-full', completed ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-white/50')}>
          {completed ? 'Done' : `+${startup.xp} XP`}
        </div>
        {socialDone && (
          <div className="text-xs font-bold text-cyan-300">+50 social</div>
        )}
      </div>
    </button>
  );
}

function MiniTask({ icon: Icon, title, subtitle, done }) {
  return (
    <div className={classNames('rounded-2xl p-3 border flex items-center gap-3', done ? 'bg-emerald-400/10 border-emerald-300/30' : 'bg-white/5 border-white/10')}>
      <div className={classNames('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', done ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-white/50')}>
        {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
      </div>
      <div>
        <div className={classNames('text-xs font-black', done ? 'text-emerald-300' : 'text-white/80')}>{title}</div>
        <div className="text-[10px] text-white/40">{subtitle}</div>
      </div>
    </div>
  );
}

function StartupDashboard({ startup, contacts, startups, dashboardStartupId, setDashboardStartupId, savedDashboard, onSave }) {
  const questViews = 42 + contacts.length * 11;
  const completions = 18 + contacts.length * 4;
  const conversion = Math.round((completions / questViews) * 100);
  const hotLeads = contacts.filter((c) => c.status === 'Hot lead').length;

  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-xs text-cyan-100 mb-3">
            <LayoutDashboard size={14} /> Startup Admin
          </div>
          <h2 className="text-3xl font-black">Startup Dashboard</h2>
          <p className="text-white/60 mt-1">Manage profile data, quest info and event contacts.</p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-white/10 border border-white/10 p-4">
        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Select startup</label>
        <select
          value={dashboardStartupId}
          onChange={(e) => setDashboardStartupId(e.target.value)}
          className="mt-2 w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 outline-none font-bold"
        >
          {[...startups]
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
            .map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </select>
      </div>

      <div className={classNames('mt-5 rounded-3xl bg-gradient-to-br p-5 shadow-xl relative overflow-hidden', startup.color)}>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/75">{startup.category}</div>
              <h3 className="text-3xl font-black mt-1">{startup.name}</h3>
            </div>
            <Pencil size={22} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold">
            <div className="flex items-center gap-2"><UserRound size={15} /> {startup.founder}</div>
            <div className="flex items-center gap-2"><MapPin size={15} /> {startup.booth}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <DashboardStat icon={Eye} label="Views" value={questViews} />
        <DashboardStat icon={CheckCircle2} label="Done" value={completions} />
        <DashboardStat icon={BarChart3} label="Conv." value={`${conversion}%`} />
        <DashboardStat icon={Users} label="Leads" value={contacts.length} />
      </div>

      <div className="mt-5 rounded-3xl bg-white/10 border border-white/10 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl">Manage Startup Data</h3>
          <button onClick={onSave} className="rounded-xl bg-cyan-400 text-slate-950 px-3 py-2 text-xs font-black flex items-center gap-1">
            <Save size={14} /> Save
          </button>
        </div>
        {savedDashboard && (
          <div className="mt-3 rounded-2xl bg-emerald-400/15 border border-emerald-300/20 text-emerald-200 px-3 py-2 text-sm font-bold">
            Changes saved in prototype.
          </div>
        )}
        <div className="mt-4 space-y-3">
          <EditableField label="Startup name" value={startup.name} />
          <EditableField label="Founder / role" value={startup.founder} />
          <EditableField label="Category" value={startup.category} />
          <EditableField label="Booth location" value={startup.booth} />
          <EditableTextarea label="Short description" value={startup.description} />
          <EditableTextarea label="Founder secret question" value={startup.question} />
          <EditableField label="Accepted secret answer" value={startup.answer} />
          <EditableTextarea label="Optional social task" value={startup.socialTask} />
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-white/10 border border-white/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-xl">Contacts & Leads</h3>
            <p className="text-white/50 text-sm mt-1">Visitors who completed or interacted with this startup quest.</p>
          </div>
          <button className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs font-black flex items-center gap-1">
            <Download size={14} /> CSV
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-black/20 border border-white/10 p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold">Hot leads</div>
            <div className="text-2xl font-black text-cyan-300">{hotLeads}</div>
          </div>
          <div className="rounded-2xl bg-black/20 border border-white/10 p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold">Follow-ups</div>
            <div className="text-2xl font-black text-cyan-300">{contacts.filter((c) => c.status === 'Follow up').length}</div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {contacts.map((contact) => (
            <div key={contact.email} className="rounded-2xl bg-black/20 border border-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black">{contact.name}</div>
                  <div className="text-xs text-cyan-200 font-bold mt-1">{contact.type} · {contact.company}</div>
                </div>
                <span className={classNames('rounded-full px-2 py-1 text-[10px] font-black', contact.status === 'Hot lead' ? 'bg-emerald-400 text-slate-950' : contact.status === 'Follow up' ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-white/70')}>
                  {contact.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-white/65">Interest: {contact.interest}</div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-xl bg-white/10 border border-white/10 py-2 text-xs font-bold flex items-center justify-center gap-1">
                  <Mail size={13} /> Email
                </button>
                <button className="flex-1 rounded-xl bg-white/10 border border-white/10 py-2 text-xs font-bold flex items-center justify-center gap-1">
                  <Phone size={13} /> Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DashboardStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3 text-center">
      <Icon size={18} className="mx-auto text-cyan-300" />
      <div className="text-lg font-black mt-2">{value}</div>
      <div className="text-[10px] text-white/45 font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
}

function EditableField({ label, value }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-white/35 font-bold">{label}</label>
      <input
        defaultValue={value}
        className="mt-1 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none text-sm"
      />
    </div>
  );
}

function EditableTextarea({ label, value }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-white/35 font-bold">{label}</label>
      <textarea
        defaultValue={value}
        rows={3}
        className="mt-1 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none text-sm resize-none"
      />
    </div>
  );
}
