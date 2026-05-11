import React from 'react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = '11 May 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-serif text-xl font-bold text-bible-900 dark:text-white mb-3">{title}</h2>
    <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-bible-900 dark:text-white mb-3">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-bible-50 dark:bg-bible-900 border border-bible-200 dark:border-bible-700 rounded-2xl p-5 mb-10 text-sm text-bible-800 dark:text-bible-200">
        Bible Room is committed to protecting your privacy. This policy explains what data we collect, why we collect it, and your rights under the General Data Protection Regulation (GDPR) and other applicable laws.
      </div>

      <Section title="1. Who We Are">
        <p>
          Bible Room ("we", "us", "our") operates the website <strong>bibleroom.app</strong> and the Bible Room web application. We are the data controller responsible for your personal data.
        </p>
        <p>
          Contact us at any time: <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 hover:underline">team@bibleroom.app</a>
        </p>
      </Section>

      <Section title="2. Data We Collect">
        <p><strong className="text-bible-900 dark:text-white">Account data</strong> — When you create an account, we collect your email address and username. These are necessary to identify you and provide the service.</p>
        <p><strong className="text-bible-900 dark:text-white">Content data</strong> — When you use Bible Room, we store the reflections you write and the rooms you join or create. This is the core of the service.</p>
        <p><strong className="text-bible-900 dark:text-white">Technical data</strong> — Our hosting and authentication infrastructure may log your IP address and session information for security and debugging purposes. We do not use this data for profiling or advertising.</p>
        <p>We do <strong>not</strong> collect payment information, location data, or device identifiers. We do not run advertising or analytics trackers.</p>
      </Section>

      <Section title="3. Why We Process Your Data (Legal Basis)">
        <p><strong className="text-bible-900 dark:text-white">Contractual necessity (Art. 6(1)(b) GDPR)</strong> — We process your account data, reflections, and room membership because this is required to provide the Bible Room service you signed up for. Without it, the service cannot function.</p>
        <p><strong className="text-bible-900 dark:text-white">Legitimate interests (Art. 6(1)(f) GDPR)</strong> — We retain server and security logs to protect the integrity and security of the platform. We have assessed that this interest does not override your rights or freedoms.</p>
      </Section>

      <Section title="4. Who We Share Your Data With">
        <p>We do not sell, rent, or trade your personal data. We share data only with the following data processors, who act under our instruction:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-bible-900 dark:text-white">Supabase</strong> — provides our database and authentication infrastructure. Data is stored on Supabase servers. Supabase acts as a data processor under a Data Processing Agreement. See their privacy policy at <span className="text-bible-600 dark:text-bible-400">supabase.com/privacy</span>.</li>
          <li><strong className="text-bible-900 dark:text-white">Vercel</strong> — hosts the Bible Room web application. Vercel may process request logs. See their privacy policy at <span className="text-bible-600 dark:text-bible-400">vercel.com/legal/privacy-policy</span>.</li>
        </ul>
        <p>Bible text is fetched from the YouVersion/Life.Church API. No personal data is sent to YouVersion.</p>
      </Section>

      <Section title="5. International Data Transfers">
        <p>Supabase and Vercel are based in the United States. When your data is processed by these services, it may be transferred to and stored in the US. These transfers are covered by appropriate safeguards, including Standard Contractual Clauses (SCCs) approved by the European Commission, as required by GDPR Chapter V.</p>
      </Section>

      <Section title="6. How Long We Keep Your Data">
        <p><strong className="text-bible-900 dark:text-white">Account and content data</strong> — We keep your data for as long as your account is active. When you delete your account, your personal data and reflections are permanently removed.</p>
        <p><strong className="text-bible-900 dark:text-white">Server logs</strong> — Technical logs are retained for approximately 30 days for security purposes, then deleted automatically.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>Under the GDPR, you have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Right of access</li>
          <li>Right to rectification</li>
          <li>Right to erasure ("right to be forgotten")</li>
          <li>Right to restriction of processing</li>
          <li>Right to data portability</li>
          <li>Right to object</li>
        </ul>
        <p>
          See our <Link to="/gdpr-rights" className="text-bible-600 dark:text-bible-400 hover:underline">GDPR Rights page</Link> for a full explanation of each right and how to exercise it. To make a request, email us at <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 hover:underline">team@bibleroom.app</a>. We will respond within 30 days.
        </p>
      </Section>

      <Section title="8. Cookies and Local Storage">
        <p>
          Bible Room uses browser local storage (not advertising cookies) for authentication and theme preferences. See our <Link to="/cookies" className="text-bible-600 dark:text-bible-400 hover:underline">Cookie Policy</Link> for full details.
        </p>
      </Section>

      <Section title="9. Minimum Age">
        <p>Bible Room is intended for users aged 16 and over. We do not knowingly collect personal data from children under 16. If you believe a child under 16 has created an account, please contact us and we will delete it promptly.</p>
      </Section>

      <Section title="10. Complaints">
        <p>If you believe we have not handled your data correctly, you have the right to lodge a complaint with the data protection supervisory authority in your country of residence. A list of EU supervisory authorities is available at <span className="text-bible-600 dark:text-bible-400">edpb.europa.eu</span>.</p>
        <p>We encourage you to contact us first at <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 hover:underline">team@bibleroom.app</a> so we can try to resolve any concerns directly.</p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. When we do, we will update the "last updated" date at the top. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
      </Section>
    </div>
  );
};
