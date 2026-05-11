import React from 'react';

const LAST_UPDATED = '11 May 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-serif text-xl font-bold text-bible-900 dark:text-white mb-3">{title}</h2>
    <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

interface StorageItemProps {
  name: string;
  type: string;
  purpose: string;
  essential: boolean;
  duration: string;
}

const StorageItem: React.FC<StorageItemProps> = ({ name, type, purpose, essential, duration }) => (
  <div className="bg-white dark:bg-bible-900 rounded-xl border border-bible-100 dark:border-bible-800 p-5">
    <div className="flex items-start justify-between gap-3 mb-2">
      <code className="text-bible-700 dark:text-bible-300 font-mono text-xs bg-bible-50 dark:bg-bible-800 px-2 py-1 rounded">{name}</code>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${essential ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
        {essential ? 'Essential' : 'Preference'}
      </span>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1"><span className="font-semibold text-bible-800 dark:text-bible-300">Type:</span> {type}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1"><span className="font-semibold text-bible-800 dark:text-bible-300">Purpose:</span> {purpose}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold text-bible-800 dark:text-bible-300">Duration:</span> {duration}</p>
  </div>
);

export const CookiesPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-bible-900 dark:text-white mb-3">Cookie Policy</h1>
        <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-bible-50 dark:bg-bible-900 border border-bible-200 dark:border-bible-700 rounded-2xl p-5 mb-10 text-sm text-bible-800 dark:text-bible-200">
        Bible Room uses a minimal set of browser storage mechanisms — only what is strictly necessary to run the service. We use no tracking cookies, no advertising cookies, and no third-party analytics.
      </div>

      <Section title="1. What Are Cookies and Local Storage?">
        <p>Cookies are small text files that websites store in your browser. Local storage is a similar mechanism that stores data in your browser but is never automatically sent to a server with requests.</p>
        <p>Both cookies and local storage can be viewed and cleared via your browser's settings or developer tools.</p>
      </Section>

      <Section title="2. What Bible Room Uses">
        <p>Bible Room uses browser local storage only. We do not set any third-party cookies. The following items may be stored in your browser:</p>
        <div className="space-y-4 mt-4">
          <StorageItem
            name="sb-*-auth-token"
            type="Local storage (set by Supabase)"
            purpose="Stores your authentication session so you remain logged in between visits. Without this, you would need to log in every time you open the app."
            essential={true}
            duration="Until you sign out or your session expires (typically 1 week)"
          />
          <StorageItem
            name="darkMode"
            type="Local storage (set by Bible Room)"
            purpose="Remembers whether you have chosen light or dark mode. This is a UI preference only and contains no personal data."
            essential={false}
            duration="Until you clear your browser storage (no expiry set)"
          />
        </div>
      </Section>

      <Section title="3. Essential Storage">
        <p>The Supabase authentication token is strictly necessary for the Service to function. Under the ePrivacy Directive, essential storage that is required to deliver a service explicitly requested by the user does not require consent. You cannot opt out of this storage while using the Service.</p>
      </Section>

      <Section title="4. What We Do Not Use">
        <p>We do not use any of the following:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Advertising or retargeting cookies</li>
          <li>Analytics cookies or tracking pixels (e.g. Google Analytics, Facebook Pixel)</li>
          <li>Third-party social media cookies</li>
          <li>Fingerprinting or cross-site tracking technologies</li>
        </ul>
      </Section>

      <Section title="5. How to Manage or Clear Storage">
        <p>You can view and delete local storage at any time through your browser's built-in tools:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-bible-900 dark:text-white">Chrome:</strong> Settings → Privacy and security → Clear browsing data → Advanced → Hosted app data</li>
          <li><strong className="text-bible-900 dark:text-white">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data → Clear Data</li>
          <li><strong className="text-bible-900 dark:text-white">Safari:</strong> Settings → Privacy → Manage Website Data</li>
          <li><strong className="text-bible-900 dark:text-white">Edge:</strong> Settings → Privacy, search, and services → Clear browsing data</li>
        </ul>
        <p>Note: clearing the authentication storage will sign you out of Bible Room.</p>
      </Section>

      <Section title="6. Changes to This Policy">
        <p>We may update this Cookie Policy if we change the storage mechanisms we use. When we do, we will update the "last updated" date at the top. We will not begin using tracking or advertising technologies without providing clear notice and, where required, obtaining your consent.</p>
        <p>Questions? Contact us at <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 hover:underline">team@bibleroom.app</a>.</p>
      </Section>
    </div>
  );
};
