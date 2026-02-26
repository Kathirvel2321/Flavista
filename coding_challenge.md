# Flavista Coding Challenge: Budget-Aware AI

## Context
You are a Full Stack Developer working on **Flavista**. The Product Manager has noticed that many users are asking the AI Assistant for affordable food options, but the current AI (Flavi) doesn't understand price constraints.

## Objective
Implement a feature that allows users to ask for food within a specific budget (e.g., "Show me food under ₹200") and receive appropriate recommendations.

---

## Task 1: Backend Logic (Node.js)
**File:** `backend/src/controllers/aiController.js`

Modify the `chat` controller to detect price-related queries.

**Requirements:**
1.  Detect phrases like "under [amount]", "below [amount]", or "cheaper than [amount]".
2.  Extract the numeric value (the budget).
3.  Assume you have access to a Mongoose model named `Food` with a schema `{ name: String, price: Number }`.
4.  Write a query to fetch up to 3 items within that budget.
5.  Return a response string listing the items found, or a message if nothing is found.

**Example Input:**
`{ "prompt": "I want something under 150" }`

**Expected Logic (Pseudo-code):**
```javascript
if (prompt contains number AND "under/below") {
   const budget = extractNumber(prompt);
   const foods = await Food.find({ price: { $lte: budget } }).limit(3);
   // Format response...
}
```

---

## Task 2: Frontend UI (React)
**File:** `Frontend/src/components/AiAssistant.jsx`

Update the AI Assistant UI to make this feature discoverable.

**Requirements:**
1.  Add a new "Budget Finds 💰" button to the `options` array in the `AiAssistant` component.
2.  When clicked, it should trigger a prompt asking the user: *"What is your budget?"* OR automatically send a query like *"Find food under ₹200"* (for simplicity, you can hardcode a value or prompt for input).

---

## Task 3: Edge Case Handling

How would you handle the following scenarios? (Explain briefly in comments)
1.  User types "under 10 rupees" (Too low, likely no results).
2.  User types "under one hundred" (Word instead of number).

---

## Evaluation Criteria
*   **Regex Usage:** Ability to extract data from natural language strings.
*   **Database Querying:** Correct use of Mongoose operators (`$lte`).
*   **User Experience:** How the bot responds when no food is found.
*   **Code Style:** Clean, readable, and consistent with the existing codebase.

---

## Starter Code Snippets

**Current `aiController.js` snippet:**
```javascript
// ... existing logic
else if (lowerPrompt.includes('offer') || ...) {
  responseText = "We have some great deals...";
}
// TODO: Add Budget Logic Here
else {
  // Fallback
}
```

Good luck!