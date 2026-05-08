
import React, { useState, useEffect } from 'react';
import { Room, WeeklyReading, Reflection } from '../types';
import { supabase } from '../services/supabaseClient';
import { TABLES } from '../constants/tables';
import { 
  Archive, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Loader2, 
  Search,
  Quote,
  Clock
} from 'lucide-react';

interface HistoryProps {
  room: Room;
  isAdmin: boolean;
  activeReadings: WeeklyReading[];
}

interface GroupedReading {
  reference: string;
  latestReading: WeeklyReading;
  allReadings: WeeklyReading[];
  reflections: Reflection[];
}

export const History: React.FC<HistoryProps> = ({ room, isAdmin, activeReadings }) => {
  const [historyData, setHistoryData] = useState<GroupedReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [room.id]);

  const fetchHistory = async () => {
    setLoading(true);
    
    // 1. Fetch all readings for this room
    const { data: readings, error: readingsError } = await supabase
      .from(TABLES.WEEKLY_READINGS)
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: false });

    if (readingsError || !readings) {
      console.error(readingsError);
      setLoading(false);
      return;
    }

    // 2. Fetch all reflections for these readings
    const readingIds = readings.map(r => r.id);
    const { data: reflectionsData, error: reflectionsError } = await supabase
      .from(TABLES.REFLECTIONS)
      .select(`*, ${TABLES.USER_PROFILES} (username)`)
      .in('reading_id', readingIds)
      .order('created_at', { ascending: true });

    if (reflectionsError) {
      console.error(reflectionsError);
      setLoading(false);
      return;
    }

    // 3. Group by normalized reference
    const normalize = (s: string) => s.replace(/[\s\u00A0]+/g, '').toLowerCase().trim();
    const activeRefs = new Set(activeReadings.map(r => normalize(r.reference)));
    
    const groups = new Map<string, GroupedReading>();

    readings.forEach(reading => {
      const normRef = normalize(reading.reference);
      
      // EXCLUDE active scriptures from history/archive
      if (activeRefs.has(normRef)) return;

      if (!groups.has(normRef)) {
        groups.set(normRef, {
          reference: reading.reference,
          latestReading: reading,
          allReadings: [reading],
          reflections: []
        });
      } else {
        groups.get(normRef)!.allReadings.push(reading);
      }
    });

    // 4. Merge reflections into groups
    reflectionsData?.forEach((r: any) => {
      const reading = readings.find(rd => rd.id === r.reading_id);
      if (!reading) return;
      
      const normRef = normalize(reading.reference);
      const group = groups.get(normRef);
      
      if (group) {
        const userObj = Array.isArray(r.user_profiles) ? r.user_profiles[0] : r.user_profiles;
        group.reflections.push({
          id: r.id,
          user_id: r.user_id,
          reading_id: r.reading_id,
          user_profiles: {
            username: userObj?.username || 'Unknown',
            email: userObj?.email || ''
          },
          timestamp: new Date(r.created_at).getTime(),
          text: r.text,
          acknowledged: r.acknowledged
        });
      }
    });

    setHistoryData(Array.from(groups.values()));
    setLoading(false);
  };

  const filteredHistory = historyData.filter(group => 
    group.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.latestReading.theme?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-white dark:bg-bible-900 p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-bible-50 dark:bg-bible-800/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-bible-600 dark:bg-bible-700 p-3 rounded-2xl text-white shadow-lg shadow-bible-200 dark:shadow-none">
              <Archive size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-bible-900 dark:text-white tracking-tight">Scripture Archive</h2>
              <p className="text-gray-500 dark:text-bible-400 font-medium mt-1">Review past readings and team reflections</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2.5 bg-bible-50 dark:bg-bible-950 border border-bible-100 dark:border-bible-800 rounded-xl focus:ring-2 focus:ring-bible-500 transition-all text-sm font-medium text-bible-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-bible-500 animate-spin" />
          <p className="text-bible-400 font-medium animate-pulse">Loading archive history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-bible-900 rounded-3xl border border-dashed border-gray-200 dark:border-bible-800">
          <div className="bg-gray-50 dark:bg-bible-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-bible-700">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-serif font-bold text-gray-500 dark:text-bible-400 mb-2">No history found.</h3>
          <p className="text-gray-400 dark:text-gray-500">Past scriptures will appear here once they are archived.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((group) => (
            <div 
              key={group.latestReading.id} 
              className="bg-white dark:bg-bible-900 rounded-3xl border border-bible-100 dark:border-bible-800 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => setExpandedId(expandedId === group.latestReading.id ? null : group.latestReading.id)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left transition-colors hover:bg-bible-50/30 dark:hover:bg-bible-800/30"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-bible-100 dark:bg-bible-800 text-bible-800 dark:text-bible-200 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                    {group.reference.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white">{group.reference}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-bible-500 dark:text-bible-400 uppercase tracking-widest">{group.latestReading.version}</span>
                      <span className="text-gray-300 dark:text-bible-800">•</span>
                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(group.latestReading.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-gray-300 dark:text-bible-800">•</span>
                      <span className="text-xs font-bold text-bible-600 dark:text-bible-400 flex items-center gap-1">
                        <MessageSquare size={12} />
                        {group.reflections.length} Reflections
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-bible-800 p-2 rounded-xl">
                  {expandedId === group.latestReading.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </button>

              {expandedId === group.latestReading.id && (
                <div className="border-t border-bible-50 dark:border-bible-800 bg-bible-50/20 dark:bg-bible-950/20 p-6 md:p-8 space-y-8 animate-fade-in">
                  <div className="bg-white dark:bg-bible-900 p-6 rounded-2xl border border-bible-100 dark:border-bible-800 shadow-sm">
                    <h4 className="text-xs font-bold text-bible-500 dark:text-bible-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <BookOpen size={14} />
                      <span>Scripture Text</span>
                    </h4>
                    <div 
                      className="text-lg font-serif text-gray-700 dark:text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: group.latestReading.text }}
                    />
                    {group.latestReading.theme && (
                      <div className="mt-4 pt-4 border-t border-bible-50 dark:border-bible-800">
                        <span className="text-xs font-bold text-bible-400 uppercase tracking-widest">Theme: </span>
                        <span className="text-sm font-medium text-bible-800 dark:text-bible-200">{group.latestReading.theme}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-bible-500 dark:text-bible-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={14} />
                      <span>Team Reflections</span>
                    </h4>
                    
                    {group.reflections.length === 0 ? (
                      <div className="text-center py-8 bg-white/50 dark:bg-bible-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-bible-800">
                        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">No reflections shared for this scripture.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {group.reflections.map((ref) => (
                          <div key={ref.id} className="bg-white dark:bg-bible-900 p-6 rounded-2xl border border-bible-50 dark:border-bible-800 shadow-sm relative group transition-all hover:border-bible-200 dark:hover:border-bible-700">
                            <Quote size={24} className="absolute top-4 right-4 text-bible-50 dark:text-bible-800 group-hover:text-bible-100 dark:group-hover:text-bible-700 transition-colors" />
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-bible-100 dark:bg-bible-800 text-bible-800 dark:text-bible-200 flex items-center justify-center font-bold text-xs">
                                {ref.user_profiles?.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-bible-900 dark:text-white">{ref.user_profiles?.username}</div>
                                <div className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 font-medium">
                                  <Clock size={10} />
                                  {new Date(ref.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-serif text-base whitespace-pre-wrap">
                              {ref.text || <span className="italic text-gray-400 dark:text-gray-500">Acknowledged the scripture.</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
