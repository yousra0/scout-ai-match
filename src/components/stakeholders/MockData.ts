
// --- Full mock data for all stakeholders, properly typed ---

export interface PlayerMock {
  id: string;
  name: string;
  type: 'player';
  avatar: string;
  position: string;
  age: number;
  club: string;
  country: string;
  description: string;
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  experience?: any[];
  highlights?: {
    url: string;
    duration: number;
    views: number;
  }[];
}

export interface ClubMock {
  id: string;
  name: string;
  type: 'club';
  avatar: string;
  league: string;
  location: string;
  description: string;
  founded?: string;
}

export interface CoachMock {
  id: string;
  name: string;
  type: 'coach';
  avatar: string;
  club: string;
  role: string;
  description: string;
  experience?: string;
}

export interface AgentMock {
  id: string;
  name: string;
  type: 'agent';
  avatar: string;
  agency?: string;
  license?: string;
  description: string;
  specialties?: string[];
}

export interface SponsorMock {
  id: string;
  name: string;
  type: 'sponsor';
  avatar: string;
  location: string;
  services?: string[];
  description: string;
}

export interface EquipmentSupplierMock {
  id: string;
  name: string;
  type: 'equipment_supplier';
  avatar: string;
  location: string;
  services?: string[];
  description: string;
}

export const mockPlayers: PlayerMock[] = [
  {
    id: "player-1",
    name: "John Smith",
    type: "player",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    position: "Forward",
    age: 22,
    club: "FC Stars",
    country: "USA",
    description: "Fast and dynamic forward with keen eye for goal.",
    attributes: {
      pace: 90,
      shooting: 84,
      passing: 73,
      dribbling: 85,
      defending: 40,
      physical: 78,
    },
    experience: [
      { club: "FC Stars", role: "Forward", start_date: "2022-08-01" }
    ],
    highlights: [
      {
        url: "https://www.example.com/video1.mp4",
        duration: 120,
        views: 1000
      }
    ]
  },
  {
    id: "player-2",
    name: "Anna Doe",
    type: "player",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    position: "Defender",
    age: 24,
    club: "Blue Warriors",
    country: "England",
    description: "Strong on tackles and aerial duels.",
    attributes: {
      pace: 76,
      shooting: 61,
      passing: 71,
      dribbling: 68,
      defending: 91,
      physical: 85,
    }
  }
];

export const mockClubs: ClubMock[] = [
  {
    id: "club-1",
    name: "FC Barcelona Youth Academy",
    type: "club",
    avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png",
    league: "La Liga",
    location: "Barcelona, Spain",
    description: "World class football academy with international experience.",
    founded: "1899",
  },
];

export const mockCoaches: CoachMock[] = [
  {
    id: "coach-1",
    name: "Marco Rossi",
    type: "coach",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    club: "FC Youth Milan",
    role: "Head Coach",
    description: "Specializes in attacking talents.",
    experience: "9 years",
  },
];

export const mockAgents: AgentMock[] = [
  {
    id: "agent-1",
    name: "Elite Sports Agency",
    type: "agent",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    agency: "Elite Sports Agency",
    license: "A12345",
    description: "Specializing in youth transfers in Europe.",
    specialties: ["Transfers", "Negotiation", "Sponsorships"]
  }
];

export const mockSponsors: SponsorMock[] = [
  {
    id: "sponsor-1",
    name: "Global Sports Foundation",
    type: "sponsor",
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    location: "New York, USA",
    description: "Supporting the next generation of sports stars.",
    services: ["Grants", "Equipment", "Mentorship"]
  }
];

export const mockEquipmentSuppliers: EquipmentSupplierMock[] = [
  {
    id: "equip-1",
    name: "SportEquip Pro",
    type: "equipment_supplier",
    avatar: "https://randomuser.me/api/portraits/men/13.jpg",
    location: "Berlin, Germany",
    services: ["Custom Shoes", "Shin Guards", "Team Kits"],
    description: "Custom equipment for professional athletes."
  }
];

// Export a combined array for all types for convenience
export const allMockStakeholders = [
  ...mockPlayers,
  ...mockClubs,
  ...mockCoaches,
  ...mockAgents,
  ...mockSponsors,
  ...mockEquipmentSuppliers
];
