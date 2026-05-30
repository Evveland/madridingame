import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Reward tier lookup — must match the rewards array in the main app
const TIERS = [
  { xp: 2000, name: 'VIP Raffle Entry'   },
  { xp: 1500, name: 'Limited Merch'      },
  { xp: 1000, name: 'T-Shirt'            },
  { xp:  600, name: 'Madrid in Game Pin' },
  { xp:  300, name: 'Sticker Pack'       },
];
function rewardFor(row) {
  if (row.reward_name) return row.reward_name;
  return TIERS.find(t => row.xp >= t.xp)?.name || 'Reward';
}

export function useRedemptions() {
  const [code, setCode]         = useState('');
  const [result, setResult]     = useState(null);
  const [looking, setLooking]   = useState(false);
  const [marking, setMarking]   = useState(false);

  // Full list for the admin view
  const [allCodes, setAllCodes]     = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setListLoading(true);
    try {
      const { data } = await supabase
        .from('redemption_codes')
        .select('id, code, xp, used, used_at, created_at, reward_name, reward_cost, player_id')
        .order('created_at', { ascending: false });

      if (!data?.length) { setAllCodes([]); return; }

      // Batch-fetch player info
      const playerIds = [...new Set(data.map(r => r.player_id))];
      const { data: players } = await supabase
        .from('players')
        .select('id, telegram_name, profile')
        .in('id', playerIds);

      const pMap = {};
      players?.forEach(p => { pMap[p.id] = p; });

      setAllCodes(data.map(r => ({ ...r, player: pMap[r.player_id] || {}, rewardName: rewardFor(r) })));
    } finally {
      setListLoading(false);
    }
  }

  async function lookup() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLooking(true);
    setResult(null);
    try {
      const { data } = await supabase
        .from('redemption_codes')
        .select('id, code, xp, used, used_at, created_at, reward_name, reward_cost, player_id')
        .eq('code', trimmed)
        .maybeSingle();

      if (!data) {
        setResult({ found: false });
      } else {
        const { data: pData } = await supabase
          .from('players')
          .select('telegram_name, profile')
          .eq('id', data.player_id)
          .maybeSingle();
        setResult({ found: true, row: data, player: pData || {}, rewardName: rewardFor(data) });
      }
    } finally {
      setLooking(false);
    }
  }

  async function markUsed() {
    if (!result?.found || result.row.used) return;
    setMarking(true);
    const now = new Date().toISOString();
    await supabase
      .from('redemption_codes')
      .update({ used: true, used_at: now })
      .eq('id', result.row.id);
    const updated = { ...result.row, used: true, used_at: now };
    setResult(prev => ({ ...prev, row: updated }));
    // Reflect in the list
    setAllCodes(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
    setMarking(false);
  }

  function reset() {
    setCode('');
    setResult(null);
  }

  const stats = {
    total:    allCodes.length,
    redeemed: allCodes.filter(r => r.used).length,
    pending:  allCodes.filter(r => !r.used).length,
  };

  return { code, setCode, result, looking, marking, lookup, markUsed, reset, allCodes, listLoading, stats };
}
