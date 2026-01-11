
import { GoogleGenAI } from "@google/genai";

// solveNaturalLanguageMath uses the Gemini API to solve math problems described in natural language.
export const solveNaturalLanguageMath = async (prompt: string): Promise<string> => {
  // Always use the process.env.API_KEY exclusively and directly.
  // We initialize the client inside the function to ensure the most up-to-date environment configuration is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Solve this math problem or query: "${prompt}". Provide a concise numerical answer first, followed by a very brief explanation if necessary. Format the response as plain text.`,
      config: {
        temperature: 0.1,
        topP: 0.95,
        // Avoid setting maxOutputTokens unless strictly necessary to prevent unexpected blocked responses.
      },
    });

    // The .text property is a getter that returns the extracted string output.
    return response.text || "I couldn't calculate that. Please try another query.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to reach the AI assistant.";
  }
};
