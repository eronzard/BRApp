import React from 'react';
import { Heart, Server, Wrench, Zap } from 'lucide-react';

const reasons = [
  { icon: Server, title: 'Keep the servers running', description: 'Bible Room uses cloud infrastructure to stay fast and reliable for groups around the world.' },
  { icon: Wrench, title: 'Fund new features', description: 'Your support helps us build improvements — better notifications, more Bible versions, and more.' },
  { icon: Zap, title: 'Stay free for everyone', description: 'We want Bible Room to remain free so no group is priced out of using it.' },
];

export const DonatePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-5">
          <Heart size={32} className="text-red-500" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-bible-900 dark:text-white mb-4">
          Support the Mission
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
          Bible Room is free for everyone. If it's been valuable to your group, consider supporting us so we can keep it running and growing.
        </p>
      </div>

      {/* Why section */}
      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        {reasons.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-white dark:bg-bible-900 rounded-2xl p-5 shadow-sm border border-bible-100 dark:border-bible-800 text-center">
            <div className="w-10 h-10 bg-bible-100 dark:bg-bible-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon size={20} className="text-bible-600 dark:text-bible-400" />
            </div>
            <h3 className="font-semibold text-bible-900 dark:text-white text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* Donation CTA */}
      <div className="bg-bible-600 rounded-3xl p-8 sm:p-10 text-center">
        <h2 className="font-serif text-2xl font-bold text-white mb-3">Ready to give?</h2>
        <p className="text-bible-200 mb-6 text-sm">
          Every contribution, big or small, helps keep Bible Room free and growing.
        </p>
        {/* Replace href with your actual donation link */}
        <a
          href="mailto:team@bibleroom.app?subject=Donation"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-bible-50 text-bible-700 font-bold rounded-2xl shadow-lg transition-all"
        >
          <Heart size={18} className="text-red-500" />
          Donate Now
        </a>
        <p className="text-bible-300 text-xs mt-4">
          Contact us at <a href="mailto:team@bibleroom.app" className="underline">team@bibleroom.app</a> with any questions about giving.
        </p>
      </div>
    </div>
  );
};
