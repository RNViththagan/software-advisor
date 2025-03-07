export interface Software {
  id: string;
  name: string;
  category: 'productivity' | 'development' | 'design' | 'communication' | 'business' | 'multimedia';
  description: string;
  pricing: 'free' | 'freemium' | 'paid' | 'subscription';
  platforms: string[];
  features: string[];
  bestFor: string[];
  alternatives: string[];
  learningCurve: 1 | 2 | 3 | 4 | 5; // 1 = Easy, 5 = Hard
  imageUrl: string;
  priceRange?: string;
}

export const software: Software[] = [
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'development',
    description: 'Powerful and extensible code editor with rich ecosystem of extensions',
    pricing: 'free',
    platforms: ['Windows', 'macOS', 'Linux', 'Web'],
    features: ['Integrated Terminal', 'Git Integration', 'Debugging', 'Extensions', 'IntelliSense'],
    bestFor: ['Web Development', 'Python', 'JavaScript', 'Remote Development'],
    alternatives: ['Sublime Text', 'Atom', 'WebStorm'],
    learningCurve: 2,
    imageUrl: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'design',
    description: 'Collaborative interface design tool that runs in the browser',
    pricing: 'freemium',
    platforms: ['Web', 'Windows', 'macOS'],
    features: ['Real-time Collaboration', 'Prototyping', 'Design Systems', 'Auto-layout', 'Components'],
    bestFor: ['UI Design', 'Prototyping', 'Design Systems', 'Team Collaboration'],
    alternatives: ['Adobe XD', 'Sketch', 'InVision'],
    learningCurve: 3,
    priceRange: '$0-12/user/month',
    imageUrl: 'https://images.unsplash.com/photo-1613791049514-61f37e2e6285?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    description: 'All-in-one workspace for notes, docs, and project management',
    pricing: 'freemium',
    platforms: ['Web', 'Windows', 'macOS', 'iOS', 'Android'],
    features: ['Rich Text Editor', 'Databases', 'Kanban Boards', 'Wiki', 'Templates'],
    bestFor: ['Note Taking', 'Project Management', 'Documentation', 'Team Wiki'],
    alternatives: ['Evernote', 'Trello', 'Confluence'],
    learningCurve: 3,
    priceRange: '$0-8/user/month',
    imageUrl: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'davinci-resolve',
    name: 'DaVinci Resolve',
    category: 'multimedia',
    description: 'Professional video editing, color correction, and audio post-production',
    pricing: 'freemium',
    platforms: ['Windows', 'macOS', 'Linux'],
    features: ['Video Editing', 'Color Correction', 'Audio Post', 'Motion Graphics', 'Multi-user Collaboration'],
    bestFor: ['Video Editing', 'Color Grading', 'YouTube Content', 'Film Production'],
    alternatives: ['Adobe Premiere Pro', 'Final Cut Pro', 'Vegas Pro'],
    learningCurve: 4,
    priceRange: '$0-295 one-time',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=60'
  }
];