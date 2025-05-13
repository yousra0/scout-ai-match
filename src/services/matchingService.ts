
import { supabase } from '@/integrations/supabase/client';
import { 
  profileToFeatureVector, 
  kNearestNeighbors, 
  calculateMatchScore,
  cosineSimilarity
} from '@/utils/similarityModels';

export interface Match {
  id: string;
  name: string;
  type: 'player' | 'coach' | 'club' | 'agent' | 'sponsor' | 'equipment_supplier';
  matchScore: number;
  description: string;
  avatarUrl?: string;
  location?: string;
  skills?: string[];
  position?: string;
}

// Get all profiles for matching
export const fetchProfilesForMatching = async (
  userType?: string,
  currentUserId?: string
): Promise<any[]> => {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        player_details(*),
        coach_details(*),
        club_details(*),
        agent_details(*),
        sponsor_details(*),
        equipment_supplier_details(*)
      `);
    
    // Filter by user type if provided
    if (userType && userType !== 'all') {
      query = query.eq('user_type', userType);
    }
    
    // Exclude current user
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching profiles for matching:', error);
    return [];
  }
};

// Get user profile by ID
export const fetchUserProfile = async (userId: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
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
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Find matches using KNN
export const findMatchesKNN = async (
  userId: string,
  userType: string = 'all',
  k: number = 6
): Promise<Match[]> => {
  try {
    // Get user profile
    const userProfile = await fetchUserProfile(userId);
    if (!userProfile) {
      console.log('User profile not found, using mock data');
      return getMockMatches(k);
    }
    
    // Get all potential matches
    const allProfiles = await fetchProfilesForMatching(userType, userId);
    if (allProfiles.length === 0) {
      console.log('No profiles found for matching, using mock data');
      return getMockMatches(k);
    }
    
    // Convert profiles to feature vectors
    const userVector = profileToFeatureVector(userProfile);
    const profileVectors = allProfiles.map(profile => ({
      id: profile.id,
      vector: profileToFeatureVector(profile),
      profile
    }));
    
    // Find K nearest neighbors
    const neighbors = kNearestNeighbors(
      profileVectors.map(pv => ({ id: pv.id, vector: pv.vector })),
      userVector,
      k,
      (a, b) => 1 - cosineSimilarity(a, b) // Convert similarity to distance
    );
    
    // Convert to Match objects
    const matches = neighbors.map(neighbor => {
      const profileData = profileVectors.find(pv => pv.id === neighbor.id)?.profile;
      if (!profileData) return null;
      
      const detailsKey = `${profileData.user_type}_details`;
      const details = profileData[detailsKey];
      
      return {
        id: profileData.id,
        name: profileData.full_name,
        type: profileData.user_type as any,
        matchScore: Math.round((1 - neighbor.distance) * 100), // Convert distance back to similarity score
        description: details?.description || 'No description available',
        avatarUrl: profileData.avatar_url,
        location: details?.country || details?.city || '',
        skills: details?.specialization ? [details.specialization] : undefined,
        position: details?.position,
      };
    }).filter(Boolean) as Match[];
    
    if (matches.length === 0) {
      console.log('No matches found with KNN, using mock data');
      return getMockMatches(k);
    }
    
    return matches;
    
  } catch (error) {
    console.error('Error finding matches with KNN:', error);
    return getMockMatches(k);
  }
};

// Find matches using cosine similarity
export const findMatchesCosineSimilarity = async (
  userId: string,
  userType: string = 'all',
  limit: number = 6
): Promise<Match[]> => {
  try {
    // Get user profile
    const userProfile = await fetchUserProfile(userId);
    if (!userProfile) {
      console.log('User profile not found, using mock data');
      return getMockMatches(limit);
    }
    
    // Get all potential matches
    const allProfiles = await fetchProfilesForMatching(userType, userId);
    if (allProfiles.length === 0) {
      console.log('No profiles found for matching, using mock data');
      return getMockMatches(limit);
    }
    
    // Convert profiles to feature vectors
    const userVector = profileToFeatureVector(userProfile);
    
    // Calculate similarity scores for all profiles
    const scoredProfiles = allProfiles.map(profile => {
      const profileVector = profileToFeatureVector(profile);
      const similarity = cosineSimilarity(userVector, profileVector);
      
      return {
        profile,
        similarity
      };
    });
    
    // Sort by similarity (descending) and take top N
    const topMatches = scoredProfiles
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
    
    // Convert to Match objects
    const matches = topMatches.map(match => {
      const profileData = match.profile;
      const detailsKey = `${profileData.user_type}_details`;
      const details = profileData[detailsKey];
      
      return {
        id: profileData.id,
        name: profileData.full_name,
        type: profileData.user_type as any,
        matchScore: Math.round(match.similarity * 100), // Convert from 0-1 to percentage
        description: details?.description || 'No description available',
        avatarUrl: profileData.avatar_url,
        location: details?.country || details?.city || '',
        skills: details?.specialization ? [details.specialization] : undefined,
        position: details?.position,
      };
    });
    
    if (matches.length === 0) {
      console.log('No matches found with cosine similarity, using mock data');
      return getMockMatches(limit);
    }
    
    return matches;
    
  } catch (error) {
    console.error('Error finding matches with cosine similarity:', error);
    return getMockMatches(limit);
  }
};

// Get mock matches for fallback
const getMockMatches = (limit: number = 6): Match[] => {
  const mockMatches: Match[] = [
    {
      id: '1',
      name: 'FC Barcelona Youth Academy',
      type: 'club',
      matchScore: 95,
      description: 'Looking for talented young players with technical skills',
      avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
      location: 'Barcelona, Spain',
    },
    {
      id: '2',
      name: 'Marco Rossi',
      type: 'coach',
      matchScore: 93,
      description: 'Specializes in developing young attacking talent',
      skills: ['Youth Development', 'Attacking Tactics', 'Technical Training'],
      location: 'Milan, Italy',
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      type: 'player',
      matchScore: 91,
      description: 'Talented midfielder looking for a new challenge',
      position: 'Midfielder',
      location: 'London, UK',
      skills: ['Passing', 'Vision', 'Ball Control'],
    },
    {
      id: '4',
      name: 'Elite Sports Agency',
      type: 'agent',
      matchScore: 88,
      description: 'Specializing in career development for young talents',
      location: 'Paris, France',
    },
    {
      id: '5',
      name: 'SportEquip Pro',
      type: 'equipment_supplier',
      matchScore: 82,
      description: 'Custom equipment for professional athletes',
      location: 'Berlin, Germany',
    },
    {
      id: '6',
      name: 'Global Sports Foundation',
      type: 'sponsor',
      matchScore: 85,
      description: 'Supporting the next generation of sports stars',
      location: 'New York, USA',
    },
  ];
  
  // Return only the requested number of matches
  return mockMatches.slice(0, limit);
};
