import React from "react";
import { Globe, Github } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              About Software Advisor
            </h1>
            <p className="text-xl text-blue-100">
              Helping you find the perfect software for your needs
            </p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Software Advisor is a project developed with the goal of
                simplifying the software discovery process. In today's digital
                world, finding the right tools can be overwhelming. Our platform
                helps users navigate through various software options by
                understanding their specific needs and requirements, making it
                easier to find the perfect solution.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <div className="space-y-4 text-gray-600 mb-8">
                <p className="text-lg leading-relaxed">
                  Simply describe your needs or requirements, and our
                  intelligent system will analyze your input to suggest the most
                  suitable software options. You can further refine your search
                  using filters for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Categories (Development, Design, Productivity, etc.)</li>
                  <li>Pricing models (Free, Freemium, Paid, Subscription)</li>
                  <li>Platforms (Windows, macOS, Linux, Web, Mobile)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About This Project
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Software Advisor is a project developed for personal learning.
                It was built using the Gemini API and other generative AI tools
                to create a system that can recommend the most suitable software
                based on users' needs. This project served as an opportunity to
                explore AI technologies, specifically in prompt engineering and
                working with powerful APIs to create a functional, user-friendly
                web application.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed">
                Developed by Roy Nesarajah Viththagan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                <a
                  href="https://rnviththagan.github.io/me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  <span>Visit Portfolio</span>
                </a>
                <a
                  href="https://github.com/RNViththagan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <Github className="h-5 w-5 mr-2" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>© 2025 Software Advisor. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
