import React from 'react';
import { Link } from 'react-router-dom';
import { AppWindow, Globe, Github, Info } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <AppWindow className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Software Advisor</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/about"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Info className="h-5 w-5 mr-1" />
              <span>About</span>
            </Link>
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
  );
}