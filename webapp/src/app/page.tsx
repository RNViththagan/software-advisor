"use client";
import { useState, useEffect, useRef } from "react";

export default function SoftwareSearch() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Fetch auto-complete suggestions using Gemini API
  useEffect(() => {
    if (search.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const prompt = `Suggest 5 software-related search queries based on: '${search}'. Respond with a JSON array.`;
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
            }
        );

        const data = await response.json();
        const match = data?.candidates?.[0]?.content?.parts?.[0]?.text.match(/\[.*\]/s);
        setSuggestions(match ? JSON.parse(match[0]).slice(0, 5) : []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Fetch software recommendations using Gemini API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowSuggestions(false); // Hide suggestions when submitting

    try {
      const prompt = `
            Provide a structured JSON output for software recommendations based on: '${search}'
            Each software should include:
            - id, name, category, description, pricing, platforms, features, bestFor, alternatives, learningCurve, imageUrl, priceRange.
            Output only valid JSON, no extra text.
            `;

      const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
      );

      const data = await response.json();
      const match = data?.candidates?.[0]?.content?.parts?.[0]?.text.match(/\[.*\]/s);
      const parsedData = match ? JSON.parse(match[0]) : null;

      if (!parsedData) throw new Error("Invalid response from AI");
      setResponseData(parsedData);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg shadow-xl">
        {/* 🔍 Search Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="relative">
            <label htmlFor="search" className="block text-xl font-semibold text-gray-800">
              Search Software:
            </label>
            <input
                id="search"
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Enter software task description"
                className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
            {/* 🔹 Search Suggestions (Only show when input is focused) */}
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border rounded mt-1 shadow z-50">
                  {suggestions.map((s, index) => (
                      <li
                          key={index}
                          onMouseDown={() => {
                            setSearch(s);
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {s}
                      </li>
                  ))}
                </ul>
            )}
          </div>

          {/* 🔍 Search Button */}
          <button
              type="submit"
              className="w-full p-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* 🚨 Error Message */}
        {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* 📋 Software Recommendations */}
        {responseData && (
            <div className="mt-8">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Software Recommendations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {responseData.map((software, index) => (
                    <div
                        key={index}
                        className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
                    >
                      <div className="flex flex-col items-center">
                        <img
                            src={software.imageUrl === "N/A"
                                ? "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
                                : software.imageUrl}
                            alt={software.name}
                            className="w-24 h-24 object-contain rounded-md"
                        />
                        <div className="mt-4 text-center">
                          <h3 className="text-xl font-medium text-gray-800">{software.name}</h3>
                          <p className="mt-2 text-lg text-gray-600"><strong>Price:</strong> {software.priceRange}</p>
                          <p className="mt-1 text-lg text-gray-600"><strong>Platforms:</strong> {software.platforms.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
}
