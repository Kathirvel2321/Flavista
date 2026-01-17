import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMail, IoArrowBack } from "react-icons/io5";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://flavista.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 font-display">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
        <button 
          onClick={() => navigate('/login')}
          className="absolute top-6 left-6 text-white/50 hover:text-white flex items-center gap-2 transition-colors"
        >
          <IoArrowBack /> Back
        </button>

        <div className="text-center mb-8 mt-6">
          <h2 className="text-3xl font-bold text-white mb-3">Forgot Password?</h2>
          <p className="text-white/50">Enter your email to reset your password.</p>
        </div>

        {message && <p className="text-green-500 text-center mb-4 bg-green-500/10 p-2 rounded-lg border border-green-500/20">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-white/60 tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;