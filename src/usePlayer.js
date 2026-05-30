import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

function getDeviceId() {
  let id = localStorage.getItem('mig_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('mig_device_id', id);
  }
  return id;
}

export function usePlayer() {
  const [player, setPlayer]       = useState(null);
  const [completed, setCompleted] = useState({});
  const [socialDone, setSocialDone] = useState({});
  const [loading, setLoading]     = useState(true);
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

    const [{ data: qc }, { data: sc }] = await Promise.all([
      supabase.from('quest_completions').select('startup_id').eq('player_id', p.id),
      supabase.from('social_completions').select('startup_id').eq('player_id', p.id),
    ]);

    const cMap = {};
    qc?.forEach(r => { cMap[r.startup_id] = true; });
    setCompleted(cMap);

    const sMap = {};
    sc?.forEach(r => { sMap[r.startup_id] = true; });
    setSocialDone(sMap);

    setLoading(false);
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

  return { player, completed, socialDone, loading, completeQuest, completeSocial, saveProfile };
}
