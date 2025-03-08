import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
export interface Software {
  id: string;
  name: string;
  category: 'productivity' | 'development' | 'design' | 'communication' | 'business' | 'multimedia';
  description: string;
  pricing: 'free' | 'freemium' | 'paid' | 'subscription';
  platforms: string[];
  features: string[];
  bestFor: string[];
  alternatives: string[];
  learningCurve: 1 | 2 | 3 | 4 | 5; // 1 = Easy, 5 = Hard
  imageUrl: string;
  priceRange?: string;
}
export async function getSuggestions(input: string): Promise<string[]> {
  if (!input.trim()) return [];
  return []
  try {
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
    const prompt = `Given this partial task description: "${input}"
  Suggest 5 ways to complete this thought, focusing on software-related tasks.
  Return only the suggestions as a JSON array of strings.
  Make suggestions specific and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response();
    const text = await response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }

}
export async function analyzeSoftwareNeeds(description: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
Generate a structured JSON output for software recommendations based on the given task description:  
'${description}'

### Output Format:
Each software recommendation should be an object with the following attributes:

- **id** (integer): The index of the result.
- **name** (string): The official name of the software.
- **category** (string): One of the following categories:  
  - 'Productivity' | 'Development' | 'Design' | 'Communication' | 'Business' | 'Multimedia'
- **description** (string): A brief overview of the software.
- **officialWebsite** (string): The official website of the software. If unavailable, return 'N/A'.
- **pricing** (string): One of the following options:  
  - 'Free' | 'Freemium' | 'Paid' | 'Subscription' | 'N/A'
- **priceRange** (string): The price in the original currency and its equivalent in LKR (if applicable).  
  Example: '$50/month (~LKR 15,000)' or 'Free'.
- **platforms** (array of strings): Supported platforms, e.g., ['Windows', 'macOS', 'Linux']. Use 'N/A' if unknown.
- **features** (array of strings): Key features of the software. Example: ['Video Editing', 'Color Correction'].
- **bestFor** (array of strings): Ideal user groups. Example: ['Content Creators', 'Professional Editing'].
- **alternatives** (array of strings): Alternative software options. Example: ['Adobe Premiere Pro', 'Final Cut Pro']. Use 'N/A' if unknown.
- **imageUrl** (string): A direct URL to an official or representative image. Use 'N/A' if unavailable.

### Guidelines:
- Convert pricing to LKR where applicable.
- Ensure all missing values are replaced with 'N/A'.
- Output **only** a valid JSON array, without additional text or explanations.
- Provide **at least 5 software recommendations** to ensure a wide variety of options.
`;



      const result = await model.generateContent(prompt);
    console.log(result)
    const match = result.response?.candidates?.[0]?.content?.parts?.[0]?.text.match(/\[.*\]/s);
    const jsonData = match ? JSON.parse(match[0]) : null;

    if (!jsonData) return res.status(500).json({ error: "Invalid JSON response from AI" });

    // Convert prices and validate website links
    const processedData = jsonData.map((software) => ({
      ...software,
      official_website: software.official_website?.startsWith("http") ? software.official_website : "N/A",
    }));
    console.log("data",processedData)


    return processedData;
  } catch (error) {
    console.error("Error analyzing software needs:", error);
    return null;
  }
}

