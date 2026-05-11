import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is Bible Room free?',
    a: 'Yes, Bible Room is completely free to use. Create your account, create a room, and invite your group — no payment required.',
  },
  {
    q: 'How do I create a room?',
    a: 'After signing in, you\'ll be taken to the lobby. Click "Create Room," give it a name, and choose whether it\'s public or private. You\'ll receive a room code to share with your group.',
  },
  {
    q: 'Can I be in multiple rooms?',
    a: 'Yes. You can join as many rooms as you like — for example, one for your small group and one for your family.',
  },
  {
    q: 'What Bible versions are supported?',
    a: 'Bible Room currently supports AMP (Amplified), ASV (American Standard Version), EASY (Easy-to-Read), NASB (New American Standard Bible), and NIV (New International Version).',
  },
  {
    q: 'How do I invite others to my room?',
    a: 'Share your room code with anyone you want to invite. They sign up for Bible Room, go to the lobby, and enter the code to join.',
  },
  {
    q: 'Who can publish scripture?',
    a: 'Only room admins can publish and manage scripture. Members can read and write reflections.',
  },
  {
    q: 'Can I see past readings?',
    a: 'Yes. The Archive tab inside your room shows all past scriptures and their reflections, so your group\'s history is always accessible.',
  },
  {
    q: 'Is my data private?',
    a: 'Reflections are visible to everyone in your room. Private rooms are not discoverable by outsiders — only people with the room code can join.',
  },
];

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-bible-100 dark:border-bible-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-bible-900 hover:bg-bible-50 dark:hover:bg-bible-800 transition-colors text-left"
      >
        <span className="font-medium text-bible-900 dark:text-white">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-bible-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 py-4 bg-bible-50 dark:bg-bible-800 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-bible-100 dark:border-bible-700">
          {a}
        </div>
      )}
    </div>
  );
};

export const FAQPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-bible-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Everything you need to know. Can't find the answer? Email us at{' '}
          <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 hover:underline">
            team@bibleroom.app
          </a>
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map(({ q, a }) => (
          <FAQItem key={q} q={q} a={a} />
        ))}
      </div>
    </div>
  );
};
