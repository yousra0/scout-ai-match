
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
