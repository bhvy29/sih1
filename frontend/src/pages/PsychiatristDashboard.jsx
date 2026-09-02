import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { psychiatristApi } from '../services/psychiatristApi';
import PatientChatWidget from '../components/PatientChatWidget';

export default function PsychiatristDashboard() {
  const [queue, setQueue] = useState([]);
  const [counts, setCounts] = useState({ queued_count: 0, in_session_count: 0, resolved_count: 0 });
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [activeChatCaseId, setActiveChatCaseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('psychiatrist_user');
    if (!storedUser) {
      navigate('/psychiatrist/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchQueue();

    // Poll queue every 5 seconds for new critical entries
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [filterStatus, sortBy]);

  const fetchQueue = async () => {
    try {
      const data = await psychiatristApi.getQueue(filterStatus || null, sortBy);
      setQueue(data.entries || []);
      setCounts({
        queued_count: data.queued_count || 0,
        in_session_count: data.in_session_count || 0,
        resolved_count: data.resolved_count || 0,
      });
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCase = async (caseId) => {
    setSelectedCase(caseId);
    try {
      const reportData = await psychiatristApi.getCaseReport(caseId);
      setSelectedReport(reportData.case);
      const notesData = await psychiatristApi.getSessionNotes(caseId);
      setNotes(notesData.notes || []);
    } catch (err) {
      console.error('Failed to fetch case details:', err);
    }
  };

  const handleStatusChange = async (caseId, newStatus) => {
    try {
      await psychiatristApi.updateQueueStatus(caseId, newStatus, user?.id);
      await fetchQueue();
      if (selectedCase === caseId) {
        handleSelectCase(caseId);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCase) return;

    try {
      await psychiatristApi.addSessionNote(selectedCase, newNoteText.trim(), user?.id, user?.full_name);
      setNewNoteText('');
      const notesData = await psychiatristApi.getSessionNotes(selectedCase);
      setNotes(notesData.notes || []);
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('psychiatrist_token');
    localStorage.removeItem('psychiatrist_user');
    navigate('/psychiatrist/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
              🩺
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Psychiatrist Connect Portal</h1>
              <p className="text-xs text-slate-400">Critical Victim Queue & Clinical Sessions</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Badge */}
            <div className="relative flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
              <span className="text-sm font-semibold text-slate-300">Pending Critical:</span>
              <span className="px-2.5 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                {counts.queued_count}
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-200">{user?.full_name || 'Dr. Psychiatrist'}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Queue List (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Controls & Filter Bar */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  filterStatus === '' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({counts.queued_count + counts.in_session_count + counts.resolved_count})
              </button>
              <button
                onClick={() => setFilterStatus('queued')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  filterStatus === 'queued' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                🔴 Queued ({counts.queued_count})
              </button>
              <button
                onClick={() => setFilterStatus('in_session')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  filterStatus === 'in_session' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                🔵 In Session ({counts.in_session_count})
              </button>
              <button
                onClick={() => setFilterStatus('resolved')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  filterStatus === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                🟢 Resolved ({counts.resolved_count})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 focus:outline-none"
              >
                <option value="created_at">Wait Time (Oldest First)</option>
                <option value="svi_score">Severity (Highest SVI)</option>
              </select>
            </div>
          </div>

          {/* Patient Queue Cards */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white p-8 text-center text-gray-500 rounded-2xl">Loading queue...</div>
            ) : queue.length === 0 ? (
              <div className="bg-white p-12 text-center text-gray-500 rounded-2xl border border-gray-200">
                <p className="text-4xl mb-2">🎉</p>
                <p className="font-bold text-gray-700 text-base">No critical patients in queue</p>
                <p className="text-xs text-gray-400 mt-1">All incoming SVI scores are currently stable.</p>
              </div>
            ) : (
              queue.map((entry) => {
                const isSelected = selectedCase === entry.case_id;
                return (
                  <div
                    key={entry.id}
                    onClick={() => handleSelectCase(entry.case_id)}
                    className={`bg-white p-5 rounded-2xl border transition duration-200 cursor-pointer shadow-sm ${
                      isSelected ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                          Case #{entry.case_id}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          entry.status === 'queued' ? 'bg-red-100 text-red-800' :
                          entry.status === 'in_session' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {entry.status.toUpperCase().replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-extrabold text-red-600">
                          SVI {entry.svi_score.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <span>Entered Queue: {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveChatCaseId(entry.case_id);
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition flex items-center gap-1"
                        >
                          💬 Chat
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCase(entry.case_id);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                        >
                          View Report ➔
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Report & Clinical Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedCase && selectedReport ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
              
              {/* Header Details */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">Case Review</h3>
                  <span className="font-mono text-xs font-semibold text-gray-500">{selectedReport.case_id}</span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleStatusChange(selectedCase, 'in_session')}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Start Session
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedCase, 'resolved')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => setActiveChatCaseId(selectedCase)}
                    className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    💬 Live Chat
                  </button>
                </div>
              </div>

              {/* AI Narrative Report */}
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">AI Assessment Summary</h4>
                <div className="bg-slate-50 p-4 rounded-xl text-xs text-gray-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-gray-200">
                  {selectedReport.ai_report || 'No detailed report available.'}
                </div>
              </div>

              {/* Session Notes Input & History */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Psychiatrist Clinical Notes</h4>
                
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter observation notes, treatment plan, or follow-up details..."
                    className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                  >
                    Save Clinical Note
                  </button>
                </form>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No notes recorded yet.</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
                        <div className="flex justify-between font-semibold text-blue-950 mb-1">
                          <span>{note.psychiatrist_name}</span>
                          <span className="text-[10px] text-gray-400">{new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-gray-700">{note.notes}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              <p className="text-3xl mb-2">📋</p>
              <p className="font-semibold text-sm text-gray-600">Select a patient from the queue</p>
              <p className="text-xs mt-1">Review full AI report, clinical notes, and manage consultation session.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Modal if Chat active */}
      {activeChatCaseId && (
        <div className="fixed bottom-6 right-6 z-50">
          <PatientChatWidget
            caseId={activeChatCaseId}
            senderType="psychiatrist"
            senderName={user?.full_name || 'Dr. Psychiatrist'}
            onClose={() => setActiveChatCaseId(null)}
          />
        </div>
      )}
    </div>
  );
}
