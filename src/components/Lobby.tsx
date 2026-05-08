
import React, { useState, useEffect } from 'react';
import { AppUser, Room } from '../types';
import { supabase } from '../services/supabaseClient';
import { TABLES } from '../constants/tables';
import { Logo } from './Logo';
import { 
  Plus, 
  Search, 
  LogOut, 
  Users, 
  ArrowRight, 
  Loader2, 
  Shield, 
  User, 
  Layout,
  BookOpen,
  MessageSquare,
  BarChart3,
  Archive,
  Globe,
  Hash,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

interface LobbyProps {
  user: AppUser;
  onSelectRoom: (room: Room, role: 'admin' | 'member') => void;
  onLogout: () => void;
  onViewProfile: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({ user, onSelectRoom, onLogout, onViewProfile, isDarkMode, onToggleTheme }) => {
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showCreate, setShowCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [creating, setCreating] = useState(false);
  
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  
  const [showPublicRooms, setShowPublicRooms] = useState(false);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [loadingPublic, setLoadingPublic] = useState(false);
  
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchMyRooms();
  }, [user.id]);

  const fetchMyRooms = async () => {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase
      .from(TABLES.ROOM_MEMBERS)
      .select(`*, ${TABLES.ROOMS} (*)`)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error fetching rooms:", error);
      setMessage({ text: "Error loading rooms: " + error.message, type: 'error' });
    } else if (data) {
      const rooms = data.map((m: any) => m[TABLES.ROOMS]).filter(Boolean);
      setMyRooms(rooms);
    }
    setLoading(false);
  };

  const fetchPublicRooms = async () => {
    setLoadingPublic(true);
    const { data, error } = await supabase
      .from(TABLES.ROOMS)
      .select('*')
      .eq('is_public', true)
      .limit(20);

    if (data && !error) {
      // Filter out rooms I'm already in
      const myRoomIds = new Set(myRooms.map(r => r.id));
      setPublicRooms(data.filter(r => !myRoomIds.has(r.id)));
    }
    setLoadingPublic(false);
  };

  const handleJoinPublicRoom = async (room: Room) => {
    setJoining(true);
    setMessage(null);

    const { error: memberError } = await supabase
      .from(TABLES.ROOM_MEMBERS)
      .insert({ room_id: room.id, user_id: user.id, role: 'member' });

    if (!memberError) {
      setMyRooms([...myRooms, room]);
      setShowJoin(false);
      setShowPublicRooms(false);
      onSelectRoom(room, 'member');
    } else {
      setMessage({ text: "Error joining room: " + memberError.message, type: 'error' });
    }
    setJoining(false);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setCreating(true);
    setMessage(null);

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // 1. Create Room
    const { data: room, error: roomError } = await supabase
      .from(TABLES.ROOMS)
      .insert({ 
        name: newRoomName, 
        code, 
        created_by: user.id,
        is_public: false 
      })
      .select()
      .single();

    if (room && !roomError) {
      // 2. Add Creator as Admin
      const { error: memberError } = await supabase
        .from(TABLES.ROOM_MEMBERS)
        .insert({ room_id: room.id, user_id: user.id, role: 'admin' });

      if (!memberError) {
        setMyRooms([...myRooms, room]);
        setShowCreate(false);
        setNewRoomName('');
        onSelectRoom(room, 'admin');
      } else {
        setMessage({ text: "Error adding member: " + memberError.message, type: 'error' });
      }
    } else {
      setMessage({ text: "Error creating room: " + (roomError?.message || "Unknown error"), type: 'error' });
    }
    setCreating(false);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length !== 6) return;
    setJoining(true);
    setMessage(null);

    // 1. Find Room
    const { data: room, error: roomError } = await supabase
      .from(TABLES.ROOMS)
      .select('*')
      .eq('code', joinCode.toUpperCase())
      .single();

    if (room && !roomError) {
      // 2. Check if already a member
      const { data: existing, error: existingError } = await supabase
        .from(TABLES.ROOM_MEMBERS)
        .select('*')
        .eq('room_id', room.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        onSelectRoom(room, existing.role);
      } else {
        // 3. Add as member
        const { error: memberError } = await supabase
          .from(TABLES.ROOM_MEMBERS)
          .insert({ room_id: room.id, user_id: user.id, role: 'member' });

        if (!memberError) {
          setMyRooms([...myRooms, room]);
          setShowJoin(false);
          setJoinCode('');
          onSelectRoom(room, 'member');
        } else {
          setMessage({ text: "Error joining room: " + memberError.message, type: 'error' });
        }
      }
    } else {
      console.error("Join room error:", roomError);
      setMessage({ text: roomError ? "Error finding room: " + roomError.message : "Room not found. Please check the code.", type: 'error' });
    }
    setJoining(false);
  };

  const filteredRooms = myRooms.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <div className="min-h-screen bg-bible-50 dark:bg-bible-950 text-gray-800 dark:text-gray-200 font-sans p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="bg-white dark:bg-bible-900 p-6 md:p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-bible-100 dark:bg-bible-800 rounded-full blur-3xl opacity-50"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <Logo size={32} iconOnly />
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-bible-900 dark:text-white tracking-tight">Bible Room</h1>
                  <p className="text-xs md:text-sm text-bible-500 dark:text-bible-400 font-medium mt-0.5">
                    {getGreeting()}, {user.username}
                  </p>
                </div>
              </div>
            </div>

              <div className="flex items-center gap-3 md:gap-4">
                <button 
                  onClick={onToggleTheme}
                  className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-bible-50 dark:hover:bg-bible-800 transition-all border border-transparent hover:border-bible-100 dark:hover:border-bible-700"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button 
                  onClick={onViewProfile}
                  className="flex-1 md:flex-none bg-bible-50 dark:bg-bible-800 text-bible-700 dark:text-bible-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-bible-100 dark:hover:bg-bible-700 transition-all flex items-center justify-center gap-2 border border-bible-100 dark:border-bible-700"
                >
                  <User size={18} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 md:flex-none text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center gap-2 font-bold text-sm"
                >
                  <LogOut size={20} />
                  <span className="md:hidden">Sign Out</span>
                </button>
              </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Room List Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-serif font-bold text-bible-900 dark:text-white flex items-center gap-3">
                <Users size={24} className="text-bible-600 dark:text-bible-400" />
                <span>Your Rooms</span>
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-bible-900 border border-bible-200 dark:border-bible-800 rounded-xl focus:ring-2 focus:ring-bible-500 transition-all text-sm font-medium shadow-sm text-bible-900 dark:text-white"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-bible-500 animate-spin" />
                <p className="text-bible-400 font-medium animate-pulse">Loading your rooms...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-bible-900 rounded-3xl border border-dashed border-bible-200 dark:border-bible-800">
                <div className="bg-bible-50 dark:bg-bible-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-bible-400">
                  <Users size={40} />
                </div>
                <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white mb-2">No Rooms Found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                  {searchQuery ? `No rooms matching "${searchQuery}"` : "You haven't joined any rooms yet. Create one or join with a code!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room, room.created_by === user.id ? 'admin' : 'member')}
                    className="group bg-white dark:bg-bible-900 p-6 rounded-3xl border border-bible-100 dark:border-bible-800 shadow-sm hover:shadow-xl hover:border-bible-300 dark:hover:border-bible-600 transition-all text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 text-bible-100 dark:text-bible-800 group-hover:text-bible-200 dark:group-hover:text-bible-700 transition-colors">
                      <ArrowRight size={40} />
                    </div>
                    <div className="relative z-10">
                      <div className="bg-bible-50 dark:bg-bible-800 text-bible-800 dark:text-bible-200 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-inner group-hover:bg-bible-600 group-hover:text-white transition-all border border-bible-100 dark:border-bible-700">
                        {room.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white mb-1 group-hover:text-bible-600 dark:group-hover:text-bible-400 transition-colors">{room.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-bible-800/50 px-2 py-1 rounded-lg w-fit group-hover:bg-bible-50 dark:group-hover:bg-bible-800 group-hover:text-bible-600 dark:group-hover:text-bible-400 transition-all border border-bible-50 dark:border-bible-700">
                        <Hash size={12} />
                        <span>{room.code}</span>
                      </div>
                      
                      <div className="mt-6 flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-bible-100 dark:bg-bible-800 border-2 border-white dark:border-bible-900 flex items-center justify-center text-[8px] font-bold text-bible-600 dark:text-bible-400">
                              <User size={10} />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Team Active</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="space-y-8">
            <div className="bg-bible-900 dark:bg-bible-950 p-8 rounded-3xl text-white shadow-2xl shadow-bible-200 dark:shadow-none relative overflow-hidden border border-white/5 dark:border-bible-800">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 dark:bg-bible-800/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-2xl font-serif font-bold tracking-tight">Get Started</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={() => { setShowJoin(true); setShowCreate(false); }}
                    className="w-full bg-white/10 dark:bg-bible-900/40 hover:bg-white/20 dark:hover:bg-bible-900/60 backdrop-blur-md border border-white/10 dark:border-bible-800 p-5 rounded-2xl flex items-center gap-4 transition-all group"
                  >
                    <div className="bg-bible-400 dark:bg-bible-600 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
                      <Hash size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Join Room</div>
                      <div className="text-xs text-bible-300 dark:text-bible-400 font-medium">Enter a 6-character code</div>
                    </div>
                    <ChevronRight size={20} className="ml-auto text-bible-400 dark:text-bible-500" />
                  </button>

                  <button
                    onClick={() => { setShowCreate(true); setShowJoin(false); }}
                    className="w-full bg-bible-600 dark:bg-bible-800 hover:bg-bible-500 dark:hover:bg-bible-700 p-5 rounded-2xl flex items-center gap-4 transition-all group shadow-lg shadow-black/20 border border-white/10 dark:border-bible-700"
                  >
                    <div className="bg-white dark:bg-bible-900 p-2.5 rounded-xl text-bible-600 dark:text-bible-400 group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Create Room</div>
                      <div className="text-xs text-bible-300 dark:text-bible-400 font-medium">Start a new team reflection</div>
                    </div>
                    <ChevronRight size={20} className="ml-auto text-bible-300 dark:text-bible-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modals / Forms */}
            {(showCreate || showJoin) && (
              <div className="bg-white dark:bg-bible-900 p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-xl animate-fade-in-up">
                {message && (
                  <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border text-sm font-medium ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
                    <AlertCircle size={18} />
                    <p>{message.text}</p>
                  </div>
                )}

                {showCreate ? (
                  <form onSubmit={handleCreateRoom} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white">New Room</h3>
                      <button type="button" onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-bible-800 dark:text-bible-400 uppercase tracking-widest">Room Name</label>
                      <input
                        type="text"
                        autoFocus
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="e.g. Sunday Morning Group"
                        className="w-full px-4 py-3 rounded-xl border border-bible-200 dark:border-bible-800 bg-white dark:bg-bible-950 focus:ring-2 focus:ring-bible-500 transition-all font-sans text-base text-bible-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={creating || !newRoomName.trim()}
                      className="w-full bg-bible-600 hover:bg-bible-700 disabled:bg-gray-300 dark:disabled:bg-bible-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-bible-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {creating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                      <span>Create Room</span>
                    </button>
                  </form>
                ) : showPublicRooms ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => setShowPublicRooms(false)}
                        className="flex items-center gap-1 text-bible-600 dark:text-bible-400 font-bold text-sm hover:underline"
                      >
                        <ChevronLeft size={16} />
                        <span>Back to Code</span>
                      </button>
                      <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white">Public Rooms</h3>
                      <button type="button" onClick={() => { setShowJoin(false); setShowPublicRooms(false); }} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {loadingPublic ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-bible-400" /></div>
                      ) : publicRooms.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm italic">No public rooms found.</div>
                      ) : (
                        publicRooms.map(room => (
                          <div key={room.id} className="flex items-center justify-between p-4 bg-bible-50 dark:bg-bible-800/50 rounded-2xl border border-bible-100 dark:border-bible-800">
                            <div className="min-w-0">
                              <div className="font-bold text-bible-900 dark:text-white truncate">{room.name}</div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{room.code}</div>
                            </div>
                            <button 
                              onClick={() => handleJoinPublicRoom(room)}
                              disabled={joining}
                              className="bg-bible-600 hover:bg-bible-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                            >
                              Join
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleJoinRoom} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white">Join Room</h3>
                      <button type="button" onClick={() => setShowJoin(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-bible-800 dark:text-bible-400 uppercase tracking-widest">Room Code</label>
                      <input
                        type="text"
                        autoFocus
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        placeholder="ENTER CODE"
                        className="w-full px-4 py-4 rounded-xl border border-bible-200 dark:border-bible-800 bg-white dark:bg-bible-950 focus:ring-2 focus:ring-bible-500 transition-all font-sans text-xl font-bold text-center tracking-[0.2em] uppercase text-bible-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={joining || joinCode.length !== 6}
                      className="w-full bg-bible-900 dark:bg-bible-700 hover:bg-black dark:hover:bg-bible-600 disabled:bg-gray-300 dark:disabled:bg-bible-800 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {joining ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                      <span>Join Room</span>
                    </button>

                    <div className="pt-4 border-t border-bible-100 dark:border-bible-800">
                      <button 
                        type="button"
                        onClick={() => { setShowPublicRooms(true); fetchPublicRooms(); }}
                        className="w-full flex items-center justify-center gap-2 text-bible-600 dark:text-bible-400 font-bold text-sm hover:underline"
                      >
                        <Globe size={16} />
                        <span>Browse Public Rooms</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bug Report Link */}
        <div className="text-center pb-12">
          <p className="text-gray-400 dark:text-gray-600 text-xs font-medium">
            Spotted a bug? Email us at <a href="mailto:team@bibleroom.app" className="text-bible-400 hover:underline">team@bibleroom.app</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const AlertCircle = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
