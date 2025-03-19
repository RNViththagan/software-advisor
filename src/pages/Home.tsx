import React, { useState, useEffect, useRef } from "react";
import { Search, Loader, Sparkles } from "lucide-react";
import { SoftwareCard } from "../components/SoftwareCard";
import { getSuggestions, getSoftware } from "../lib/gemini";
import debounce from "lodash/debounce";

const TaskDescriptionInput = ({
  taskDescription,
  setTaskDescription,
  handleSearch,
  descriptionSuggestions,
  layout = "default", // "default" or "compact"
}) => {
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] =
    useState(false);

  return (
    <div
      className={` ${layout === "default" ? "" : "mb-8"} bg-white rounded-lg shadow p-6`}
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
                }}
                onFocus={() => setShowDescriptionSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && taskDescription.trim()) {
                    e.preventDefault();
                    handleSearch();
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
  const [taskDescription, setTaskDescription] = useState("");
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<
    string[]
  >([]);
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
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
      setDescriptionSuggestions(suggestions?.suggestions);
    }, 500),
  ).current;

  useEffect(() => {
    if (taskDescription.length >= 3) {
      debouncedGetSuggestions(taskDescription);
    } else {
      setDescriptionSuggestions([]);
    }
  }, [taskDescription]);

  const handleSearch = async () => {
    if (!taskDescription) return;
    setShowDescriptionSuggestions(false);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const software = await getSoftware(taskDescription);
      setSoftware(software);
    } catch (error) {
      console.error("Error Fetching Software:", error);
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
            <TaskDescriptionInput
              taskDescription={taskDescription}
              setTaskDescription={setTaskDescription}
              handleSearch={handleSearch}
              descriptionSuggestions={descriptionSuggestions}
              layout="default" // or "compact"
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
                layout="compact" // or "compact"
              />

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
