import React, { useState, useEffect, useRef } from 'react';
import { Search, AppWindow, Loader, Github, Globe } from 'lucide-react';
import { software, Software } from './data/software';
import { SoftwareCard } from './components/SoftwareCard';

function App() {
  const [filters, setFilters] = useState({
    category: 'all',
    pricing: 'all',
    platform: 'all'
  });
  const [search, setSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const allPlatforms = Array.from(
    new Set(software.flatMap(s => s.platforms))
  ).sort();

  // Generate search suggestions based on software data
  const generateSuggestions = (query: string): string[] => {
    if (!query) return [];
    const allTerms = new Set([
      ...software.map(sw => sw.name.toLowerCase()),
      ...software.flatMap(sw => sw.features.map(f => f.toLowerCase())),
      ...software.flatMap(sw => sw.bestFor.map(b => b.toLowerCase())),
      ...software.map(sw => sw.category.toLowerCase())
    ]);

    return Array.from(allTerms)
      .filter(term => term.includes(query.toLowerCase()))
      .slice(0, 5);
  };

  useEffect(() => {
    setSearchSuggestions(generateSuggestions(search));
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchesTaskDescription = (sw: Software, task: string): boolean => {
    if (!task) return true;
    const searchTerms = task.toLowerCase().split(' ');
    const relevantFields = [
      sw.name.toLowerCase(),
      sw.description.toLowerCase(),
      ...sw.features.map(f => f.toLowerCase()),
      ...sw.bestFor.map(b => b.toLowerCase())
    ];
    return searchTerms.every(term =>
      relevantFields.some(field => field.includes(term))
    );
  };

  const handleSearch = async (value: string) => {
    setSearch(value);
    setShowSuggestions(false);
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  const filteredSoftware = software.filter(sw => {
    const matchesSearch = search === '' || 
      sw.name.toLowerCase().includes(search.toLowerCase()) ||
      sw.description.toLowerCase().includes(search.toLowerCase()) ||
      sw.features.some(f => f.toLowerCase().includes(search.toLowerCase())) ||
      sw.bestFor.some(b => b.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = filters.category === 'all' || sw.category === filters.category;
    const matchesPricing = filters.pricing === 'all' || sw.pricing === filters.pricing;
    const matchesPlatform = filters.platform === 'all' || sw.platforms.includes(filters.platform);
    const matchesTask = matchesTaskDescription(sw, taskDescription);

    return matchesSearch && matchesCategory && matchesPricing && matchesPlatform && matchesTask;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AppWindow className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Software Advisor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://rnviththagan.github.io/me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Globe className="h-5 w-5 mr-1" />
                <span>Portfolio</span>
              </a>
              <a
                href="https://github.com/RNViththagan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Github className="h-5 w-5 mr-1" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-900 mb-2">
              Describe your task or requirements
            </label>
            <textarea
              placeholder="e.g., I need to edit videos for YouTube, with color correction and audio editing capabilities..."
              className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search software..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                      onClick={() => handleSearch(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">Finding the best software for you...</span>
          </div>
        ) : filteredSoftware.length > 0 ? (
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching software found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find more options.
            </p>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Software Advisor</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Software Advisor is a fun project developed by Roy Nesarajah Viththagan to help users find the perfect software for their needs. 
              This tool makes it easy to discover and compare different software options based on your specific requirements.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>© 2024 Software Advisor</span>
              <span>•</span>
              <a 
                href="https://rnviththagan.github.io/me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Visit Developer's Portfolio
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;