import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { IoPerson, IoMail, IoSave, IoCamera, IoCloudUpload, IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    profileImageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await fetch('https://flavista.onrender.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUser({
            username: data.username,
            email: data.email,
            profileImageUrl: data.profileImageUrl
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch('https://flavista.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const imagePath = await res.text();
        setUser((prev) => ({ ...prev, profileImageUrl: imagePath }));
        // Auto-save after upload
        await updateProfile({ ...user, profileImageUrl: imagePath });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (userData) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await fetch('https://flavista.onrender.com/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
        // Notify other components (Navbar) that user data has changed
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(user);
    navigate('/');
  };

  // Helper to resolve image URL (Google vs Local)
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    return path.startsWith('https') ? path : `https://flavista.onrender.com/api/images/${path}`;
  };

  return (
    <>
      <div className="sticky top-0 w-full z-30"><Navbar /></div>
      <div className="min-h-screen bg-background-dark font-display text-white p-4 md:p-10 flex justify-center items-start pt-20">
            <button onClick={() => navigate('/')} className="absolute top-20 left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer text-white hover:text-orange-500 hover:scale-110 transition-all duration-500"><IoArrowBack /></button>
        {/* Background Decoration */}
        <div className="fixed top-20 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Edit Profile
          </h1>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-orange-500 to-yellow-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                    <img 
                      src={getImageUrl(user.profileImageUrl)} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 hover:text-white transition-all shadow-lg transform group-hover:scale-110">
                  <IoCamera className="text-xl" />
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
              <p className="mt-4 text-white/50 text-sm">Allowed: JPG, PNG, WEBP</p>
            </div>

            {message && <div className="bg-green-500/20 text-green-400 p-3 rounded-xl mb-6 text-center border border-green-500/30">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <IoPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="text" 
                    value={user.username}
                    onChange={(e) => setUser({...user, username: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="email" 
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:border-orange-500 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-4">
                <IoSave /> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
