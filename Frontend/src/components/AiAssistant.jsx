import React, { useState, useRef, useEffect } from 'react';
import { IoSparkles, IoClose, IoHappy, IoFlame, IoIceCream, IoRestaurant, IoSend, IoAperture, IoHardwareChip, IoWallet } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// 🧠 Custom Hook for Backend AI Integration
const useBackendAI = () => {
  const [aiLoading, setAiLoading] = useState(false);

  const getAIResponse = async (userText) => {
    setAiLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userText })
      });
      
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "AI Server Error");

      // Handle various response formats
      return data.response || data.result || data.message || data.text;
    } catch (error) {
      console.error("AI API Error:", error);
      return "I'm having trouble connecting to the server. Please check if the backend is running.";
    } finally {
      setAiLoading(false);
    }
  };

  return { getAIResponse, aiLoading };
};

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Greetings! I'm Flavi, your culinary intelligence. How may I assist your palate today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { getAIResponse, aiLoading } = useBackendAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const processLocalCommand = async (text) => {
    const lowerText = text.toLowerCase();
    
    try {
        if (lowerText.includes('surprise') || lowerText.includes('recommend') || lowerText.includes('best')) {
            const res = await fetch('http://localhost:5000/api/foods/trending');
            const data = await res.json();
            if (data && data.length > 0) {
                const suggestion = data[Math.floor(Math.random() * data.length)];
                return {
                    text: `How about trying our trending ${suggestion.name}? It's a customer favorite!`,
                    action: { link: `/food/${suggestion._id}`, label: 'View Item' }
                };
            }
        } 
        
        if (lowerText.includes('spicy') || lowerText.includes('hot')) {
             const res = await fetch('http://localhost:5000/api/foods/category/Indian');
             const data = await res.json();
             if (data && data.length > 0) {
                 const suggestion = data[0];
                 return {
                     text: `I found something spicy and delicious for you: ${suggestion.name}!`,
                     action: { link: `/food/${suggestion._id}`, label: 'View Item' }
                 };
             }
        } 
        
        if (lowerText.includes('sweet') || lowerText.includes('dessert') || lowerText.includes('cake')) {
             const res = await fetch('http://localhost:5000/api/foods/category/Dessert');
             const data = await res.json();
             if (data && data.length > 0) {
                 const suggestion = data[0];
                 return {
                     text: `Satisfy your sweet tooth with ${suggestion.name}. It's divine!`,
                     action: { link: `/food/${suggestion._id}`, label: 'View Item' }
                 };
             }
        } 
        
        if (lowerText.includes('restaurant')) {
             return {
                 text: "Taking you to our finest restaurants...",
                 action: { link: '/restaurants', label: 'View Restaurants' }
             };
        }

        // General Search fallback
        if (text.length > 2) {
            const res = await fetch(`http://localhost:5000/api/foods/search?query=${text}`);
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                return {
                    text: `I found ${data[0].name} which matches your request!`,
                    action: { link: `/food/${data[0]._id}`, label: 'Check it out' }
                };
            }
        }

        return null; // No local match found

    } catch (e) {
        return { text: "My systems are calibrating. Please try checking the menu directly." };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const text = inputValue.trim();
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(async () => {
        // 1. Try Local Command (Database/Routing)
        let response = await processLocalCommand(text);

        // 2. If no local match, try Backend AI
        if (!response) {
            const aiText = await getAIResponse(text);
            if (aiText) {
                response = { text: aiText };
            } else {
                response = { text: "I specialize in finding food on our menu. Try asking for 'spicy dishes' or 'desserts'!" };
            }
        }

        setIsTyping(false);
        setMessages(prev => [...prev, { type: 'bot', ...response }]);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleOptionClick = async (option) => {
    setMessages(prev => [...prev, { type: 'user', text: option.label }]);
    setIsTyping(true);

    setTimeout(async () => {
      let response = {};
      // Map options to keywords for the generator
      if (option.value === 'surprise') response = await processLocalCommand('surprise');
      else if (option.value === 'spicy') response = await processLocalCommand('spicy');
      else if (option.value === 'sweet') response = await processLocalCommand('sweet');
      else if (option.value === 'restaurants') response = await processLocalCommand('restaurant');
      else if (option.value === 'budget') {
        // Task 2: Automatically send a budget query
        // We simulate the user asking for food under a specific amount (e.g., 250)
        const aiText = await getAIResponse("Find food under 250");
        response = { text: aiText };
      }
      
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'bot', ...response }]);
    }, 1000);
  };

  const options = [
    { label: "Surprise Me! 🎲", value: "surprise", icon: <IoHappy /> },
    { label: "Something Spicy 🌶️", value: "spicy", icon: <IoFlame /> },
    { label: "Sweet Treat 🍦", value: "sweet", icon: <IoIceCream /> },
    { label: "Find Restaurants 🍽️", value: "restaurants", icon: <IoRestaurant /> },
    { label: "Budget Finds 💰", value: "budget", icon: <IoWallet /> }
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-black/80 backdrop-blur-xl border border-orange-500/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] text-white group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-purple-600/20 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex items-center justify-center w-full h-full">
            <IoAperture className="text-3xl text-orange-500 animate-[spin_10s_linear_infinite]" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-50 w-80 md:w-96 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col font-display ring-1 ring-white/5"
            style={{ maxHeight: '600px', height: '500px' }}
          >
            {/* Professional Header */}
            <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <IoHardwareChip className="text-lg" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm tracking-wide">FLAVI ASSISTANT</h3>
                    <p className="text-[10px] text-white/50 flex items-center gap-1 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active
                    </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-tr-none shadow-lg shadow-orange-500/20' 
                      : 'bg-[#1f1f1f] text-white/90 rounded-tl-none border border-white/10'
                  }`}>
                    {msg.text}
                    {msg.action && (
                        <button 
                            onClick={() => navigate(msg.action.link)}
                            className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold transition-colors border border-white/10 flex items-center justify-center gap-2"
                        >
                            <IoSparkles className="text-orange-400" />
                            {msg.action.label}
                        </button>
                    )}
                  </div>
                </div>
              ))}
              {(isTyping || aiLoading) && (
                <div className="flex justify-start">
                  <div className="bg-[#1f1f1f] px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 border border-white/10 items-center">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-white/10 bg-black/40 backdrop-blur-md">
                {/* Quick Options - Only show if few messages to save space */}
                {messages.length < 4 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-medium text-white/70 transition-all whitespace-nowrap flex items-center gap-2 flex-shrink-0 hover:border-orange-500/30 hover:text-white"
                        >
                            {opt.icon} {opt.label}
                        </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Flavi..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500/50 focus:bg-white/10 outline-none transition-all placeholder-white/30"
                    />
                    <button 
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white p-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                    >
                        <IoSend />
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;