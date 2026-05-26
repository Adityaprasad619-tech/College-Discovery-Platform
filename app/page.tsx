import Navbar from "@/components/Navbar";
import { Search, GitCompare, Bookmark, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const highlights = [
    {
      icon: Search,
      color: "text-blue-600 bg-blue-50",
      title: "Smart College Filtering",
      description: "Filter instantly by location and annual fees budget. Search dynamic keywords to find matching curriculums."
    },
    {
      icon: GitCompare,
      color: "text-purple-600 bg-purple-50",
      title: "Side-by-Side Comparison",
      description: "Line up to 3 selected institutions at once. Evaluate ratings, tuition, and placement offers side-by-side."
    },
    {
      icon: Bookmark,
      color: "text-amber-600 bg-amber-50",
      title: "Personalized Shortlist",
      description: "Save and structure your favorites. Access saved choices instantly via your authenticated dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-white/0 -z-10"></div>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
          
          <div className="mx-auto max-w-4xl text-center">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-6">
              <Sparkles className="h-3.5 w-3.5 fill-blue-100" />
              <span>Discover Your Dream Academy</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl leading-[1.1]">
              Find & Compare The Best <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Engineering Colleges
              </span> in India
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-gray-500 leading-relaxed font-medium">
              EduFind is a modern College Discovery Platform. Evaluate courses, compare placements, and save your top choices—all in one place.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/colleges"
                className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-98 transition-all"
              >
                <span>Browse Colleges</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="/compare"
                className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-2xl bg-white border border-gray-200 px-8 py-4 text-base font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:scale-[1.02] active:scale-98 transition-all"
              >
                <GitCompare className="h-5 w-5 text-gray-400" />
                <span>Compare Matrix</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Platform Key Capabilities</h2>
            <p className="text-sm text-gray-400 mt-2 font-semibold uppercase tracking-wider">Simple, fast, and structured decision making</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mt-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:scale-[1.01]"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} mb-6`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{item.title}</h3>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed font-medium">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mini CTA footer block */}
        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 h-40 w-40 bg-blue-600/10 rounded-full blur-2xl"></div>
            
            <GraduationCap className="h-10 w-10 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold sm:text-2xl">Ready to map out your academic future?</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
  Get immediate access to verified listings of India&apos;s leading Indian Institutes of Technology and premium universities.
</p>
            <div className="mt-8">
              <Link
                href="/colleges"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95"
              >
                <span>Browse Directory</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Landing page footer */}
      <footer className="mx-auto max-w-7xl px-4 mt-8 w-full text-center text-xs text-gray-400 font-medium">
        <p>© {new Date().getFullYear()} EduFind Platform. Built with Next.js 15 and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
