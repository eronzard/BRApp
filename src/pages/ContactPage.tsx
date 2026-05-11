import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-bible-900 dark:text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          We'd love to hear from you — whether it's a question, a suggestion, or a report of something not working.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-bible-900 rounded-2xl p-8 shadow-md border border-bible-100 dark:border-bible-800 flex gap-5 items-start">
          <div className="w-12 h-12 bg-bible-100 dark:bg-bible-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <Mail size={22} className="text-bible-600 dark:text-bible-400" />
          </div>
          <div>
            <h2 className="font-semibold text-bible-900 dark:text-white mb-1">Email Support</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              For any questions, bug reports, or feedback, reach out by email. We typically respond within 1–2 business days.
            </p>
            <a
              href="mailto:team@bibleroom.app"
              className="inline-flex items-center gap-1.5 text-bible-600 dark:text-bible-400 font-semibold hover:underline"
            >
              team@bibleroom.app
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-bible-900 rounded-2xl p-8 shadow-md border border-bible-100 dark:border-bible-800 flex gap-5 items-start">
          <div className="w-12 h-12 bg-bible-100 dark:bg-bible-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageCircle size={22} className="text-bible-600 dark:text-bible-400" />
          </div>
          <div>
            <h2 className="font-semibold text-bible-900 dark:text-white mb-1">Feature Requests</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Have an idea for something that would make Bible Room better for your group? We'd love to hear it. Send your suggestions to the email above and we'll consider them for future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
