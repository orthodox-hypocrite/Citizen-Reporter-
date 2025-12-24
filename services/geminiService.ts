
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, IssueCategory } from "../types";

export const analyzeCivicIssue = async (
  imageB64: string,
  userDescription: string
): Promise<AIAnalysisResult> => {
  // Always create a fresh instance to ensure we have the latest API Key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageB64.split(',')[1] || imageB64,
            },
          },
          {
            text: `Act as a city infrastructure AI. Analyze this image. User description: "${userDescription}". 
            Task:
            1. Classify: POTHOLE, WATER_LEAK, WASTE_MGMT, STREET_LIGHT, or OTHER.
            2. Severity: Score 1 (low) to 10 (emergency).
            3. Verification: Is this a genuine civic issue? (true/false).
            4. Confidence: 0-100.
            5. Impact: One-sentence summary of hazard.
            
            Return ONLY valid JSON.`
          }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            severity: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            verificationStatus: { type: Type.BOOLEAN },
            estimatedImpact: { type: Type.STRING },
          },
          required: ["category", "severity", "confidence", "verificationStatus", "estimatedImpact"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const data = JSON.parse(text);
    
    // Map string category to enum safely
    let category = IssueCategory.OTHER;
    const catStr = (data.category || '').toUpperCase();
    if (catStr.includes('POTHOLE')) category = IssueCategory.POTHOLE;
    else if (catStr.includes('WATER')) category = IssueCategory.WATER_LEAK;
    else if (catStr.includes('WASTE')) category = IssueCategory.WASTE_MGMT;
    else if (catStr.includes('LIGHT')) category = IssueCategory.STREET_LIGHT;

    return {
      category,
      severity: Number(data.severity) || 5,
      confidence: Number(data.confidence) || 80,
      verificationStatus: data.verificationStatus ?? true,
      estimatedImpact: data.estimatedImpact || "Civic hazard detected."
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
