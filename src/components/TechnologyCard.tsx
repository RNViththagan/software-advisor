import React from 'react';
import { Star, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Technology } from '../data/technologies';

interface TechnologyCardProps {
  technology: Technology;
}

export function TechnologyCard({ technology }: TechnologyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
      <div className="h-48 overflow-hidden">
        <img 
          src={technology.imageUrl} 
          alt={technology.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{technology.name}</h3>
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
            {technology.category}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{technology.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            <span>Learning Curve: {Array(technology.learningCurve).fill('★').join('')}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            <span>Popularity: {Array(technology.popularity).fill('★').join('')}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            <span>Job Market: {Array(technology.jobMarket).fill('★').join('')}</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
          <div className="flex flex-wrap gap-2">
            {technology.bestFor.map((use, index) => (
              <div key={index} className="flex items-center text-sm bg-gray-100 rounded-full px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                {use}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}