"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CollegeCard, { College } from "@/components/CollegeCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { Search, MapPin, Coins, SlidersHorizontal, X, GitCompare } from "lucide-react";
import Link from "next/link";
import { useCompareStore } from "@/store/useCompareStore";

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxFees, setMaxFees] = useState("");

  // Toast State for quick notifications
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // Zustand compare items count for floating comparison bar
  const comparedIds = useCompareStore((state) => state.comparedIds);
  const clearCompare = useCompareStore((state) => state.clearCompare);

  // Fetch function
  const fetchColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.set("search", search.trim());
      if (location.trim()) queryParams.set("location", location.trim());
      if (maxFees) queryParams.set("maxFees", maxFees);

      const res = await fetch(`/api/colleges?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch colleges.");
      const json = await res.json();
      
      if (json.success && Array.isArray(json.data)) {
        setColleges(json.data);
      } else {
        throw new Error("Invalid payload format received.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load colleges. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  // Run fetch when filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchColleges();
    }, 300); // 300ms debounce for input entries

    return () => clearTimeout(handler);
  }, [search, location, maxFees]);

  // Show customized toast alert
  const triggerToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Save toggle API integration
  const handleSaveToggle = async (collegeId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.saved ? "Added to shortlist!" : "Removed from shortlist.");
        return true;
      } else {
        triggerToast(data.error || "Please authenticate to save colleges.", true);
        return false;
      }
    } catch {
      triggerToast("Network error. Unable to toggle save status.", true);
      return false;
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setLocation("");
    setMaxFees("");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />

      {/* Hero section inside Browse Colleges */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold sm:text-4xl tracking-tight">Explore Top Engineering Institutions</h1>
          <p className="mt-3 text-base text-blue-100 max-w-xl mx-auto">
            Discover the best IITs, NITs, and premium academies. Review fees structures, check ratings, and save your choices.
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Filtering Options Grid */}
        <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-700 font-bold">
            <SlidersHorizontal className="h-4.5 w-4.5 text-blue-600" />
            <span className="text-sm uppercase tracking-wider text-gray-500">Filter Discovery Parameters</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Search filter input */}
            <div className="relative">
              <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search college name or courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/40 py-2.5 pl-10 pr-4 text-sm font-medium text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Location filter input */}
            <div className="relative">
              <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter state or city (e.g. Delhi)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/40 py-2.5 pl-10 pr-4 text-sm font-medium text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Fees Limit selector */}
            <div className="relative">
              <Coins className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <select
                value={maxFees}
                onChange={(e) => setMaxFees(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/40 py-2.5 pl-10 pr-8 text-sm font-medium text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
              >
                <option value="">Any Annual Fees Budget</option>
                <option value="100000">₹1.0 Lakh or less</option>
                <option value="200000">₹2.0 Lakhs or less</option>
                <option value="300000">₹3.0 Lakhs or less</option>
                <option value="500000">₹5.0 Lakhs or less</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          {/* Helper showing actively filtered labels */}
          {(search || location || maxFees) && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-400 font-semibold uppercase">Active:</span>
                {search && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 px-2 py-1">
                    &quot;{search}&quot;
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 px-2 py-1">
                    Loc: {location}
                  </span>
                )}
                {maxFees && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 px-2 py-1">
                    Fees: ≤ ₹{parseInt(maxFees, 10).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
              >
                <X className="h-3 w-3" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </section>

        {/* Results Block */}
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : error ? (
          <EmptyState
            iconType="error"
            title="Operational Exception"
            description={error}
            actionText="Retry Fetch"
            onActionClick={fetchColleges}
          />
        ) : colleges.length === 0 ? (
          <EmptyState
            iconType="search"
            title="No Matching Colleges Found"
            description="We couldn't find any engineering institutions matching your active search terms or budget limits. Try broadening your keywords."
            actionText="Clear Filter Settings"
            onActionClick={handleClearFilters}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onSaveToggle={handleSaveToggle}
                onShowToast={triggerToast}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Compare Drawer Trigger (Bottom Right) */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-slow">
          <div className="flex items-center gap-4 rounded-full bg-gray-900 px-6 py-3.5 shadow-xl text-white">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-blue-400 animate-spin-slow" />
              <span className="text-sm font-bold">
                {comparedIds.length} {comparedIds.length === 1 ? "College" : "Colleges"} Added
              </span>
            </div>
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex gap-2">
              <Link
                href="/compare"
                className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-blue-500 hover:scale-102"
              >
                Compare Now
              </Link>
              <button
                onClick={clearCompare}
                className="rounded-full bg-gray-800 p-1.5 text-xs font-medium hover:text-gray-300"
                title="Clear Compare Selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Minimalistic Toast Component */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl bg-white p-4 shadow-xl border border-gray-100 flex items-center gap-3 animate-slide-in">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
            toast.isError ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
          }`}>
            {toast.isError ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </div>
          <p className="text-xs font-bold text-gray-700">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
