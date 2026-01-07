import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkWriting = async (text: string, topic: string): Promise<any> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  const prompt = `
    Act as a strict TOEIC Writing Examiner. 
    Topic: "${topic}"
    Student Submission: "${text}"
    
    Analyze the submission. 
    Return a JSON object with the following schema:
    {
      "estimatedScore": integer (0-200),
      "correctedText": string (the full text with grammar fixed),
      "critique": string (concise feedback on grammar and coherence),
      "betterVocab": array of strings (3-5 advanced words/phrases they could have used)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedScore: { type: Type.INTEGER },
            correctedText: { type: Type.STRING },
            critique: { type: Type.STRING },
            betterVocab: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Writing Error:", error);
    throw error;
  }
};

export const getSpeakingQuestion = async (): Promise<string> => {
  if (!process.env.API_KEY) return "Describe a picture of a busy office."; // Fallback

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a single, random TOEIC Speaking Part 2 or Part 3 question. Return ONLY the question text.",
    });
    return response.text?.trim() || "Describe your favorite hobby.";
  } catch (e) {
    return "What are the advantages of working from home?";
  }
};

export const checkSpeaking = async (question: string, transcript: string): Promise<any> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  const prompt = `
    Question: "${question}"
    Spoken Answer Transcript: "${transcript}"
    
    Evaluate this response for a TOEIC Speaking test.
    Return JSON:
    {
      "fluencyScore": integer (1-10),
      "relevanceScore": integer (1-10),
      "feedback": string (short advice),
      "sampleAnswer": string (a high-scoring example answer for this question)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fluencyScore: { type: Type.INTEGER },
            relevanceScore: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            sampleAnswer: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Speaking Error:", error);
    throw error;
  }
};

export const generateDailyTopic = async (): Promise<string> => {
    if (!process.env.API_KEY) return "Business Travel";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate a short, engaging topic phrase for English study today (e.g., 'Office Politics', 'Renewable Energy', 'Client Negotiations'). Return ONLY the topic.",
        });
        return response.text?.trim() || "Global Trade";
    } catch (e) {
        return "Workplace Safety";
    }
}