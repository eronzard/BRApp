import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, PauseCircle, Download, XCircle, Flag, Clock } from 'lucide-react';

const LAST_UPDATED = '11 May 2026';

interface RightCardProps {
  icon: React.ElementType;
  article: string;
  title: string;
  description: string;
  howTo: string;
}

const RightCard: React.FC<RightCardProps> = ({ icon: Icon, article, title, description, howTo }) => (
  <div className="bg-white dark:bg-bible-900 rounded-2xl border border-bible-100 dark:border-bible-800 p-6">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-bible-100 dark:bg-bible-800 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-bible-600 dark:text-bible-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-bible-500 dark:text-bible-400 font-mono mb-0.5">{article}</p>
        <h3 className="font-semibold text-bible-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{description}</p>
        <div className="bg-bible-50 dark:bg-bible-800 rounded-lg px-3 py-2">
          <p className="text-xs text-bible-700 dark:text-bible-300"><span className="font-semibold">How to exercise it:</span> {howTo}</p>
        </div>
      </div>
    </div>
  </div>
);

export const GDPRRightsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-bible-900 dark:text-white mb-3">Your GDPR Rights</h1>
        <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-bible-50 dark:bg-bible-900 border border-bible-200 dark:border-bible-700 rounded-2xl p-5 mb-10 text-sm text-bible-800 dark:text-bible-200">
        Under the General Data Protection Regulation (GDPR), you have the following rights regarding your personal data. We will respond to all valid requests within <strong>30 days</strong>, as required by law. To exercise any right, email us at <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 hover:underline font-semibold">team@bibleroom.app</a>.
      </div>

      <div className="space-y-4 mb-12">
        <RightCard
          icon={Eye}
          article="Article 15"
          title="Right of Access"
          description="You have the right to know what personal data we hold about you and to receive a copy of it. This includes your account details, reflections, and room membership."
          howTo="Email us and we will send you a summary of all personal data we hold for your account within 30 days."
        />
        <RightCard
          icon={Edit3}
          article="Article 16"
          title="Right to Rectification"
          description="If your personal data is inaccurate or incomplete, you have the right to have it corrected."
          howTo="You can update your username in the Profile section of the app. For other corrections (e.g. email address), email us."
        />
        <RightCard
          icon={Trash2}
          article="Article 17"
          title="Right to Erasure"
          description='Also known as the "right to be forgotten." You can request deletion of your personal data when it is no longer necessary for the purposes it was collected, or if you withdraw consent.'
          howTo="Delete your account from the Profile section of the app — this permanently removes your account and reflections. Alternatively, email us and we will do it for you."
        />
        <RightCard
          icon={PauseCircle}
          article="Article 18"
          title="Right to Restriction of Processing"
          description="You can ask us to pause processing of your data — for example, if you contest the accuracy of your data or have objected to processing and are waiting for us to verify our grounds."
          howTo="Email us explaining which processing you wish to restrict. We will suspend the relevant processing while we review your request."
        />
        <RightCard
          icon={Download}
          article="Article 20"
          title="Right to Data Portability"
          description="You have the right to receive your personal data in a structured, commonly used, machine-readable format (such as JSON or CSV) and to transmit it to another service."
          howTo="Email us and we will provide an export of your account data and reflections in a portable format within 30 days."
        />
        <RightCard
          icon={XCircle}
          article="Article 21"
          title="Right to Object"
          description="You can object to processing of your personal data that is based on legitimate interests. We process server logs on this basis. If you object, we will stop unless we can demonstrate compelling legitimate grounds that override your interests."
          howTo="Email us stating which processing you object to and the grounds for your objection. We will review and respond within 30 days."
        />
        <RightCard
          icon={Flag}
          article="Article 77"
          title="Right to Lodge a Complaint"
          description="If you believe we have handled your data unlawfully, you have the right to lodge a complaint with the data protection supervisory authority in your country of residence or where the alleged infringement took place."
          howTo="Find your national supervisory authority at edpb.europa.eu/about-edpb/board/members_en. We encourage you to contact us first so we can try to resolve the issue directly."
        />
      </div>

      <div className="bg-bible-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Clock size={20} className="text-bible-200" />
          <h2 className="font-semibold">Response Time</h2>
        </div>
        <p className="text-bible-100 text-sm leading-relaxed mb-4">
          We will acknowledge all rights requests within 72 hours and provide a full response within <strong>30 calendar days</strong>. If a request is complex or we receive a high volume of requests, we may extend this by a further two months — in which case we will notify you within the first 30 days and explain the reason.
        </p>
        <a
          href="mailto:team@bibleroom.app"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-bible-700 font-semibold rounded-xl text-sm hover:bg-bible-50 transition-colors"
        >
          Email us to make a request
        </a>
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        For more information, see our full <Link to="/privacy" className="text-bible-500 hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
};
