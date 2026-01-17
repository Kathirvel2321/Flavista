import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { IoSettings, IoLockClosed, IoFlame, IoLeaf, IoSave, IoTrash, IoWarning, IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    spicyLevel: 'Medium',
    vegonly: false
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.preferences) {
          setPreferences({
            spicyLevel: data.preferences.spicyLevel || 'Medium',
            vegonly: data.preferences.vegonly || false
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    const body = { preferences };
    if (password) body.password = password;

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setMessage('Settings updated successfully!');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('userUpdated')); // Update Navbar
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    
      <div className="sticky top-0 w-full z-30"><Navbar /></div>
      <div className="min-h-screen bg-background-dark font-display text-white p-4 md:p-10 flex justify-center items-start pt-20">
      <button onClick={() => navigate('/')} className="absolute top-20 left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointertext-white hover:text-orange-500 transition-colors"><IoArrowBack /></button>
        {/* Background Decoration */}
        <div className="fixed top-20 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Settings
          </h1>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
            {message && <div className={`p-3 rounded-xl mb-6 text-center border ${message.includes('match') ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>{message}</div>}

            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Food Preferences */}
              <div>
                <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2 flex items-center gap-2"><IoFlame className="text-orange-500"/> Food Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Spicy Level</label>
                    <select 
                      value={preferences.spicyLevel}
                      onChange={(e) => setPreferences({...preferences, spicyLevel: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-orange-500 focus:bg-white/10 outline-none transition-all text-white appearance-none cursor-pointer"
                    >
                      <option value="Mild" className="bg-gray-900">Mild</option>
                      <option value="Medium" className="bg-gray-900">Medium</option>
                      <option value="Hot" className="bg-gray-900">Hot</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setPreferences({...preferences, vegonly: !preferences.vegonly})}>
                    <label className="text-sm font-bold text-white/80 uppercase tracking-wider flex items-center gap-2 cursor-pointer"><IoLeaf className="text-green-500" /> Veg Only</label>
                    <input 
                      type="checkbox" 
                      checked={preferences.vegonly}
                      onChange={(e) => setPreferences({...preferences, vegonly: e.target.checked})}
                      className="w-5 h-5 accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2 flex items-center gap-2"><IoLockClosed className="text-orange-500"/> Security</h2>
                <div className="space-y-4">
                  <div className="relative group">
                    <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
                    <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all" />
                  </div>
                  <div className="relative group">
                    <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
                <IoSave /> Update Settings
              </button>
            </form>

            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2"><IoWarning /> Danger Zone</h2>
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full border border-red-500/30 text-red-400 font-bold py-4 rounded-xl hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <IoTrash /> Delete Account
                </button>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center animate-fadeIn">
                  <p className="text-white mb-4">Are you sure? This action cannot be undone.</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;