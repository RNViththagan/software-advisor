import { DollarSign, Monitor, Award, Lightbulb, ArrowRight, CheckCircle, Laptop2 } from "lucide-react";
import { Software } from "../data/software";

interface SoftwareCardProps {
  software: Software;
}

export function SoftwareCard({ software }: SoftwareCardProps) {
  return (
      <a
          href={software.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
      >
        <div className="overflow-hidden relative">
          {/* <img src={software.imageUrl} alt={software.name} className="w-full h-full object-cover" /> */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
            {software.category}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{software.name}</h3>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-500 mr-1" />
              <span className="text-sm text-gray-600">{software.pricing}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{software.description}</p>

          {software.priceRange && (
              <div className="mb-4 text-sm text-gray-500">Price Range: {software.priceRange}</div>
          )}

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <Monitor className="w-5 h-5 mr-2 text-blue-500" />
                <h4 className="font-semibold text-gray-900">Platforms</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {software.platforms.map((platform, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                  {platform}
                </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Award className="w-5 h-5 mr-2 text-purple-500" />
                <h4 className="font-semibold text-gray-900">Key Features</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {software.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="flex items-center text-sm bg-purple-50 text-purple-700 rounded-full px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                      {feature}
                </span>
                ))}
                {software.features.length > 3 && (
                    <span className="text-sm text-purple-500">+{software.features.length - 3} more</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                <h4 className="font-semibold text-gray-900">Best For</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {software.bestFor.map((use, index) => (
                    <span key={index} className="text-sm bg-yellow-50 text-yellow-700 rounded-full px-3 py-1">
                  {use}
                </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Laptop2 className="w-5 h-5 mr-2 text-gray-500" />
                <h4 className="font-semibold text-gray-900">Alternatives</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {software.alternatives.map((alt, index) => (
                    <span key={index} className="text-sm text-gray-600 flex items-center">
                  {index > 0 && <ArrowRight className="w-3 h-3 mx-1" />}
                      {alt}
                </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </a>
  );
}
