
import React, { useState } from 'react';
import { Reflection, AppUser, WeeklyReading } from '../types';
import { supabase } from '../services/supabaseClient';
import { TABLES } from '../constants/tables';
import { Dashboard } from './Dashboard';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Loader2, 
  Calendar,
  BookOpen,
  Quote,
  BarChart3
} from 'lucide-react';

interface ReflectionsListProps {
  reflections: Reflection[];
  currentUser: AppUser;
  isAdmin: boolean;
  onUpdateReflection: () => void;
  readingDate?: string;
  reference?: string;
  theme?: string;
  activeReading?: WeeklyReading;
}

export const ReflectionsList: React.FC<ReflectionsListProps> = ({ 
  reflections, 
  currentUser, 
  isAdmin, 
  onUpdateReflection,
  readingDate,
  reference,
  theme,
  activeReading
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const activeReflections = reflections.filter(r => 
    r.text && 
    r.text.trim().length > 0
  );
  const acknowledgedCount = reflections.filter(r => 
    r.acknowledged
  ).length;

  const handleEdit = (reflection: Reflection) => {
    setEditingId(reflection.id);
    setEditText(reflection.text);
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    const { error } = await supabase
      .from(TABLES.REFLECTIONS)
      .update({ text: editText })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      onUpdateReflection();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this reflection?")) return;
    const { error } = await supabase
      .from(TABLES.REFLECTIONS)
      .delete()
      .eq('id', id);

    if (!error) onUpdateReflection();
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-white dark:bg-bible-900 p-6 md:p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-bible-50 dark:bg-bible-800/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-bible-600 dark:bg-bible-700 p-3 rounded-2xl text-white shadow-lg shadow-bible-200 dark:shadow-none">
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-bible-900 dark:text-white tracking-tight">Team Reflections</h2>
              <p className="text-gray-500 dark:text-bible-400 font-medium mt-1">Sharing insights on {reference || 'this week\'s scripture'}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {isAdmin && readingDate && (
              <div className="flex items-center gap-2 bg-bible-50 dark:bg-bible-800 text-bible-700 dark:text-bible-300 px-4 py-2 rounded-xl border border-bible-100 dark:border-bible-700 text-sm font-bold shrink-0">
                <Calendar size={16} />
                <span>Published: {new Date(readingDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-bible-100 dark:bg-bible-800 text-bible-800 dark:text-bible-200 px-4 py-2 rounded-xl text-sm font-bold border border-bible-200 dark:border-bible-700 flex items-center gap-2">
                <MessageSquare size={14} />
                <span>{activeReflections.length} Reflections</span>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-2 rounded-xl text-sm font-bold border border-green-200 dark:border-green-800 flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{acknowledgedCount} Acknowledged</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeReflections.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-bible-900 rounded-3xl border border-dashed border-gray-200 dark:border-bible-800">
          <div className="bg-gray-50 dark:bg-bible-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-bible-700">
            <Quote size={32} />
          </div>
          <h3 className="text-xl font-serif font-bold text-gray-500 dark:text-bible-400 mb-2">No written reflections yet.</h3>
          <p className="text-gray-400 dark:text-gray-500 mb-4">Be the first to share your thoughts on the Read tab!</p>
          <div className="pt-4 border-t border-bible-50 dark:border-bible-800 max-w-xs mx-auto">
            <p className="text-xs text-bible-400 font-medium italic">Looking for past reflections? Check the Archive tab to see history from previous weeks.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeReflections.map((reflection) => (
            <div 
              key={reflection.id} 
              className={`bg-white dark:bg-bible-900 rounded-3xl border transition-all hover:shadow-lg overflow-hidden ${reflection.user_id === currentUser.id ? 'border-bible-300 dark:border-bible-600 shadow-md ring-1 ring-bible-100 dark:ring-bible-800' : 'border-bible-100 dark:border-bible-800 shadow-sm'}`}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${reflection.user_id === currentUser.id ? 'bg-bible-600 text-white' : 'bg-bible-100 dark:bg-bible-800 text-bible-800 dark:text-bible-200'}`}>
                      {reflection.user_profiles?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="font-bold text-bible-900 dark:text-white flex items-center gap-2">
                        {reflection.user_profiles?.username}
                        {reflection.user_id === currentUser.id && (
                          <span className="text-[10px] bg-bible-100 dark:bg-bible-800 text-bible-800 dark:text-bible-300 px-1.5 py-0.5 rounded uppercase tracking-widest">You</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">
                        <Clock size={12} />
                        <span>{new Date(reflection.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {reflection.acknowledged && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg border border-green-100 dark:border-green-800">
                        <CheckCircle2 size={12} />
                        <span className="hidden sm:inline uppercase tracking-tighter">Acknowledged</span>
                      </div>
                    )}
                    
                    {(reflection.user_id === currentUser.id || isAdmin) && (
                      <div className="flex items-center gap-1 ml-2">
                        {reflection.user_id === currentUser.id && (
                          <button 
                            onClick={() => handleEdit(reflection)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-bible-600 dark:hover:text-bible-400 hover:bg-bible-50 dark:hover:bg-bible-800 rounded-lg transition-all"
                            title="Edit Reflection"
                          >
                            <Edit3 size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(reflection.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete Reflection"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {editingId === reflection.id ? (
                  <div className="space-y-4 animate-fade-in">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full h-32 p-4 bg-bible-50 dark:bg-bible-950 border border-bible-200 dark:border-bible-800 rounded-2xl focus:ring-2 focus:ring-bible-500 transition-all resize-none font-medium text-gray-800 dark:text-gray-200"
                    />
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-bible-800 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSave(reflection.id)}
                        disabled={isSaving || !editText.trim()}
                        className="bg-bible-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-bible-200 dark:shadow-none hover:bg-bible-700 transition-all disabled:bg-gray-300 dark:disabled:bg-bible-800 flex items-center gap-2"
                      >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Quote size={40} className="absolute -top-4 -left-4 text-bible-50 dark:text-bible-800 opacity-50 pointer-events-none" />
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-serif text-lg relative z-10 whitespace-pre-wrap">
                      {reflection.text || <span className="italic text-gray-400 dark:text-gray-500">Acknowledged the scripture without a written reflection.</span>}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeReading && (
        <div className="mt-16 pt-16 border-t border-bible-200 dark:border-bible-800">
          <Dashboard 
            reflections={reflections} 
            verse={activeReading} 
          />
        </div>
      )}
    </div>
  );
};
