import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

// XP values — single source of truth for client and DB view
export const XP = {
  BASE:           50,
  QUEST:         100,
  SOCIAL:         50,
  ALL_QUESTS:    500,
  VISIT_BOOTH:    25,
  CONTACT_STARTUP: 75,
  JOIN_MIG:      200,
  REDEEM_CODE:    25,
};

function getDeviceId() {
  let id = localStorage.getItem('mig_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('mig_device_id', id);
  }
  return id;
}

function getTelegramUser() {
  try {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      const u = tg.initDataUnsafe.user;
      return {
        id:   u.id,
        name: [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || null,
      };
    }
  } catch (_) {}
  return null;
}

export function usePlayer() {
  const [player, setPlayer]               = useState(null);
  const [telegramUser, setTelegramUser]   = useState(null);
  const [completed, setCompleted]         = useState({});
  const [socialDone, setSocialDone]       = useState({});
  const [actions, setActions]             = useState([]);
  const [redemptionCodes, setRedemptionCodes] = useState({}); // { [reward_name]: row }
  const [loading, setLoading]             = useState(true);
  const playerRef = useRef(null);

  useEffect(() => { init(); }, []);

  async function init() {
    const deviceId = getDeviceId();
    const tg = getTelegramUser();
    if (tg) setTelegramUser(tg);

    // Build upsert payload — include Telegram fields if available
    const upsertPayload = { device_id: deviceId };
    if (tg) {
      upsertPayload.telegram_id   = tg.id;
      upsertPayload.telegram_name = tg.name;
    }

    const { data: p, error } = await supabase
      .from('players')
      .upsert(upsertPayload, { onConflict: 'device_id' })
      .select()
      .single();

    if (error || !p) { setLoading(false); return; }
    setPlayer(p);
    playerRef.current = p;

    const [{ data: qc }, { data: sc }, { data: rc }, { data: pa }] = await Promise.all([
      supabase.from('quest_completions').select('startup_id').eq('player_id', p.id),
      supabase.from('social_completions').select('startup_id').eq('player_id', p.id),
      supabase.from('redemption_codes').select('code,xp,used,used_at,reward_name,reward_cost').eq('player_id', p.id),
      supabase.from('player_actions').select('action_type,reference_id,xp_earned').eq('player_id', p.id),
    ]);

    const cMap = {};
    qc?.forEach(r => { cMap[r.startup_id] = true; });
    setCompleted(cMap);

    const sMap = {};
    sc?.forEach(r => { sMap[r.startup_id] = true; });
    setSocialDone(sMap);

    if (rc) {
      const map = {};
      rc.forEach(r => { if (r.reward_name) map[r.reward_name] = r; });
      setRedemptionCodes(map);
    }
    setActions(pa || []);

    setLoading(false);
  }

  // Record a one-time action (idempotent — unique constraint in DB)
  async function recordAction(actionType, referenceId = 'global', xpEarned = 0) {
    const p = playerRef.current;
    if (!p) return;
    const { data, error } = await supabase
      .from('player_actions')
      .upsert(
        { player_id: p.id, action_type: actionType, reference_id: referenceId, xp_earned: xpEarned },
        { onConflict: 'player_id,action_type,reference_id', ignoreDuplicates: true },
      )
      .select('action_type,reference_id,xp_earned')
      .maybeSingle();
    if (data) setActions(prev => [...prev.filter(a => !(a.action_type === actionType && a.reference_id === referenceId)), data]);
  }

  async function completeQuest(startupId) {
    const p = playerRef.current;
    if (!p) return;
    await supabase.from('quest_completions').upsert(
      { player_id: p.id, startup_id: startupId },
      { onConflict: 'player_id,startup_id' },
    );
    setCompleted(prev => ({ ...prev, [startupId]: true }));
  }

  async function completeSocial(startupId) {
    const p = playerRef.current;
    if (!p) return;
    await supabase.from('social_completions').upsert(
      { player_id: p.id, startup_id: startupId },
      { onConflict: 'player_id,startup_id' },
    );
    setSocialDone(prev => ({ ...prev, [startupId]: true }));
  }

  async function saveProfile(profileValue) {
    const p = playerRef.current;
    if (!p) return;
    await supabase.from('players').update({ profile: profileValue }).eq('id', p.id);
    setPlayer(prev => ({ ...prev, profile: profileValue }));
  }

  // reward = { name, xp } — server-side XP validation + code issuance
  async function generateRedemptionCode(reward) {
    const deviceId = getDeviceId();
    if (redemptionCodes[reward.name]) return redemptionCodes[reward.name];

    try {
      const { data, error } = await supabase.functions.invoke('generate-redemption', {
        body: { device_id: deviceId, reward_name: reward.name, reward_cost: reward.xp },
      });
      if (error || !data?.code) return null;
      const row = { code: data.code, xp: reward.xp, used: data.used ?? false, reward_name: reward.name, reward_cost: reward.xp };
      setRedemptionCodes(prev => ({ ...prev, [reward.name]: row }));
      // Sync local actions so XP deduction reflects immediately client-side
      setActions(prev => [
        ...prev.filter(a => !(a.action_type === 'spend_xp' && a.reference_id === reward.name)),
        { action_type: 'spend_xp', reference_id: reward.name, xp_earned: -reward.xp },
      ]);
      return row;
    } catch { return null; }
  }

  async function submitContact({ startupId, name, company, email, type, interest }) {
    await supabase.from('contacts').insert({
      startup_id: startupId, name, company, email, type, interest, status: 'New',
    });
    await recordAction('contact_startup', startupId, XP.CONTACT_STARTUP);
  }

  async function submitJoinMig(fields) {
    await supabase.from('mig_leads').insert(fields);
    await recordAction('join_mig', 'global', XP.JOIN_MIG);
  }

  // Derived action lookup helpers
  function hasAction(type, ref = 'global') {
    return actions.some(a => a.action_type === type && a.reference_id === ref);
  }
  function actionXp() {
    return actions.reduce((sum, a) => sum + (a.xp_earned || 0), 0);
  }

  return {
    player,
    telegramUser,
    completed,
    socialDone,
    actions,
    redemptionCodes,
    loading,
    completeQuest,
    completeSocial,
    saveProfile,
    generateRedemptionCode,
    submitContact,
    submitJoinMig,
    recordAction,
    hasAction,
    actionXp,
  };
}
