import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTacticalIntel = async (route: string, situation: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following tactical situation for a driver using the REY Process.
    Route: ${route}
    Situation: ${situation}
    Provide:
    1. Immediate threat assessment
    2. Recommended "Ghost Route" (encrypted path).
    Format as Markdown.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text;
};

export const createTacticalChat = async (message: string) => {
  const chat = await ai.chats.create({
    model: 'gemini-3.1-pro-preview',
    config: {
      systemInstruction:
        "You are the REY Process Tactical console. You respond with high-fidelity, tactical precision. Your tone is calm, authoritative, and rooted in the 'Peace, be still' philosophy of Mark 4:39. You manage biometric locks and sovereign navigation routes.",
    },
  });
  const response = await chat.sendMessage({ message });
  return response.text;
};
