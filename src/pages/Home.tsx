import React, { useState, useEffect, useRef } from "react";
import { Search, Loader, Sparkles } from "lucide-react";
import { Software } from "../data/software";
import { SoftwareCard } from "../components/SoftwareCard";
import { getSuggestions, analyzeSoftwareNeeds } from "../lib/gemini";
import debounce from "lodash/debounce";

interface HomeProps {
  hasSearched: boolean;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Home({ hasSearched, setHasSearched }: HomeProps) {
  const [filters, setFilters] = useState({
    category: "all",
    pricing: "all",
    platform: "all",
  });
  const [search, setSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<
    string[]
  >([]);
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const allPlatforms: any[] = ["Android", "iOS"];
  const [software, setSoftware] = useState([]);

  // Reset taskDescription when hasSearched becomes false
  useEffect(() => {
    if (!hasSearched) {
      setTaskDescription(""); // Reset taskDescription to empty
    }
  }, [hasSearched]); // Depend on hasSearched, so it runs whenever it changes

  const debouncedGetSuggestions = useRef(
    debounce(async (input: string) => {
      const suggestions = await getSuggestions(input);
      setDescriptionSuggestions(suggestions);
    }, 500),
  ).current;

  useEffect(() => {
    if (taskDescription.length >= 3) {
      debouncedGetSuggestions(taskDescription);
    } else {
      setDescriptionSuggestions([]);
    }
  }, [taskDescription]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        descriptionRef.current &&
        !descriptionRef.current.contains(event.target as Node)
      ) {
        setShowDescriptionSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!taskDescription) return;

    setShowSuggestions(false);
    setShowDescriptionSuggestions(false);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const analysis = await analyzeSoftwareNeeds(taskDescription);
      setAiAnalysis(analysis);
      setSoftware(analysis);
    } catch (error) {
      console.error("Error analyzing needs:", error);
    }

    setIsLoading(false);
  };
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {!hasSearched ? (
        <>
          <div className="text-center mb-8">
            <div className="mb-6">
              <Sparkles className="h-16 w-16 text-blue-600 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Software
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Describe your needs and we'll help you discover the best tools for
              your requirements.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6" ref={descriptionRef}>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Describe your task or requirements
                </label>
                <div className="relative">
                  <textarea
                    placeholder="e.g., I need to edit videos for YouTube, with color correction and audio editing capabilities..."
                    className="p-6 w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={taskDescription}
                    onChange={(e) => {
                      setTaskDescription(e.target.value);
                      setShowDescriptionSuggestions(false); // turn on
                    }}
                    onFocus={() => setShowDescriptionSuggestions(false)} // turn on
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && taskDescription.trim()) {
                        e.preventDefault(); // Prevent the default behavior (line break)
                        handleSearch(); // Trigger the search function
                      }
                    }}
                  />
                  {showDescriptionSuggestions &&
                    descriptionSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                        {descriptionSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                            onClick={() => {
                              setTaskDescription(suggestion);
                              setShowDescriptionSuggestions(false);
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!taskDescription.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Software
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-lg text-gray-600">
                Analyzing your requirements...
              </span>
            </div>
          ) : (
            <>
              <div className="mb-8 bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div ref={descriptionRef}>
                    <label className="block text-lg font-medium text-gray-900 mb-2">
                      Task Description
                    </label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <textarea
                          placeholder="e.g., I need to edit videos for YouTube, with color correction and audio editing capabilities..."
                          className="p-2 w-full h-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={taskDescription}
                          onChange={(e) => {
                            setTaskDescription(e.target.value);
                            setShowDescriptionSuggestions(false); // turn on
                          }}
                          onFocus={() => setShowDescriptionSuggestions(false)} // turn on
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && taskDescription.trim()) {
                              e.preventDefault(); // Prevent the default behavior (line break)
                              handleSearch(); // Trigger the search function
                            }
                          }}
                        />
                        {showDescriptionSuggestions &&
                          descriptionSuggestions.length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                              {descriptionSuggestions.map(
                                (suggestion, index) => (
                                  <button
                                    key={index}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                                    onClick={() => {
                                      setTaskDescription(suggestion);
                                      setShowDescriptionSuggestions(false);
                                    }}
                                  >
                                    {suggestion}
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                      <button
                        onClick={handleSearch}
                        className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {software.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {software.map((sw) => (
                    <SoftwareCard key={sw.id} software={sw} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <div className="mb-4">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No matching software found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or filters to find more
                    options.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
