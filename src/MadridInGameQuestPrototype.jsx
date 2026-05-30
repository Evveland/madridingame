import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, MapPin, Gift, Star, QrCode, Users, CheckCircle2, Lock, ArrowLeft, Search, BadgeCheck, Sparkles, Ticket, Target, Crown, MessageCircleQuestion, Store, UserRound, Home, LayoutDashboard, Mail, Download, Save, Eye, Pencil, BarChart3, Phone } from 'lucide-react';
import { usePlayer, XP } from './usePlayer';
import QRCode from 'react-qr-code';
import { useDashboard } from './useDashboard';
import { useMigLeads } from './useMigLeads';
import { supabase } from './supabase';

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
    pin: '1011',
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
    pin: '2727',
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
    pin: '3636',
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
    pin: '4545',
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
    pin: '5454',
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
    pin: '6363',
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
    pin: '7272',
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
    pin: '8181',
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
    pin: '9090',
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
    pin: '0909',
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


function classNames(...items) {
  return items.filter(Boolean).join(' ');
}

export default function MadridInGameQuestPrototype() {
  const [screen, setScreen] = useState('splash');
  const [profile, setProfile] = useState('');
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [redeemed, setRedeemed] = useState(false);
  const [dashboardStartupId, setDashboardStartupId] = useState('evveland');
  const [dashboardAuth, setDashboardAuth] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);

  const { player, completed, socialDone, actions, redemptionCode, loading, completeQuest, completeSocial, saveProfile, generateRedemptionCode, submitContact, submitJoinMig, hasAction, actionXp, recordAction } = usePlayer();
  const [contactStartupId, setContactStartupId] = useState(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [joinType, setJoinType] = useState(null);

  // QR deep-link: ?startup=evveland → open that startup's quest page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('startup');
    if (!sid) return;
    const found = startups.find(s => s.id === sid);
    if (!found) return;
    setSelected(sid);
    setScreen('startup');
    // Record booth visit once player is loaded (may need a short wait)
    const tryRecord = () => {
      recordAction('visit_booth', sid, XP.VISIT_BOOTH);
    };
    if (player) {
      tryRecord();
    } else {
      const t = setTimeout(tryRecord, 2000);
      return () => clearTimeout(t);
    }
  }, [player]);

  const completedCount = Object.keys(completed).length;
  const xp = XP.BASE
    + completedCount * XP.QUEST
    + Object.keys(socialDone).length * XP.SOCIAL
    + (completedCount === startups.length ? XP.ALL_QUESTS : 0)
    + actionXp();

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
    completeQuest(current.id);
    setError('');
    setScreen('success');
  }

  function markSocialDone() {
    if (!current) return;
    completeSocial(current.id);
  }

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .order('xp', { ascending: false })
      .limit(10);
    setLeaderboard(data || []);
  }

  return (
    <div className="min-h-screen bg-[#060816] text-white flex justify-center">
      <div className="w-full max-w-md h-screen flex flex-col bg-gradient-to-b from-[#111735] via-[#080b1a] to-black relative shadow-2xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-48 -right-32 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-8 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <TopBar xp={xp} completedCount={completedCount} />

        <div className="relative z-10 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {screen === 'splash' && (
              <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -18 }} className="pb-6">
                {/* Hero banner */}
                <div className="relative h-52 overflow-hidden">
                  <img src="/venue.jpg" alt="South Summit La Nave Madrid" className="w-full h-full object-cover object-center" />
                  {/* gradient fade to app background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#080b1a]" />
                  {/* logo pinned bottom-left over the image */}
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#1f2020]/90 border border-white/20 backdrop-blur flex items-center justify-center overflow-hidden shadow-xl">
                      <img src={MIG_LOGO} alt="Madrid in Game" className="w-11 h-11 object-cover" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/60 font-bold leading-none">Madrid in Game</div>
                      <div className="text-white font-black text-lg leading-tight">South Summit</div>
                    </div>
                  </div>
                  {/* badge top-right */}
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-xs text-cyan-200 font-bold">
                    <Sparkles size={12} /> Quest
                  </div>
                </div>

                {/* Content below hero */}
                <div className="px-5 mt-4">
                  <h1 className="text-3xl font-black leading-none tracking-tight">
                    Explore the <span className="text-cyan-300">Gaming</span> ecosystem
                  </h1>
                  <p className="text-white/55 mt-2 text-sm leading-relaxed">
                    Visit startup booths, ask founders a secret question, earn XP and redeem merch.
                  </p>

                  <div className="mt-4 rounded-2xl p-4 bg-white/10 border border-white/10 backdrop-blur">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <Stat value="10" label="Startups" />
                      <Stat value="2K" label="Max XP" />
                      <Stat value="5" label="Rewards" />
                    </div>
                  </div>

                  <button onClick={() => setScreen('onboarding')} className="mt-4 w-full rounded-2xl bg-cyan-400 text-slate-950 font-black py-4 shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition">
                    Start Quest
                  </button>
                  {hasAction('join_mig') ? (
                    <div className="mt-3 w-full rounded-2xl bg-emerald-400/10 border border-emerald-300/20 text-emerald-300 font-bold py-4 flex items-center justify-center gap-2 text-sm">
                      <CheckCircle2 size={17} /> Joined Madrid in Game · +{XP.JOIN_MIG} XP
                    </div>
                  ) : (
                    <button onClick={() => { setJoinType(null); setScreen('joinType'); }} className="mt-3 w-full rounded-2xl bg-white/10 border border-cyan-400/30 text-cyan-300 font-black py-4 active:scale-[0.98] transition">
                      Join Madrid in Game · +{XP.JOIN_MIG} XP →
                    </button>
                  )}
                  <button onClick={() => setScreen('map')} className="mt-3 w-full rounded-2xl bg-white/5 border border-white/10 text-white/50 font-semibold py-3">
                    Preview Startup Map
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'onboarding' && (
              <motion.div key="onboarding" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-5 pb-6">
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
                <button disabled={!profile} onClick={() => { saveProfile(profile); setScreen('map'); }} className={classNames('mt-6 w-full rounded-2xl font-black py-4 transition', profile ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30' : 'bg-white/10 text-white/30')}>
                  Enter Mission Map
                </button>
              </motion.div>
            )}

            {screen === 'map' && (
              <motion.div key="map" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4 pb-6">
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
              <motion.div key="startup" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="px-5 pt-4 pb-6">
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
                  <MiniTask icon={QrCode} title="Visit Booth" subtitle={`Scan QR · +${XP.VISIT_BOOTH} XP`} done={hasAction('visit_booth', current.id)} />
                  <MiniTask icon={MessageCircleQuestion} title="Ask Founder" subtitle={`+${current.xp} XP`} done={!!completed[current.id]} />
                  <MiniTask icon={Users} title="Social Task" subtitle={`Optional +${XP.SOCIAL} XP`} done={!!socialDone[current.id]} />
                  <MiniTask icon={Mail} title="Share Details" subtitle={`+${XP.CONTACT_STARTUP} XP`} done={hasAction('contact_startup', current.id)} />
                  <MiniTask icon={Gift} title="Merch" subtitle="Redeem XP" done={xp >= 300} />
                </div>
                <button onClick={() => setScreen('question')} className="mt-5 w-full rounded-2xl bg-cyan-400 text-slate-950 font-black py-4 shadow-lg shadow-cyan-500/30">
                  Start Founder Question
                </button>
                {!socialDone[current.id] && (
                  <button onClick={markSocialDone} className="mt-3 w-full rounded-2xl bg-white/10 border border-white/10 font-bold py-4">
                    Complete Social Task +{XP.SOCIAL} XP
                  </button>
                )}
                {hasAction('contact_startup', current.id) ? (
                  <div className="mt-3 w-full rounded-2xl bg-emerald-400/10 border border-emerald-300/20 text-emerald-300 font-bold py-4 flex items-center justify-center gap-2 text-sm">
                    <CheckCircle2 size={17} /> Details shared · +{XP.CONTACT_STARTUP} XP earned
                  </div>
                ) : (
                  <button
                    onClick={() => { setContactStartupId(current.id); setScreen('contactForm'); }}
                    className="mt-3 w-full rounded-2xl bg-white/5 border border-white/10 text-white/60 font-semibold py-4 flex items-center justify-center gap-2 active:scale-[0.98] transition"
                  >
                    <Mail size={17} /> Share your details · +{XP.CONTACT_STARTUP} XP
                  </button>
                )}
              </motion.div>
            )}

            {screen === 'question' && current && (
              <motion.div key="question" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="px-5 pt-4 pb-6">
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
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-5 pt-12 pb-6 text-center">
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
              <motion.div key="store" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4 pb-6">
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
                {!redemptionCode ? (
                  <button
                    disabled={xp < 300 || generatingCode}
                    onClick={async () => {
                      setGeneratingCode(true);
                      await generateRedemptionCode(xp);
                      setGeneratingCode(false);
                    }}
                    className={classNames('mt-5 w-full rounded-2xl font-black py-4 transition', xp >= 300 ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 active:scale-[0.98]' : 'bg-white/10 text-white/40')}
                  >
                    {generatingCode ? 'Generating…' : xp >= 300 ? 'Generate Redemption Code' : `${300 - xp} XP to unlock`}
                  </button>
                ) : (
                  <div className="mt-5 rounded-3xl bg-white text-slate-950 p-6 text-center">
                    <QrCode className="mx-auto" size={86} />
                    <div className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Show this at the booth</div>
                    <div className="text-3xl font-black mt-1 tracking-widest">{redemptionCode.code}</div>
                    <div className="mt-3 text-sm font-bold text-slate-500">{redemptionCode.xp} XP · {redemptionCode.used ? '✓ Redeemed' : 'Not yet redeemed'}</div>
                    {redemptionCode.used && (
                      <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                        <CheckCircle2 size={13} /> Code used — merch collected!
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {screen === 'leaderboard' && (
              <motion.div key="leaderboard" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4 pb-6">
                <h2 className="text-3xl font-black">Leaderboard</h2>
                <p className="text-white/60 mt-1">Top South Summit explorers today.</p>
                <div className="mt-6 space-y-3">
                  {leaderboard === null ? (
                    <p className="text-white/40 text-sm text-center py-8">Loading…</p>
                  ) : leaderboard.length === 0 ? (
                    <p className="text-white/40 text-sm text-center py-8">No players yet — be the first!</p>
                  ) : (
                    leaderboard.map((row, i) => {
                      const isMe = player && row.player_id === player.id;
                      return (
                        <div key={row.player_id} className={classNames('rounded-2xl p-4 border flex items-center gap-4', isMe ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'bg-white/10 border-white/10')}>
                          <div className="text-2xl font-black w-8">#{i + 1}</div>
                          <div className="flex-1">
                            <div className="font-black">{isMe ? 'You' : (row.profile || 'Explorer')}</div>
                            <div className={classNames('text-sm', isMe ? 'text-slate-700' : 'text-white/60')}>{row.quests_completed} startups visited</div>
                          </div>
                          <div className="font-black">{row.xp} XP</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {screen === 'joinType' && (
              <JoinTypePicker
                onSelect={(t) => { setJoinType(t); setScreen('joinForm'); }}
                onBack={() => setScreen('splash')}
              />
            )}

            {screen === 'joinForm' && joinType && (
              <JoinForm
                type={joinType}
                onSubmit={async (fields) => {
                  await submitJoinMig({ type: joinType, ...fields });
                  setScreen('joinSuccess');
                }}
                onBack={() => setScreen('joinType')}
              />
            )}

            {screen === 'joinSuccess' && (
              <motion.div key="joinSuccess" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-5 pt-16 pb-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                  className="mx-auto w-20 h-20 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <CheckCircle2 size={44} />
                </motion.div>
                <h2 className="text-3xl font-black mt-6">You're in!</h2>
                <p className="text-white/60 mt-3 leading-relaxed">The Madrid in Game team will reach out soon. Welcome to the ecosystem.</p>
                <div className="mt-5 rounded-2xl bg-cyan-400/10 border border-cyan-300/20 p-4 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold">XP earned</div>
                    <div className="text-2xl font-black text-cyan-300 mt-0.5">+{XP.JOIN_MIG} XP</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Interest</div>
                    <div className="font-black mt-0.5">{joinType}</div>
                  </div>
                </div>
                <button onClick={() => setScreen('splash')} className="mt-5 w-full rounded-2xl bg-cyan-400 text-slate-950 font-black py-4">
                  Back to Home
                </button>
              </motion.div>
            )}

            {screen === 'contactForm' && contactStartupId && (
              <ContactForm
                startup={startups.find(s => s.id === contactStartupId)}
                playerProfile={player?.profile || ''}
                onSubmit={async (fields) => {
                  await submitContact({ startupId: contactStartupId, ...fields });
                  // do NOT navigate here — ContactForm shows success screen first,
                  // then calls onBack when user taps "Back to Startup"
                }}
                onBack={() => setScreen('startup')}
              />
            )}

            {screen === 'pin' && (
              <PinPad
                onSuccess={(result) => {
                  if (result === '__mig_admin__') {
                    setScreen('migAdmin');
                  } else {
                    setDashboardAuth(result);
                    setDashboardStartupId(result);
                    setScreen('dashboard');
                  }
                }}
                onBack={() => setScreen('splash')}
              />
            )}

            {screen === 'migAdmin' && (
              <MigAdminScreen onSignOut={() => setScreen('splash')} />
            )}

            {screen === 'dashboard' && (
              <DashboardScreen
                startup={dashboardStartup}
                startups={startups}
                dashboardStartupId={dashboardStartupId}
                setDashboardStartupId={setDashboardStartupId}
                onSignOut={() => { setDashboardAuth(null); setScreen('splash'); }}
                locked={!!dashboardAuth}
              />
            )}
          </AnimatePresence>
        </div>

        <BottomNav screen={screen} setScreen={setScreen} dashboardAuth={dashboardAuth} />
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TopBar({ xp, completedCount }) {
  return (
    <div className="relative z-20 shrink-0 px-5 pt-4 pb-2 flex items-center justify-between">
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

function BottomNav({ screen, setScreen, dashboardAuth }) {
  const items = [
    ['splash', Home, 'Home'],
    ['map', Target, 'Quests'],
    ['store', Store, 'Store'],
    ['leaderboard', Trophy, 'Rank'],
    ['dashboard', LayoutDashboard, 'Startup'],
  ];
  function handleNav(id) {
    if (id === 'dashboard') {
      setScreen(dashboardAuth ? 'dashboard' : 'pin');
    } else {
      if (id === 'leaderboard') fetchLeaderboard();
      setScreen(id);
    }
  }
  const activeId = screen === 'pin' ? 'dashboard' : screen;
  return (
    <div className="relative z-30 p-4 shrink-0">
      <div className="rounded-3xl bg-black/70 backdrop-blur-xl border border-white/10 p-2 grid grid-cols-5 gap-1 shadow-2xl">
        {items.map(([id, Icon, label]) => (
          <button key={id} onClick={() => handleNav(id)} className={classNames('rounded-2xl py-3 flex flex-col items-center gap-1 text-xs font-bold transition', activeId === id ? 'bg-cyan-400 text-slate-950' : 'text-white/60')}>
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

const JOIN_OPTIONS = [
  { id: 'Startup',            icon: Target,        desc: 'Apply to join the Madrid in Game startup programme' },
  { id: 'Mentor',             icon: UserRound,      desc: 'Share your expertise with the gaming ecosystem' },
  { id: 'Partnership',        icon: Users,          desc: 'Explore co-marketing or commercial partnerships' },
  { id: 'Cluster membership', icon: LayoutDashboard,desc: 'Become a member of the Madrid in Game cluster' },
  { id: 'Other',              icon: Sparkles,       desc: "Tell us how you'd like to get involved" },
];

function JoinTypePicker({ onSelect, onBack }) {
  return (
    <motion.div key="joinType" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4 pb-6">
      <Back onClick={onBack} />
      <div className="mt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-xs text-cyan-200 font-bold mb-4">
          <Sparkles size={13} /> Join Madrid in Game
        </div>
        <h2 className="text-3xl font-black leading-tight">How would you like<br />to get involved?</h2>
        <p className="text-white/50 mt-2 text-sm">Choose the option that best describes you.</p>
      </div>
      <div className="mt-6 space-y-3">
        {JOIN_OPTIONS.map(({ id, icon: Icon, desc }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="w-full text-left rounded-2xl bg-white/10 border border-white/10 p-4 flex items-center gap-4 active:scale-[0.98] active:bg-white/15 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-300/20 flex items-center justify-center shrink-0 text-cyan-300">
              <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black">{id}</div>
              <div className="text-xs text-white/45 mt-0.5 leading-snug">{desc}</div>
            </div>
            <ArrowLeft size={16} className="rotate-180 text-white/30 shrink-0" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function JoinForm({ type, onSubmit, onBack }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const messagePlaceholder = {
    'Startup':            'Tell us about your startup, stage and what you need…',
    'Mentor':             'What areas can you mentor in? Availability?',
    'Partnership':        'What kind of partnership are you interested in?',
    'Cluster membership': 'Why do you want to join the cluster?',
    'Other':              'How would you like to get involved?',
  }[type] || 'Tell us more…';

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || null,
      website: website.trim() || null,
      message: message.trim() || null,
    });
  }

  return (
    <motion.div key="joinForm" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4 pb-6">
      <Back onClick={onBack} />
      <div className="mt-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-xs text-cyan-200 font-bold mb-3">
          {type}
        </div>
        <h2 className="text-2xl font-black">Your details</h2>
        <p className="text-white/50 mt-1 text-sm">The Madrid in Game team will be in touch.</p>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email *</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Company / Organisation</label>
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Where are you from?"
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Website</label>
          <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" type="url"
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Tell us more</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={messagePlaceholder} rows={3}
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold resize-none" />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !email.trim() || submitting}
        className={classNames('mt-6 w-full rounded-2xl font-black py-4 transition', name.trim() && email.trim() ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 active:scale-[0.98]' : 'bg-white/10 text-white/40')}
      >
        {submitting ? 'Sending…' : 'Send to Madrid in Game'}
      </button>
    </motion.div>
  );
}

function ContactForm({ startup, playerProfile, onSubmit, onBack }) {
  const [name, setName]         = useState('');
  const [company, setCompany]   = useState('');
  const [email, setEmail]       = useState('');
  const [type, setType]         = useState(playerProfile || '');
  const [interest, setInterest] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    await onSubmit({ name: name.trim(), company: company.trim(), email: email.trim(), type, interest: interest.trim() });
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <motion.div key="contactDone" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-5 pt-16 pb-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 12 }}
          className="mx-auto w-20 h-20 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <CheckCircle2 size={44} />
        </motion.div>
        <h2 className="text-3xl font-black mt-6">Details Shared!</h2>
        <p className="text-white/60 mt-3">{startup?.name} will be in touch after the event.</p>
        <div className="mt-5 rounded-2xl bg-cyan-400/10 border border-cyan-300/20 p-4 inline-flex items-center gap-3 mx-auto">
          <Trophy size={20} className="text-cyan-300" />
          <span className="font-black text-cyan-300 text-xl">+{XP.CONTACT_STARTUP} XP</span>
        </div>
        <button onClick={onBack} className="mt-5 w-full rounded-2xl bg-cyan-400 text-slate-950 font-black py-4">
          Back to Startup
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div key="contactForm" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4 pb-6">
      <Back onClick={onBack} />
      <div className="mt-6">
        <div className={classNames('h-16 rounded-2xl bg-gradient-to-br flex items-center px-5 mb-5', startup?.color || 'from-cyan-500 to-blue-600')}>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Sharing with</div>
            <div className="font-black text-xl">{startup?.name}</div>
          </div>
        </div>
        <h2 className="text-2xl font-black">Leave your details</h2>
        <p className="text-white/50 mt-1 text-sm">The founder will follow up after South Summit.</p>
      </div>

      <div className="mt-6 space-y-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Company / Organisation</label>
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Where are you from?"
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email *</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">I am a…</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold bg-[#111735]">
            <option value="">Select your profile</option>
            {['Investor', 'Startup founder', 'Corporate / brand', 'Publisher / gaming industry', 'Student / talent', 'Visitor / curious'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">What interests you about {startup?.name}?</label>
          <input value={interest} onChange={e => setInterest(e.target.value)} placeholder="e.g. Partnership, investment, demo…"
            className="mt-1.5 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-sm font-semibold" />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !email.trim() || submitting}
        className={classNames('mt-6 w-full rounded-2xl font-black py-4 transition', name.trim() && email.trim() ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 active:scale-[0.98]' : 'bg-white/10 text-white/40')}
      >
        {submitting ? 'Submitting…' : 'Share My Details'}
      </button>
    </motion.div>
  );
}

function PinPad({ onSuccess, onBack }) {
  const [digits, setDigits] = useState([]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function press(d) {
    if (digits.length >= 4) return;
    const next = [...digits, d];
    setDigits(next);
    setError(false);
    if (next.length === 4) {
      const code = next.join('');
      if (code === '2025') { onSuccess('__mig_admin__'); return; }
      const match = startups.find((s) => s.pin === code);
      if (match) {
        onSuccess(match.id);
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => { setDigits([]); setShake(false); }, 700);
      }
    }
  }

  function backspace() {
    setDigits((d) => d.slice(0, -1));
    setError(false);
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', '⌫'];

  return (
    <motion.div key="pin" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4 pb-6">
      <Back onClick={onBack} />
      <div className="mt-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-300/20 flex items-center justify-center mx-auto mb-6">
          <Lock size={28} className="text-cyan-300" />
        </div>
        <h2 className="text-3xl font-black">Startup Access</h2>
        <p className="text-white/60 mt-2 text-sm">Enter your 4-digit booth access code</p>
      </div>

      <motion.div
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex justify-center gap-5 mt-10"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={classNames(
              'w-5 h-5 rounded-full border-2 transition-all duration-150',
              digits.length > i
                ? error ? 'bg-rose-400 border-rose-400' : 'bg-cyan-400 border-cyan-400 scale-110'
                : 'border-white/30 bg-transparent'
            )}
          />
        ))}
      </motion.div>

      {error && (
        <p className="text-center text-rose-300 text-sm mt-4 font-semibold">Wrong code — try again</p>
      )}

      <div className="mt-8 grid grid-cols-3 gap-3 px-4">
        {keys.map((k, i) =>
          k === null ? (
            <div key={i} />
          ) : k === '⌫' ? (
            <button
              key={i}
              onClick={backspace}
              className="rounded-2xl py-5 flex items-center justify-center bg-white/5 border border-white/10 text-white/50 active:scale-95 transition"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              key={i}
              onClick={() => press(k)}
              className="rounded-2xl py-5 text-2xl font-black text-center bg-white/10 border border-white/10 active:scale-95 active:bg-white/20 transition"
            >
              {k}
            </button>
          )
        )}
      </div>

      <p className="text-center text-white/30 text-xs mt-8">Your access code was provided by Madrid in Game</p>
    </motion.div>
  );
}

const JOIN_TYPE_COLORS = {
  'Startup':            'bg-pink-500/20 text-pink-200 border-pink-400/20',
  'Mentor':             'bg-violet-500/20 text-violet-200 border-violet-400/20',
  'Partnership':        'bg-cyan-500/20 text-cyan-200 border-cyan-400/20',
  'Cluster membership': 'bg-emerald-500/20 text-emerald-200 border-emerald-400/20',
  'Other':              'bg-white/10 text-white/60 border-white/10',
};
const STATUS_COLORS = {
  'New':       'bg-white/10 text-white/70',
  'Contacted': 'bg-cyan-400 text-slate-950',
  'Qualified': 'bg-emerald-400 text-slate-950',
  'Closed':    'bg-white/20 text-white/40',
};

function MigAdminScreen({ onSignOut }) {
  const db = useMigLeads();
  return (
    <motion.div key="migAdmin" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="px-5 pt-4 pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-xs text-cyan-100 mb-3">
            <LayoutDashboard size={14} /> MiG Admin
          </div>
          <h2 className="text-3xl font-black">Join Leads</h2>
          <p className="text-white/60 mt-1">People who want to get involved with Madrid in Game.</p>
        </div>
        <button onClick={onSignOut} className="shrink-0 mt-1 flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs font-bold text-white/60 active:scale-95 transition">
          <Lock size={13} /> Sign out
        </button>
      </div>

      {/* Summary stats */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-white/10 border border-white/10 p-4 col-span-2 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Total leads</div>
            <div className="text-4xl font-black text-cyan-300 mt-1">{db.allLeads.length}</div>
          </div>
          <button onClick={db.downloadCSV} disabled={!db.allLeads.length}
            className="flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs font-black disabled:opacity-40 active:scale-95 transition">
            <Download size={14} /> CSV
          </button>
        </div>
        {Object.entries(db.countByType).map(([type, count]) => (
          <div key={type} className={classNames('rounded-2xl border p-3', JOIN_TYPE_COLORS[type] || 'bg-white/10 text-white/60 border-white/10')}>
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-70">{type}</div>
            <div className="text-2xl font-black mt-1">{count}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Startup', 'Mentor', 'Partnership', 'Cluster membership', 'Other'].map(f => (
          <button key={f} onClick={() => db.setFilter(f)}
            className={classNames('shrink-0 rounded-full px-3 py-1.5 text-xs font-black transition',
              db.filter === f ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-white/60')}>
            {f}
          </button>
        ))}
      </div>

      {/* Lead list */}
      <div className="mt-4 space-y-3">
        {db.loading ? (
          <p className="text-white/40 text-sm text-center py-8">Loading…</p>
        ) : db.leads.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
            <p className="text-white/30 text-sm">No leads yet{db.filter !== 'All' ? ` for ${db.filter}` : ''}.</p>
            <p className="text-white/20 text-xs mt-1">They'll appear here once people submit the Join form.</p>
          </div>
        ) : (
          db.leads.map(lead => (
            <div key={lead.id} className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-black truncate">{lead.name}</div>
                  <div className="text-xs text-white/50 mt-0.5 truncate">{[lead.company, lead.email].filter(Boolean).join(' · ')}</div>
                  {lead.website && <div className="text-xs text-cyan-300/70 mt-0.5 truncate">{lead.website}</div>}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={classNames('rounded-full px-2 py-0.5 text-[10px] font-black border', JOIN_TYPE_COLORS[lead.type] || 'bg-white/10 text-white/60 border-white/10')}>
                    {lead.type}
                  </span>
                  <select value={lead.status} onChange={e => db.updateStatus(lead.id, e.target.value)}
                    className={classNames('rounded-full px-2 py-0.5 text-[10px] font-black outline-none cursor-pointer', STATUS_COLORS[lead.status] || STATUS_COLORS['New'])}>
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
              {lead.message && <p className="mt-2 text-xs text-white/50 leading-snug line-clamp-2">"{lead.message}"</p>}
              <div className="mt-3 flex gap-2">
                <a href={`mailto:${lead.email}`}
                  className="flex-1 rounded-xl bg-white/10 border border-white/10 py-2 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition">
                  <Mail size={13} /> Email
                </a>
                <div className="text-xs text-white/30 flex items-center px-3">{lead.created_at?.slice(0, 10)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

const APP_URL = 'https://project-2gjoz.vercel.app';

function BoothQR({ startup }) {
  const url = `${APP_URL}/?startup=${startup.id}`;

  function downloadSVG() {
    const svg = document.getElementById(`qr-${startup.id}`);
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${startup.id}-booth-qr.svg`;
    a.click();
  }

  return (
    <div className="mt-5 rounded-3xl bg-white/10 border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-black text-xl">Booth QR Code</h3>
          <p className="text-white/50 text-xs mt-0.5">Show this to visitors — scanning opens your quest.</p>
        </div>
        <button onClick={downloadSVG}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs font-black active:scale-95 transition">
          <Download size={14} /> SVG
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className={classNames('rounded-2xl p-5 bg-gradient-to-br relative overflow-hidden', startup.color)}>
          <div className="absolute inset-0 bg-white/10" />
          <div className="relative bg-white rounded-xl p-3 shadow-lg">
            <QRCode
              id={`qr-${startup.id}`}
              value={url}
              size={180}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="M"
            />
          </div>
        </div>

        <div className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold mb-1">Booth URL</div>
          <div className="text-xs font-mono text-cyan-300 break-all">{url}</div>
        </div>

        <div className="w-full grid grid-cols-2 gap-2 text-center">
          <div className="rounded-2xl bg-black/20 border border-white/10 p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold">Booth</div>
            <div className="font-black text-sm mt-0.5">{startup.booth}</div>
          </div>
          <div className="rounded-2xl bg-black/20 border border-white/10 p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold">XP for visit</div>
            <div className="font-black text-sm mt-0.5 text-cyan-300">+{XP.VISIT_BOOTH} XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Owns the useDashboard hook + the motion wrapper so StartupDashboard stays hook-free
function DashboardScreen({ startup, startups, dashboardStartupId, setDashboardStartupId, onSignOut, locked }) {
  const db = useDashboard(startup);
  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
      <StartupDashboard
        startup={startup}
        startups={startups}
        dashboardStartupId={dashboardStartupId}
        setDashboardStartupId={setDashboardStartupId}
        onSignOut={onSignOut}
        locked={locked}
        db={db}
      />
    </motion.div>
  );
}

function StartupDashboard({ startup, startups, dashboardStartupId, setDashboardStartupId, onSignOut, locked, db }) {
  const { form, setField, contacts, questViews, loading, saving, saved, save, updateContactStatus, downloadCSV } = db;

  const hotLeads  = contacts.filter(c => c.status === 'Hot lead').length;
  const followUps = contacts.filter(c => c.status === 'Follow up').length;
  const conversion = questViews > 0 ? Math.round((contacts.length / questViews) * 100) : 0;

  return (
    <div className="px-5 pt-4 pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-300/20 text-xs text-cyan-100 mb-3">
            <LayoutDashboard size={14} /> Startup Admin
          </div>
          <h2 className="text-3xl font-black">Startup Dashboard</h2>
          <p className="text-white/60 mt-1">Manage profile data, quest info and event contacts.</p>
        </div>
        {locked && (
          <button onClick={onSignOut} className="shrink-0 mt-1 flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs font-bold text-white/60 active:scale-95 transition">
            <Lock size={13} /> Sign out
          </button>
        )}
      </div>

      {!locked && (
        <div className="mt-5 rounded-3xl bg-white/10 border border-white/10 p-4">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Select startup</label>
          <select value={dashboardStartupId} onChange={e => setDashboardStartupId(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 outline-none font-bold">
            {[...startups].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })).map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className={classNames('mt-5 rounded-3xl bg-gradient-to-br p-5 shadow-xl relative overflow-hidden', startup.color)}>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-xl" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-widest text-white/75">{form.category || startup.category}</div>
          <h3 className="text-3xl font-black mt-1">{form.name || startup.name}</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold">
            <div className="flex items-center gap-2"><UserRound size={15} />{form.founder || startup.founder}</div>
            <div className="flex items-center gap-2"><MapPin size={15} />{form.booth || startup.booth}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <DashboardStat icon={Eye}         label="Quests"  value={questViews} />
        <DashboardStat icon={CheckCircle2} label="Leads"   value={contacts.length} />
        <DashboardStat icon={BarChart3}   label="Conv."   value={`${conversion}%`} />
        <DashboardStat icon={Users}       label="Hot"     value={hotLeads} />
      </div>

      {/* ── Booth QR code ── */}
      <BoothQR startup={startup} />

      {/* ── Editable profile ── */}
      <div className="mt-5 rounded-3xl bg-white/10 border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-xl">Startup Profile</h3>
          <button onClick={save} disabled={saving || loading}
            className="rounded-xl bg-cyan-400 text-slate-950 px-3 py-2 text-xs font-black flex items-center gap-1 active:scale-95 transition disabled:opacity-50">
            <Save size={14} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
        {saved && (
          <div className="mb-4 rounded-2xl bg-emerald-400/15 border border-emerald-300/20 text-emerald-200 px-3 py-2 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={15} /> Saved to database
          </div>
        )}
        {loading ? (
          <p className="text-white/40 text-sm text-center py-4">Loading…</p>
        ) : (
          <div className="space-y-3">
            <EditableField    label="Startup name"          value={form.name}        onChange={v => setField('name', v)} />
            <EditableField    label="Founder / role"        value={form.founder}     onChange={v => setField('founder', v)} />
            <EditableField    label="Category"              value={form.category}    onChange={v => setField('category', v)} />
            <EditableField    label="Booth location"        value={form.booth}       onChange={v => setField('booth', v)} />
            <EditableTextarea label="Short description"     value={form.description} onChange={v => setField('description', v)} />
            <EditableTextarea label="Quest mission text"    value={form.mission}     onChange={v => setField('mission', v)} />
            <EditableTextarea label="Secret question"       value={form.question}    onChange={v => setField('question', v)} />
            <EditableField    label="Accepted answer"       value={form.answer}      onChange={v => setField('answer', v)} />
            <EditableTextarea label="Optional social task"  value={form.social_task} onChange={v => setField('social_task', v)} />
          </div>
        )}
      </div>

      {/* ── Contacts & Leads ── */}
      <div className="mt-5 rounded-3xl bg-white/10 border border-white/10 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-black text-xl">Contacts & Leads</h3>
            <p className="text-white/50 text-sm mt-0.5">People who shared their details at your booth.</p>
          </div>
          <button onClick={downloadCSV} disabled={contacts.length === 0}
            className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs font-black flex items-center gap-1 disabled:opacity-40">
            <Download size={14} /> CSV
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-2xl bg-black/20 border border-white/10 p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold">Hot leads</div>
            <div className="text-2xl font-black text-cyan-300">{hotLeads}</div>
          </div>
          <div className="rounded-2xl bg-black/20 border border-white/10 p-3">
            <div className="text-[10px] uppercase tracking-widest text-white/35 font-bold">Follow-ups</div>
            <div className="text-2xl font-black text-cyan-300">{followUps}</div>
          </div>
        </div>

        {loading ? (
          <p className="text-white/40 text-sm text-center py-4">Loading…</p>
        ) : contacts.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-6">No contacts yet — share your booth QR!</p>
        ) : (
          <div className="space-y-3">
            {contacts.map(contact => (
              <div key={contact.id} className="rounded-2xl bg-black/20 border border-white/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-black truncate">{contact.name}</div>
                    <div className="text-xs text-cyan-200 font-bold mt-0.5 truncate">{[contact.type, contact.company].filter(Boolean).join(' · ')}</div>
                    {contact.email && <div className="text-xs text-white/45 mt-0.5 truncate">{contact.email}</div>}
                  </div>
                  <select
                    value={contact.status || 'New'}
                    onChange={e => updateContactStatus(contact.id, e.target.value)}
                    className={classNames('shrink-0 rounded-full px-2 py-1 text-[10px] font-black outline-none cursor-pointer',
                      contact.status === 'Hot lead'  ? 'bg-emerald-400 text-slate-950' :
                      contact.status === 'Follow up' ? 'bg-cyan-400 text-slate-950'    : 'bg-white/10 text-white/70')}
                  >
                    <option>New</option>
                    <option>Follow up</option>
                    <option>Hot lead</option>
                    <option>Closed</option>
                  </select>
                </div>
                {contact.interest && <div className="mt-2 text-xs text-white/55 leading-snug">"{contact.interest}"</div>}
                <div className="mt-3 flex gap-2">
                  <a href={`mailto:${contact.email}`}
                    className="flex-1 rounded-xl bg-white/10 border border-white/10 py-2 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition">
                    <Mail size={13} /> Email
                  </a>
                  <div className="flex-1 rounded-xl bg-white/5 border border-white/5 py-2 text-xs font-bold flex items-center justify-center gap-1 text-white/30">
                    <Sparkles size={13} /> {contact.created_at?.slice(0, 10) || '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
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

function EditableField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-white/35 font-bold">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none text-sm focus:border-cyan-400/50 transition"
      />
    </div>
  );
}

function EditableTextarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-white/35 font-bold">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none text-sm resize-none focus:border-cyan-400/50 transition"
      />
    </div>
  );
}
