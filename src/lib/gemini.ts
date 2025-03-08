import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getSuggestions(input: string): Promise<string[]> {
  if (!input.trim()) return [];

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Given this partial task description: "${input}"
    Suggest 5 ways to complete this thought, focusing on software-related tasks.
    Return only the suggestions as a JSON array of strings.
    Make suggestions specific and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
}

export async function analyzeSoftwareNeeds(description: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this software requirement: "${description}"
    
    Return a JSON object with:
    1. Main category of software needed
    2. Key features required
    3. Suggested pricing model
    4. Recommended platforms
    5. Type of users it's best for
    
    Format:
    {
      "category": string,
      "features": string[],
      "pricing": string,
      "platforms": string[],
      "bestFor": string[]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing software needs:', error);
    return null;
  }
}