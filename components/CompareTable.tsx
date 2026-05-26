"use client";

import { useCompareStore } from "@/store/useCompareStore";
import { Star, MapPin, Landmark, Briefcase, Award, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { College } from "./CollegeCard";

interface CompareTableProps {
  colleges: College[];
}

export default function CompareTable({ colleges }: CompareTableProps) {
  const removeCollegeId = useCompareStore((state) => state.removeCollegeId);

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs/year`;
    }
    return `₹${amount.toLocaleString("en-IN")}/year`;
  };

  if (colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-3xl p-12 bg-gray-50/50">
        <Sparkles className="h-10 w-10 text-gray-400 stroke-[1.5]" />
        <h3 className="mt-4 text-base font-bold text-gray-800">No colleges selected</h3>
        <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
          Select and add up to 3 colleges from the browse page to compare their specs side-by-side!
        </p>
        <Link
          href="/colleges"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Browse Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full min-w-[700px] border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/40">
            {/* Spec Label Header */}
            <th className="w-1/4 p-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Features</th>
            
            {/* College Headers */}
            {colleges.map((college) => (
              <th key={college.id} className="w-1/4 p-6 relative">
                <button
                  onClick={() => removeCollegeId(college.id)}
                  className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors"
                  title="Remove from compare"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="pr-4">
                  <h4 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug">
                    {college.name}
                  </h4>
                  <p className="mt-1 text-xs text-gray-400 line-clamp-1">{college.location}</p>
                </div>
              </th>
            ))}
            
            {/* Empty slots placeholders if < 3 colleges */}
            {Array.from({ length: Math.max(0, 3 - colleges.length) }).map((_, idx) => (
              <th key={`empty-hdr-${idx}`} className="w-1/4 p-6 bg-gray-50/10 border-l border-gray-100">
                <div className="flex flex-col items-center justify-center py-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/40 text-center">
                  <span className="text-xs font-semibold text-gray-400">Slot Available</span>
                  <Link href="/colleges" className="mt-2 text-[10px] font-bold text-blue-600 hover:underline">
                    Add College
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          
          {/* Rating Comparison */}
          <tr>
            <td className="p-6 font-bold text-gray-700 bg-gray-50/10 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-500" />
              <span>Overall Rating</span>
            </td>
            {colleges.map((college) => (
              <td key={`rating-${college.id}`} className="p-6">
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-sm font-semibold text-amber-700">
                  <Star className="h-3.5 w-3.5 fill-amber-500 stroke-amber-500" />
                  <span>{college.rating.toFixed(1)} / 5.0</span>
                </div>
              </td>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
              <td key={`empty-rating-${idx}`} className="p-6 bg-gray-50/10 border-l border-gray-100"></td>
            ))}
          </tr>

          {/* Fees Comparison */}
          <tr>
            <td className="p-6 font-bold text-gray-700 bg-gray-50/10 flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-blue-500" />
              <span>Annual Fees</span>
            </td>
            {colleges.map((college) => (
              <td key={`fees-${college.id}`} className="p-6 font-bold text-gray-800">
                {formatFees(college.fees)}
              </td>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
              <td key={`empty-fees-${idx}`} className="p-6 bg-gray-50/10 border-l border-gray-100"></td>
            ))}
          </tr>

          {/* Placements Comparison */}
          <tr>
            <td className="p-6 font-bold text-gray-700 bg-gray-50/10 flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-emerald-500" />
              <span>Placements (LPA)</span>
            </td>
            {colleges.map((college) => (
              <td key={`placement-${college.id}`} className="p-6 text-sm text-gray-600 leading-relaxed font-medium">
                {college.placements}
              </td>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
              <td key={`empty-placement-${idx}`} className="p-6 bg-gray-50/10 border-l border-gray-100"></td>
            ))}
          </tr>

          {/* Location Comparison */}
          <tr>
            <td className="p-6 font-bold text-gray-700 bg-gray-50/10 flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-red-500" />
              <span>Campus Location</span>
            </td>
            {colleges.map((college) => (
              <td key={`loc-${college.id}`} className="p-6 text-sm text-gray-600 font-medium">
                {college.location}
              </td>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
              <td key={`empty-loc-${idx}`} className="p-6 bg-gray-50/10 border-l border-gray-100"></td>
            ))}
          </tr>

          {/* Courses Comparison */}
          <tr>
            <td className="p-6 font-bold text-gray-700 bg-gray-50/10 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-purple-500" />
              <span>Top Specializations</span>
            </td>
            {colleges.map((college) => (
              <td key={`courses-${college.id}`} className="p-6 text-xs text-gray-600 leading-relaxed">
                <div className="flex flex-wrap gap-1">
                  {college.courses.split(", ").map((course, cIdx) => (
                    <span key={cIdx} className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                      {course}
                    </span>
                  ))}
                </div>
              </td>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
              <td key={`empty-courses-${idx}`} className="p-6 bg-gray-50/10 border-l border-gray-100"></td>
            ))}
          </tr>

          {/* Detail Link row */}
          <tr>
            <td className="p-6 font-bold text-gray-700 bg-gray-50/10">Action</td>
            {colleges.map((college) => (
              <td key={`action-${college.id}`} className="p-6">
                <Link
                  href={`/colleges/${college.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs tracking-wider px-4 py-2 hover:scale-[1.02] active:scale-98 transition-all"
                >
                  View Details Page
                </Link>
              </td>
            ))}
            {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
              <td key={`empty-action-${idx}`} className="p-6 bg-gray-50/10 border-l border-gray-100"></td>
            ))}
          </tr>

        </tbody>
      </table>
    </div>
  );
}
