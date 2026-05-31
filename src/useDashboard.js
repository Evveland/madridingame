import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { supabase } from './supabase';

// Telegram deep link — scanning opens the app inside Telegram, not a browser
const APP_URL = 'https://t.me/madridingame_bot/open';

function formFromStatic(s) {
  if (!s) return {};
  return {
    name:        s.name        || '',
    founder:     s.founder     || '',
    category:    s.category    || '',
    booth:       s.booth       || '',
    description: s.description || '',
    mission:     s.mission     || '',
    question:    s.question    || '',
    answer:      s.answer      || '',
    social_task:  s.socialTask   || '',
    social_links: s.social_links || {},
  };
}

export function useDashboard(staticStartup) {
  const id = staticStartup?.id;

  const [form, setForm]             = useState(() => formFromStatic(staticStartup));
  const [contacts, setContacts]     = useState([]);
  const [questViews, setQuestViews] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [boothQrDataUrl, setBoothQrDataUrl] = useState('');

  useEffect(() => {
    if (!id) return;
    setForm(formFromStatic(staticStartup));
    setLoading(true);
    // Generate QR code data URL for the booth
    QRCode.toDataURL(`${APP_URL}?startapp=${id}`, {
      width: 220,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then(url => setBoothQrDataUrl(url)).catch(() => {});
    load();

    async function load() {
      try {
        const [profileRes, contactsRes, countRes] = await Promise.all([
          supabase.from('startup_profiles').select('*').eq('startup_id', id).maybeSingle(),
          supabase.from('contacts').select('*').eq('startup_id', id).order('created_at', { ascending: false }),
          supabase.from('quest_completions').select('id', { count: 'exact', head: true }).eq('startup_id', id),
        ]);
        if (profileRes.data) {
          const p = profileRes.data;
          setForm({
            name:        p.name        || staticStartup.name        || '',
            founder:     p.founder     || staticStartup.founder     || '',
            category:    p.category    || staticStartup.category    || '',
            booth:       p.booth       || staticStartup.booth       || '',
            description: p.description || staticStartup.description || '',
            mission:     p.mission     || staticStartup.mission     || '',
            question:    p.question    || staticStartup.question    || '',
            answer:      p.answer      || staticStartup.answer      || '',
            social_task:  p.social_task  || staticStartup.socialTask  || '',
            social_links: p.social_links || staticStartup.social_links || {},
          });
        }
        setContacts(contactsRes.data || []);
        setQuestViews(countRes.count || 0);
      } catch (err) {
        console.error('useDashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function save() {
    if (!id) return;
    setSaving(true);
    try {
      await supabase.from('startup_profiles').upsert(
        { startup_id: id, ...form, updated_at: new Date().toISOString() },
        { onConflict: 'startup_id' },
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('useDashboard save error:', err);
    } finally {
      setSaving(false);
    }
  }

  async function updateContactStatus(contactId, status) {
    await supabase.from('contacts').update({ status }).eq('id', contactId);
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status } : c));
  }

  function downloadCSV() {
    if (!contacts.length) return;
    const headers = ['Name', 'Company', 'Email', 'Type', 'Interest', 'Status', 'Date'];
    const rows = contacts.map(c => [c.name, c.company, c.email, c.type, c.interest, c.status, c.created_at?.slice(0, 10)]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${id}-leads.csv`;
    a.click();
  }

  const boothUrl = `${APP_URL}?startapp=${id}`;
  return { form, setField, contacts, questViews, loading, saving, saved, save, updateContactStatus, downloadCSV, boothQrDataUrl, boothUrl };
}
