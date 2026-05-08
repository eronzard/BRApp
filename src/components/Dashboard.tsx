
import React from 'react';
import { Reflection, WeeklyReading } from '../types';
import { BarChart3, Users, MessageSquare } from 'lucide-react';

interface DashboardProps {
  reflections: Reflection[];
  verse: WeeklyReading;
}

export const Dashboard: React.FC<DashboardProps> = ({ reflections, verse }) => {
  const activeReflections = reflections.filter(r => r.text && r.text.trim().length > 0);

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-bible-900 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-bible-200 dark:border-bible-800 shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-bible-50 dark:bg-bible-800/10 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-start gap-4 md:gap-5 min-w-0">
            <div className="bg-bible-900 dark:bg-bible-800 p-3 md:p-4 rounded-2xl text-white shadow-xl shadow-bible-200 dark:shadow-none shrink-0">
              <BarChart3 size={24} className="md:w-7 md:h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-3xl font-serif font-bold text-bible-900 dark:text-white tracking-tight truncate">Reflections</h2>
              <p className="text-gray-500 dark:text-bible-400 font-medium mt-1 max-w-md text-sm md:text-base line-clamp-2">
                Team reflections for <span className="text-bible-600 dark:text-bible-300 font-bold">{verse.reference}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 self-start lg:self-center">
            <div className="text-center px-6 md:px-8 py-2 md:py-3 bg-bible-50 dark:bg-bible-950 rounded-2xl border border-bible-100 dark:border-bible-800">
              <div className="text-2xl md:text-3xl font-bold text-bible-900 dark:text-white leading-none">{activeReflections.length}</div>
              <div className="text-[9px] md:text-[10px] text-bible-500 dark:text-bible-400 uppercase font-bold tracking-widest mt-1">Reflections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Participation card */}
      <div className="bg-bible-900 dark:bg-black p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-3">
            <Users size={22} className="text-bible-300" />
            <span>Participation</span>
          </h3>
          <div className="text-5xl font-bold mb-3 tracking-tight">{activeReflections.length}</div>
          <p className="text-bible-300 text-sm font-medium">Total reflections shared for this verse.</p>
          <div className="mt-8 h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-bible-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, (activeReflections.length / 10) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {activeReflections.length === 0 && (
        <div className="bg-white dark:bg-bible-900 rounded-[2.5rem] border border-dashed border-bible-200 dark:border-bible-800 p-16 md:p-24 text-center">
          <div className="bg-bible-50 dark:bg-bible-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-bible-400 dark:text-bible-500">
            <MessageSquare size={48} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-bible-900 dark:text-white mb-3">No Reflections Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed text-lg">
            Once the team shares their thoughts on this verse, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
