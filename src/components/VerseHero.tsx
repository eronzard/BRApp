
import React, { useState, useEffect } from 'react';
import { WeeklyReading, SUPPORTED_VERSIONS } from '../types';
import { getScriptureDetails } from '../services/bibleService';
import { CheckCircle2, ChevronDown, Loader2, BookOpen, Volume2, Square, Play } from 'lucide-react';

interface VerseHeroProps {
  verse: WeeklyReading;
  loading?: boolean;
  hasAcknowledged: boolean;
  onAcknowledge: () => void;
}

export const VerseHero: React.FC<VerseHeroProps> = ({ verse, loading = false, hasAcknowledged, onAcknowledge }) => {
  const [currentText, setCurrentText] = useState(verse.text);
  const [currentVersion, setCurrentVersion] = useState(verse.version);
  const [isFetching, setIsFetching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Use a stable key for the effect to prevent unnecessary re-renders or missing updates
  const verseKey = verse.id || verse.reference;

  useEffect(() => {
    setCurrentText(verse.text);
    setCurrentVersion(verse.version);
    // Stop any ongoing speech when the verse changes
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [verseKey, verse.text, verse.version]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleVersionChange = async (newVersion: string) => {
    if (newVersion === currentVersion) return;
    
    setIsFetching(true);
    setCurrentVersion(newVersion);
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    
    const details = await getScriptureDetails(verse.reference, newVersion);
    setCurrentText(details.text);
    setIsFetching(false);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToRead = `${verse.reference}. ${stripHtml(currentText)}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-bible-900 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-xl transition-all hover:shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-bible-100 dark:bg-bible-800 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-bible-50 dark:bg-bible-950 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="relative p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-bible-600 p-3 rounded-2xl text-white shadow-lg shadow-bible-200 dark:shadow-none">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-bible-900 dark:text-white tracking-tight">
                  {verse.reference}
                </h1>
                {hasAcknowledged ? (
                  <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-100 dark:border-green-800">
                    <CheckCircle2 size={14} />
                    <span>Acknowledged</span>
                  </div>
                ) : (
                  <button
                    onClick={onAcknowledge}
                    className="bg-bible-600 hover:bg-bible-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>I Acknowledge</span>
                  </button>
                )}
              </div>
              {verse.theme && (
                <p className="text-bible-500 dark:text-bible-400 font-medium mt-1 uppercase tracking-widest text-xs">
                  Theme: {verse.theme}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-md hover:shadow-lg ${
                isPlaying 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800' 
                  : 'bg-bible-50 dark:bg-bible-800 text-bible-700 dark:text-bible-200 border border-bible-100 dark:border-bible-700 hover:bg-bible-100 dark:hover:bg-bible-700'
              }`}
              title={isPlaying ? "Stop Reading" : "Listen to Scripture"}
            >
              {isPlaying ? (
                <>
                  <Square size={18} fill="currentColor" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  <span>Listen</span>
                </>
              )}
            </button>

            <div className="relative group">
              <select
                value={currentVersion}
                onChange={(e) => handleVersionChange(e.target.value)}
                className="appearance-none bg-bible-50 dark:bg-bible-800 border border-bible-200 dark:border-bible-700 text-bible-800 dark:text-bible-200 text-sm rounded-xl focus:ring-bible-500 focus:border-bible-500 block w-full pl-4 pr-10 py-2.5 cursor-pointer transition-all hover:bg-bible-100 dark:hover:bg-bible-700 font-medium"
              >
                {SUPPORTED_VERSIONS.map(v => (
                  <option key={v} value={v} className="dark:bg-bible-900">{v}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-bible-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {isFetching || loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-bible-500 animate-spin" />
              <p className="text-bible-400 font-medium animate-pulse">Fetching scripture text...</p>
            </div>
          ) : (
            <div className="prose prose-bible dark:prose-invert max-w-none">
              <div 
                className="text-base md:text-lg lg:text-xl font-sans text-gray-800 dark:text-gray-200 leading-relaxed text-left"
                dangerouslySetInnerHTML={{ __html: currentText }}
              />
            </div>
          )}
          
          <div className="mt-10 pt-8 border-t border-bible-100 dark:border-bible-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              Published on {new Date(verse.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
            <div className="text-bible-400 dark:text-bible-500 text-sm font-mono italic">
              {currentVersion} Version
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
