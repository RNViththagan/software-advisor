import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader, Sparkles } from 'lucide-react';
import { Software } from '../data/software';
import { SoftwareCard } from '../components/SoftwareCard';
import { getSuggestions, analyzeSoftwareNeeds } from '../lib/gemini';
import debounce from 'lodash/debounce';

export function Home() {
  const [filters, setFilters] = useState({
    category: 'all',
    pricing: 'all',
    platform: 'all'
  });
  const [search, setSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<string[]>([]);
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const allPlatforms: any[] = ["Android", "iOS"];
  const [software,setSoftware] = useState([]);

  const debouncedGetSuggestions = useRef(
    debounce(async (input: string) => {
      const suggestions = await getSuggestions(input);
      setDescriptionSuggestions(suggestions);
    }, 500)
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (descriptionRef.current && !descriptionRef.current.contains(event.target as Node)) {
        setShowDescriptionSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      console.log("Analysic",analysis);
      setSoftware(analysis);
    } catch (error) {
      console.error('Error analyzing needs:', error);
    }

    setIsLoading(false);
  };

  // const filteredSoftware = software.filter(sw => {
  //   const matchesSearch = !search ||
  //     sw.name.toLowerCase().includes(search.toLowerCase()) ||
  //     sw.description.toLowerCase().includes(search.toLowerCase()) ||
  //     sw.features.some(f => f.toLowerCase().includes(search.toLowerCase())) ||
  //     sw.bestFor.some(b => b.toLowerCase().includes(search.toLowerCase()));
  //
  //   const matchesCategory = filters.category === 'all' || sw.category === filters.category;
  //   const matchesPricing = filters.pricing === 'all' || sw.pricing === filters.pricing;
  //   const matchesPlatform = filters.platform === 'all' || sw.platforms.includes(filters.platform);
  //
  //   let matchesAiAnalysis = true;
  //   if (aiAnalysis) {
  //     matchesAiAnalysis = aiAnalysis.features.some((feature: string) =>
  //       sw.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
  //     );
  //   }
  //
  //   return matchesSearch && matchesCategory && matchesPricing && matchesPlatform && matchesAiAnalysis;
  // });

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
              Describe your needs and we'll help you discover the best tools for your requirements.
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
                    className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={taskDescription}
                    onChange={(e) => {
                      setTaskDescription(e.target.value);
                      setShowDescriptionSuggestions(true);
                    }}
                    onFocus={() => setShowDescriptionSuggestions(true)}
                  />
                  {showDescriptionSuggestions && descriptionSuggestions.length > 0 && (
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
              <span className="ml-3 text-lg text-gray-600">Analyzing your requirements...</span>
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
                          className="w-full h-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={taskDescription}
                          onChange={(e) => {
                            setTaskDescription(e.target.value);
                            setShowDescriptionSuggestions(true);
                          }}
                          onFocus={() => setShowDescriptionSuggestions(true)}
                        />
                        {showDescriptionSuggestions && descriptionSuggestions.length > 0 && (
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
                      <button
                        onClick={handleSearch}
                        className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative" ref={searchRef}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search within results..."
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value="all">All Categories</option>
                      <option value="productivity">Productivity</option>
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="communication">Communication</option>
                      <option value="business">Business</option>
                      <option value="multimedia">Multimedia</option>
                    </select>

                    <select
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.pricing}
                      onChange={(e) => setFilters({ ...filters, pricing: e.target.value })}
                    >
                      <option value="all">All Pricing Types</option>
                      <option value="free">Free</option>
                      <option value="freemium">Freemium</option>
                      <option value="paid">Paid</option>
                      <option value="subscription">Subscription</option>
                    </select>

                    <select
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.platform}
                      onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                    >
                      <option value="all">All Platforms</option>
                      {allPlatforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/*{aiAnalysis && (*/}
              {/*  <div className="mb-8 bg-white rounded-lg shadow p-6">*/}
              {/*    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>*/}
              {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">*/}
              {/*      <div>*/}
              {/*        <h4 className="font-medium text-gray-700 mb-2">Key Features Needed:</h4>*/}
              {/*        <ul className="list-disc pl-4 space-y-1">*/}
              {/*          {aiAnalysis.features.map((feature: string, index: number) => (*/}
              {/*            <li key={index} className="text-gray-600">{feature}</li>*/}
              {/*          ))}*/}
              {/*        </ul>*/}
              {/*      </div>*/}
              {/*      <div>*/}
              {/*        <h4 className="font-medium text-gray-700 mb-2">Best For:</h4>*/}
              {/*        <ul className="list-disc pl-4 space-y-1">*/}
              {/*          {aiAnalysis.bestFor.map((user: string, index: number) => (*/}
              {/*            <li key={index} className="text-gray-600">{user}</li>*/}
              {/*          ))}*/}
              {/*        </ul>*/}
              {/*      </div>*/}
              {/*      <div>*/}
              {/*        <h4 className="font-medium text-gray-700 mb-2">Recommended Platforms:</h4>*/}
              {/*        <ul className="list-disc pl-4 space-y-1">*/}
              {/*          {aiAnalysis.platforms.map((platform: string, index: number) => (*/}
              {/*            <li key={index} className="text-gray-600">{platform}</li>*/}
              {/*          ))}*/}
              {/*        </ul>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*)}*/}

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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matching software found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or filters to find more options.
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