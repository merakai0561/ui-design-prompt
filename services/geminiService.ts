import { GoogleGenAI } from "@google/genai";

export const refinePromptWithGemini = async (
  currentPrompt: string, 
  model: string = 'gemini-2.5-flash', 
  customApiKey?: string,
  customBaseUrl?: string
): Promise<string> => {
  // Prioritize custom key if provided, otherwise fallback to env variable
  // Trim to remove accidental whitespace
  const apiKey = (customApiKey || process.env.API_KEY || "").trim();
  
  if (!apiKey) {
    console.error("API Key is missing. Please set process.env.API_KEY or provide a custom key.");
    throw new Error("API Key is missing");
  }

  // Initialize the client with the key and optional base URL (proxy)
  // Using 'any' for options to avoid strict type issues if the SDK definition varies
  const clientOptions: any = { apiKey };
  if (customBaseUrl && customBaseUrl.trim()) {
    clientOptions.baseUrl = customBaseUrl.trim();
  }

  const ai = new GoogleGenAI(clientOptions);

  if (!currentPrompt.trim()) {
    return "";
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are an expert AI Art Prompt Engineer for Midjourney and Stable Diffusion. 
      Refine the following UI design prompt to be more descriptive, high-quality, and professional.
      Keep the core meaning but enhance the adjectives and technical terms related to UI/UX design.
      Return ONLY the refined English prompt string. Do not include any introduction or markdown.
      
      Input Prompt: "${currentPrompt}"`,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};