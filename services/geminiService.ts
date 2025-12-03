import { GoogleGenAI } from "@google/genai";
import { ACCOUNTS, RECENT_TRANSACTIONS } from '../constants';

// Initialize Gemini Client
// Support both Vite's import.meta.env and Node's process.env
// @ts-ignore
const apiKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) || (typeof process !== 'undefined' && process.env && process.env.API_KEY) || ''; 

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are Meridian AI, a highly sophisticated financial concierge for a high-net-worth individual named Howard Woods.
You have access to the user's current accounts and recent transactions.
Your tone should be professional, concise, private-banking level, and helpful.
Do not make up data that isn't provided in the context.
If asked about the portfolio, summarize the accounts provided.
If asked about specific spending, refer to the transactions list.

Context Data:
User: Howard Woods
Accounts: ${JSON.stringify(ACCOUNTS)}
Recent Transactions: ${JSON.stringify(RECENT_TRANSACTIONS)}
`;

export const getFinancialInsight = async (userPrompt: string): Promise<string> => {
  if (!apiKey) {
    // Graceful fallback if no key is present in demo mode
    return "I am currently running in demo mode. Please configure an API Key to enable live insights.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    return response.text || "I apologize, I could not generate an insight at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently unable to access the financial networks. Please try again later.";
  }
};