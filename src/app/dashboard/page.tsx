'use client';

import { useSupabase } from '@/components/SupabaseProvider';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnalysisRow {
  id: string;
  stripeSessionId: string;
  created_at: string;
  net_optimization_potential?: number | null; // show quick value
}

export default function DashboardPage() {
  const { supabaseClient, session } = useSupabase();
  const [items, setItems] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      console.log('Dashboard: fetchItems started.');
      setLoading(true);
      setError(null);
      try {
        if (!session) {
          console.log('Dashboard: No session found, returning.');
          return;
        }
        console.log('Dashboard: Session found, fetching purchases for user:', session.user.id);
        const { data: purchases, error: purchError } = await supabaseClient
          .from('purchases')
          .select('stripe_session_id, analysis_results(id,created_at,full_analysis)')
          .eq('user_id', session.user.id)
          .in('status', ['pending', 'completed']);
        console.log('Dashboard: Supabase query completed.');
        if (purchError) throw purchError;
        console.log('Dashboard: Raw purchases data received:', purchases);

        // Separate purchases with and without embedded analysis_results
        const missing: string[] = [];
        const itemsFlat: AnalysisRow[] = [];

        (purchases || []).forEach((p: any) => {
          const ar = p.analysis_results;
          if (!ar) {
            if (p.stripe_session_id) {
              console.warn('Dashboard: Purchase missing analysis_results, will verify:', p.stripe_session_id);
              missing.push(p.stripe_session_id);
            } else {
              console.warn('Dashboard: Purchase missing analysis_results and has no stripe_session_id:', p);
            }
            return;
          }
          if (!ar.full_analysis) {
            console.warn('Dashboard: Analysis result missing full_analysis:', ar.id);
          }
          itemsFlat.push({
            id: ar.id,
            stripeSessionId: p.stripe_session_id,
            created_at: ar.created_at,
            net_optimization_potential: ar.full_analysis?.netOptimizationPotential ?? null,
          });
        });

        // If some purchases missing linkage, call verify endpoint to fix and then refetch once.
        if (missing.length > 0) {
          console.log('Dashboard: Triggering verify for sessions:', missing);
          await Promise.all(
            missing.map((sid) =>
              fetch(`/api/payment/verify?session_id=${sid}`).catch((err) => {
                console.error('Verify call failed for', sid, err);
                return null;
              })
            )
          );
          console.log('Dashboard: Verify calls done, refetching once.');
          // Recursive one-time refetch
          const { data: purchases2 } = await supabaseClient
            .from('purchases')
            .select('analysis_results(id,created_at,full_analysis)')
            .eq('user_id', session.user.id)
            .eq('status', 'completed');
          (purchases2 || []).forEach((p: any) => {
            const ar = p.analysis_results;
            if (ar) {
              itemsFlat.push({
                id: ar.id,
                stripeSessionId: p.stripe_session_id,
                created_at: ar.created_at,
                net_optimization_potential: ar.full_analysis?.netOptimizationPotential ?? null,
              });
            }
          });
        }

        console.log('Dashboard: Processed itemsFlat after verify:', itemsFlat);

        itemsFlat.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setItems(itemsFlat);
      } catch (err: any) {
        console.error('Dashboard: Error fetching or processing analyses:', err);
        setError(err.message || 'Error fetching analyses');
      } finally {
        console.log('Dashboard: fetchItems finished.');
        setLoading(false);
      }
    };
    fetchItems();
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
                href={`/results?analysis_id=${a.id}&session_id=${a.stripeSessionId}`}
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
