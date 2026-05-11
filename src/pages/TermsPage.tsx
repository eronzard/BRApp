import React from 'react';

const LAST_UPDATED = '11 May 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-serif text-xl font-bold text-bible-900 dark:text-white mb-3">{title}</h2>
    <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-bible-900 dark:text-white mb-3">Terms of Use</h1>
        <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-bible-50 dark:bg-bible-900 border border-bible-200 dark:border-bible-700 rounded-2xl p-5 mb-10 text-sm text-bible-800 dark:text-bible-200">
        Please read these Terms of Use carefully before using Bible Room. By accessing or using the service, you agree to be bound by these terms.
      </div>

      <Section title="1. Acceptance of Terms">
        <p>By creating an account or using Bible Room ("the Service"), you agree to these Terms of Use and our <a href="/privacy" className="text-bible-600 dark:text-bible-400 hover:underline">Privacy Policy</a>. If you do not agree, you must not use the Service.</p>
        <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
      </Section>

      <Section title="2. Description of the Service">
        <p>Bible Room is a web application that allows groups of people to read the same Bible passage each week and share personal reflections with each other. Features include:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Creating and joining rooms with a room code</li>
          <li>Admins publishing weekly scripture passages</li>
          <li>Members writing and reading reflections</li>
          <li>A searchable archive of past readings</li>
        </ul>
        <p>The Service is provided free of charge. We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.</p>
      </Section>

      <Section title="3. Account Requirements">
        <p><strong className="text-bible-900 dark:text-white">Age.</strong> You must be at least 16 years old to create an account. By registering, you confirm that you meet this requirement.</p>
        <p><strong className="text-bible-900 dark:text-white">Accurate information.</strong> You agree to provide accurate and complete information when creating your account and to keep it up to date.</p>
        <p><strong className="text-bible-900 dark:text-white">Account security.</strong> You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately at <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 hover:underline">team@bibleroom.app</a> if you suspect unauthorised access to your account.</p>
        <p><strong className="text-bible-900 dark:text-white">One account per person.</strong> Each account must belong to one individual. Shared or automated accounts are not permitted.</p>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree to use the Service only for lawful purposes and in a manner that does not infringe the rights of others. You must not post content that is:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Harmful, abusive, harassing, threatening, or hateful</li>
          <li>Defamatory, obscene, or sexually explicit</li>
          <li>Infringing on the intellectual property rights of others</li>
          <li>Intended to deceive, defraud, or impersonate others</li>
          <li>Spam, advertising, or commercial solicitation</li>
          <li>In violation of any applicable law or regulation</li>
        </ul>
        <p>Bible Room is designed for faith-based scripture reading and reflection. We expect all users to engage respectfully with one another.</p>
      </Section>

      <Section title="5. Content Ownership">
        <p><strong className="text-bible-900 dark:text-white">Your reflections.</strong> You retain ownership of the reflections and other content you submit to the Service. By submitting content, you grant Bible Room a non-exclusive, royalty-free licence to store, display, and transmit that content solely for the purpose of operating the Service within your room.</p>
        <p><strong className="text-bible-900 dark:text-white">Bible text.</strong> Scripture passages are sourced from YouVersion/Life.Church via their partner API. Bible text is the property of its respective copyright holders and is used under licence.</p>
        <p><strong className="text-bible-900 dark:text-white">Bible Room content.</strong> The Bible Room name, logo, design, and code are the property of Bible Room and may not be reproduced without permission.</p>
      </Section>

      <Section title="6. Privacy">
        <p>Your use of the Service is also governed by our <a href="/privacy" className="text-bible-600 dark:text-bible-400 hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference. Please review it carefully.</p>
      </Section>

      <Section title="7. Service Availability">
        <p>The Service is provided "as is" and "as available." We do not guarantee that the Service will be uninterrupted, error-free, or secure. We are not liable for any loss or damage arising from downtime, data loss, or technical errors.</p>
        <p>We may perform maintenance, updates, or changes to the Service at any time. We will try to notify users of significant disruptions in advance where possible.</p>
      </Section>

      <Section title="8. Termination">
        <p><strong className="text-bible-900 dark:text-white">By you.</strong> You may delete your account at any time via the Profile page in the app. Deleting your account removes your personal data and reflections permanently.</p>
        <p><strong className="text-bible-900 dark:text-white">By us.</strong> We reserve the right to suspend or terminate accounts that violate these Terms, without notice. In serious cases (e.g. illegal content), we may report violations to the relevant authorities.</p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>To the fullest extent permitted by applicable law, Bible Room shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages.</p>
        <p>Our total liability to you for any claim arising from the Service shall not exceed the amount you have paid us in the 12 months preceding the claim (which, since the Service is free, is zero).</p>
      </Section>

      <Section title="10. Governing Law">
        <p>These Terms are governed by and construed in accordance with the laws of the European Union and the laws of the jurisdiction in which the operator is based, without regard to conflict of law principles.</p>
        <p>Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.</p>
      </Section>

      <Section title="11. Contact">
        <p>For any questions about these Terms, please contact us at <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 hover:underline">team@bibleroom.app</a>.</p>
      </Section>
    </div>
  );
};
