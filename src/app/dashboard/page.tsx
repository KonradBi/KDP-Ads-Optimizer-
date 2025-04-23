'use client';

import { useSupabase } from '@/components/SupabaseProvider';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnalysisRow {
  id: string;
  created_at: string;
  net_optimization_potential?: number | null; // show quick value
}

export default function DashboardPage() {
  const { supabaseClient, session } = useSupabase();
  const [items, setItems] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      try {
        // Fetch purchased analyses with nested analysis_results
        const { data: purchases, error: purchError } = await supabaseClient
          .from('purchases')
          .select(`analysis_results ( id, created_at, net_optimization_potential:full_analysis->>'netOptimizationPotential' )`)
          .eq('user_id', session.user.id)
          .eq('status', 'completed');
        if (purchError) throw purchError;
        const itemsFlat = (purchases || [])
          .map((p: any) => p.analysis_results)
          .filter((r: any) => r)
          .map((r: any) => ({
            id: r.id,
            created_at: r.created_at,
            net_optimization_potential: parseFloat(r.net_optimization_potential),
          }));
        // Sort by creation date descending
        itemsFlat.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setItems(itemsFlat);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, supabaseClient]);

  if (!session) {
    return <p className="p-6 text-center">Please log in to view your analyses.</p>;
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
    return <p className="p-6 text-red-400">Error: {error}</p>;
  }

  if (items.length === 0) {
    return <p className="p-6">You have no purchased analyses yet.</p>;
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
              {/* file_name not stored currently */}
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
