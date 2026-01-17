import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMail, IoLockClosed, IoLogoGoogle, IoArrowBack, IoPerson } from "react-icons/io5";
import Flavistalogo from "../logo/Flavistalogo";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { password } = formData;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      setError('Password must be at least 8 characters long, contain uppercase, lowercase, number and special character.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        
        if (response.ok) {
          alert('Registration Successful! Please Login.');
          navigate('/login');
        } else {
          const errorMessage = data.message || data.error || 'Registration failed';
          if (errorMessage.toString().toLowerCase().includes('already exists') || errorMessage.toString().toLowerCase().includes('duplicate')) {
            setError('You already have an account. Please Login.');
          } else {
            setError(errorMessage);
          }
        }
      } else {
        const text = await response.text();
        console.error("Server Error:", text);
        setError(`Server Error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error(err);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-background-dark flex font-display">
      
      {/* Left Side - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
             style={{ backgroundImage: "url('/backgroundimage2.webp')" }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full">
          <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2 w-fit">
             <Flavistalogo className="w-10 h-10 text-white" />
             <span className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500">Flavista</span>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">
              Join the <span className="text-orange-500">Revolution</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Create an account today and start your journey with the best food delivery service in town.
            </p>
            
            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 mt-8 grid grid-cols-3 gap-4 divide-x divide-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">15k+</p>
                <p className="text-xs text-white/60 mt-1">Orders Delivered</p>
              </div>
              <div className="text-center pl-4">
                <p className="text-2xl font-bold text-orange-500">4.8</p>
                <p className="text-xs text-white/60 mt-1">App Rating</p>
              </div>
              <div className="text-center pl-4">
                <p className="text-2xl font-bold text-orange-500">24/7</p>
                <p className="text-xs text-white/60 mt-1">Live Support</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/40">
            © 2024 Flavista Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 lg:hidden bg-[url('/backgroundimage2.webp')] bg-cover bg-center opacity-20"></div>
        
        <div className="w-full max-w-md relative z-10 lg:bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <button 
            onClick={() => navigate('/')}
            className="absolute -top-12 left-0 text-white/50 hover:text-white flex items-center gap-2 transition-colors lg:hidden"
          >
            <IoArrowBack /> Back to Home
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Create Account</h2>
            <p className="text-white/50">Sign up to get started with Flavista.</p>
          </div>

          {error && <p className="text-red-500 text-center mb-4 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-white/60 tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <IoPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-white/60 tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-white/60 tracking-wider ml-1">Password</label>
              <div className="relative group">
                <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">
              Sign Up
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-white/40 text-sm">Or sign up with</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div>
            <button 
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl transition-all hover:-translate-y-0.5">
              <IoLogoGoogle className="text-xl" /> Google
            </button>
          </div>

          <p className="text-center mt-8 text-white/50">
            Already have an account? <button onClick={() => navigate('/login')} className="text-orange-500 font-bold hover:underline">Log In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;