
// This file contains the mock player data that was previously in the PlayerProfilePage component

// Mock player data
export const playerData = {
  id: '1',
  name: 'Alex Johnson',
  age: 23,
  nationality: 'England',
  position: 'Forward',
  club: 'Manchester City FC',
  matchPercentage: 95,
  avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  bio: "Dynamic forward with excellent finishing abilities and strong aerial presence. Specialized in breaking defensive lines and creating scoring opportunities. Looking for a club where I can develop further and contribute to team success.",
  location: 'Manchester, UK',
  lastActive: '2 hours ago',
  height: '185 cm',
  weight: '80 kg',
  preferredFoot: 'Right',
  stats: {
    matches: 87,
    goals: 54,
    assists: 23,
    yellowCards: 5,
    redCards: 0
  },
  attributes: {
    pace: 88,
    shooting: 92,
    passing: 85,
    dribbling: 87,
    defending: 45,
    physical: 76
  },
  recentPerformance: [
    { name: 'Match 1', goals: 2, assists: 1 },
    { name: 'Match 2', goals: 0, assists: 2 },
    { name: 'Match 3', goals: 1, assists: 0 },
    { name: 'Match 4', goals: 3, assists: 1 },
    { name: 'Match 5', goals: 1, assists: 2 },
  ],
  highlights: [
    { 
      id: '1',
      title: 'Season Highlights 2024/25', 
      url: '#', 
      thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      duration: '3:42',
      views: '12.5K'
    },
    { 
      id: '2',
      title: 'Best Goals Compilation', 
      url: '#', 
      thumbnail: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      duration: '5:18',
      views: '8.3K'
    },
    { 
      id: '3',
      title: 'Skills & Tricks 2024', 
      url: '#', 
      thumbnail: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      duration: '2:56',
      views: '6.7K'
    },
    { 
      id: '4',
      title: 'Match Winning Performance vs. Liverpool', 
      url: '#', 
      thumbnail: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      duration: '4:22',
      views: '15.2K'
    }
  ],
  experience: [
    { 
      club: 'Manchester City FC', 
      role: 'Forward', 
      period: 'Jan 2023 - Present',
      achievements: 'Top scorer of the season with 24 goals'
    },
    { 
      club: 'Leicester City', 
      role: 'Forward', 
      period: 'Aug 2020 - Dec 2022',
      achievements: 'Helped team reach Champions League qualification'
    }
  ],
  education: [
    { institution: 'Manchester United Academy', qualification: 'Professional Youth Program', period: '2015 - 2020' }
  ]
};

// Expanded mock data for enhanced testing of matching and recommendation systems

// Mock Players Data
export const mockPlayers = [
  {
    id: '101',
    name: 'Emma Williams',
    type: 'player' as const,
    matchScore: 94,
    description: 'Versatile midfielder with excellent vision and passing ability',
    position: 'Midfielder',
    location: 'Paris, France',
    avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
    skills: ['Passing', 'Vision', 'Set Pieces']
  },
  {
    id: '102',
    name: 'Carlos Rodriguez',
    type: 'player' as const,
    matchScore: 92,
    description: 'Skilled winger known for speed and dribbling abilities',
    position: 'Right Wing',
    location: 'Madrid, Spain',
    avatarUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
    skills: ['Speed', 'Dribbling', 'Crossing']
  },
  {
    id: '103',
    name: 'Sophia Chen',
    type: 'player' as const,
    matchScore: 89,
    description: 'Defensive midfielder with strong tackling and positional awareness',
    position: 'Defensive Midfielder',
    location: 'Beijing, China',
    avatarUrl: 'https://randomuser.me/api/portraits/women/41.jpg',
    skills: ['Tackling', 'Positioning', 'Leadership']
  },
  {
    id: '104',
    name: 'Jamal Thompson',
    type: 'player' as const,
    matchScore: 87,
    description: 'Athletic goalkeeper with excellent reflexes and distribution',
    position: 'Goalkeeper',
    location: 'Lagos, Nigeria',
    avatarUrl: 'https://randomuser.me/api/portraits/men/19.jpg',
    skills: ['Shot Stopping', 'Distribution', 'Aerial Control']
  },
  {
    id: '105',
    name: 'Lena Müller',
    type: 'player' as const,
    matchScore: 86,
    description: 'Versatile defender capable of playing multiple positions',
    position: 'Center Back',
    location: 'Munich, Germany',
    avatarUrl: 'https://randomuser.me/api/portraits/women/29.jpg',
    skills: ['Defending', 'Versatility', 'Game Reading']
  }
];

