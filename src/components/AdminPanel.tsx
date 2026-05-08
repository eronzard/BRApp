
import React, { useState, useEffect } from 'react';
import { Room, AppUser, WeeklyReading, RoomMember, SUPPORTED_VERSIONS } from '../types';
import { supabase } from '../services/supabaseClient';
import { TABLES } from '../constants/tables';
import { getScriptureDetails } from '../services/bibleService';
import { 
  Shield, 
  Users, 
  Settings, 
  Plus, 
  Archive, 
  Trash2, 
  UserMinus, 
  UserPlus, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  RefreshCw,
  Search,
  Copy,
  Edit2,
  Globe,
  Lock as LockIcon,
  Check,
  X,
  ChevronRight,
  Calendar,
  History,
  Info,
  ExternalLink,
} from 'lucide-react';

interface AdminPanelProps {
  room: Room;
  currentUser: AppUser;
  currentReading: WeeklyReading | null;
  activeReadings: WeeklyReading[];
  onReadingUpdate: () => void;
  onRoomUpdate: (updated: Room) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  room, 
  currentUser, 
  currentReading, 
  activeReadings,
  onReadingUpdate, 
  onRoomUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'scripture' | 'members' | 'settings'>('scripture');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Room Name Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempRoomName, setTempRoomName] = useState(room.name);

  // Scripture Form State
  const [reference, setReference] = useState('');
  const [version, setVersion] = useState('NKJV');
  const [theme, setTheme] = useState('');
  const [fetchedText, setFetchedText] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  // Members State
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');

  // Privacy State
  const [isChangingPrivacy, setIsChangingPrivacy] = useState(false);
  const [privacyCode, setPrivacyCode] = useState('');
  const [privacyLoading, setPrivacyLoading] = useState(false);

  // Delete Room State
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Archive State
  const [archivedReadings, setArchivedReadings] = useState<WeeklyReading[]>([]);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [reactivatingId, setReactivatingId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'members') fetchMembers();
    if (activeTab === 'scripture') fetchArchivedReadings();
  }, [activeTab, room.id]);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    const { data, error } = await supabase
      .from(TABLES.ROOM_MEMBERS)
      .select(`*, ${TABLES.USER_PROFILES} (username, email)`)
      .eq('room_id', room.id);

    if (data && !error) setMembers(data as any);
    setLoadingMembers(false);
  };

  const fetchArchivedReadings = async () => {
    setLoadingArchive(true);
    const { data, error } = await supabase
      .from(TABLES.WEEKLY_READINGS)
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: false });

    const isActive = (r: any) => {
      const val = r.is_active;
      return val === true || String(val) === 'true' || val === 1 || String(val) === '1';
    };

    if (data && !error) {
      // Deduplicate by reference and exclude currently active ones
      const activeRefs = new Set(
        data.filter(isActive).map(r => r.reference.toLowerCase().trim())
      );
      const unique: WeeklyReading[] = [];
      const seen = new Set();
      
      data.forEach((r: WeeklyReading) => {
        const ref = r.reference.toLowerCase().trim();
        if (!isActive(r) && !activeRefs.has(ref) && !seen.has(ref)) {
          unique.push(r);
          seen.add(ref);
        }
      });
      setArchivedReadings(unique);
    }
    setLoadingArchive(false);
  };

  const handleFetchText = async () => {
    if (!reference.trim()) return;
    setIsFetching(true);
    setMessage(null);
    try {
      const details = await getScriptureDetails(reference, version);
      setFetchedText(details.text);
      setReference(details.fullReference);
    } catch (err) {
      setMessage({ text: "Failed to fetch scripture text. Please try again.", type: 'error' });
    } finally {
      setIsFetching(false);
    }
  };

  const handlePublish = async () => {
    if (!reference.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      // 1. Fetch the text first (direct fetch and publish)
      const details = await getScriptureDetails(reference, version);
      const textToPublish = details.text;
      const normalizedReference = details.fullReference;

      if (!textToPublish || textToPublish.includes("Error retrieving")) {
        throw new Error("Could not retrieve scripture text. Please check the reference and try again.");
      }

      // 2. Check if this scripture already exists in this room
      const { data: existing } = await supabase
        .from(TABLES.WEEKLY_READINGS)
        .select('id')
        .eq('room_id', room.id)
        .eq('reference', normalizedReference)
        .eq('version', version)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from(TABLES.WEEKLY_READINGS)
          .update({
            text: textToPublish,
            theme,
            week_start_date: new Date().toISOString(),
            is_active: true
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase.from(TABLES.WEEKLY_READINGS).insert({
          room_id: room.id,
          reference: normalizedReference,
          version,
          text: textToPublish,
          theme,
          week_start_date: new Date().toISOString(),
          is_active: true
        });
        
        if (error) throw error;
      }

      setMessage({ text: `"${normalizedReference}" published successfully!`, type: 'success' });
      setReference('');
      setTheme('');
      setFetchedText('');
      onReadingUpdate();
      fetchArchivedReadings();
    } catch (error: any) {
      setMessage({ text: error.message || "Error publishing scripture", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deactivateReading = async (reading: WeeklyReading) => {
    setDeactivatingId(reading.id);
    setMessage(null);
    console.log("Archiving scripture:", reading.reference, "ID:", reading.id);
    try {
      // Use ID for the update as it's the primary key and most reliable for RLS
      const { error } = await supabase
        .from(TABLES.WEEKLY_READINGS)
        .update({ is_active: false })
        .eq('id', reading.id);

      if (error) throw error;

      await onReadingUpdate();
      await fetchArchivedReadings();
      setMessage({ text: "Scripture archived successfully!", type: 'success' });
    } catch (error: any) {
      console.error("Archive error:", error);
      const errorMsg = error.message || JSON.stringify(error);
      setMessage({ text: `Archiving error: ${errorMsg}`, type: 'error' });
    } finally {
      setDeactivatingId(null);
    }
  };

  const reactivateReading = async (reading: WeeklyReading) => {
    setReactivatingId(reading.id);
    setMessage(null);
    try {
      // Update the existing record instead of inserting a new one
      const { error } = await supabase
        .from(TABLES.WEEKLY_READINGS)
        .update({
          is_active: true,
          week_start_date: new Date().toISOString() // Update date to bring it to top
        })
        .eq('id', reading.id);

      if (error) throw error;

      await onReadingUpdate();
      await fetchArchivedReadings();
      setMessage({ text: "Scripture reactivated successfully!", type: 'success' });
    } catch (error: any) {
      const errorMsg = error.message || JSON.stringify(error);
      setMessage({ text: `Reactivation error: ${errorMsg}`, type: 'error' });
    } finally {
      setReactivatingId(null);
    }
  };

  const toggleAdmin = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    const { error } = await supabase
      .from(TABLES.ROOM_MEMBERS)
      .update({ role: newRole })
      .eq('id', memberId);

    if (!error) fetchMembers();
  };

  const removeMember = async (memberId: string) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    const { error } = await supabase
      .from(TABLES.ROOM_MEMBERS)
      .delete()
      .eq('id', memberId);

    if (!error) fetchMembers();
  };

  const updateRoomName = async (newName: string) => {
    if (!newName.trim()) return;
    const { data, error } = await supabase
      .from(TABLES.ROOMS)
      .update({ name: newName })
      .eq('id', room.id)
      .select()
      .single();

    if (data && !error) onRoomUpdate(data);
  };

  const updateRoomPrivacy = async () => {
    if (privacyCode.toUpperCase() !== room.code) {
      setMessage({ text: "Incorrect room code. Verification failed.", type: 'error' });
      return;
    }

    setPrivacyLoading(true);
    const { data, error } = await supabase
      .from(TABLES.ROOMS)
      .update({ is_public: !room.is_public })
      .eq('id', room.id)
      .select()
      .single();

    if (data && !error) {
      onRoomUpdate(data);
      setMessage({ text: `Room is now ${data.is_public ? 'Public' : 'Private'}!`, type: 'success' });
      setIsChangingPrivacy(false);
      setPrivacyCode('');
    } else {
      setMessage({ text: "Error updating privacy: " + (error?.message || "Unknown error"), type: 'error' });
    }
    setPrivacyLoading(false);
  };

  const handleDeleteRoom = async () => {
    if (deleteCode.toUpperCase() !== room.code) {
      setMessage({ text: "Incorrect room code. Deletion failed.", type: 'error' });
      return;
    }

    setDeleteLoading(true);
    setMessage(null);

    try {
      // First, we need to handle related data if not cascaded
      // If RLS or FKs are strict, we might need to be careful.
      // But usually, a simple delete on the room should work if schema is right.
      const { error } = await supabase
        .from(TABLES.ROOMS)
        .delete()
        .eq('id', room.id);

      if (error) throw error;

      // If successful, we need to redirect the user out of the room
      // Since the room is gone, reloading the page will take them to the lobby
      window.location.href = '/';
    } catch (error: any) {
      setMessage({ text: "Error deleting room: " + (error.message || "Unknown error"), type: 'error' });
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-bible-900 rounded-3xl border border-bible-200 dark:border-bible-800 shadow-xl overflow-hidden animate-fade-in-up">
      <div className="bg-bible-900 dark:bg-black p-4 md:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-3 md:gap-4">
          <div className="bg-white/20 p-2 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-md">
            <Shield size={20} className="text-bible-300 md:hidden" />
            <Shield size={28} className="text-bible-300 hidden md:block" />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-serif font-bold tracking-tight">Admin Center</h2>
            <p className="text-bible-300 text-[10px] md:text-sm font-medium mt-0.5">Manage your room</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-bible-100 dark:border-bible-800 bg-bible-50/50 dark:bg-bible-900/50">
        <TabButton active={activeTab === 'scripture'} onClick={() => setActiveTab('scripture')} icon={<BookOpen size={16}/>} label="Scripture" />
        <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users size={16}/>} label="Members" />
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={16}/>} label="Settings" />
      </div>

      <div className="p-4 md:p-8">
        {message && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border animate-shake ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {activeTab === 'scripture' && (
          <div className="space-y-12">
            <section className="bg-bible-50 dark:bg-bible-950/50 p-8 rounded-3xl border border-bible-100 dark:border-bible-800">
              <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white mb-6 flex items-center gap-2">
                <Plus size={20} className="text-bible-600 dark:text-bible-400" />
                <span>Publish New Scripture</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-bible-800 dark:text-bible-400 uppercase tracking-wider">Theme (Optional)</label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Courage, Faith, Leadership"
                    className="w-full px-4 py-3 rounded-xl border border-bible-200 dark:border-bible-800 bg-white dark:bg-bible-950 focus:ring-2 focus:ring-bible-500 transition-all font-medium text-bible-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-bible-800 dark:text-bible-400 uppercase tracking-wider">Reference</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. John 3:16"
                    className="w-full px-4 py-3 rounded-xl border border-bible-200 dark:border-bible-800 bg-white dark:bg-bible-950 focus:ring-2 focus:ring-bible-500 transition-all font-medium text-bible-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold text-bible-800 dark:text-bible-400 uppercase tracking-wider">Bible Version</label>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_VERSIONS.map(v => (
                    <button
                      key={v}
                      onClick={() => setVersion(v)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${version === v ? 'bg-bible-600 border-bible-600 text-white shadow-md' : 'bg-white dark:bg-bible-900 border-bible-200 dark:border-bible-800 text-bible-600 dark:text-bible-400 hover:bg-bible-50 dark:hover:bg-bible-800'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePublish}
                disabled={loading || !reference.trim()}
                className="w-full bg-bible-800 dark:bg-bible-700 hover:bg-black dark:hover:bg-bible-600 disabled:bg-gray-300 dark:disabled:bg-bible-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-bible-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
                <span>Publish to Room</span>
              </button>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white flex items-center gap-2">
                  <Archive size={20} className="text-bible-600 dark:text-bible-400" />
                  <span>Active & Archived Readings</span>
                </h3>
              </div>

              <div className="space-y-4">
                {activeReadings.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-5 bg-bible-50 dark:bg-bible-800/50 border border-bible-200 dark:border-bible-800 rounded-2xl group transition-all hover:border-bible-400 dark:hover:border-bible-600">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-2 rounded-xl"><CheckCircle2 size={20} /></div>
                      <div>
                        <div className="font-bold text-bible-900 dark:text-white">{r.reference}</div>
                        <div className="text-xs text-bible-500 dark:text-bible-400 font-medium uppercase tracking-wider">{r.version} • Active</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deactivateReading(r)}
                      disabled={deactivatingId === r.id}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2 font-bold text-sm"
                    >
                      {deactivatingId === r.id ? <Loader2 size={18} className="animate-spin" /> : <Archive size={18} />}
                      <span>Archive</span>
                    </button>
                  </div>
                ))}

                {loadingArchive ? (
                  <div className="flex justify-center py-10"><Loader2 size={32} className="animate-spin text-bible-300" /></div>
                ) : archivedReadings.length > 0 ? (
                  archivedReadings.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-5 bg-white dark:bg-bible-900 border border-gray-100 dark:border-bible-800 rounded-2xl group transition-all hover:border-bible-200 dark:hover:border-bible-700">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 dark:bg-bible-800 text-gray-400 dark:text-gray-500 p-2 rounded-xl"><Archive size={20} /></div>
                        <div>
                          <div className="font-bold text-gray-700 dark:text-gray-300">{r.reference}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">{r.version} • Archived</div>
                        </div>
                      </div>
                      <button
                        onClick={() => reactivateReading(r)}
                        disabled={reactivatingId === r.id}
                        className="text-bible-400 dark:text-bible-500 hover:text-bible-700 dark:hover:text-bible-300 p-2 rounded-xl hover:bg-bible-50 dark:hover:bg-bible-800 transition-all flex items-center gap-2 font-bold text-sm"
                      >
                        {reactivatingId === r.id ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                        <span>Reactivate</span>
                      </button>
                    </div>
                  ))
                ) : activeReadings.length === 0 && (
                  <div className="text-center py-10 text-gray-400 dark:text-gray-500 font-medium italic">No reading history found.</div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search members by name or email..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-bible-200 dark:border-bible-800 bg-white dark:bg-bible-950 focus:ring-2 focus:ring-bible-500 transition-all font-medium text-bible-900 dark:text-white"
              />
            </div>

            <div className="bg-white dark:bg-bible-900 border border-bible-100 dark:border-bible-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-bible-50 dark:bg-bible-800 text-bible-800 dark:text-bible-200 text-xs font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-4 md:px-6 py-4">User</th>
                      <th className="px-4 md:px-6 py-4">Role</th>
                      <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bible-50 dark:divide-bible-800">
                    {loadingMembers ? (
                      <tr><td colSpan={3} className="px-6 py-10 text-center"><Loader2 size={32} className="animate-spin text-bible-300 mx-auto" /></td></tr>
                    ) : members.filter(m => 
                        m.user_profiles?.username.toLowerCase().includes(memberSearch.toLowerCase()) || 
                        m.user_profiles?.email.toLowerCase().includes(memberSearch.toLowerCase())
                      ).map(m => (
                      <tr key={m.id} className="hover:bg-bible-50/30 dark:hover:bg-bible-800/30 transition-colors">
                        <td className="px-4 md:px-6 py-4">
                          <div className="font-bold text-bible-900 dark:text-white truncate max-w-[150px] md:max-w-none" title={m.user_profiles?.username}>{m.user_profiles?.username}</div>
                          <div className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 truncate max-w-[150px] md:max-w-none" title={m.user_profiles?.email}>{m.user_profiles?.email}</div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-tighter ${m.role === 'admin' ? 'bg-bible-100 dark:bg-bible-800 text-bible-800 dark:text-bible-200' : 'bg-gray-100 dark:bg-bible-700 text-gray-600 dark:text-gray-400'}`}>
                            {m.role}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 md:gap-2">
                            <button
                              onClick={() => toggleAdmin(m.id, m.role)}
                              disabled={m.user_id === currentUser.id}
                              className={`p-1.5 md:p-2 rounded-lg transition-all ${m.user_id === currentUser.id ? 'opacity-20 cursor-not-allowed' : 'hover:bg-bible-100 dark:hover:bg-bible-800 text-bible-600 dark:text-bible-400'}`}
                              title={m.role === 'admin' ? "Revoke Admin" : "Make Admin"}
                            >
                              {m.role === 'admin' ? <UserMinus size={16}/> : <UserPlus size={16}/>}
                            </button>
                            <button
                              onClick={() => removeMember(m.id)}
                              disabled={m.user_id === currentUser.id}
                              className={`p-1.5 md:p-2 rounded-lg transition-all ${m.user_id === currentUser.id ? 'opacity-20 cursor-not-allowed' : 'hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400'}`}
                              title="Remove from Room"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-bible-50 dark:divide-bible-800">
                {loadingMembers ? (
                  <div className="p-10 text-center"><Loader2 size={32} className="animate-spin text-bible-300 mx-auto" /></div>
                ) : members.filter(m => 
                    m.user_profiles?.username.toLowerCase().includes(memberSearch.toLowerCase()) || 
                    m.user_profiles?.email.toLowerCase().includes(memberSearch.toLowerCase())
                  ).map(m => (
                  <div key={m.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-bible-900 dark:text-white">{m.user_profiles?.username}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{m.user_profiles?.email}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${m.role === 'admin' ? 'bg-bible-100 dark:bg-bible-800 text-bible-800 dark:text-bible-200' : 'bg-gray-100 dark:bg-bible-700 text-gray-600 dark:text-gray-400'}`}>
                        {m.role}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAdmin(m.id, m.role)}
                        disabled={m.user_id === currentUser.id}
                        className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-xs font-bold ${m.user_id === currentUser.id ? 'opacity-20 cursor-not-allowed bg-gray-50 dark:bg-bible-950 text-gray-400' : 'bg-bible-50 dark:bg-bible-800 text-bible-600 dark:text-bible-400 hover:bg-bible-100 dark:hover:bg-bible-700'}`}
                      >
                        {m.role === 'admin' ? <UserMinus size={14}/> : <UserPlus size={14}/>}
                        <span>{m.role === 'admin' ? "Revoke Admin" : "Make Admin"}</span>
                      </button>
                      <button
                        onClick={() => removeMember(m.id)}
                        disabled={m.user_id === currentUser.id}
                        className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-xs font-bold ${m.user_id === currentUser.id ? 'opacity-20 cursor-not-allowed bg-gray-50 dark:bg-bible-950 text-gray-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'}`}
                      >
                        <Trash2 size={14}/>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-bible-900 dark:text-white">Room Settings</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-bible-800 dark:text-bible-400 uppercase tracking-wider">Room Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempRoomName}
                    disabled={!isEditingName}
                    onChange={(e) => setTempRoomName(e.target.value)}
                    className={`flex-1 min-w-0 px-4 py-3 rounded-xl border transition-all font-medium ${isEditingName ? 'border-bible-500 bg-white dark:bg-bible-950 text-bible-900 dark:text-white' : 'border-bible-100 dark:border-bible-800 bg-bible-50 dark:bg-bible-800/50 text-gray-500'}`}
                  />
                  {isEditingName ? (
                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={() => {
                          updateRoomName(tempRoomName);
                          setIsEditingName(false);
                        }}
                        className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-all"
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          setTempRoomName(room.name);
                          setIsEditingName(false);
                        }}
                        className="bg-gray-200 dark:bg-bible-800 text-gray-600 dark:text-gray-400 p-3 rounded-xl hover:bg-gray-300 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="bg-bible-100 dark:bg-bible-800 text-bible-600 dark:text-bible-400 p-3 rounded-xl hover:bg-bible-200 dark:hover:bg-bible-700 transition-all shrink-0"
                    >
                      <Edit2 size={20} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-bible-800 dark:text-bible-400 uppercase tracking-wider">Room Privacy</label>
                <div className={`p-4 rounded-2xl border transition-all ${room.is_public ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800' : 'bg-bible-50 border-bible-100 dark:bg-bible-800/50 dark:border-bible-800'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${room.is_public ? 'bg-green-100 text-green-600' : 'bg-bible-100 text-bible-600'}`}>
                        {room.is_public ? <Globe size={20} /> : <LockIcon size={20} />}
                      </div>
                      <div>
                        <div className="font-bold text-bible-900 dark:text-white">{room.is_public ? 'Public Room' : 'Private Room'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{room.is_public ? 'Anyone can find and join this room' : 'Only people with the code can join'}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsChangingPrivacy(true)}
                      className="text-xs font-bold uppercase tracking-widest text-bible-600 hover:text-bible-800 dark:text-bible-400 dark:hover:text-bible-200"
                    >
                      Change
                    </button>
                  </div>

                  {isChangingPrivacy && (
                    <div className="mt-4 pt-4 border-t border-bible-100 dark:border-bible-800 space-y-4 animate-fade-in">
                      <div className="text-sm font-medium text-bible-800 dark:text-bible-300">
                        To switch to <span className="font-bold">{room.is_public ? 'Private' : 'Public'}</span>, please type the room code <span className="font-mono font-bold text-bible-900 dark:text-white">{room.code}</span> to verify.
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={privacyCode}
                            onChange={(e) => setPrivacyCode(e.target.value.toUpperCase())}
                            onPaste={(e) => e.preventDefault()}
                            placeholder="ENTER CODE"
                            className="flex-1 px-4 py-2 rounded-xl border border-bible-200 dark:border-bible-800 bg-white dark:bg-bible-950 font-mono font-bold text-center tracking-widest min-w-0"
                          />
                          <button 
                            onClick={() => { setIsChangingPrivacy(false); setPrivacyCode(''); }}
                            className="text-gray-400 hover:text-gray-600 p-2 shrink-0"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <button 
                          onClick={updateRoomPrivacy}
                          disabled={privacyLoading || privacyCode.length !== 6}
                          className="w-full bg-bible-800 dark:bg-bible-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {privacyLoading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Privacy Change'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-bible-800 dark:text-bible-400 uppercase tracking-wider">Room Code (Share this with your team)</label>
                <div className="flex items-center gap-3 p-4 bg-bible-50 dark:bg-bible-800/50 rounded-xl border border-bible-100 dark:border-bible-800 font-mono text-xl font-bold text-bible-900 dark:text-white">
                  <span className="truncate">{room.code}</span>
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(room.code);
                        setMessage({ text: "Code copied to clipboard!", type: 'success' });
                    }}
                    className="ml-auto text-bible-500 hover:text-bible-800 p-2 rounded-lg hover:bg-bible-100 dark:hover:bg-bible-700 transition-all shrink-0"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-bible-100 dark:border-bible-800">
              <h4 className="text-red-600 font-bold mb-2">Danger Zone</h4>
              <p className="text-sm text-gray-500 mb-4">Deleting a room is permanent and will remove all reflections and history.</p>
              
              {!isDeletingRoom ? (
                <button
                  onClick={() => setIsDeletingRoom(true)}
                  className="w-full sm:w-auto bg-red-50 dark:bg-red-900/10 text-red-600 px-6 py-3 rounded-xl font-bold border border-red-100 dark:border-red-900/30 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  <span>Delete Room</span>
                </button>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 space-y-4 animate-fade-in">
                  <div className="text-sm font-medium text-red-800 dark:text-red-300">
                    To permanently delete <span className="font-bold">{room.name}</span>, please type the room code <span className="font-mono font-bold text-red-900 dark:text-red-200">{room.code}</span> to confirm.
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={deleteCode}
                        onChange={(e) => setDeleteCode(e.target.value.toUpperCase())}
                        onPaste={(e) => e.preventDefault()}
                        placeholder="ENTER CODE"
                        className="flex-1 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-bible-950 font-mono font-bold text-center tracking-widest text-red-600 min-w-0"
                      />
                      <button 
                        onClick={() => { setIsDeletingRoom(false); setDeleteCode(''); }}
                        className="text-gray-400 hover:text-gray-600 p-2 shrink-0"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <button 
                      onClick={handleDeleteRoom}
                      disabled={deleteLoading || deleteCode.length !== 6}
                      className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-200 dark:shadow-none"
                    >
                      {deleteLoading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                      <span>Permanently Delete Room</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2 ${active ? 'bg-white dark:bg-bible-900 border-bible-600 text-bible-900 dark:text-white shadow-sm' : 'text-gray-400 border-transparent hover:text-bible-600 hover:bg-bible-50/30 dark:hover:bg-bible-800/30'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
