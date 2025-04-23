'use client';

import { useSupabase } from '@/components/SupabaseProvider';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnalysisRow {
  id: string;
  created_at: string;
  file_name?: string | null; // optional future field
  net_optimization_potential?: number | null; // show quick value
}

export default function DashboardPage() {
  const { supabaseClient, session } = useSupabase();
  const [items, setItems] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    supabaseClient
      .from('analyses')
      .select('id, created_at, net_optimization_potential:full_analysis->>netOptimizationPotential, file_name')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setItems((data as any) || []);
        }
        setLoading(false);
      });
  }, [session, supabaseClient]);

  if (!session) {
    return <p className="p-6 text-center">Bitte einloggen, um deine Analysen zu sehen.</p>;
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <span className="animate-spin rounded-full h-6 w-6 border-4 border-indigo-400 border-t-transparent inline-block mr-2"></span>
        Loading…
      </div>
    );
  }

  if (error) {
    return <p className="p-6 text-red-400">Fehler: {error}</p>;
  }

  if (items.length === 0) {
    return <p className="p-6">Du hast noch keine bezahlten Analysen.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Analyses</h1>
      <ul className="space-y-3">
        {items.map((a) => (
          <li
            key={a.id}
            className="border border-slate-700/50 rounded-lg p-4 flex justify-between items-center hover:bg-slate-800/40"
          >
            <div>
              <p className="font-medium text-slate-100">
                {new Date(a.created_at).toLocaleString()}
              </p>
              {a.file_name && <p className="text-slate-400 text-sm">{a.file_name}</p>}
            </div>
            <div className="flex items-center gap-4">
              {a.net_optimization_potential && (
                <span className="text-amber-400 text-sm">
                  +{Number(a.net_optimization_potential).toFixed(0)} $ potential
                </span>
              )}
              <Link
                href={`/results?analysis_id=${a.id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition"
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
