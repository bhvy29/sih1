import React, { useState, useEffect, useRef } from 'react';
import { psychiatristApi } from '../services/psychiatristApi';

export default function PatientChatWidget({ caseId, senderType = 'patient', senderName = 'Patient', onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const data = await psychiatristApi.getChatMessages(caseId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll every 3 seconds for new messages
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [caseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');
    setLoading(true);

    try {
      await psychiatristApi.sendChatMessage(caseId, senderType, senderName, textToSend);
      await fetchMessages();
    } catch (err) {
      console.error('Failed to send chat message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[500px] w-full max-w-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <div>
            <h4 className="font-bold text-lg leading-tight">Live Consultation Chat</h4>
            <p className="text-xs text-blue-100">Case ID: <span className="font-mono font-semibold">{caseId}</span></p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white font-bold text-xl px-2 py-1 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Window */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-gray-500 p-6">
            <div>
              <p className="text-3xl mb-2">💬</p>
              <p className="font-semibold text-sm">Session initialized.</p>
              <p className="text-xs text-gray-400 mt-1">Send a message to start speaking directly with the attending psychiatrist.</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_type === senderType;
            return (
              <div
                key={msg.id || msg.timestamp}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-gray-400 mb-1 px-1 font-medium">
                  {msg.sender_name} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition text-sm flex items-center gap-1"
        >
          Send ➔
        </button>
      </form>
    </div>
  );
}
