import { Button } from "@/components/ui/button";
import Link from "next/link";

// Hoisted static SVG elements to avoid re-creation on each render (Rule 6.3)
const targetIcon = (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
    <circle cx="12" cy="12" r="8" strokeWidth={2} strokeDasharray="4 4" />
  </svg>
);

const observationIcon = (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

export function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto text-center mb-24">
      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-800/30 bg-amber-950/20 backdrop-blur-sm mb-8">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm text-gray-300">Lulin Observatory Active</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
        <span className="block text-gray-100">NCU</span>
        <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
          Target & Observation
        </span>
        <span className="block text-gray-100">Manager</span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
        Streamline your astronomical research with precision scheduling, real-time monitoring,
        and comprehensive data management for the Lulin Observatory.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/targets">
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:shadow-amber-600/40 hover:scale-105"
          >
            {targetIcon}
            View Targets
          </Button>
        </Link>
        <Link href="/observations">
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg border-gray-700 bg-gray-900/50 text-gray-200 hover:bg-gray-800/80 hover:border-gray-600 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            {observationIcon}
            Browse Observations
          </Button>
        </Link>
      </div>
    </section>
  );
}
