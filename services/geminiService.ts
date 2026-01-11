
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveNaturalLanguageMath = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Solve this math problem or query: "${prompt}". Provide a concise numerical answer first, followed by a very brief explanation if necessary. Format the response as plain text.`,
      config: {
        temperature: 0.1,
        topP: 0.95,
        maxOutputTokens: 256,
      },
    });

    return response.text || "I couldn't calculate that. Please try another query.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to reach the AI assistant.";
  }
};
