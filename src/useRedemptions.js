import { useState } from 'react';
import { supabase } from './supabase';

export function useRedemptions() {
  const [code, setCode]         = useState('');
  const [result, setResult]     = useState(null); // null | { found: false } | { found: true, row, reward }
  const [looking, setLooking]   = useState(false);
  const [marking, setMarking]   = useState(false);

  // Reward tier lookup — must match the rewards array in the main app
  const TIERS = [
    { xp: 2000, name: 'VIP Raffle Entry'  },
    { xp: 1500, name: 'Limited Merch'     },
    { xp: 1000, name: 'T-Shirt'           },
    { xp:  600, name: 'Madrid in Game Pin' },
    { xp:  300, name: 'Sticker Pack'      },
  ];
  function rewardFor(xp) {
    return TIERS.find(t => xp >= t.xp) || TIERS[TIERS.length - 1];
  }

  async function lookup() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLooking(true);
    setResult(null);
    try {
      const { data } = await supabase
        .from('redemption_codes')
        .select('id, code, xp, used, used_at, created_at, player_id')
        .eq('code', trimmed)
        .maybeSingle();

      if (!data) {
        setResult({ found: false });
      } else {
        // Try to get telegram_name for the player
        const { data: pData } = await supabase
          .from('players')
          .select('telegram_name, profile')
          .eq('id', data.player_id)
          .maybeSingle();
        setResult({
          found:  true,
          row:    data,
          player: pData || {},
          reward: rewardFor(data.xp),
        });
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
    setResult(prev => ({ ...prev, row: { ...prev.row, used: true, used_at: now } }));
    setMarking(false);
  }

  function reset() {
    setCode('');
    setResult(null);
  }

  return { code, setCode, result, looking, marking, lookup, markUsed, reset };
}
