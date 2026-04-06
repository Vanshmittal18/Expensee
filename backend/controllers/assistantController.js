const Expense = require("../models/Expense");
const Income = require("../models/Income");

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini(userQuery) {
  try {
    // Initialize the model (ensure genAI is securely initialized elsewhere with your API key)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const systemPrompt = `
                        You are FinMate — a polite, concise, and professional financial assistant.
                        You help users understand their personal finance data such as income, expenses, balance, and savings.

                        Guidelines:
                        - Give clear, human-like answers (2–5 sentences maximum).
                        - Use bullet points or short paragraphs for clarity.
                        - Always format numbers with commas and proper currency symbols if relevant.
                        - Be polite and direct — avoid filler words.
                        - All transactions are in INR.
                        - If the user asks anything unrelated to personal finance (like coding, jokes, or random questions),
                        respond with a short, polite refusal such as:
                        "I'm here to help only with financial insights. Could you please ask something related to your finances?"
                        `;

    const prompt = `
                    ${systemPrompt}

                    User Query: "${userQuery}"

                    Based on the provided financial summary and context, respond accordingly.
                    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();

  } catch (error) {
    if (error.message.includes('429') || error.status === 429) {
      console.error("❌ Free tier rate limit reached. Please wait before trying again.");
    } else {
      console.error("Error calling Gemini API:", error);
    }
    return null; 
  }
}

exports.getResponseFromGPT = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    const prompt = `User ID: ${userId}\n\nFinancial Summary:\nExpenses: ${JSON.stringify(
      expenses
    )}\nIncomes: ${JSON.stringify(incomes)}\n\nQuery: ${req.body.query}`;
const gptResponse = await callGemini(prompt);
res.status(200).json({ response: gptResponse });
}catch (error) {
    console.error("Error getting response from GPT:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
