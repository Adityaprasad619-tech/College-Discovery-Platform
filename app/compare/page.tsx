"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CompareTable from "@/components/CompareTable";
import { useCompareStore } from "@/store/useCompareStore";
import { College } from "@/components/CollegeCard";
import { GitCompare, PlusCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const comparedIds = useCompareStore((state) => state.comparedIds);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch full details of selected compared colleges
  useEffect(() => {
    let active = true;
    
    const fetchComparedDetails = async () => {
      if (comparedIds.length === 0) {
        setColleges([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        // Fetch all colleges and filter them in memory, or make concurrent individual fetch requests.
        // Fetching all colleges is incredibly fast, simple, cached, and bulletproof!
        const res = await fetch("/api/colleges");
        if (!res.ok) throw new Error("Failed to load compare data.");
        
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const list: College[] = json.data;
          const filtered = list.filter((c) => comparedIds.includes(c.id));
          if (active) {
            setColleges(filtered);
          }
        } else {
          throw new Error("Invalid payload format received.");
        }
      } catch (err) {
        console.error(err);
        if (active) setError("Unable to retrieve college specs for comparison.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchComparedDetails();

    return () => {
      active = false;
    };
  }, [comparedIds]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />

      {/* Header section */}
      <header className="bg-gradient-to-r from-slate-800 to-indigo-950 py-12 px-4 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-4 backdrop-blur-sm">
            <GitCompare className="h-6 w-6 text-blue-400 stroke-[2]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Compare Institutions Side-by-Side</h1>
          <p className="mt-3 text-base text-gray-300 max-w-lg mx-auto">
            Evaluate annual tuition budgets, career placements, general ratings, locations, and top courses side-by-side.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Info panel */}
        {comparedIds.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
              <span>
                You have selected <strong>{comparedIds.length}</strong> of <strong>3</strong> maximum college slots.
              </span>
            </div>
            {comparedIds.length < 3 && (
              <Link 
                href="/colleges" 
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline uppercase tracking-wide"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add More Colleges</span>
              </Link>
            )}
          </div>
        )}

        {/* Loaders, error, or main compare grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center border border-gray-100 rounded-3xl p-16 bg-white animate-pulse">
            <GitCompare className="h-8 w-8 text-gray-300 animate-spin" />
            <span className="mt-3 text-sm text-gray-400 font-semibold">Compiling comparison metrics...</span>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50/30 p-8 text-center text-red-700">
            <p className="font-bold">Error compiling details</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <CompareTable colleges={colleges} />
        )}
      </main>
    </div>
  );
}
