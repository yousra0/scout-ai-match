
import { Match } from '@/services/matchingService';

export interface Attribute {
  name: string;
  value: number;
  color?: string;
}

export interface Highlight {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
}

export const playerData = {
  name: 'Lamine Yamal',
  avatar: 'https://img.a.transfermarkt.technology/portrait/big/868622-1694414937.jpg',
  position: 'Right Winger',
  age: 16,
  country: 'Spain',
  club: 'FC Barcelona',
  description: 'Lamine Yamal is a young professional footballer who plays as a winger for La Liga club Barcelona and the Spain national team. Born in 2007, he became the youngest player to appear for Barcelona in La Liga at the age of 15 years and 290 days.',
  attributes: [
    { name: 'Pace', value: 89, color: '#10b981' },
    { name: 'Shooting', value: 75, color: '#10b981' },
    { name: 'Passing', value: 82, color: '#10b981' },
    { name: 'Dribbling', value: 87, color: '#10b981' },
    { name: 'Defending', value: 42, color: '#ef4444' },
    { name: 'Physical', value: 64, color: '#f59e0b' }
  ] as Attribute[],
  highlights: [
    {
      id: '1',
      title: 'Goal vs Athletic Club',
      thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format',
      videoUrl: 'https://www.youtube.com/watch?v=example1'
    },
    {
      id: '2',
      title: 'Skills and Tricks Compilation',
      thumbnail: 'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?w=500&auto=format',
      videoUrl: 'https://www.youtube.com/watch?v=example2'
    }
  ] as Highlight[],
  experience: [
    {
      id: "exp1",
      club: "FC Barcelona",
      role: "First Team",
      start_date: "2023-04-01",
      is_current_role: true,
      achievements: "La Liga debut, Champions League debut"
    },
    {
      id: "exp2",
      club: "FC Barcelona Youth",
      role: "La Masia Academy",
      start_date: "2014-01-01",
      end_date: "2023-03-31",
      is_current_role: false,
      achievements: "Youth League winner"
    }
  ]
};

// Mock players for the matching system
export const mockPlayers: Match[] = [
  {
    id: "player-1",
    name: "Lamine Yamal",
    type: "player",
    matchScore: 92,
    description: "Talented young winger with exceptional dribbling and pace",
    avatarUrl: "https://img.a.transfermarkt.technology/portrait/big/868622-1694414937.jpg",
    location: "Barcelona, Spain",
    position: "Right Winger",
    skills: ["Dribbling", "Speed", "Technique"]
  },
  {
    id: "player-2",
    name: "Nico Williams",
    type: "player",
    matchScore: 88,
    description: "Fast winger who excels in one-on-one situations",
    avatarUrl: "https://img.a.transfermarkt.technology/portrait/big/709187-1664438935.jpg",
    location: "Bilbao, Spain",
    position: "Left Winger",
    skills: ["Speed", "Crossing", "Dribbling"]
  },
  {
    id: "player-3",
    name: "Gavi",
    type: "player",
    matchScore: 86,
    description: "Tenacious midfielder known for his work rate and technical ability",
    avatarUrl: "https://img.a.transfermarkt.technology/portrait/big/646667-1644501128.jpg",
    location: "Barcelona, Spain",
    position: "Central Midfielder",
    skills: ["Passing", "Tackling", "Pressing"]
  },
  {
    id: "player-4",
    name: "Jude Bellingham",
    type: "player",
    matchScore: 84,
    description: "Complete midfielder who can defend and attack with equal skill",
    avatarUrl: "https://img.a.transfermarkt.technology/portrait/big/581678-1657091290.jpg",
    location: "Madrid, Spain",
    position: "Attacking Midfielder",
    skills: ["Scoring", "Passing", "Leadership"]
  },
  {
    id: "player-5",
    name: "Florian Wirtz",
    type: "player",
    matchScore: 81,
    description: "Creative playmaker with excellent vision and ball control",
    avatarUrl: "https://img.a.transfermarkt.technology/portrait/big/670994-1657877148.jpg",
    location: "Leverkusen, Germany",
    position: "Attacking Midfielder",
    skills: ["Vision", "Technique", "Goal-scoring"]
  }
];
