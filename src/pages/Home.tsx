import React, { useState, useEffect } from "react";
import {
  Search,
  Loader,
  Sparkles,
  Clock,
  Database,
  Filter,
} from "lucide-react";
import { SoftwareCard } from "../components/SoftwareCard";
import { getSuggestions, getSoftware } from "../lib/gemini";
import debounce from "lodash/debounce";

interface TaskDescriptionInputProps {
  taskDescription: string;
  setTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  descriptionSuggestions: string[];
  layout?: "default" | "compact";
}

interface Filters {
  platform: string;
  pricing: string;
}

const TaskDescriptionInput: React.FC<TaskDescriptionInputProps> = ({
  taskDescription,
  setTaskDescription,
  handleSearch,
  descriptionSuggestions,
  layout = "default",
}) => {
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] =
    useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  return (
    <div
      className={`${layout === "default" ? "" : "mb-8"} bg-white rounded-lg shadow p-6`}
    >
      <div className={layout === "default" ? "mb-6" : "grid grid-cols-1 gap-6"}>
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-2">
            {layout === "default"
              ? "Describe your task or requirements"
              : "Task Description"}
          </label>
          <div className={layout === "default" ? "relative" : "flex gap-4"}>
            <div
              className={layout === "compact" ? "relative flex-1" : "relative"}
            >
              <textarea
                placeholder="e.g., I need to edit videos for YouTube, with color correction and audio editing capabilities..."
                className={`${
                  layout === "default" ? "p-6 h-32" : "p-2 h-20"
                } w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                value={taskDescription}
                onChange={(e) => {
                  setTaskDescription(e.target.value);
                  setShowDescriptionSuggestions(true);
                  setSelectedIndex(-1);
                }}
                onFocus={() => setShowDescriptionSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowDescriptionSuggestions(false), 200)
                }
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                      prev < descriptionSuggestions.length - 1 ? prev + 1 : 0,
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                      prev > 0 ? prev - 1 : descriptionSuggestions.length - 1,
                    );
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (selectedIndex >= 0) {
                      setSelectedIndex(-1);
                      setTaskDescription(descriptionSuggestions[selectedIndex]);
                      setShowDescriptionSuggestions(false);
                    } else if (taskDescription.trim()) {
                      handleSearch();
                    }
                  }
                }}
              />
              {showDescriptionSuggestions &&
                descriptionSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                    {descriptionSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                          selectedIndex === index ? "bg-gray-200" : ""
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setTaskDescription(suggestion);
                          setShowDescriptionSuggestions(false);
                          setSelectedIndex(-1);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
            </div>
            {layout === "compact" ? (
              <button
                onClick={handleSearch}
                className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {layout === "default" ? (
        <button
          onClick={handleSearch}
          disabled={!taskDescription.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="w-5 h-5 mr-2" />
          Find Software
        </button>
      ) : null}
    </div>
  );
};

interface HomeProps {
  hasSearched: boolean;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Home({ hasSearched, setHasSearched }: HomeProps) {
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [software, setSoftware] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    platform: "all",
    pricing: "all",
  });
  const [searchTime, setSearchTime] = useState<number>(0);

  const uniquePlatforms = Array.from(
    new Set(software.flatMap((sw) => sw.platforms)),
  ).sort();
  const uniquePricing = Array.from(
    new Set(software.map((sw) => sw.pricing)),
  ).sort();
  useEffect(() => {
    if (!hasSearched) {
      setTaskDescription(""); // Reset taskDescription to empty
    }
  }, [hasSearched]);
  useEffect(() => {
    const fetchSuggestions = debounce(async () => {
      if (taskDescription.length >= 3) {
        try {
          const suggestions = await getSuggestions(taskDescription);
          setDescriptionSuggestions(suggestions?.suggestions ?? []);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setDescriptionSuggestions([]);
      }
    }, 500); // Wait 500ms before making the API request

    fetchSuggestions();

    return () => fetchSuggestions.cancel(); // Cleanup to prevent unnecessary calls
  }, [taskDescription]);

  const handleSearch = async () => {
    if (!taskDescription) return;
    setIsLoading(true);
    setHasSearched(true);

    const startTime = performance.now();
    try {
      const results = await getSoftware(taskDescription);
      setSoftware(results);
    } catch (error) {
      console.error("Error Fetching Software:", error);
    }
    const endTime = performance.now();
    setSearchTime(endTime - startTime);

    setIsLoading(false);
  };

  const filteredSoftware = software.filter((sw) => {
    const matchesPlatform =
      filters.platform === "all" || sw.platforms.includes(filters.platform);
    const matchesPricing =
      filters.pricing === "all" || sw.pricing === filters.pricing;

    return matchesPlatform && matchesPricing;
  });

  const isFiltered = filters.platform !== "all" || filters.pricing !== "all";

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
            <TaskDescriptionInput
              taskDescription={taskDescription}
              setTaskDescription={setTaskDescription}
              handleSearch={handleSearch}
              descriptionSuggestions={descriptionSuggestions}
              layout="default"
            />
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
              <TaskDescriptionInput
                taskDescription={taskDescription}
                setTaskDescription={setTaskDescription}
                handleSearch={handleSearch}
                descriptionSuggestions={descriptionSuggestions}
                layout="compact"
              />

              {/* Filters Section with Results Summary */}
              <div className="mb-8 bg-white rounded-lg shadow p-6">
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-gray-600">
                      <Database className="w-5 h-5 mr-2 text-blue-500" />
                      <span>
                        Found{" "}
                        <span className="font-semibold text-gray-900">
                          {software.length}
                        </span>{" "}
                        results
                        {isFiltered && (
                          <>
                            <span className="mx-2">•</span>
                            <Filter className="w-4 h-4 inline mr-1 text-purple-500" />
                            <span>
                              Showing{" "}
                              <span className="font-semibold text-gray-900">
                                {filteredSoftware.length}
                              </span>
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2 text-green-500" />
                      <span>
                        Search completed in{" "}
                        <span className="font-semibold text-gray-900">
                          {(searchTime / 1000).toFixed(2)}
                        </span>{" "}
                        seconds
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform
                    </label>
                    <select
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.platform}
                      onChange={(e) =>
                        setFilters({ ...filters, platform: e.target.value })
                      }
                    >
                      <option value="all">All Platforms</option>
                      {uniquePlatforms.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pricing
                    </label>
                    <select
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.pricing}
                      onChange={(e) =>
                        setFilters({ ...filters, pricing: e.target.value })
                      }
                    >
                      <option value="all">All Pricing Types</option>
                      {uniquePricing.map((pricing) => (
                        <option key={pricing} value={pricing}>
                          {pricing}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {filteredSoftware.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSoftware.map((sw) => (
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
