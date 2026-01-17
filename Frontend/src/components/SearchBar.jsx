import React, { useState, useEffect, useRef } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Debounce fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        const res = await fetch(`https://flavista.onrender.com/api/foods/suggestions?query=${query}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Wait 300ms after typing stops

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) return;
    setShowSuggestions(false);
    setQuery(searchQuery);
    
    // Here we call your existing search API to get/save the food details
    try {
      const res = await fetch(`https://flavista.onrender.com/api/foods/search?query=${searchQuery}`);
      const data = await res.json();
      if (res.ok) {
        // Navigate to food details page or show modal
        const foodItem = Array.isArray(data) ? data[0] : data;
        if (foodItem && foodItem._id) navigate(`/food/${foodItem._id}`);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <div className="relative flex items-center bg-white/10 border border-white/10 rounded-full px-4 py-3 backdrop-blur-md focus-within:bg-white/20 focus-within:border-orange-500/50 transition-all shadow-lg">
        <IoSearch className="text-white/50 text-xl" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="Search for food (e.g. Pizza, Burger)..."
          className="w-full bg-transparent border-none outline-none text-white placeholder-white/50 px-3 font-display"
        />
        {query && (
          <IoClose 
            className="text-white/50 cursor-pointer hover:text-white transition-colors" 
            onClick={() => setQuery('')}
          />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="px-5 py-3 text-white/80 hover:bg-orange-500 hover:text-white cursor-pointer transition-colors flex items-center gap-3 border-b border-white/5 last:border-none font-display"
            >
              <IoSearch className="opacity-50 text-sm" />
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;