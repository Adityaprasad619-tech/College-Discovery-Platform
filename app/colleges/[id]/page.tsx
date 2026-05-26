"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Star, MapPin, Landmark, Briefcase, GraduationCap, ArrowLeft, Bookmark, BookmarkCheck, GitCompare } from "lucide-react";
import Link from "next/link";
import { College } from "@/components/CollegeCard";
import { useCompareStore } from "@/store/useCompareStore";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function CollegeDetailPage({ params }: PageProps) {
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // Zustand compare utilities
  const { addCollegeId, removeCollegeId, isCompared } = useCompareStore();
  const compared = college ? isCompared(college.id) : false;

  // Resolve params and fetch details
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        // Fetch details
        const res = await fetch(`/api/colleges/${id}`);
        if (res.status === 404) {
          if (active) setError("The requested college does not exist in our registry.");
          return;
        }
        if (!res.ok) throw new Error("Failed to load college details.");
        
        const json = await res.json();
        if (json.success && json.data) {
          if (active) {
            setCollege(json.data);
            
            // Check if saved
            checkSavedStatus(json.data.id);
          }
        } else {
          throw new Error("Invalid payload format received.");
        }
      } catch (err) {
        console.error(err);
        if (active) setError("A network exception occurred while fetching details.");
      } finally {
        if (active) setLoading(false);
      }
    };

    const checkSavedStatus = async (collegeId: string) => {
      try {
        const res = await fetch("/api/saved");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const savedList: College[] = data.data;
          setIsSaved(savedList.some((c) => c.id === collegeId));
        }
      } catch (e) {
        console.warn("Unable to check saved status:", e);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [params]);

  const triggerToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveClick = async () => {
    if (!college || saveLoading) return;
    setSaveLoading(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(data.saved);
        triggerToast(data.saved ? "Added to shortlist!" : "Removed from shortlist.");
      } else {
        // Fallback offline toggling
        setIsSaved(!isSaved);
        triggerToast(!isSaved ? "Saved to shortlist (Offline mode)!" : "Removed from saves.");
      }
    } catch {
      setIsSaved(!isSaved);
      triggerToast(!isSaved ? "Saved to shortlist (Offline mode)!" : "Removed from saves.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCompareClick = () => {
    if (!college) return;
    if (compared) {
      removeCollegeId(college.id);
      triggerToast("Removed from comparison.");
    } else {
      const res = addCollegeId(college.id);
      if (!res.success && res.error) {
        triggerToast(res.error, true);
      } else {
        triggerToast("Added to comparison tray!");
      }
    }
  };

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs/year`;
    }
    return `₹${amount.toLocaleString("en-IN")}/year`;
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-12 animate-pulse">
          <div className="h-6 w-24 rounded bg-gray-200 mb-6"></div>
          <div className="h-[220px] rounded-3xl bg-gray-200 mb-8"></div>
          <div className="h-8 w-2/3 rounded bg-gray-200 mb-4"></div>
          <div className="h-4 w-1/3 rounded bg-gray-200 mb-10"></div>
          <div className="space-y-4">
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State / Invalid IDs
  if (error || !college) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mx-auto mb-6">
            <XIcon className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">College Not Found</h2>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {error || "The institution ID requested is invalid or has been decommissioned."}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/colleges"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs tracking-wider px-5 py-3 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Listing</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Perfect Render State
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link href="/colleges" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discovery</span>
        </Link>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm mb-8">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-blue-100/40 to-indigo-100/10 rounded-bl-[120px] -z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              {/* Rating Badge */}
              <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                <Star className="h-4 w-4 fill-amber-500 stroke-amber-500" />
                <span>{college.rating.toFixed(1)} / 5.0 Rating</span>
              </div>

              {/* Title */}
              <h1 className="mt-4 text-2xl font-extrabold text-gray-900 sm:text-3xl leading-tight">
                {college.name}
              </h1>

              {/* Location Tag */}
              <div className="mt-3 flex items-center gap-2 text-gray-500 font-medium text-sm">
                <MapPin className="h-4.5 w-4.5 stroke-gray-400 shrink-0" />
                <span>{college.location}</span>
              </div>
            </div>

            {/* Float Actions */}
            <div className="flex gap-2.5 sm:self-start shrink-0">
              {/* Save Trigger */}
              <button
                onClick={handleSaveClick}
                disabled={saveLoading}
                className={`flex h-11 px-4 items-center gap-2 rounded-xl border text-sm font-bold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-98 ${
                  isSaved
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {isSaved ? <BookmarkCheck className="h-4.5 w-4.5 fill-amber-400" /> : <Bookmark className="h-4.5 w-4.5" />}
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>

              {/* Compare Trigger */}
              <button
                onClick={handleCompareClick}
                className={`flex h-11 px-4 items-center gap-2 rounded-xl border text-sm font-bold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-98 ${
                  compared
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <GitCompare className="h-4.5 w-4.5" />
                <span>{compared ? "Comparing" : "Compare"}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid gap-4 sm:grid-cols-2 mt-8 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3.5 rounded-2xl bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">Annual Fees structure</p>
                <p className="mt-1 text-base font-bold text-gray-800">{formatFees(college.fees)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none">Placements Average</p>
                <p className="mt-1 text-base font-bold text-gray-800">{college.placements.split(" | ")[0].replace("Average package: ", "")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Body Columns */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Info Left Column */}
          <div className="space-y-8 md:col-span-2">
            
            {/* Overview Card */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4">
                Institute Overview
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {college.overview}
              </p>
            </section>

            {/* Courses / Specializations Grid */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                <span>Available Specializations</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {college.courses.split(", ").map((course, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-3 hover:border-blue-100 hover:bg-blue-50/10 transition-colors">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-bold text-gray-500">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">{course}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Statistics Column */}
          <div className="space-y-8">
            {/* Placements Specification Card */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-400 mb-4">
                Placement Insights
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400">Average LPA</span>
                  <p className="text-xl font-black text-emerald-600 mt-0.5">
                    {college.placements.split(" | ")[0].replace("Average package: ", "")}
                  </p>
                </div>
                {college.placements.includes(" | ") && (
                  <div className="border-t border-gray-50 pt-3">
                    <span className="text-xs font-semibold text-gray-400">Highest Package Offered</span>
                    <p className="text-lg font-extrabold text-gray-800 mt-0.5">
                      {college.placements.split(" | ")[1].replace("Highest package: ", "")}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Details Sidebar */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-400 mb-4">
                Key Parameters
              </h2>
              <ul className="space-y-3.5 text-xs">
                <li className="flex justify-between border-b border-gray-50 pb-2.5">
                  <span className="font-semibold text-gray-400">Est. Fees (4 Years)</span>
                  <span className="font-bold text-gray-700">₹{(college.fees * 4 / 100000).toFixed(2)} Lakhs</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2.5">
                  <span className="font-semibold text-gray-400">Location State</span>
                  <span className="font-bold text-gray-700">{college.location.split(", ")[1]}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold text-gray-400">NIRF Tier Match</span>
                  <span className="font-bold text-blue-600">Top 100 Class</span>
                </li>
              </ul>
            </section>
          </div>
        </div>

      </main>

      {/* Floating toast message alerts */}
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

// Simple internal icon component for error state
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
