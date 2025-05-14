import { supabase } from '@/integrations/supabase/client';
import {
  mockPlayers,
  mockCoaches,
  mockClubs,
  mockAgents,
  mockSponsors,
  mockEquipmentSuppliers,
  allMockStakeholders
} from '@/components/stakeholders/MockData';
import { StakeholderType } from '@/services/stakeholderService';

export interface Recommendation {
  id: string;
  title: string;
  type: StakeholderType;
  category: string;
  description: string;
  imageUrl?: string;
  location?: string;
  date?: string;
  tags?: string[];
  reason: string;
  score: number;
}

// Fetch recommendations by specific type
export const fetchRecommendationsByType = async (
  userId: string, 
  type: StakeholderType,
  limit: number = 10
): Promise<Recommendation[]> => {
  try {
    // Query the supabase database for recommendations
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        player_details(*),
        coach_details(*),
        club_details(*),
        agent_details(*),
        sponsor_details(*),
        equipment_supplier_details(*)
      `)
      .eq('user_type', type)
      .neq('id', userId)
      .limit(limit);

    if (profileError || !profileData || profileData.length === 0) {
      console.log(`Error or no data fetching ${type} recommendations from DB:`, profileError);
      return getMockRecommendationsByType(type, limit);
    }

    // Map database profiles to recommendations
    return profileData.map(profile => {
      // Get details table based on type
      let details: any = {};
      switch (type) {
        case "player": details = profile.player_details ?? {}; break;
        case "club": details = profile.club_details ?? {}; break;
        case "coach": details = profile.coach_details ?? {}; break;
        case "agent": details = profile.agent_details ?? {}; break;
        case "sponsor": details = profile.sponsor_details ?? {}; break;
        case "equipment_supplier": details = profile.equipment_supplier_details ?? {}; break;
      }

      const score = Math.floor(Math.random() * 16) + 80;
      let category = '';
      let tags: string[] = [];
      let reason = '';

      switch (type) {
        case 'player':
          category = details.position ?? 'Player';
          tags = [details.position, details.country].filter(Boolean);
          reason = "Based on your player preferences and scouting history";
          break;
        case 'coach':
          category = details.specialization ?? 'Coach';
          tags = [details.specialization, details.current_club].filter(Boolean);
          reason = "Matches your coaching style preferences and development needs";
          break;
        case 'club':
          category = details.league ?? 'Club';
          tags = [details.league, details.country].filter(Boolean);
          reason = "Aligns with your career aspirations and playing style";
          break;
        case 'agent':
          category = details.specialization ?? 'Agent';
          tags = [details.specialization, details.regions_of_operation].filter(Boolean);
          reason = "Could help advance your career based on your goals";
          break;
        case 'sponsor':
          category = details.industry ?? 'Sponsor';
          tags = [details.industry, details.sponsorship_focus].filter(Boolean);
          reason = "Potential partnership opportunity based on your profile";
          break;
        case 'equipment_supplier':
          category = details.specialization ?? 'Equipment';
          tags = [details.products, details.specialization].filter(Boolean);
          reason = "Equipment that could enhance your performance";
          break;
      }

      return {
        id: profile.id,
        title: profile.full_name ?? type.charAt(0).toUpperCase() + type.slice(1) + " recommendation",
        type: type,
        category: category ?? "",
        description: details.description ?? `Recommended ${type} based on your profile`,
        imageUrl: profile.avatar_url,
        location: details.country ?? details.city ?? details.location,
        tags: tags.filter(Boolean),
        reason: reason,
        score: score
      };
    });

  } catch (error) {
    console.error(`Error fetching ${type} recommendations:`, error);
    // Return mock data as fallback
    return getMockRecommendationsByType(type, limit);
  }
};

// Get all recommendations for a user
export const getRecommendations = async (
  userId: string,
  limit: number = 6
): Promise<Recommendation[]> => {
  try {
    // Get all stakeholder types
    const stakeholderTypes: StakeholderType[] = ['player', 'coach', 'club', 'agent', 'sponsor', 'equipment_supplier'];
    
    // Fetch recommendations for each type
    const recommendationsPromises = stakeholderTypes.map(type => 
      fetchRecommendationsByType(userId, type, Math.ceil(limit / stakeholderTypes.length))
    );
    
    // Wait for all requests to complete
    const resultsArray = await Promise.all(recommendationsPromises);
    
    // Combine all recommendations and shuffle them
    let allRecommendations = resultsArray.flat();
    
    // Shuffle recommendations
    allRecommendations = allRecommendations.sort(() => Math.random() - 0.5);
    
    // Return limited number of recommendations
    return allRecommendations.slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Return mock recommendations as fallback
    const mockRecs = getMockRecommendations(limit);
    return mockRecs;
  }
};

// Get mock recommendations for a specific type
const getMockRecommendationsByType = (type: StakeholderType, limit: number): Recommendation[] => {
  let mockData: any[] = [];
  
  switch (type) {
    case 'player':
      mockData = mockPlayers;
      break;
    case 'coach':
      mockData = mockCoaches;
      break;
    case 'club':
      mockData = mockClubs;
      break;
    case 'agent':
      mockData = mockAgents;
      break;
    case 'sponsor':
      mockData = mockSponsors;
      break;
    case 'equipment_supplier':
      mockData = mockEquipmentSuppliers;
      break;
    default:
      mockData = [];
  }
  
  // Map to recommendation format
  return mockData.slice(0, limit).map(item => {
    let category = '';
    let tags: string[] = [];
    let reason = '';
    
    switch (type) {
      case 'player':
        category = item.position || 'Player';
        tags = [item.position, item.skills && item.skills[0]].filter(Boolean);
        reason = `Based on your player preferences and scouting history`;
        break;
      case 'coach':
        category = item.role || 'Coach';
        tags = [item.role, item.club].filter(Boolean);
        reason = `Matches your coaching style preferences and development needs`;
        break;
      case 'club':
        category = item.league || 'Club';
        tags = [item.league, item.location].filter(Boolean);
        reason = `Aligns with your career aspirations and playing style`;
        break;
      case 'agent':
        category = item.agency || 'Agent';
        tags = item.specialties ? item.specialties.slice(0, 2) : [];
        reason = `Could help advance your career based on your goals`;
        break;
      case 'sponsor':
      case 'equipment_supplier':
        category = item.services && item.services[0] || type.replace('_', ' ');
        tags = item.services ? item.services.slice(0, 2) : [];
        reason = `Potential partnership opportunity based on your profile`;
        break;
    }
    
    return {
      id: item.id,
      title: item.name,
      type: type,
      category: category,
      description: item.description || `Recommended ${type} based on your profile`,
      imageUrl: item.avatar,
      // Now always safe: player/location exists
      location: item.location,
      tags: tags,
      reason: reason,
      score: item.matchScore || Math.floor(Math.random() * 16) + 80
    };
  });
};

// Get mock recommendations
const getMockRecommendations = (limit: number): Recommendation[] => {
  // Combine all mock data
  const allMockData = allMockStakeholders;
  
  // Shuffle the array
  const shuffled = [...allMockData].sort(() => Math.random() - 0.5);
  
  // Take the requested number of items
  const selected = shuffled.slice(0, limit);
  
  // Convert to recommendation format
  return selected.map(item => {
    const type = item.type as StakeholderType;
    let category = '';
    let tags: string[] = [];
    
    if ('position' in item && item.position) {
      category = item.position;
      tags = ['football', 'player'];
    } else if ('role' in item && item.role) {
      category = item.role;
      tags = ['coaching', 'football'];
    } else if ('league' in item && item.league) {
      category = item.league;
      tags = ['club', 'football'];
    } else if ('agency' in item && item.agency) {
      category = 'Agent';
      tags = ['representation', 'transfers'];
    } else if ('services' in item && item.services && item.services.length > 0) {
      category = item.type.replace('_', ' ');
      tags = item.services.slice(0, 2);
    } else {
      category = type.replace('_', ' ');
      tags = ['football', 'sports'];
    }
    
    return {
      id: item.id,
      title: item.name,
      type: type,
      category: category,
      description: item.description || `Recommended ${type} based on your profile`,
      imageUrl: item.avatar,
      location: item.location,
      tags: tags,
      reason: `Matching your profile and preferences`,
      score: Math.floor(Math.random() * 16) + 80
    };
  });
};
