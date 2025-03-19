import { GoogleGenerativeAI } from "@google/generative-ai";
import { Software } from "../data/software.ts";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const geminiModel = "gemini-2.0-flash";

export async function getSuggestions(input: string): Promise<string[]> {
  if (!input.trim()) return { completed_text: input, suggestions: [] };

  try {
    const model = genAI.getGenerativeModel({ model: geminiModel });

    // AI prompt ensuring only the missing words are suggested
    const prompt = `
      You are an AI assistant specializing in software-related text completion.
      Your job is to:
        1. **Correct any spelling mistakes** in the provided input while keeping the meaning intact.  
        2. **Preserve the corrected input exactly as it is.**  
        3. **Only suggest the missing words or phrases** to complete the sentence.  
        4. **Ensure the completion remains software-specific and relevant.**  
        5. **Generate three alternative completions, all strictly software-related.**  
        6. **Provide a structured JSON output.** 

      ### **Rules:**
      - Do not modify or reword the input.
      - Only append the missing words to complete the sentence meaningfully.
      - Keep the response structured and concise.

      ### **User Input:**
      "${input}"

      **Expected JSON Output:**
      {
        "completed_text": "User input + suggested completion",
        "suggestions": [
          "User input + Alternative completion 1",
          "User input + Alternative completion 2",
          "User input + Alternative completion 3"
        ]
      }
    `;

    const result = await model.generateContent(prompt);

    // Extract JSON response safely
    const rawText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Remove Markdown code block if present
    const match = rawText?.match(/```json\s*([\s\S]*?)\s*```/);

    const jsonText = match ? match[1] : rawText; // Extract only the JSON part

    try {
      const data = jsonText ? JSON.parse(jsonText) : null;
      console.log("data ", data);

      if (!data || !data.completed_text || !Array.isArray(data.suggestions)) {
        console.error("Invalid JSON response from AI");
        return { completed_text: input, suggestions: [] };
      }

      return data;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return { completed_text: input, suggestions: [] };
    }
  } catch (error) {
    console.error("Error generating completion:", error);
    return { completed_text: input, suggestions: [] };
  }
}

export async function getSoftware(description: string): Promise<any> {
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
