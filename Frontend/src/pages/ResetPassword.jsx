import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoLockClosed, IoArrowBack } from "react-icons/io5";
import Flavistalogo from "../logo/Flavistalogo";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      setError('Password must be at least 8 characters long, contain uppercase, lowercase, number and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`https://flavista.onrender.com/api/auth/resetpassword/${resetToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Password updated successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex font-display items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[url('/backgroundimage2.webp')] bg-cover bg-center opacity-20"></div>
      
      <div className="w-full max-w-md relative z-10 bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
             <Flavistalogo className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Reset Password</h2>
          <p className="text-white/50">Enter your new password below.</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4 bg-green-500/10 p-2 rounded-lg border border-green-500/20">{message}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-white/60 tracking-wider ml-1">New Password</label>
            <div className="relative group">
              <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all"
                placeholder="New password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-white/60 tracking-wider ml-1">Confirm Password</label>
            <div className="relative group">
              <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
