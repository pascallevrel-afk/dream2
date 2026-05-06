import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";

// Initialize the client. 
// Note: process.env.API_KEY is handled by the build environment/runtime.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Clean up the base64 string if it includes the data URL prefix.
 */
const stripBase64Prefix = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
};

/**
 * Generates a redesigned bedroom image based on an original image and a prompt.
 */
export const generateBedroomDesign = async (
  base64Image: string,
  promptText: string
): Promise<string> => {
  
  const cleanBase64 = stripBase64Prefix(base64Image);

  try {
    const fullPrompt = `
      You are an expert interior designer. 
      Task: Redesign the bedroom in the image provided.
      Style Instruction: ${promptText}.
      
      Constraints:
      1. Maintain the structural layout of the room (walls, windows, door positions) and perspective.
      2. If a bed is not clearly visible, you MUST add a bed that matches the style.
      3. The result must be a high-quality, photorealistic image.
      4. Do not output any text, only the image.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Standardizing on jpeg for API simplicity, usually works for png too
            },
          },
        ],
      },
    });

    // Extract the image from the response
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }
    
    throw new Error("No image generated.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates a response for the chat, potentially with a new image design.
 */
export const generateChatDesign = async (
  originalBase64: string,
  chatHistory: string,
  userInstruction: string
): Promise<{ textResponse: string; imageBase64: string | null }> => {
  
  const cleanBase64 = stripBase64Prefix(originalBase64);

  try {
    const prompt = `
      You are a helpful interior design assistant named DreamSpace.
      
      Context: The user is refining a bedroom design.
      History of changes: ${chatHistory}
      Current User Request: "${userInstruction}"

      Instructions:
      1. If the user asks for a visual change (e.g., "change walls to blue", "add a lamp"), generate a new version of the image applying these changes while keeping the original room layout.
      2. If the user just asks a question (e.g., "what colors go with blue?"), answer textually.
      
      Output Requirement:
      - Always provide a short, friendly text response describing what you did.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: 'image/jpeg',
              },
            }
        ]
      }
    });

    let textResponse = "Here is your new design.";
    let imageBase64: string | null = null;

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                textResponse = part.text;
            }
            if (part.inlineData && part.inlineData.data) {
                imageBase64 = `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    return { textResponse, imageBase64 };

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};
