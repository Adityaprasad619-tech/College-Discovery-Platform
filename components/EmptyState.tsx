"use client";

import { AlertCircle, Search, Inbox, HelpCircle } from "lucide-react";

interface EmptyStateProps {
  iconType?: "search" | "saved" | "error" | "default";
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  iconType = "default",
  title,
  description,
  actionText,
  onActionClick,
}: EmptyStateProps) {
  
  const renderIcon = () => {
    switch (iconType) {
      case "search":
        return <Search className="h-12 w-12 text-blue-500 stroke-[1.5]" />;
      case "saved":
        return <Inbox className="h-12 w-12 text-amber-500 stroke-[1.5]" />;
      case "error":
        return <AlertCircle className="h-12 w-12 text-red-500 stroke-[1.5]" />;
      default:
        return <HelpCircle className="h-12 w-12 text-gray-400 stroke-[1.5]" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50 mb-4 transition-transform duration-300 hover:rotate-6">
        {renderIcon()}
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 leading-snug">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">{description}</p>
      
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs tracking-wider px-5 py-2.5 transition-all shadow-sm active:scale-95 hover:scale-[1.02]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
