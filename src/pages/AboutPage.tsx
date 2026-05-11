import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Users, ArrowRight } from 'lucide-react';

const values = [
  { icon: BookOpen, title: 'Scripture First', description: 'Every feature points back to engagement with God\'s Word. The Bible is the center of everything we build.' },
  { icon: Users, title: 'Community Matters', description: 'Reading the Bible together is more powerful than reading alone. We build tools that make community easy.' },
  { icon: Heart, title: 'Accessible to All', description: 'Bible Room is free and simple to use. We want every small group, family, and church team to have access.' },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-bible-900 dark:text-white mb-4">
          About Bible Room
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          We built Bible Room because we believe that reading Scripture together — and hearing each other's reflections — changes people.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white dark:bg-bible-900 rounded-3xl p-8 sm:p-10 shadow-md border border-bible-100 dark:border-bible-800 mb-10">
        <h2 className="font-serif text-2xl font-bold text-bible-900 dark:text-white mb-4">Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          Bible Room exists to help communities engage with scripture together, consistently. We saw small groups struggling to stay on the same page — some using group chats, some using spreadsheets, none of it built for this purpose.
        </p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          So we built a simple tool: a shared space where a group reads the same passage each week and shares what it means to them. No more chasing down reflections across different apps. One room, one passage, one conversation.
        </p>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-bible-900 dark:text-white mb-6 text-center">What We Believe</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white dark:bg-bible-900 rounded-2xl p-6 shadow-sm border border-bible-100 dark:border-bible-800">
              <div className="w-10 h-10 bg-bible-100 dark:bg-bible-800 rounded-xl flex items-center justify-center mb-3">
                <Icon size={20} className="text-bible-600 dark:text-bible-400" />
              </div>
              <h3 className="font-semibold text-bible-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/web"
          className="inline-flex items-center gap-2 px-8 py-4 bg-bible-600 hover:bg-bible-700 text-white font-bold rounded-2xl shadow-lg transition-all"
        >
          Enter Bible Room
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
