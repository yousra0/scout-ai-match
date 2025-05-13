
import { 
  ClubStakeholder,
  CoachStakeholder,
  AgentStakeholder,
  ServiceProviderStakeholder
} from '@/services/stakeholderService';

// Mock Player data is already defined in PlayerData.ts

// Mock Coaches
export const mockCoaches: CoachStakeholder[] = [
  {
    id: "coach-1",
    name: "José Mourinho",
    type: "coach",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jos%C3%A9_Mourinho.jpg/1200px-Jos%C3%A9_Mourinho.jpg",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1493&auto=format&fit=crop",
    location: "London, UK",
    role: "Head Coach",
    club: "AS Roma",
    experience: "20+ years",
    previousClubs: [
      "Chelsea FC",
      "Real Madrid",
      "Manchester United",
      "Inter Milan",
      "Tottenham Hotspur"
    ],
    description: "José Mourinho is one of the most successful and controversial football managers of all time, known for his tactical knowledge and psychological skills.",
    achievements: [
      "2x UEFA Champions League winner",
      "3x Premier League winner",
      "2x Serie A winner",
      "1x La Liga winner"
    ],
    email: "jose@specialone.com",
    phone: "+44 123 456 7890"
  },
  {
    id: "coach-2",
    name: "Jurgen Klopp",
    type: "coach",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/6/62/Klopp_2019_%28cropped%29.jpg",
    coverImage: "https://images.unsplash.com/photo-1580880783109-6746c2199006?q=80&w=1374&auto=format&fit=crop",
    location: "Liverpool, UK",
    role: "Head Coach",
    club: "Liverpool FC",
    experience: "20+ years",
    previousClubs: [
      "Borussia Dortmund",
      "Mainz 05"
    ],
    description: "Jurgen Klopp is known for his charismatic personality, tactical knowledge, and his gegenpressing style of play.",
    achievements: [
      "1x Premier League winner",
      "1x UEFA Champions League winner",
      "2x Bundesliga winner",
      "1x FIFA Club World Cup winner"
    ],
    email: "jurgen@liverpool.com",
    phone: "+44 151 234 5678"
  },
  {
    id: "coach-3",
    name: "Pep Guardiola",
    type: "coach",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pep_2017_%28cropped%29.jpg",
    coverImage: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1452&auto=format&fit=crop",
    location: "Manchester, UK",
    role: "Head Coach",
    club: "Manchester City FC",
    experience: "15+ years",
    previousClubs: [
      "Barcelona",
      "Bayern Munich"
    ],
    description: "Pep Guardiola is known for his tiki-taka style of play, emphasizing ball possession and short passing.",
    achievements: [
      "4x Premier League winner",
      "3x La Liga winner",
      "3x Bundesliga winner",
      "2x UEFA Champions League winner"
    ],
    email: "pep@mancity.com"
  },
  {
    id: "coach-4",
    name: "Zinedine Zidane",
    type: "coach",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg",
    coverImage: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1467&auto=format&fit=crop",
    location: "Madrid, Spain",
    role: "Head Coach",
    description: "Former legendary player turned coach, known for his tactical intelligence and man-management skills.",
    achievements: [
      "3x UEFA Champions League winner",
      "2x La Liga winner",
      "2x FIFA Club World Cup winner"
    ],
    previousClubs: [
      "Real Madrid"
    ]
  }
];

