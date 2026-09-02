import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { psychiatristApi } from '../services/psychiatristApi';

export default function PsychiatristLogin() {
  const [username, setUsername] = useState('psychiatrist');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await psychiatristApi.login(username, password);
      localStorage.setItem('psychiatrist_token', data.token);
      localStorage.setItem('psychiatrist_user', JSON.stringify(data.psychiatrist));
      navigate('/psychiatrist/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-extrabold text-2xl">🩺</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Psychiatrist Portal</h1>
          <p className="text-gray-500 text-sm mt-1">SahAI Critical Trauma Response Queue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-lg font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition duration-200 text-base"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal ➔'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Demo Credentials: <span className="font-mono text-gray-700">psychiatrist</span> / <span className="font-mono text-gray-700">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
