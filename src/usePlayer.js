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

function makeCode() {
  return 'MIG-' + Array.from(crypto.getRandomValues(new Uint8Array(5)))
    .map(b => b.toString(36).toUpperCase().padStart(2, '0'))
    .join('')
    .slice(0, 8);
}

export function usePlayer() {
  const [player, setPlayer]               = useState(null);
  const [completed, setCompleted]         = useState({});
  const [socialDone, setSocialDone]       = useState({});
  const [actions, setActions]             = useState([]);   // player_actions rows
  const [redemptionCode, setRedemptionCode] = useState(null);
  const [loading, setLoading]             = useState(true);
  const playerRef = useRef(null);

  useEffect(() => { init(); }, []);

  async function init() {
    const deviceId = getDeviceId();

    const { data: p, error } = await supabase
      .from('players')
      .upsert({ device_id: deviceId }, { onConflict: 'device_id' })
      .select()
      .single();

    if (error || !p) { setLoading(false); return; }
    setPlayer(p);
    playerRef.current = p;

    const [{ data: qc }, { data: sc }, { data: rc }, { data: pa }] = await Promise.all([
      supabase.from('quest_completions').select('startup_id').eq('player_id', p.id),
      supabase.from('social_completions').select('startup_id').eq('player_id', p.id),
      supabase.from('redemption_codes').select('code,xp,used').eq('player_id', p.id).limit(1).maybeSingle(),
      supabase.from('player_actions').select('action_type,reference_id,xp_earned').eq('player_id', p.id),
    ]);

    const cMap = {};
    qc?.forEach(r => { cMap[r.startup_id] = true; });
    setCompleted(cMap);

    const sMap = {};
    sc?.forEach(r => { sMap[r.startup_id] = true; });
    setSocialDone(sMap);

    if (rc) setRedemptionCode(rc);
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

  async function generateRedemptionCode(xp) {
    const p = playerRef.current;
    if (!p) return null;
    if (redemptionCode) return redemptionCode;

    for (let i = 0; i < 2; i++) {
      const code = makeCode();
      const { data, error } = await supabase
        .from('redemption_codes')
        .insert({ player_id: p.id, xp, code })
        .select('code,xp,used')
        .single();
      if (!error && data) {
        setRedemptionCode(data);
        await recordAction('redeem_code', 'global', XP.REDEEM_CODE);
        return data;
      }
    }
    return null;
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
    completed,
    socialDone,
    actions,
    redemptionCode,
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
