
import React from 'react';
import { ChevronLeft, BookOpen, Users, MessageSquare, Shield, Archive, BarChart3, Hash, Key } from 'lucide-react';

interface UserGuideProps {
  onBack: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-bible-50 dark:bg-bible-950 p-4 md:p-8 animate-fade-in transition-colors duration-300 pb-24">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-bible-600 dark:text-bible-400 hover:text-bible-800 dark:hover:text-bible-200 font-bold transition-all group shrink-0"
          >
            <div className="bg-white dark:bg-bible-900 p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all">
              <ChevronLeft size={20} />
            </div>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="bg-bible-600 p-2 rounded-xl text-white shrink-0">
              <BookOpen size={20} className="md:w-6 md:h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-bible-900 dark:text-white truncate">User Guide</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Getting Started */}
          <section className="bg-white dark:bg-bible-900 p-6 md:p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-lg space-y-3 md:space-y-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-bible-100 dark:bg-bible-800 text-bible-600 dark:text-bible-400 rounded-2xl flex items-center justify-center">
              <Users size={20} className="md:w-6 md:h-6" />
            </div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-bible-900 dark:text-white">Getting Started</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
              Welcome to Bible Room! To begin, you can either **Create a Room** or **Join a Room** using a 6-digit code. Each room is a private space for your group to study and reflect on scriptures together.
            </p>
          </section>

          {/* Daily Reading */}
          <section className="bg-white dark:bg-bible-900 p-6 md:p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-lg space-y-3 md:space-y-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-bible-100 dark:bg-bible-800 text-bible-600 dark:text-bible-400 rounded-2xl flex items-center justify-center">
              <BookOpen size={20} className="md:w-6 md:h-6" />
            </div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-bible-900 dark:text-white">Daily Reading</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
              Once inside a room, you'll see the active scripture published by the admin. Read the verse, then click **"I've Read This"** to unlock the reflection input.
            </p>
          </section>

          {/* Reflections */}
          <section className="bg-white dark:bg-bible-900 p-6 md:p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-lg space-y-3 md:space-y-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-bible-100 dark:bg-bible-800 text-bible-600 dark:text-bible-400 rounded-2xl flex items-center justify-center">
              <MessageSquare size={20} className="md:w-6 md:h-6" />
            </div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-bible-900 dark:text-white">Sharing Reflections</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
              Share your thoughts on the scripture. You can see reflections from other members in the **"Reflect"** tab. It's a great way to learn from each other's insights.
            </p>
          </section>

          {/* Admin Controls */}
          <section className="bg-white dark:bg-bible-900 p-6 md:p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-lg space-y-3 md:space-y-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-bible-100 dark:bg-bible-800 text-bible-600 dark:text-bible-400 rounded-2xl flex items-center justify-center">
              <Shield size={20} className="md:w-6 md:h-6" />
            </div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-bible-900 dark:text-white">Admin Controls</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
              Room admins can publish new scriptures, manage members, and archive old readings. Use the **"Admin"** tab to keep the room active and organized.
            </p>
          </section>
        </div>

        {/* Detailed Features */}
        <div className="bg-bible-900 dark:bg-bible-950 p-6 md:p-10 rounded-[32px] md:rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-white/5 dark:border-bible-800">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/5 dark:bg-bible-800/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 text-bible-300 dark:text-bible-400">
                  <Archive size={18} />
                  <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">History</span>
                </div>
                <p className="text-xs md:text-sm text-bible-100 dark:text-bible-200 leading-relaxed">Access all previous scriptures and reflections in the Archive tab.</p>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 text-bible-300 dark:text-bible-400">
                  <BarChart3 size={18} />
                  <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Review</span>
                </div>
                <p className="text-xs md:text-sm text-bible-100 dark:text-bible-200 leading-relaxed">Get an AI-powered summary of the group's reflections to see common themes.</p>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 text-bible-300 dark:text-bible-400">
                  <Key size={18} />
                  <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Security</span>
                </div>
                <p className="text-xs md:text-sm text-bible-100 dark:text-bible-200 leading-relaxed">Your data is protected. Use the Profile section to manage your account and room memberships.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-bible-900 dark:text-white text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FaqItem 
              question="How do I join a room?" 
              answer="Ask the room administrator for the 6-digit room code. Enter this code in the 'Join Room' section of your lobby." 
            />
            <FaqItem 
              question="Can I leave a room?" 
              answer="Yes, go to your Profile, find the room under 'Manage Your Rooms', and type the room code to confirm leaving. This will delete your data for that room." 
            />
            <FaqItem 
              question="How do I change my password?" 
              answer="In your Profile section, click 'Change Password'. You will receive an email with instructions to set a new password." 
            />
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-10 border-t border-bible-200 dark:border-bible-800">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Need more help? Contact us at <a href="mailto:team@bibleroom.app" className="text-bible-600 dark:text-bible-400 font-bold hover:underline">team@bibleroom.app</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => (
  <div className="bg-white dark:bg-bible-900 p-6 rounded-2xl border border-bible-100 dark:border-bible-800 shadow-sm">
    <h3 className="font-bold text-bible-900 dark:text-white mb-2">{question}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
  </div>
);
