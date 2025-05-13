
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
    if (!userProfile) return [];
    
    // Get all potential matches
    const allProfiles = await fetchProfilesForMatching(userType, userId);
    if (allProfiles.length === 0) return [];
    
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
    return neighbors.map(neighbor => {
      const profileData = profileVectors.find(pv => pv.id === neighbor.id)?.profile;
      if (!profileData) return null;
      
      const detailsKey = `${profileData.user_type}_details`;
      const details = profileData[detailsKey];
      
      return {
        id: profileData.id,
        name: profileData.full_name,
        type: profileData.user_type,
        matchScore: Math.round((1 - neighbor.distance) * 100), // Convert distance back to similarity score
        description: details?.description || '',
        avatarUrl: profileData.avatar_url,
        location: details?.country || details?.city || '',
        skills: details?.specialization ? [details.specialization] : undefined,
        position: details?.position,
      };
    }).filter(Boolean) as Match[];
    
  } catch (error) {
    console.error('Error finding matches with KNN:', error);
    return [];
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
    if (!userProfile) return [];
    
    // Get all potential matches
    const allProfiles = await fetchProfilesForMatching(userType, userId);
    if (allProfiles.length === 0) return [];
    
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
    return topMatches.map(match => {
      const profileData = match.profile;
      const detailsKey = `${profileData.user_type}_details`;
      const details = profileData[detailsKey];
      
      return {
        id: profileData.id,
        name: profileData.full_name,
        type: profileData.user_type,
        matchScore: Math.round((match.similarity + 1) / 2 * 100), // Convert from -1,1 to 0-100
        description: details?.description || '',
        avatarUrl: profileData.avatar_url,
        location: details?.country || details?.city || '',
        skills: details?.specialization ? [details.specialization] : undefined,
        position: details?.position,
      };
    });
    
  } catch (error) {
    console.error('Error finding matches with cosine similarity:', error);
    return [];
  }
};
