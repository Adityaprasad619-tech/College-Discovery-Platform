"use client";

import { useCompareStore } from "@/store/useCompareStore";
import { Star, MapPin, Landmark, Bookmark, BookmarkCheck, GitCompare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placements: string;
  overview: string;
  courses: string;
}

interface CollegeCardProps {
  college: College;
  initialIsSaved?: boolean;
  onSaveToggle?: (id: string) => Promise<boolean>;
  onShowToast?: (message: string, isError?: boolean) => void;
}

export default function CollegeCard({
  college,
  initialIsSaved = false,
  onSaveToggle,
  onShowToast
}: CollegeCardProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const { addCollegeId, removeCollegeId, isCompared } = useCompareStore();
  const compared = isCompared(college.id);

  // Format fees nicely (e.g. 2,20,000 -> ₹2.2 Lakhs)
  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs/year`;
    }
    return `₹${amount.toLocaleString("en-IN")}/year`;
  };

  const handleCompareClick = () => {
    if (compared) {
      removeCollegeId(college.id);
      if (onShowToast) onShowToast("Removed from comparison.");
    } else {
      const res = addCollegeId(college.id);
      if (!res.success && res.error) {
        if (onShowToast) onShowToast(res.error, true);
      } else {
        if (onShowToast) onShowToast("Added to comparison tray!");
      }
    }
  };

  const handleSaveClick = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    try {
      if (onSaveToggle) {
        const success = await onSaveToggle(college.id);
        if (success) {
          setIsSaved(!isSaved);
        }
      } else {
        // Fallback mockup toggling
        const nextState = !isSaved;
        setIsSaved(nextState);
        if (onShowToast) {
          onShowToast(nextState ? "College saved to shortlist!" : "College removed from shortlist.");
        }
      }
    } catch {
      if (onShowToast) onShowToast("Failed to save college.", true);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md hover:shadow-blue-50/40">
      
      {/* Save Button (Top Right) */}
      <button
        onClick={handleSaveClick}
        disabled={saveLoading}
        className={`absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
          isSaved ? "text-amber-500 border-amber-100" : "text-gray-400 hover:text-gray-900"
        }`}
        aria-label="Save College"
      >
        {isSaved ? <BookmarkCheck className="h-5 w-5 fill-amber-400" /> : <Bookmark className="h-5 w-5" />}
      </button>

      {/* College Info */}
      <div className="flex-1">
        {/* Rating Badge */}
        <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
          <span>{college.rating.toFixed(1)}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {college.name}
        </h3>

        {/* Location tag */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0 stroke-gray-400" />
          <span className="line-clamp-1">{college.location}</span>
        </div>

        {/* Fees info */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-2.5">
          <Landmark className="h-4.5 w-4.5 shrink-0 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-none">Annual Fees</span>
            <span className="text-sm font-bold text-gray-800">{formatFees(college.fees)}</span>
          </div>
        </div>
      </div>

      {/* Actions (Bottom Bar) */}
      <div className="mt-5 border-t border-gray-50 pt-4 flex gap-2">
        {/* Compare Action */}
        <button
          onClick={handleCompareClick}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-semibold tracking-wide border transition-all duration-200 active:scale-98 ${
            compared
              ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <GitCompare className={`h-4 w-4 ${compared ? "animate-spin-slow" : ""}`} />
          <span>{compared ? "Comparing" : "Compare"}</span>
        </button>

        {/* Details Link */}
        <Link
          href={`/colleges/${college.id}`}
          className="flex items-center justify-center gap-1 rounded-xl bg-gray-900 py-2 px-3.5 text-xs font-semibold tracking-wide text-white hover:bg-gray-800 transition-all hover:gap-1.5 active:scale-98"
        >
          <span>Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
