import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMail, IoLockClosed, IoLogoGoogle, IoArrowBack } from "react-icons/io5";
import Flavistalogo from "../logo/Flavistalogo";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://flavista.onrender.com/api/auth/login', {
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
          if (rememberMe) {
            localStorage.setItem('token', data.token);
          } else {
            sessionStorage.setItem('token', data.token);
          }
          navigate('/');
        } else {
          setError(data.message || data.error || 'Invalid email or password');
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
    window.location.href = `https://flavista.onrender.com/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-background-dark flex font-display">
      

      <div className="leftside hidden lg:flex w-1/2 relative overflow-hidden">
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
              Taste the <span className="text-orange-500">Extraordinary</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Join thousands of food lovers who order their favorite meals in seconds. Experience premium delivery like never before.
            </p>
            
            {/* Testimonial Card */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 mt-8">
              <div className="flex gap-1 text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="italic text-white/80 mb-4">"The best food delivery app I've ever used. The UI is stunning and the service is incredibly fast!"</p>
              <div className="flex items-center gap-3">
                <img src="httpss://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-orange-500" />
                <div>
                  <p className="font-bold text-sm">Sarah Jenkins</p>
                  <p className="text-xs text-white/50">Food Blogger</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/40">
            © 2024 Flavista Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 lg:hidden bg-[url('/backgroundimage2.webp')] bg-cover bg-center opacity-20"></div>
        
        <div className="w-full max-w-md relative z-10 lg:bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <button 
            onClick={() => navigate('/')}
            className="absolute -top-12 left-0 text-white/50 hover:text-white flex items-center gap-2 transition-colors lg:hidden"
          >
            <IoArrowBack /> Back to Home
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Welcome Back!</h2>
            <p className="text-white/50">Please enter your details to sign in.</p>
          </div>

          {error && <p className="text-red-500 text-center mb-4 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-offset-0 focus:ring-orange-500/50" 
                />
                <span className="text-white/60 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-orange-500 hover:text-orange-400 font-medium transition-colors">Forgot Password?</button>
            </div>

            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm">
              Sign In
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-white/40 text-sm">Or continue with</span>
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
            Don't have an account? <button onClick={() => navigate('/signup')} className="text-orange-500 font-bold hover:underline">Sign up for free</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
