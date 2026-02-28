"use client";

import { Counter } from "./Counter";

interface Stat {
  value: number;
  label: string;
  suffix: string;
}

const defaultStats: Stat[] = [
  { value: 0, label: "Targets Cataloged", suffix: "" },
  { value: 0, label: "Active Observations", suffix: "" },
  { value: 0, label: "Instruments", suffix: "" },
  { value: 0, label: "Uptime", suffix: "%" },
];

interface StatsSectionProps {
  stats?: Stat[];
}

export function StatsSection({ stats = defaultStats }: StatsSectionProps) {
  return (
    <section className="max-w-4xl mx-auto mb-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="text-center p-6 rounded-xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm"
          >
            <div className="text-3xl sm:text-4xl font-bold text-amber-500 mb-2">
              <Counter
                end={stat.value}
                suffix={stat.suffix}
                duration={2000 + i * 200}
              />
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
