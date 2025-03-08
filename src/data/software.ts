export interface Software {
  id: number; // Integer for the index of the result
  name: string; // Official name of the software
  category: 'Productivity' | 'Development' | 'Design' | 'Communication' | 'Business' | 'Multimedia'; // Category of the software
  description: string; // Brief overview of the software
  officialWebsite: string; // Official website of the software
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Subscription' | 'N/A'; // Pricing model
  priceRange?: string; // Price in the original currency and its equivalent in LKR (if applicable)
  platforms: string[]; // Supported platforms
  features: string[]; // Key features of the software
  bestFor: string[]; // Ideal user groups
  alternatives: string[]; // Alternative software options
  imageUrl: string; // URL to an official or representative image
}
