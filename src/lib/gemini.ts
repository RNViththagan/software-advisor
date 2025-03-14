import { GoogleGenerativeAI } from "@google/generative-ai";
import { Software } from "../data/software.ts";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const geminiModel = "gemini-2.0-flash";
export async function getSuggestions(input: string): Promise<string[]> {
  if (!input.trim()) return []; // Return empty array if input is empty or whitespace

  try {
    const model = genAI.getGenerativeModel({ model: geminiModel });

    const prompt = `Given the following partial task description: "${input}",  
Suggest 5 short, actionable completions or clarifications to help finish this description.  
Each completion should help clarify the task and make it more specific or actionable, and should focus on software-related actions, tools, or steps.  
Return only the suggestions as a JSON array of strings. Each suggestion should be concise, ideally a few words, helping to complete or refine the user's task description.`;

    const result = await model.generateContent(prompt);

    const match =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text.match(
        /\[.*\]/s,
      );
    const suggestions = match ? JSON.parse(match[0]) : null;

    if (!suggestions) {
      console.error("Invalid JSON response from AI");
      return []; // Return empty array if no valid suggestions
    }
    return suggestions;
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return []; // Return empty array in case of error
  }
}

export async function analyzeSoftwareNeeds(description: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: geminiModel });
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
    const match =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text.match(
        /\[.*\]/s,
      );
    const jsonData = match ? JSON.parse(match[0]) : null;

    if (!jsonData)
      return res.status(500).json({ error: "Invalid JSON response from AI" });

    // Convert prices and validate website links
    const processedData = jsonData.map((software: Software) => ({
      ...software,
      official_website: software.official_website?.startsWith("http")
        ? software.official_website
        : "N/A",
    }));
    return processedData;
  } catch (error) {
    console.error("Error analyzing software needs:", error);
    return null;
  }
}
