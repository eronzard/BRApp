import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, BookOpen, PenLine, MessageSquare, Archive, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    num: '01',
    title: 'Sign Up & Create a Room',
    description:
      'Create your free account in seconds. Then create a room for your group — you\'ll get a short room code to share with everyone you want to invite.',
  },
  {
    icon: UserPlus,
    num: '02',
    title: 'Invite Your Group',
    description:
      'Share the room code with your small group, family, or church team. They sign up and join your room using the code. You\'re the admin; they\'re members.',
  },
  {
    icon: BookOpen,
    num: '03',
    title: 'Admin Publishes the Weekly Scripture',
    description:
      'Each week, you (the admin) select a Bible passage and version — NIV, AMP, ASV, NASB, or EASY — and publish it. It becomes live for your whole group immediately.',
  },
  {
    icon: PenLine,
    num: '04',
    title: 'Members Read & Write Reflections',
    description:
      'Group members open the app, read the scripture, and write what it means to them. Reflections are personal and honest — no right or wrong answers.',
  },
  {
    icon: MessageSquare,
    num: '05',
    title: 'Read Each Other\'s Reflections',
    description:
      'Once submitted, everyone can read each other\'s reflections. This is where the magic happens — seeing how the same passage speaks differently to each person.',
  },
  {
    icon: Archive,
    num: '06',
    title: 'Archive Keeps Your History',
    description:
      'Past weeks are automatically archived. You can browse your group\'s entire history of readings and reflections — a growing record of your journey through scripture.',
  },
];

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-bible-900 dark:text-white mb-4">
          How It Works
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Bible Room is designed to be simple. Here's everything that happens, step by step.
        </p>
      </div>

      <div className="relative">
        {/* Vertical line on desktop */}
        <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-px bg-bible-200 dark:bg-bible-800" />

        <div className="space-y-8">
          {steps.map(({ icon: Icon, num, title, description }) => (
            <div key={num} className="flex gap-6 sm:gap-8">
              <div className="relative flex-shrink-0 w-16 h-16 bg-bible-600 rounded-2xl flex items-center justify-center shadow-md">
                <Icon size={24} className="text-white" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-bible-950 border-2 border-bible-600 rounded-full flex items-center justify-center text-bible-600 text-xs font-bold">
                  {parseInt(num)}
                </span>
              </div>
              <div className="bg-white dark:bg-bible-900 rounded-2xl p-6 flex-1 shadow-sm border border-bible-100 dark:border-bible-800">
                <h3 className="font-semibold text-bible-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <Link
          to="/web"
          className="inline-flex items-center gap-2 px-8 py-4 bg-bible-600 hover:bg-bible-700 text-white font-bold rounded-2xl shadow-lg transition-all"
        >
          Get Started Now
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
