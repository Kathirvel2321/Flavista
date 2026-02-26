import Food from '../models/foodModel.js';

const chat = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // 1. Input Validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(200).json({ response: "Please say something!" });
    }

    const lowerPrompt = prompt.toLowerCase().trim();
    let responseText = "";

    // 2. Smart Response Logic (The "Brain")
    
    // --- TASK 1: BUDGET LOGIC ---
    // Regex to capture "under 200", "below 500", "cheaper than 150"
    // Handles optional currency symbols like ₹ or Rs.
    const budgetMatch = lowerPrompt.match(/(?:under|below|cheaper than)\s*(?:₹|rs\.?)?\s*(\d+)/);

    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1]);

      // Edge Case: Budget too low
      if (budget < 50) {
        responseText = `₹${budget} is a bit low! Our delicious items start around ₹50.`;
      } else {
        // Query Database: Find items with price <= budget
        const foods = await Food.find({ price: { $lte: budget } }).limit(3).select('name price');
        
        if (foods.length > 0) {
          const foodList = foods.map(f => `${f.name} (₹${f.price})`).join(", ");
          responseText = `Here are some wallet-friendly options under ₹${budget}: ${foodList}.`;
        } else {
          responseText = `I couldn't find anything under ₹${budget}. Try increasing your budget a bit!`;
        }
      }
    }
    // Greetings & Politeness
    else if (['hi', 'hello', 'hey', 'greetings', 'yo'].some(w => lowerPrompt.startsWith(w))) {
      responseText = "Hello! Welcome to Flavista. I'm here to help you find the most delicious food in town. What are you craving?";
    }
    else if (lowerPrompt.includes('how are you')) {
      responseText = "I'm just a bot, but I'm feeling hungry for some data! How can I help you order food?";
    }
    else if (lowerPrompt.includes('thank')) {
      responseText = "You're very welcome! Let me know if you need more recommendations.";
    }
    else if (lowerPrompt.includes('bye') || lowerPrompt.includes('goodbye')) {
      responseText = "Goodbye! Come back when you're hungry!";
    }
    else if (lowerPrompt.includes('name') && (lowerPrompt.includes('your') || lowerPrompt.includes('who'))) {
      responseText = "I'm Flavi, your personal culinary assistant.";
    }

    // App Specific Queries
    else if (lowerPrompt.includes('offer') || lowerPrompt.includes('coupon') || lowerPrompt.includes('discount') || lowerPrompt.includes('code')) {
      responseText = "We have some great deals running! Check the 'Offers' page for flat 50% OFF and free delivery codes.";
    }
    else if (lowerPrompt.includes('delivery') || lowerPrompt.includes('time') || lowerPrompt.includes('long')) {
      responseText = "Our standard delivery time is 30-45 minutes. We prioritize getting your food to you hot and fresh!";
    }
    else if (lowerPrompt.includes('payment') || lowerPrompt.includes('pay') || lowerPrompt.includes('card') || lowerPrompt.includes('cash')) {
      responseText = "We accept all major Credit/Debit Cards, UPI, and Cash on Delivery. You can choose your method at checkout.";
    }
    else if (lowerPrompt.includes('refund') || lowerPrompt.includes('cancel')) {
      responseText = "For refunds or cancellations, please go to 'My Orders' and select the specific order for help, or contact support.";
    }
    else if (lowerPrompt.includes('location') || lowerPrompt.includes('where')) {
      responseText = "We deliver across the city! You can enter your address at checkout to confirm availability.";
    }

    // Food Categories (Fallback if frontend local search didn't catch it)
    else if (lowerPrompt.includes('veg') && !lowerPrompt.includes('non')) {
      responseText = "We have a wide range of pure vegetarian dishes. Try our Paneer Tikka or Veggie Supreme Pizza!";
    }
    else if (lowerPrompt.includes('non-veg') || lowerPrompt.includes('chicken') || lowerPrompt.includes('meat')) {
      responseText = "Our non-veg selection is top-notch. The Chicken Biryani and BBQ Wings are customer favorites.";
    }
    else if (lowerPrompt.includes('healthy') || lowerPrompt.includes('diet') || lowerPrompt.includes('salad')) {
      responseText = "Watching your calories? We have fresh Greek Salads and Protein Bowls available.";
    }

    // Default Fallback
    else {
      const fallbacks = [
        "That sounds interesting! You can try searching for that item in the search bar above.",
        "I'm mostly an expert on our menu. Try asking about 'burgers', 'pizza', or 'offers'!",
        "I didn't quite catch that, but I'm sure we have something tasty for you. Have you checked our 'Explore' section?",
        "My food knowledge is vast, but I'm not sure about that specific request. Maybe try browsing our 'Restaurants'?"
      ];
      responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Simulate a slight delay to feel like "thinking"
    await new Promise(resolve => setTimeout(resolve, 500));

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(200).json({ response: "My brain froze for a second! Could you say that again?" });
  }
};

export default { chat };
