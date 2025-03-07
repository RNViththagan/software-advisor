export interface Technology {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'database' | 'tool';
  description: string;
  learningCurve: 1 | 2 | 3 | 4 | 5; // 1 = Easy, 5 = Hard
  popularity: 1 | 2 | 3 | 4 | 5; // 1 = Low, 5 = High
  jobMarket: 1 | 2 | 3 | 4 | 5; // 1 = Limited, 5 = Abundant
  bestFor: string[];
  imageUrl: string;
}

export const technologies: Technology[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'language',
    description: 'Versatile language known for its simplicity and vast ecosystem',
    learningCurve: 1,
    popularity: 5,
    jobMarket: 5,
    bestFor: ['Data Science', 'AI/ML', 'Web Development', 'Automation'],
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'language',
    description: 'JavaScript with static typing for large-scale applications',
    learningCurve: 3,
    popularity: 4,
    jobMarket: 4,
    bestFor: ['Web Development', 'Enterprise Apps', 'Full-stack Development'],
    imageUrl: 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'react',
    name: 'React',
    category: 'framework',
    description: 'Popular UI library for building interactive web applications',
    learningCurve: 2,
    popularity: 5,
    jobMarket: 5,
    bestFor: ['Single Page Applications', 'Mobile Development', 'User Interfaces'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'framework',
    description: 'JavaScript runtime for server-side development',
    learningCurve: 2,
    popularity: 5,
    jobMarket: 5,
    bestFor: ['Backend Development', 'API Development', 'Real-time Applications'],
    imageUrl: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&auto=format&fit=crop&q=60'
  }
];