// Mock Clubs
export const mockClubs: ClubStakeholder[] = [
  {
    id: "club-1",
    name: "FC Barcelona",
    type: "club",
    avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png",
    coverImage: "https://images.unsplash.com/photo-1508098682722-e99c643e7485?q=80&w=1470&auto=format&fit=crop",
    location: "Barcelona, Spain",
    founded: "1899",
    league: "La Liga",
    stadium: "Camp Nou",
    capacity: "99,354",
    manager: "Xavi Hernandez",
    description: "FC Barcelona is a professional football club based in Barcelona, Catalonia, Spain, that competes in La Liga, the top flight of Spanish football.",
    achievements: [
      "26x La Liga Champions",
      "5x UEFA Champions League winners",
      "31x Copa del Rey winners"
    ],
    players: [
      "Robert Lewandowski",
      "Lamine Yamal",
      "Pedri",
      "Ilkay Gündogan"
    ],
    sponsors: [
      "Nike",
      "Spotify",
      "Beko"
    ],
    email: "info@fcbarcelona.com",
    phone: "+34 902 1899 00",
    website: "https://www.fcbarcelona.com"
  },
  {
    id: "club-2",
    name: "Manchester United",
    type: "club",
    avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png",
    coverImage: "https://images.unsplash.com/photo-1493307100940-ac5f30741598?q=80&w=1470&auto=format&fit=crop",
    location: "Manchester, UK",
    founded: "1878",
    league: "Premier League",
    stadium: "Old Trafford",
    capacity: "74,140",
    manager: "Erik ten Hag",
    description: "Manchester United is one of the most successful and globally recognized football clubs, known for their attacking style of play.",
    achievements: [
      "20x Premier League Champions",
      "3x UEFA Champions League winners",
      "12x FA Cup winners"
    ],
    email: "enquiries@manutd.co.uk",
    phone: "+44 161 868 8000",
    website: "https://www.manutd.com"
  },
  {
    id: "club-3",
    name: "Bayern Munich",
    type: "club",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png",
    coverImage: "https://images.unsplash.com/photo-1577223625816-6328dfb8abe5?q=80&w=1470&auto=format&fit=crop",
    location: "Munich, Germany",
    founded: "1900",
    league: "Bundesliga",
    stadium: "Allianz Arena",
    capacity: "75,000",
    description: "FC Bayern Munich is Germany's most successful football club and a global powerhouse known for developing top talent.",
    achievements: [
      "31x Bundesliga Champions",
      "6x UEFA Champions League winners",
      "20x DFB-Pokal winners"
    ],
    website: "https://fcbayern.com"
  },
  {
    id: "club-4",
    name: "Ajax Amsterdam",
    type: "club",
    avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Ajax_Amsterdam.svg/1200px-Ajax_Amsterdam.svg.png",
    coverImage: "https://images.unsplash.com/photo-1518604100146-5d424ab3faae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHNvY2NlcnxlbnwwfHwwfHx8MA%3D%3D",
    location: "Amsterdam, Netherlands",
    founded: "1900",
    league: "Eredivisie",
    stadium: "Johan Cruijff ArenA",
    description: "Ajax is known for its youth academy and development philosophy, having produced numerous world-class players.",
    achievements: [
      "35x Eredivisie Champions",
      "4x UEFA Champions League winners",
      "20x KNVB Cup winners"
    ]
  }
];

// Mock Agents
export const mockAgents: AgentStakeholder[] = [
  {
    id: "agent-1",
    name: "Jorge Mendes",
    type: "agent",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Jorge_Mendes_2019_%28cropped%29.jpg",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1471&auto=format&fit=crop",
    location: "Lisbon, Portugal",
    agency: "Gestifute",
    license: "FIFA Licensed Agent",
    experience: "25+ years",
    clients: [
      "Cristiano Ronaldo",
      "João Félix",
      "Rúben Dias",
      "Diogo Jota"
    ],
    description: "Jorge Mendes is a Portuguese football agent who represents many high-profile football players and coaches.",
    specialties: [
      "Contract Negotiation",
      "Player Development",
      "Commercial Deals",
      "Career Management"
    ],
    email: "contact@gestifute.com",
    phone: "+351 123 456 789"
  },
  {
    id: "agent-2",
    name: "Mino Raiola",
    type: "agent",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/FIFA_Ballon_d%27Or_Gala_2014_%28cropped%29.jpg/640px-FIFA_Ballon_d%27Or_Gala_2014_%28cropped%29.jpg",
    coverImage: "https://images.unsplash.com/photo-1517424220076-584c4d1a23aa?q=80&w=1470&auto=format&fit=crop",
    location: "Monte Carlo, Monaco",
    agency: "Mino Raiola Agency",
    license: "FIFA Licensed Agent",
    experience: "30+ years",
    clients: [
      "Erling Haaland",
      "Paul Pogba",
      "Zlatan Ibrahimović",
      "Gianluigi Donnarumma"
    ],
    description: "Known for his outspoken personality and tough negotiation tactics, Mino Raiola represents some of the biggest names in football.",
    specialties: [
      "Transfer Negotiations",
      "Image Rights",
      "Endorsement Deals"
    ],
    email: "info@raiola.com"
  },
  {
    id: "agent-3",
    name: "Jonathan Barnett",
    type: "agent",
    avatar: "https://cdn.resfu.com/media/img_news/agencia-efe_multimedia_4373651.multimedia.photos.14599312.file.jpg",
    coverImage: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?q=80&w=1374&auto=format&fit=crop",
    location: "London, UK",
    agency: "ICM Stellar Sports",
    license: "FA Licensed Agent",
    experience: "35+ years",
    clients: [
      "Gareth Bale",
      "Jack Grealish",
      "Eduardo Camavinga"
    ],
    description: "Jonathan Barnett is the chairman and founder of ICM Stellar Sports, one of the world's leading sports agencies.",
    specialties: [
      "High-Profile Transfers",
      "Media Relations",
      "Financial Planning"
    ]
  }
];

