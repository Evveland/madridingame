import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useMigLeads() {
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('mig_leads')
        .select('*')
        .order('created_at', { ascending: false });
      setLeads(data || []);
    } catch (err) {
      console.error('useMigLeads load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    await supabase.from('mig_leads').update({ status }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }

  async function updateNotes(id, notes) {
    await supabase.from('mig_leads').update({ notes }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes } : l));
  }

  function downloadCSV() {
    const rows = (filter === 'All' ? leads : leads.filter(l => l.type === filter));
    if (!rows.length) return;
    const headers = ['Type', 'Name', 'Email', 'Company', 'Website', 'Message', 'Status', 'Notes', 'Date'];
    const csv = [headers, ...rows.map(l => [
      l.type, l.name, l.email, l.company, l.website, l.message, l.status, l.notes, l.created_at?.slice(0, 10),
    ])].map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `mig-leads-${filter.toLowerCase().replace(/\s/g, '-')}.csv`;
    a.click();
  }

  const filtered = filter === 'All' ? leads : leads.filter(l => l.type === filter);
  const countByType = leads.reduce((acc, l) => { acc[l.type] = (acc[l.type] || 0) + 1; return acc; }, {});

  return { leads: filtered, allLeads: leads, loading, filter, setFilter, updateStatus, updateNotes, downloadCSV, countByType };
}
