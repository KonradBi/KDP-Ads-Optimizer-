'use client';

import { useSupabase } from '@/components/SupabaseProvider';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react'; // Import Trash icon
import { confirmDialog } from '@/components/ConfirmDialog';

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
  const [deletingId, setDeletingId] = useState<string | null>(null); // State for loading indicator during delete

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

  // Function to handle deletion
  const handleDeleteAnalysis = async (analysisId: string) => {
    // Verwende den benutzerdefinierten Dialog statt window.confirm
    const confirmed = await confirmDialog('Are you sure you want to delete this analysis? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingId(analysisId); // Show loading state for this item
    setError(null);

    try {
      // Delete from analysis_results table first
      const { error: deleteAnalysisError } = await supabaseClient
        .from('analysis_results')
        .delete()
        .eq('id', analysisId);

      if (deleteAnalysisError) {
        throw deleteAnalysisError;
      }
      
      // Optionally: Delete from purchases table if desired (check foreign key constraints)
      // const { error: deletePurchaseError } = await supabaseClient
      //  .from('purchases')
      //  .delete()
      //  .eq('analysis_id', analysisId); // Assuming 'analysis_id' is the foreign key column name
      // if (deletePurchaseError) { 
      //   console.warn('Failed to delete related purchase record:', deletePurchaseError.message);
      //   // Decide if this should prevent UI update or just log a warning
      // }

      // Update state to remove the item from the list
      setItems(prevItems => prevItems.filter(item => item.id !== analysisId));
      console.log('Successfully deleted analysis:', analysisId);

    } catch (err: any) {
      console.error('Error deleting analysis:', err);
      setError(`Failed to delete analysis: ${err.message}`);
    } finally {
      setDeletingId(null); // Clear loading state
    }
  };

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
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300">My Analyses</h1>
        <div className="ml-auto">
          <Link 
            href="/upload" 
            className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-amber-500/20"
          >
            <span>New Analysis</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-xl p-8 shadow-lg border border-slate-700/50">
          <p className="text-center text-slate-300">No analyses yet. Upload your first Amazon Ads report to get started.</p>
          <div className="mt-6 flex justify-center">
            <Link 
              href="/upload" 
              className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-lg"
            >
              Upload CSV
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-xl overflow-hidden shadow-lg hover:shadow-amber-600/5 border border-slate-700/50 transition-all duration-300 hover:border-amber-600/30"
            >
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center">
                <div className="flex-grow mb-4 sm:mb-0">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg font-medium text-slate-100">
                      {new Date(item.created_at).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})} 
                    </p>
                  </div>
                  <p className="mt-1 ml-7 text-slate-400 text-sm">Amazon Ads Analysis</p>
                </div>
                
                {/* Action Buttons Wrapper */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto ml-0 sm:ml-4">
                  <Link
                    href={`/results?analysis_id=${item.id}`}
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-indigo-500/20 whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    View Analysis
                  </Link>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteAnalysis(item.id)}
                    disabled={deletingId === item.id}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-slate-700/50"
                    aria-label="Delete analysis"
                  >
                    {deletingId === item.id ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent inline-block"></span>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="ml-2 sm:hidden">Delete</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