// Mock Coaches Data
export const mockCoaches = [
  {
    id: '201',
    name: 'Jurgen Klopp',
    type: 'coach' as const,
    matchScore: 96,
    description: 'Specializes in high-pressing systems and player development',
    skills: ['Tactical Analysis', 'Player Development', 'Motivational Leadership'],
    location: 'Liverpool, UK',
    avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg'
  },
  {
    id: '202',
    name: 'Maria Gonzalez',
    type: 'coach' as const,
    matchScore: 91,
    description: 'Expert in technical skills training and youth development',
    skills: ['Technical Training', 'Youth Development', 'Skill Analysis'],
    location: 'Barcelona, Spain',
    avatarUrl: 'https://randomuser.me/api/portraits/women/74.jpg'
  },
  {
    id: '203',
    name: 'Akira Tanaka',
    type: 'coach' as const,
    matchScore: 88,
    description: 'Specializes in tactical flexibility and game strategy',
    skills: ['Game Strategy', 'Tactical Flexibility', 'Opposition Analysis'],
    location: 'Tokyo, Japan',
    avatarUrl: 'https://randomuser.me/api/portraits/men/81.jpg'
  },
  {
    id: '204',
    name: 'Sarah Johnson',
    type: 'coach' as const,
    matchScore: 86,
    description: 'Mental conditioning coach focusing on performance psychology',
    skills: ['Mental Conditioning', 'Performance Psychology', 'Stress Management'],
    location: 'Toronto, Canada',
    avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    id: '205',
    name: 'Antoine Dubois',
    type: 'coach' as const,
    matchScore: 82,
    description: 'Specializes in physical conditioning and injury prevention',
    skills: ['Physical Conditioning', 'Injury Prevention', 'Recovery Protocols'],
    location: 'Lyon, France',
    avatarUrl: 'https://randomuser.me/api/portraits/men/33.jpg'
  }
];

// Mock Clubs Data
export const mockClubs = [
  {
    id: '301',
    name: 'FC Bayern Munich',
    type: 'club' as const,
    matchScore: 93,
    description: 'Elite European club known for developing young talent',
    location: 'Munich, Germany',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Logo_FC_Bayern_M%C3%BCnchen_%282002%E2%80%932017%29.svg/1200px-Logo_FC_Bayern_M%C3%BCnchen_%282002%E2%80%932017%29.svg.png'
  },
  {
    id: '302',
    name: 'Ajax Amsterdam',
    type: 'club' as const,
    matchScore: 91,
    description: 'Famous for their youth academy and technical development',
    location: 'Amsterdam, Netherlands',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Ajax_Amsterdam.svg/1200px-Ajax_Amsterdam.svg.png'
  },
  {
    id: '303',
    name: 'Boca Juniors',
    type: 'club' as const,
    matchScore: 89,
    description: 'Renowned South American club with passionate fanbase',
    location: 'Buenos Aires, Argentina',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boca_Juniors_logo18.svg/1200px-Boca_Juniors_logo18.svg.png'
  },
  {
    id: '304',
    name: 'Portland Timbers',
    type: 'club' as const,
    matchScore: 87,
    description: 'MLS club with strong community ties and development focus',
    location: 'Portland, USA',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Portland_Timbers_logo.svg/1200px-Portland_Timbers_logo.svg.png'
  },
  {
    id: '305',
    name: 'Kashima Antlers',
    type: 'club' as const,
    matchScore: 85,
    description: 'Leading J-League club with modern facilities and training methods',
    location: 'Kashima, Japan',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Kashima_Antlers_logo.svg/1200px-Kashima_Antlers_logo.svg.png'
  }
];

