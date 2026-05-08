
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ReflectionInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export const ReflectionInput: React.FC<ReflectionInputProps> = ({ onSubmit, isLoading = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <div className="bg-white dark:bg-bible-900 rounded-2xl border border-bible-200 dark:border-bible-800 shadow-lg overflow-hidden transition-all hover:shadow-xl">
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white mb-4 flex items-center gap-2">
          <Send size={20} className="text-bible-600 dark:text-bible-400" />
          <span>Write Your Reflection</span>
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          How does this scripture speak to you today? Share your thoughts, prayers, or action items with the team.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isLoading ? "Submitting..." : "Type your reflection here..."}
              className={`w-full h-40 p-5 bg-bible-50 dark:bg-bible-950 border border-bible-100 dark:border-bible-800 rounded-xl focus:ring-2 focus:ring-bible-500 focus:border-transparent transition-all resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
              {text.trim().length < 10 ? (
                <span className="text-bible-600 dark:text-bible-400">Min. 10 characters required ({10 - text.trim().length} more)</span>
              ) : (
                <span className="text-green-600 dark:text-green-400">Ready to submit!</span>
              )}
            </div>
            <button
              type="submit"
              disabled={text.trim().length < 10 || isLoading}
              className="w-full sm:w-auto bg-bible-600 hover:bg-bible-700 disabled:bg-gray-300 dark:disabled:bg-bible-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-bible-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Submit Reflection</span>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
