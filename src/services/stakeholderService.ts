
import { supabase } from '@/integrations/supabase/client';
import { 
  mockPlayers,
  mockCoaches,
  mockClubs,
  mockAgents,
  mockSponsors,
  mockEquipmentSuppliers
} from '@/components/stakeholders/MockData';

// Types for stakeholders
export type StakeholderType = 'player' | 'coach' | 'club' | 'agent' | 'sponsor' | 'equipment_supplier';

export interface BaseStakeholder {
  id: string;
  name: string;
  type: StakeholderType;
  avatar: string;
  coverImage?: string;
  location?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface ClubStakeholder extends BaseStakeholder {
  type: 'club';
  founded?: string;
  league?: string;
  stadium?: string;
  capacity?: string;
  manager?: string;
  achievements?: string[];
  players?: string[];
  sponsors?: string[];
}

export interface CoachStakeholder extends BaseStakeholder {
  type: 'coach';
  role?: string;
  club?: string;
  experience?: string;
  previousClubs?: string[];
  achievements?: string[];
}

export interface AgentStakeholder extends BaseStakeholder {
  type: 'agent';
  agency?: string;
  license?: string;
  experience?: string;
  clients?: string[];
  specialties?: string[];
}

export interface ServiceProviderStakeholder extends BaseStakeholder {
  type: 'sponsor' | 'equipment_supplier';
  founded?: string;
  services?: string[];
  certifications?: string[];
  clients?: string[];
}

export type Stakeholder = ClubStakeholder | CoachStakeholder | AgentStakeholder | ServiceProviderStakeholder;

// Fetch a stakeholder by type and id
export const fetchStakeholder = async (
  type: StakeholderType,
  id: string
): Promise<Stakeholder | null> => {
  try {
    // Determine the details table based on type
    const detailsTable = `${type}_details`;
    
    // Query the database
    const { data, error } = await supabase
      .from('profiles')
      .select(`*, ${detailsTable}(*)`)
      .eq('id', id)
      .eq('user_type', type)
      .single();
    
    if (error || !data) {
      console.log(`Error fetching ${type} data from database, falling back to mock data`, error);
      // Return mock data
      return getMockStakeholder(type, id);
    }
    
    // Map database data to stakeholder interface
    return mapDatabaseToStakeholder(data, type);
    
  } catch (error) {
    console.error(`Error fetching stakeholder ${type}/${id}:`, error);
    // Return mock data as fallback
    return getMockStakeholder(type, id);
  }
};

// Map database data to stakeholder interface
const mapDatabaseToStakeholder = (data: any, type: StakeholderType): Stakeholder => {
  const baseStakeholder = {
    id: data.id,
    name: data.full_name || 'Unknown',
    type: type as StakeholderType,
    avatar: data.avatar_url || '',
    location: data[`${type}_details`]?.country || data[`${type}_details`]?.city || '',
    description: data[`${type}_details`]?.description || '',
    email: data.email,
    phone: data.phone,
    website: data[`${type}_details`]?.website
  };

  switch (type) {
    case 'club':
      return {
        ...baseStakeholder,
        type: 'club',
        founded: data.club_details?.founded_year?.toString(),
        league: data.club_details?.league,
        stadium: data.club_details?.stadium,
        achievements: data.club_details?.achievements?.split(',').map((a: string) => a.trim()) || []
      } as ClubStakeholder;
      
    case 'coach':
      return {
        ...baseStakeholder,
        type: 'coach',
        role: data.coach_details?.specialization,
        club: data.coach_details?.current_club,
        experience: data.coach_details?.experience,
        achievements: data.coach_details?.achievements?.split(',').map((a: string) => a.trim()) || []
      } as CoachStakeholder;
      
    case 'agent':
      return {
        ...baseStakeholder,
        type: 'agent',
        agency: data.agent_details?.agency,
        license: data.agent_details?.license_number,
        experience: data.agent_details?.experience_years?.toString(),
        specialties: data.agent_details?.specialization?.split(',').map((s: string) => s.trim()) || []
      } as AgentStakeholder;
      
    case 'sponsor':
    case 'equipment_supplier':
      return {
        ...baseStakeholder,
        type: type as 'sponsor' | 'equipment_supplier',
        founded: data[`${type}_details`]?.year_established?.toString(),
        services: data[`${type}_details`]?.sponsorship_focus?.split(',').map((s: string) => s.trim()) || 
                 data[`${type}_details`]?.products?.split(',').map((p: string) => p.trim()) || []
      } as ServiceProviderStakeholder;
      
    default:
      return baseStakeholder as Stakeholder;
  }
};

// Get mock stakeholder data
export const getMockStakeholder = (type: StakeholderType, id: string): Stakeholder | null => {
  switch (type) {
    case 'player':
      return mockPlayers.find(player => player.id === id) || mockPlayers[0] || null;
    case 'coach':
      return mockCoaches.find(coach => coach.id === id) || mockCoaches[0] || null;
    case 'club':
      return mockClubs.find(club => club.id === id) || mockClubs[0] || null;
    case 'agent':
      return mockAgents.find(agent => agent.id === id) || mockAgents[0] || null;
    case 'sponsor':
      return mockSponsors.find(sponsor => sponsor.id === id) || mockSponsors[0] || null;
    case 'equipment_supplier':
      return mockEquipmentSuppliers.find(supplier => supplier.id === id) || mockEquipmentSuppliers[0] || null;
    default:
      return null;
  }
};

// Fetch all stakeholders of a specific type
export const fetchStakeholdersByType = async (
  type: StakeholderType,
  limit: number = 10
): Promise<Stakeholder[]> => {
  try {
    // Determine the details table based on type
    const detailsTable = `${type}_details`;
    
    // Query the database
    const { data, error } = await supabase
      .from('profiles')
      .select(`*, ${detailsTable}(*)`)
      .eq('user_type', type)
      .limit(limit);
    
    if (error || !data || data.length === 0) {
      console.log(`Error fetching ${type} data from database, falling back to mock data`, error);
      // Return mock data
      return getMockStakeholdersByType(type);
    }
    
    // Map database data to stakeholder interface
    return data.map(item => mapDatabaseToStakeholder(item, type));
    
  } catch (error) {
    console.error(`Error fetching ${type} stakeholders:`, error);
    // Return mock data as fallback
    return getMockStakeholdersByType(type);
  }
};

// Get mock stakeholders by type
export const getMockStakeholdersByType = (type: StakeholderType): Stakeholder[] => {
  switch (type) {
    case 'player':
      return mockPlayers;
    case 'coach':
      return mockCoaches;
    case 'club':
      return mockClubs;
    case 'agent':
      return mockAgents;
    case 'sponsor':
      return mockSponsors;
    case 'equipment_supplier':
      return mockEquipmentSuppliers;
    default:
      return [];
  }
};
