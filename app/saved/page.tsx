"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CollegeCard, { College } from "@/components/CollegeCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { Bookmark, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const fetchSavedColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/saved");
      if (!res.ok) throw new Error("Failed to load saved colleges.");
      const json = await res.json();
      
      if (json.success && Array.isArray(json.data)) {
        setSavedColleges(json.data);
      } else {
        throw new Error("Invalid payload format received.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load your saved shortlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedColleges();
  }, []);

  const triggerToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle save toggle from inside Saved page
  const handleSaveToggleFromPage = async (collegeId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically remove the college from the saved colleges list
        setSavedColleges((prev) => prev.filter((c) => c.id !== collegeId));
        triggerToast("Removed from shortlist successfully!");
        return true;
      }
      return false;
    } catch {
      // Offline fallback: remove
      setSavedColleges((prev) => prev.filter((c) => c.id !== collegeId));
      triggerToast("Removed from shortlist (Offline mode)!");
      return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />

      {/* Header Banner */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-600 py-12 px-4 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-4 backdrop-blur-sm">
            <Bookmark className="h-6 w-6 text-amber-200 fill-amber-200" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Shortlisted Institutions</h1>
          <p className="mt-3 text-base text-amber-50 max-w-lg mx-auto">
            Manage, review, and evaluate your saved academies. Add them to compare slots to make your final choice.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Shortlist overview bar */}
        {!loading && !error && savedColleges.length > 0 && (
          <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" />
              <span className="text-sm font-bold text-gray-700">
                You have shortlisted <strong>{savedColleges.length}</strong> college {savedColleges.length === 1 ? "choice" : "choices"}.
              </span>
            </div>
            <Link 
              href="/compare" 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline uppercase tracking-wide"
            >
              Compare Shortlist Side-by-Side
            </Link>
          </div>
        )}

        {/* Dynamic Display blocks */}
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : error ? (
          <EmptyState
            iconType="error"
            title="Saves Retrieval Failure"
            description={error}
            actionText="Retry Fetch"
            onActionClick={fetchSavedColleges}
          />
        ) : savedColleges.length === 0 ? (
          <EmptyState
            iconType="saved"
            title="Your shortlist is currently empty"
            description="Shortlist colleges by tapping the bookmark icon on any college card in our catalog, so they show up here instantly."
            actionText="Start Shortlisting"
            onActionClick={() => window.location.href = "/colleges"}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                initialIsSaved={true}
                onSaveToggle={handleSaveToggleFromPage}
                onShowToast={triggerToast}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating toast messages */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl bg-white p-4 shadow-xl border border-gray-100 flex items-center gap-3 animate-slide-in">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-xs font-bold text-gray-700">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