// Mock Sponsors
export const mockSponsors: ServiceProviderStakeholder[] = [
  {
    id: "sponsor-1",
    name: "Global Finance Group",
    type: "sponsor",
    avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1470&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1560520653-9eb1de890f0b?q=80&w=1473&auto=format&fit=crop",
    location: "London, UK",
    founded: "1982",
    description: "Global Finance Group is a multinational financial services company with major sponsorship deals across European football.",
    services: [
      "Main Kit Sponsorship",
      "Stadium Naming Rights",
      "Youth Academy Support",
      "Financial Services for Athletes"
    ],
    certifications: [
      "Financial Conduct Authority Regulated",
      "European Sponsorship Association Award Winner"
    ],
    clients: [
      "Arsenal FC",
      "Juventus",
      "Borussia Dortmund",
      "Ajax Amsterdam"
    ],
    email: "partnerships@globalfinance.com",
    phone: "+44 207 123 4567",
    website: "https://www.globalfinancegroup.com"
  },
  {
    id: "sponsor-2",
    name: "TechVision Inc.",
    type: "sponsor",
    avatar: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop",
    location: "San Francisco, USA",
    founded: "2005",
    description: "TechVision is a leading technology company that specializes in innovation and digital transformation.",
    services: [
      "Technology Partnership",
      "Digital Fan Experience",
      "Performance Analytics",
      "Smart Stadium Solutions"
    ],
    clients: [
      "Manchester City",
      "Real Madrid",
      "LA Galaxy"
    ],
    website: "https://www.techvision.com"
  },
  {
    id: "sponsor-3",
    name: "SportHealth Nutrition",
    type: "sponsor",
    avatar: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1374&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=1480&auto=format&fit=crop",
    location: "Berlin, Germany",
    founded: "1998",
    description: "SportHealth specializes in nutrition products specifically designed for professional athletes and sports performance.",
    services: [
      "Nutritional Partnership",
      "Performance Enhancement",
      "Recovery Products",
      "Health Monitoring"
    ],
    clients: [
      "Bayern Munich",
      "German National Team",
      "PSG"
    ]
  }
];

// Mock Equipment Suppliers
export const mockEquipmentSuppliers: ServiceProviderStakeholder[] = [
  {
    id: "equipment-1",
    name: "Elite Sports Equipment",
    type: "equipment_supplier",
    avatar: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1470&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1571902943202-507ec2618b04?q=80&w=1375&auto=format&fit=crop",
    location: "Manchester, UK",
    founded: "1998",
    description: "Elite Sports Equipment is a leading provider of high-quality football equipment and training gear for professional clubs and academies.",
    services: [
      "Professional Match Balls",
      "Training Equipment",
      "Goal Technology",
      "Performance Analysis Tools"
    ],
    certifications: [
      "FIFA Approved Supplier",
      "ISO 9001 Certified",
      "Football Foundation Partner"
    ],
    clients: [
      "Premier League",
      "UEFA",
      "Manchester City Academy",
      "Dutch Football Association"
    ],
    email: "sales@elitesports.com",
    phone: "+44 161 123 4567",
    website: "https://www.elitesportsequipment.com"
  },
  {
    id: "equipment-2",
    name: "Pro Training Systems",
    type: "equipment_supplier",
    avatar: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1471&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1526232636376-53d03f24f92?q=80&w=1470&auto=format&fit=crop",
    location: "Barcelona, Spain",
    founded: "2001",
    description: "Specializing in innovative training solutions for professional football clubs and academies.",
    services: [
      "Smart Training Systems",
      "Biometric Tracking",
      "Recovery Equipment",
      "Customized Training Programs"
    ],
    clients: [
      "La Liga",
      "Barcelona Academy",
      "Portuguese Football Federation"
    ],
    website: "https://www.protrainingsystems.com"
  },
  {
    id: "equipment-3",
    name: "Global Football Gear",
    type: "equipment_supplier",
    avatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1507&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1470&auto=format&fit=crop",
    location: "Milan, Italy",
    founded: "1985",
    description: "Premium football equipment manufacturer known for its innovative designs and high-quality materials.",
    services: [
      "Match Kits",
      "Training Apparel",
      "Goalkeeper Equipment",
      "Protective Gear"
    ],
    clients: [
      "Serie A",
      "Italian Football Federation",
      "Multiple National Teams"
    ]
  }
];

// Export all mock data
export const allMockStakeholders = [
  ...mockCoaches,
  ...mockClubs,
  ...mockAgents,
  ...mockSponsors,
  ...mockEquipmentSuppliers
];