// Mock Agents Data
export const mockAgents = [
  {
    id: '401',
    name: 'Daniel Richardson',
    type: 'agent' as const,
    matchScore: 94,
    description: 'Specializes in European transfers and contract negotiation',
    location: 'London, UK',
    avatarUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
    skills: ['Contract Negotiation', 'European Market', 'Career Planning']
  },
  {
    id: '402',
    name: 'Isabella Martinez',
    type: 'agent' as const,
    matchScore: 92,
    description: 'Focuses on South American talent development and transfers',
    location: 'São Paulo, Brazil',
    avatarUrl: 'https://randomuser.me/api/portraits/women/38.jpg',
    skills: ['Talent Scouting', 'South American Market', 'Player Development']
  },
  {
    id: '403',
    name: 'Omar Al-Farsi',
    type: 'agent' as const,
    matchScore: 89,
    description: 'Specializes in Middle Eastern and Asian football markets',
    location: 'Dubai, UAE',
    avatarUrl: 'https://randomuser.me/api/portraits/men/28.jpg',
    skills: ['Asian Markets', 'Commercial Deals', 'Cultural Adaptation']
  },
  {
    id: '404',
    name: 'Victoria Chen',
    type: 'agent' as const,
    matchScore: 87,
    description: 'Expert in digital marketing and personal brand development',
    location: 'Singapore',
    avatarUrl: 'https://randomuser.me/api/portraits/women/52.jpg',
    skills: ['Brand Development', 'Social Media Strategy', 'Endorsement Deals']
  },
  {
    id: '405',
    name: 'Michael O\'Sullivan',
    type: 'agent' as const,
    matchScore: 85,
    description: 'Specializes in youth player development and first contracts',
    location: 'Dublin, Ireland',
    avatarUrl: 'https://randomuser.me/api/portraits/men/91.jpg',
    skills: ['Youth Development', 'First Contracts', 'Academy Transitions']
  }
];

// Mock Sponsors Data
export const mockSponsors = [
  {
    id: '501',
    name: 'SportTech International',
    type: 'sponsor' as const,
    matchScore: 90,
    description: 'Global sports equipment manufacturer looking for rising stars',
    location: 'Beaverton, USA',
    avatarUrl: 'https://images.unsplash.com/photo-1622553658623-da00841b09de?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '502',
    name: 'GreenEnergy Drinks',
    type: 'sponsor' as const,
    matchScore: 88,
    description: 'Eco-friendly sports beverage company targeting young athletes',
    location: 'Stockholm, Sweden',
    avatarUrl: 'https://images.unsplash.com/photo-1543348950-0a1c9fc161af?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '503',
    name: 'Horizon Airlines',
    type: 'sponsor' as const,
    matchScore: 86,
    description: 'International airline looking to expand sports partnerships',
    location: 'Dubai, UAE',
    avatarUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '504',
    name: 'Financial Future',
    type: 'sponsor' as const,
    matchScore: 84,
    description: 'Investment firm specializing in athlete financial planning',
    location: 'New York, USA',
    avatarUrl: 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '505',
    name: 'Global Tech Solutions',
    type: 'sponsor' as const,
    matchScore: 82,
    description: 'Technology company seeking athletes for innovation partnerships',
    location: 'Seoul, South Korea',
    avatarUrl: 'https://images.unsplash.com/photo-1529310399831-ed472b81d589?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }
];

// Transform player attributes for the radar chart
export const radarData = [
  {
    subject: 'Pace',
    A: playerData.attributes.pace,
    fullMark: 100,
  },
  {
    subject: 'Shooting',
    A: playerData.attributes.shooting,
    fullMark: 100,
  },
  {
    subject: 'Passing',
    A: playerData.attributes.passing,
    fullMark: 100,
  },
  {
    subject: 'Dribbling',
    A: playerData.attributes.dribbling,
    fullMark: 100,
  },
  {
    subject: 'Defending',
    A: playerData.attributes.defending,
    fullMark: 100,
  },
  {
    subject: 'Physical',
    A: playerData.attributes.physical,
    fullMark: 100,
  },
];

// Transform player stats for the bar chart
export const statsData = [
  { name: 'Matches', value: playerData.stats.matches },
  { name: 'Goals', value: playerData.stats.goals },
  { name: 'Assists', value: playerData.stats.assists },
  { name: 'Yellow Cards', value: playerData.stats.yellowCards },
  { name: 'Red Cards', value: playerData.stats.redCards },
];

// Combine all mock data for consolidated access
export const allMockData = {
  players: mockPlayers,
  coaches: mockCoaches,
  clubs: mockClubs,
  agents: mockAgents,
  sponsors: mockSponsors
};
