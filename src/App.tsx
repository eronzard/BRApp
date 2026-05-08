
import React, { useState, useEffect } from 'react';
import { WeeklyReading, Reflection, AppView, AppUser, Room } from './types';
import { supabase } from './services/supabaseClient';
import { TABLES } from './constants/tables';
import { VerseHero } from './components/VerseHero';
import { ReflectionInput } from './components/ReflectionInput';
import { Auth } from './components/Auth';
import { AdminPanel } from './components/AdminPanel';
import { ReflectionsList } from './components/ReflectionsList';
import { History } from './components/History';
import { Lobby } from './components/Lobby';
import { UserProfile } from './components/UserProfile';
import { UserGuide } from './components/UserGuide';
import { Logo } from './components/Logo';
import { NavButton, MobileNavButton } from './components/Navigation';
import { Layout, BookOpen, BarChart3, MessageSquare, Shield, ArrowLeft, Archive, LogOut, Loader2, Moon, Sun, User } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      // Default to light mode if no preference is set, to avoid confusion
      return false;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  // Room State
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomRole, setRoomRole] = useState<'admin' | 'member'>('member');

  // Content State
  const [activeReadings, setActiveReadings] = useState<WeeklyReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(false);
  
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [myReflections, setMyReflections] = useState<Record<string, Reflection>>({});
  
  const [view, setView] = useState<AppView>(AppView.HOME);

  // 1. Official Auth Handling
  useEffect(() => {
    // Check for recovery hash or path specifically
    // The auth provider uses type=recovery for password resets and type=signup for new users
    const isRecoveryLink = window.location.hash.includes('type=recovery') || 
                           window.location.pathname === '/reset-password';

    if (isRecoveryLink) {
      setIsRecovering(true);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setSessionLoading(false);
      }
    });

    // Listen for changes (Sign In, Sign Out, Recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovering(true);
      } else if (event === 'SIGNED_IN' && session) {
        // Only fetch profile if we aren't in the middle of a password recovery
        if (!isRecovering) {
          fetchProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentRoom(null);
        setIsRecovering(false);
        setSessionLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isRecovering]);

  const fetchProfile = async (userId: string) => {
    setSessionLoading(true);
    try {
      // 1. Check for profile in the NEW table
      const { data: existingProfile, error: profileError } = await supabase
        .from(TABLES.USER_PROFILES)
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        setSessionLoading(false);
        return;
      }

      const userEmail = session.user.email;
      const newId = session.user.id;
      let currentUserData = existingProfile;

      // 2. Ensure profile exists
      if (!existingProfile) {
        const { data: newUser, error: createError } = await supabase
          .from(TABLES.USER_PROFILES)
          .insert({
            id: newId,
            username: session.user.user_metadata?.username || userEmail?.split('@')[0] || 'User',
            email: userEmail,
            is_admin: false
          })
          .select()
          .single();
        
        if (newUser && !createError) {
          currentUserData = newUser;
        }
      }

      if (currentUserData) {
        setCurrentUser(currentUserData as AppUser);
      }
    } catch (err) {
      console.error("Error in fetchProfile:", err);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentRoom(null);
    setIsRecovering(false);
    setMyReflections({});
    setReflections([]);
    setActiveReadings([]);
    setView(AppView.HOME);
  };

  const handleAuthSuccess = (userId: string) => {
    setIsRecovering(false);
    fetchProfile(userId);
  };

  const exitRoom = () => {
    setCurrentRoom(null);
    setActiveReadings([]);
    setReflections([]);
    setMyReflections({});
    setView(AppView.HOME);
  };

  const enterRoom = (room: Room, role: 'admin' | 'member') => {
    setCurrentRoom(room);
    setRoomRole(role);
    setView(AppView.HOME);
  };

  // 2. Fetch Weekly Reading & Reflections (Scoped to Room)
  useEffect(() => {
    if (currentUser && currentRoom) {
      loadWeeklyData();
    }
  }, [currentUser, currentRoom]);

  const loadWeeklyData = async () => {
    if (!currentRoom) return;
    setLoadingReadings(true);
    
    const { data: allReadings, error } = await supabase
      .from(TABLES.WEEKLY_READINGS)
      .select('*')
      .eq('room_id', currentRoom.id)
      .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading readings:", error);
        setLoadingReadings(false);
        return;
    }

    if (!allReadings || allReadings.length === 0) {
        setActiveReadings([]);
        setLoadingReadings(false);
        return;
    }

    const isActive = (r: WeeklyReading) => {
      const val = (r as any).is_active;
      return val === true || String(val) === 'true' || val === 1 || String(val) === '1';
    };
    const currentActive = allReadings.filter(isActive);

    setActiveReadings(currentActive);
    
    const normalize = (s: string) => s.replace(/[\s\u00A0]+/g, '').toLowerCase();
    const activeReferences = new Set(currentActive.map(r => normalize(r.reference)));
    const relatedReadingIds = allReadings
        .filter((r: WeeklyReading) => activeReferences.has(normalize(r.reference)))
        .map((r: WeeklyReading) => r.id);

    fetchReflections(relatedReadingIds);
  };

  const fetchReflections = async (readingIds: string[]) => {
    if (readingIds.length === 0) {
        console.log("No reading IDs provided for reflections fetch.");
        setReflections([]);
        setLoadingReadings(false);
        return;
    }

    console.log("Fetching reflections for IDs:", readingIds);
    const { data, error } = await supabase
      .from(TABLES.REFLECTIONS)
      .select(`*, ${TABLES.USER_PROFILES} (username, email)`)
      .in('reading_id', readingIds)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching reflections:", error);
    }

    if (data && !error) {
        console.log(`Fetched ${data.length} reflections`);
        const formatted: Reflection[] = data.map((r: any) => {
            const userObj = Array.isArray(r.user_profiles) ? r.user_profiles[0] : r.user_profiles;
            return {
                id: r.id,
                user_id: r.user_id,
                reading_id: r.reading_id,
                user_profiles: {
                    username: userObj?.username || 'Unknown User',
                    email: userObj?.email || ''
                },
                timestamp: new Date(r.created_at).getTime(),
                text: r.text,
                acknowledged: r.acknowledged
            };
        });
        
        setReflections(formatted);
        
        if (currentUser) {
            const mine: Record<string, Reflection> = {};
            formatted.filter(r => r.user_id === currentUser.id).forEach(r => {
                mine[r.reading_id] = r;
            });
            setMyReflections(mine);
        }
    }
    setLoadingReadings(false);
  };

  const handleClockIn = async (readingId: string) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from(TABLES.REFLECTIONS).insert({
        user_id: currentUser.id,
        reading_id: readingId,
        acknowledged: true,
        text: ''
    }).select().single();
    if (data && !error) loadWeeklyData();
  };

  const handleReflectionSubmit = async (text: string, readingId: string) => {
    const existing = myReflections[readingId];
    if (!existing) {
      console.error("No existing reflection record found to update.");
      return;
    }
    
    setLoadingReadings(true);
    const { error } = await supabase
      .from(TABLES.REFLECTIONS)
      .update({ 
        text: text
      })
      .eq('id', existing.id);
    
    if (error) {
      console.error("Error submitting reflection:", error);
      alert("Failed to submit reflection. Please try again.");
      setLoadingReadings(false);
    } else {
      console.log("Reflection submitted successfully");
      await loadWeeklyData();
      setView(AppView.REFLECTIONS);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-bible-50 dark:bg-bible-950 flex items-center justify-center transition-colors duration-300">
        <Loader2 size={40} className="animate-spin text-bible-500" />
      </div>
    );
  }

  if (!currentUser || isRecovering) {
    return (
      <Auth 
        onLogin={handleAuthSuccess} 
        onCancelRecovery={() => setIsRecovering(false)}
        initialMode={isRecovering ? 'reset' : 'signin'} 
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (!currentRoom) {
    if (view === AppView.PROFILE) {
      return <UserProfile user={currentUser} onBack={() => setView(AppView.HOME)} onLogout={handleSignOut} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onViewGuide={() => setView(AppView.USER_GUIDE)} />;
    }
    if (view === AppView.USER_GUIDE) {
      return <UserGuide onBack={() => setView(AppView.PROFILE)} />;
    }
    return <Lobby user={currentUser} onSelectRoom={enterRoom} onLogout={handleSignOut} onViewProfile={() => setView(AppView.PROFILE)} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen bg-bible-50 dark:bg-bible-950 text-gray-800 dark:text-gray-200 font-sans pb-24 md:pb-20 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-bible-900/90 backdrop-blur-md border-b border-bible-200 dark:border-bible-800 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-6 overflow-hidden flex-1 md:flex-none">
              <button onClick={exitRoom} className="text-gray-500 dark:text-gray-400 hover:text-bible-800 dark:hover:text-bible-200 transition-colors p-2.5 rounded-full hover:bg-bible-50 dark:hover:bg-bible-800 flex-shrink-0">
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-4 cursor-pointer overflow-hidden" onClick={() => setView(AppView.HOME)}>
                <div className="min-w-0">
                  <span className="font-serif text-xl md:text-2xl font-bold text-bible-900 dark:text-white tracking-tight block leading-tight truncate">{currentRoom.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-bible-800 px-2 py-0.5 rounded mt-1 inline-block font-mono font-bold">{currentRoom.code}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-bible-50 dark:hover:bg-bible-800 transition-all mr-2"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <NavButton active={view === AppView.HOME} onClick={() => setView(AppView.HOME)} icon={<BookOpen size={18}/>} label="Read" />
              <NavButton active={view === AppView.REFLECTIONS} onClick={() => setView(AppView.REFLECTIONS)} icon={<MessageSquare size={18}/>} label="Reflect" />
              <NavButton active={view === AppView.HISTORY} onClick={() => setView(AppView.HISTORY)} icon={<Archive size={18}/>} label="Archive" />
              {roomRole === 'admin' && <NavButton active={view === AppView.ADMIN} onClick={() => setView(AppView.ADMIN)} icon={<Shield size={18}/>} label="Admin" />}
              <NavButton active={view === AppView.PROFILE} onClick={() => setView(AppView.PROFILE)} icon={<User size={18}/>} label="Profile" />
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-bible-900 border-t border-gray-200 dark:border-bible-800 p-2 flex justify-around z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-none">
        <MobileNavButton active={view === AppView.HOME} onClick={() => setView(AppView.HOME)} icon={<BookOpen size={20}/>} label="Read" />
        <MobileNavButton active={view === AppView.REFLECTIONS} onClick={() => setView(AppView.REFLECTIONS)} icon={<MessageSquare size={20}/>} label="Reflect" />
        <MobileNavButton active={view === AppView.HISTORY} onClick={() => setView(AppView.HISTORY)} icon={<Archive size={20}/>} label="Archive" />
        {roomRole === 'admin' && <MobileNavButton active={view === AppView.ADMIN} onClick={() => setView(AppView.ADMIN)} icon={<Shield size={20}/>} label="Admin" />}
        <MobileNavButton active={view === AppView.PROFILE} onClick={() => setView(AppView.PROFILE)} icon={<User size={20}/>} label="Profile" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === AppView.HOME && (
          <div className="space-y-12 animate-fade-in-up">
            {loadingReadings ? (
               <div className="w-full h-64 bg-bible-100 dark:bg-bible-900 animate-pulse rounded-xl"></div>
            ) : activeReadings.length > 0 ? (
               activeReadings.map(reading => (
                 <div key={reading.id} className="space-y-6">
                    <VerseHero verse={reading} loading={false} hasAcknowledged={!!myReflections[reading.id]} onAcknowledge={() => handleClockIn(reading.id)} />
                    {myReflections[reading.id] && (
                        <div className="max-w-3xl mx-auto">
                            <ReflectionInput 
                              onSubmit={(text) => handleReflectionSubmit(text, reading.id)} 
                              isLoading={loadingReadings}
                            />
                        </div>
                    )}
                 </div>
               ))
            ) : (
                <div className="text-center py-20 bg-white dark:bg-bible-900 rounded-2xl border border-dashed border-gray-200 dark:border-bible-800">
                    <h2 className="text-xl font-serif text-gray-500 dark:text-gray-400 mb-2">No active scriptures.</h2>
                    <p className="text-gray-400 dark:text-gray-500">Wait for the Room Admin to publish a verse.</p>
                    {roomRole === 'admin' && (
                        <button onClick={() => setView(AppView.ADMIN)} className="mt-4 text-bible-600 dark:text-bible-400 font-medium underline hover:text-bible-800 dark:hover:text-bible-200">Go to Admin Panel to set one.</button>
                    )}
                </div>
            )}
          </div>
        )}

        {view === AppView.REFLECTIONS && <ReflectionsList reflections={reflections} currentUser={currentUser} isAdmin={roomRole === 'admin'} onUpdateReflection={loadWeeklyData} readingDate={activeReadings[0]?.created_at} reference={activeReadings[0]?.reference} theme={activeReadings[0]?.theme} activeReading={activeReadings[0]} />}
        {view === AppView.HISTORY && currentRoom && <History room={currentRoom} isAdmin={roomRole === 'admin'} activeReadings={activeReadings} />}
        {view === AppView.ADMIN && roomRole === 'admin' && currentRoom && <AdminPanel room={currentRoom} currentUser={currentUser} currentReading={activeReadings[0] || null} activeReadings={activeReadings} onReadingUpdate={loadWeeklyData} onRoomUpdate={(updated) => setCurrentRoom(updated)} />}
        {view === AppView.PROFILE && <UserProfile user={currentUser} onBack={() => setView(AppView.HOME)} onLogout={handleSignOut} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onViewGuide={() => setView(AppView.USER_GUIDE)} />}
        
        {/* Bug Report Link */}
        <div className="mt-20 text-center pb-8">
          <p className="text-gray-400 dark:text-gray-600 text-xs font-medium">
            Spotted a bug? Email us at <a href="mailto:team@bibleroom.app" className="text-bible-400 hover:underline">team@bibleroom.app</a>
          </p>
        </div>
      </main>
    </div>
  );
}
