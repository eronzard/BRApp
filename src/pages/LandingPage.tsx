import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageSquare, Archive, Users, ArrowRight, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Weekly Scripture',
    description:
      'Your room admin selects a passage each week. Everyone in the group reads the same scripture, creating a shared foundation for reflection.',
  },
  {
    icon: MessageSquare,
    title: 'Team Reflections',
    description:
      "Each member writes what the passage means to them personally. Read each other's reflections and grow together in understanding.",
  },
  {
    icon: Archive,
    title: 'Reading Archive',
    description:
      "Every week's scripture and reflections are preserved. Revisit past readings and see how your group has grown over time.",
  },
  {
    icon: Users,
    title: 'Rooms & Roles',
    description:
      'Create a private room for your small group, family, or church team. Admins manage the scripture; members focus on reflecting.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Create or Join a Room',
    description: 'Sign up and create a room in seconds. Share the room code to invite your group.',
  },
  {
    num: '02',
    title: 'Admin Publishes Scripture',
    description: 'The room admin selects a Bible passage and version. It goes live for the whole group.',
  },
  {
    num: '03',
    title: 'Read & Reflect Together',
    description: "Everyone reads the same passage and writes their reflection. Then read each other's.",
  },
];

export const LandingPage: React.FC = () => {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-bible-100 via-bible-50 to-white dark:from-bible-900 dark:via-bible-950 dark:to-bible-950 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-bible-200 dark:bg-bible-800 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-bible-300 dark:bg-bible-700 rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bible-100 dark:bg-bible-800 text-bible-700 dark:text-bible-300 text-xs font-semibold tracking-wide mb-6 border border-bible-200 dark:border-bible-700">
            <BookOpen size={12} />
            Team Bible Reading, Reimagined
          </span>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-bible-900 dark:text-white leading-tight mb-6">
            Read Together.
            <br />
            <span className="text-bible-600">Reflect Together.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
            Bible Room brings your small group, family, or church team together around weekly scripture — one passage, every week, with space for everyone's reflection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/web"
              className="inline-flex items-center gap-2 px-8 py-4 bg-bible-600 hover:bg-bible-700 text-white text-base font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Enter App
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-bible-900 hover:bg-bible-50 dark:hover:bg-bible-800 text-bible-700 dark:text-bible-300 text-base font-semibold rounded-2xl shadow border border-bible-200 dark:border-bible-700 transition-all"
            >
              How It Works
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bible-900 dark:text-white mb-4">
              Everything your group needs
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Simple tools designed for meaningful engagement with scripture, built for real communities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white dark:bg-bible-900 rounded-2xl p-6 shadow-md border border-bible-100 dark:border-bible-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-11 h-11 bg-bible-100 dark:bg-bible-800 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-bible-600 dark:text-bible-400" />
                </div>
                <h3 className="font-semibold text-bible-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works teaser ── */}
      <section className="py-20 sm:py-24 bg-white dark:bg-bible-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bible-900 dark:text-white mb-4">
              Up and running in minutes
            </h2>
            <p className="text-gray-500 dark:text-gray-400">No setup fees. No complicated onboarding. Just open the app and start reading.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            {steps.map(({ num, title, description }) => (
              <div key={num} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-bible-600 text-white font-serif font-bold text-xl mb-4">
                  {num}
                </div>
                <h3 className="font-semibold text-bible-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-bible-600 dark:text-bible-400 font-semibold hover:underline">
              See the full walkthrough
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 sm:py-24 bg-bible-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to read Scripture together?
          </h2>
          <p className="text-bible-200 text-lg mb-8">
            It's free. Create your room in minutes and invite your group today.
          </p>
          <Link
            to="/web"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-bible-50 text-bible-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};
