
import React, { useState, useEffect } from 'react';
import { AppUser, Room } from '../types';
import { supabase } from '../services/supabaseClient';
import { TABLES } from '../constants/tables';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  User, 
  Mail, 
  Key, 
  LogOut, 
  ChevronLeft, 
  Shield, 
  Hash, 
  Trash2, 
  AlertTriangle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Download,
  Moon,
  Sun,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface UserProfileProps {
  user: AppUser;
  onBack: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onViewGuide: () => void;
}

interface ReflectionOverview {
  roomName: string;
  roomCode: string;
  reflections: {
    reference: string;
    text: string;
    date: string;
  }[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onBack, 
  onLogout, 
  isDarkMode, 
  onToggleTheme,
  onViewGuide
}) => {
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [reflectionsOverview, setReflectionsOverview] = useState<ReflectionOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReflections, setLoadingReflections] = useState(true);
  const [leavingRoomId, setLeavingRoomId] = useState<string | null>(null);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [sendingReset, setSendingReset] = useState(false);

  useEffect(() => {
    fetchMyRooms();
    fetchReflectionsOverview();
  }, [user.id]);

  const fetchMyRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLES.ROOM_MEMBERS)
      .select(`*, ${TABLES.ROOMS} (*)`)
      .eq('user_id', user.id);

    if (data && !error) {
      const rooms = data.map((m: any) => m[TABLES.ROOMS]).filter(Boolean);
      setMyRooms(rooms);
    }
    setLoading(false);
  };

  const fetchReflectionsOverview = async () => {
    setLoadingReflections(true);
    try {
      const { data, error } = await supabase
        .from(TABLES.REFLECTIONS)
        .select(`
          text,
          created_at,
          ${TABLES.WEEKLY_READINGS} (
            reference,
            ${TABLES.ROOMS} (
              name,
              code
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        const grouped: Record<string, ReflectionOverview> = {};
        
        data.forEach((r: any) => {
          const reflectionText = r.text?.trim();
          // Only include reflections that have actual text content
          if (!reflectionText) return;

          const reading = Array.isArray(r[TABLES.WEEKLY_READINGS]) ? r[TABLES.WEEKLY_READINGS][0] : r[TABLES.WEEKLY_READINGS];
          if (!reading) return;

          const room = Array.isArray(reading[TABLES.ROOMS]) ? reading[TABLES.ROOMS][0] : reading[TABLES.ROOMS];
          if (!room) return;
          
          if (!grouped[room.code]) {
            grouped[room.code] = {
              roomName: room.name,
              roomCode: room.code,
              reflections: []
            };
          }
          
          grouped[room.code].reflections.push({
            reference: reading.reference,
            text: reflectionText,
            date: new Date(r.created_at).toLocaleDateString()
          });
        });
        
        setReflectionsOverview(Object.values(grouped));
      }
    } catch (err) {
      console.error("Error fetching reflections overview:", err);
    } finally {
      setLoadingReflections(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('My Bible Room Reflections', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`User: ${user.username} (${user.email})`, 14, 30);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 36);
    
    let currentY = 45;

    reflectionsOverview.forEach((room) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text(`Room: ${room.roomName} (${room.roomCode})`, 14, currentY);
      currentY += 10;

      autoTable(doc, {
        startY: currentY,
        head: [['Date', 'Scripture', 'Reflection']],
        body: room.reflections.map(r => [r.date, r.reference, r.text]),
        theme: 'striped',
        headStyles: { fillColor: [139, 69, 19] }, // Bible brown
        margin: { left: 14, right: 14 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;
    });

    doc.save(`BibleRoom_Reflections_${user.username}.pdf`);
  };

  const handlePasswordReset = async () => {
    setSendingReset(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage({ text: "Error: " + error.message, type: 'error' });
    } else {
      setMessage({ text: "Password reset email sent! Please check your inbox.", type: 'success' });
    }
    setSendingReset(false);
  };

  const handleLeaveRoom = async (room: Room) => {
    if (verificationCode !== room.code) {
      setMessage({ text: "Verification code does not match.", type: 'error' });
      return;
    }

    setIsLeaving(true);
    setMessage(null);

    try {
      // 1. Find all readings for this room
      const { data: readings } = await supabase
        .from(TABLES.WEEKLY_READINGS)
        .select('id')
        .eq('room_id', room.id);

      const readingIds = readings?.map(r => r.id) || [];

      // 2. Delete user's reflections for these readings
      if (readingIds.length > 0) {
        await supabase
          .from(TABLES.REFLECTIONS)
          .delete()
          .eq('user_id', user.id)
          .in('reading_id', readingIds);
      }

      // 3. Delete membership
      const { error: memberError } = await supabase
        .from(TABLES.ROOM_MEMBERS)
        .delete()
        .eq('room_id', room.id)
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      setMessage({ text: `Successfully left ${room.name}. All your data for this room has been removed.`, type: 'success' });
      setMyRooms(myRooms.filter(r => r.id !== room.id));
      setLeavingRoomId(null);
      setVerificationCode('');
    } catch (err: any) {
      setMessage({ text: "Error leaving room: " + err.message, type: 'error' });
    } finally {
      setIsLeaving(false);
    }
  };

  const preventPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setMessage({ text: "Pasting is disabled for verification. Please type the code manually.", type: 'error' });
  };

  return (
    <div className="min-h-screen bg-bible-50 dark:bg-bible-950 p-4 md:p-8 animate-fade-in transition-colors duration-300 pb-24">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
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
              <User size={20} className="md:w-6 md:h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-bible-900 dark:text-white truncate">User Profile</h1>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-shake ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800'}`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <section className="bg-white dark:bg-bible-900 p-6 md:p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-lg text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-bible-100 dark:bg-bible-800 text-bible-600 dark:text-bible-400 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-3xl md:text-4xl font-bold shadow-inner">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-bible-900 dark:text-white truncate">{user.username}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm truncate mb-6 md:mb-8">{user.email}</p>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4 pt-6 md:pt-8 border-t border-bible-50 dark:border-bible-800">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-bible-900 dark:text-white">{myRooms.length}</div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Rooms</div>
                </div>
                <div className="text-center border-l border-bible-50 dark:border-bible-800">
                  <div className="text-xl md:text-2xl font-bold text-bible-900 dark:text-white">{reflectionsOverview.reduce((acc, r) => acc + r.reflections.length, 0)}</div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Reflections</div>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-bible-900 p-6 md:p-8 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-lg space-y-4 md:space-y-6">
              <h3 className="text-sm font-bold text-bible-800 dark:text-bible-400 uppercase tracking-widest">Preferences</h3>
              
              <div className="flex items-center justify-between p-3 md:p-4 bg-bible-50 dark:bg-bible-800/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon size={18} className="text-bible-400" /> : <Sun size={18} className="text-bible-600" />}
                  <span className="text-sm font-bold text-bible-900 dark:text-white">Dark Mode</span>
                </div>
                <button 
                  onClick={onToggleTheme}
                  className={`w-12 h-6 rounded-full transition-all relative ${isDarkMode ? 'bg-bible-600' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <button 
                onClick={onViewGuide}
                className="w-full flex items-center justify-between p-3 md:p-4 bg-bible-50 dark:bg-bible-800/50 rounded-2xl hover:bg-bible-100 dark:hover:bg-bible-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-bible-600 dark:text-bible-400" />
                  <span className="text-sm font-bold text-bible-900 dark:text-white">User Guide</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={handlePasswordReset}
                className="w-full flex items-center gap-3 p-3 md:p-4 text-bible-600 dark:text-bible-400 hover:bg-bible-50 dark:hover:bg-bible-800 rounded-2xl transition-all font-bold text-sm"
              >
                <Key size={18} />
                <span>Change Password</span>
              </button>

              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 p-3 md:p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all font-bold text-sm"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {/* Reflections Overview Section */}
            <div className="bg-white dark:bg-bible-900 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-lg p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-bible-100 dark:bg-bible-800 p-2 rounded-xl text-bible-600 dark:text-bible-400">
                    <MessageSquare size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-bible-900 dark:text-white">My Reflections</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-medium">Your spiritual journey</p>
                  </div>
                </div>
                <button 
                  onClick={exportToPDF}
                  disabled={reflectionsOverview.length === 0}
                  className="flex items-center justify-center gap-2 bg-bible-50 dark:bg-bible-800 text-bible-700 dark:text-bible-300 px-4 py-2 rounded-xl font-bold border border-bible-200 dark:border-bible-700 hover:bg-bible-600 dark:hover:bg-bible-700 hover:text-white transition-all disabled:opacity-50 text-xs"
                >
                  <Download size={16} />
                  <span>Export PDF</span>
                </button>
              </div>

              {loadingReflections ? (
                <div className="flex flex-col items-center justify-center py-10 md:py-20">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-bible-500 animate-spin mb-4" />
                  <p className="text-gray-400 font-medium text-xs md:text-sm">Fetching reflections...</p>
                </div>
              ) : reflectionsOverview.length === 0 ? (
                <div className="text-center py-10 md:py-20 bg-bible-50 dark:bg-bible-800/30 rounded-3xl border border-dashed border-bible-200 dark:border-bible-800">
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm">No reflections submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {reflectionsOverview.map((room) => (
                    <div key={room.roomCode} className="border border-bible-100 dark:border-bible-800 rounded-2xl overflow-hidden">
                      <button 
                        onClick={() => setExpandedRoom(expandedRoom === room.roomCode ? null : room.roomCode)}
                        className="w-full flex items-center justify-between p-4 bg-bible-50/50 dark:bg-bible-800/20 hover:bg-bible-50 dark:hover:bg-bible-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white dark:bg-bible-900 rounded-lg flex items-center justify-center font-bold text-bible-600 dark:text-bible-400 border border-bible-100 dark:border-bible-800 shadow-sm text-sm">
                            {room.roomName.charAt(0)}
                          </div>
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-bible-900 dark:text-white text-sm truncate">{room.roomName}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">{room.reflections.length} Reflections</p>
                          </div>
                        </div>
                        {expandedRoom === room.roomCode ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                      </button>
                      
                      {expandedRoom === room.roomCode && (
                        <div className="p-4 space-y-4 bg-white dark:bg-bible-900 animate-fade-in">
                          {room.reflections.map((ref, idx) => (
                            <div key={idx} className="space-y-1.5 pb-4 border-b border-bible-50 dark:border-bible-800 last:border-0 last:pb-0">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-bible-600 dark:text-bible-400 uppercase tracking-widest">{ref.reference}</span>
                                <span className="text-[9px] text-gray-400 font-medium">{ref.date}</span>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">"{ref.text}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rooms Management */}
            <div className="bg-white dark:bg-bible-900 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-bible-100 dark:bg-bible-800 p-2 rounded-xl text-bible-600 dark:text-bible-400">
                    <Hash size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-bible-900 dark:text-white">Room Memberships</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-medium">Manage your active study spaces</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 md:py-20">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-bible-500 animate-spin mb-4" />
                  <p className="text-gray-400 font-medium text-xs md:text-sm">Loading rooms...</p>
                </div>
              ) : myRooms.length === 0 ? (
                <div className="text-center py-10 md:py-20 bg-bible-50 dark:bg-bible-800/30 rounded-3xl border border-dashed border-bible-200 dark:border-bible-800">
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm">You are not a member of any rooms yet.</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {myRooms.map((room) => (
                    <div key={room.id} className="bg-white dark:bg-bible-900 p-4 md:p-6 rounded-2xl border border-bible-100 dark:border-bible-800 hover:border-bible-300 transition-all shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-bible-50 dark:bg-bible-800 text-bible-600 dark:text-bible-400 rounded-xl flex items-center justify-center font-bold text-lg border border-bible-100 dark:border-bible-800">
                            {room.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm md:text-base font-bold text-bible-900 dark:text-white truncate">{room.name}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-0.5">
                              <Hash size={10} />
                              <span>{room.code}</span>
                            </div>
                          </div>
                        </div>

                        {leavingRoomId === room.id ? (
                          <div className="w-full sm:max-w-[240px] animate-fade-in">
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">Type {room.code}</p>
                                <button onClick={() => { setLeavingRoomId(null); setVerificationCode(''); }} className="text-red-400 hover:text-red-600">
                                  <X size={14} />
                                </button>
                              </div>
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  value={verificationCode}
                                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                                  onPaste={preventPaste}
                                  placeholder="Code..."
                                  className="w-full px-2 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-black font-mono text-[10px] uppercase text-center tracking-widest"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleLeaveRoom(room)}
                                  disabled={isLeaving || verificationCode !== room.code}
                                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-2 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1"
                                >
                                  {isLeaving ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                  <span>Leave Room</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setLeavingRoomId(room.id)}
                            className="flex items-center justify-center gap-2 text-gray-400 hover:text-red-600 font-bold text-[10px] md:text-xs transition-all p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                          >
                            <Trash2 size={14} />
                            <span>Leave Room</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Support Section */}
            <div className="bg-bible-900 dark:bg-black p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-lg md:text-xl font-serif font-bold">Support & Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={onViewGuide}
                    className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-bible-600 p-2 rounded-xl text-white">
                        <FileText size={18} />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-bold block">User Guide</span>
                        <span className="text-[10px] text-bible-300">Learn the basics</span>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-bible-400" />
                  </button>
                  
                  <a 
                    href="mailto:team@bibleroom.app"
                    className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-bible-600 p-2 rounded-xl text-white">
                        <Mail size={18} />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-bold block">Contact Support</span>
                        <span className="text-[10px] text-bible-300">team@bibleroom.app</span>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-bible-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
