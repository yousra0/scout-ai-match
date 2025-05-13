
import { supabase } from '@/integrations/supabase/client';
import { 
  profileToFeatureVector, 
  calculateMatchScore, 
  cosineSimilarity 
} from '@/utils/similarityModels';

export interface Recommendation {
  id: string;
  title: string;
  type: 'player' | 'club' | 'agent' | 'coach' | 'event' | 'course' | 'opportunity';
  category: string;
  description: string;
  imageUrl?: string;
  location?: string;
  date?: string;
  tags?: string[];
  reason: string;
  score: number;
}

// Fetch profiles by type with similarity scores
export const fetchRecommendationsByType = async (
  userId: string,
  type: string,
  limit: number = 10,
  similarityThreshold: number = 0.5
): Promise<Recommendation[]> => {
  try {
    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select(`
        *,
        player_details(*),
        coach_details(*),
        club_details(*),
        agent_details(*)
      `)
      .eq('id', userId)
      .single();
    
    if (userError) {
      throw userError;
    }
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    // Get all profiles matching the requested type
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        *,
        player_details(*),
        coach_details(*),
        club_details(*),
        agent_details(*)
      `)
      .eq('user_type', type)
      .neq('id', userId);
    
    if (profilesError) {
      throw profilesError;
    }
    
    if (!profiles || profiles.length === 0) {
      return [];
    }
    
    // Convert user profile to feature vector
    const userVector = profileToFeatureVector(userProfile);
    
    // Calculate similarity scores and map to recommendations
    const recommendations = profiles
      .map(profile => {
        const profileVector = profileToFeatureVector(profile);
        const similarity = cosineSimilarity(userVector, profileVector);
        
        // Skip items below threshold
        if (similarity < similarityThreshold) {
          return null;
        }
        
        const detailsKey = `${profile.user_type}_details`;
        const details = profile[detailsKey];
        
        // Generate reason based on profile type and attributes
        let reason = '';
        if (profile.user_type === 'player') {
          reason = `Player with ${details?.position} position matches your preferences`;
        } else if (profile.user_type === 'club') {
          reason = `Club in ${details?.country || 'your region'} matches your career goals`;
        } else if (profile.user_type === 'coach') {
          reason = `Coach specializing in ${details?.specialization || 'your needs'} could improve your skills`;
        } else if (profile.user_type === 'agent') {
          reason = `Agent with experience in ${details?.specialization || 'your area'} could help your career`;
        }
        
        return {
          id: profile.id,
          title: profile.full_name,
          type: profile.user_type as any,
          category: details?.position || details?.specialization || profile.user_type,
          description: details?.description || 'No description available',
          imageUrl: profile.avatar_url,
          location: details?.country || details?.city,
          tags: details?.specialization ? [details.specialization] : [],
          reason,
          score: similarity
        };
      })
      .filter(Boolean) as Recommendation[];
    
    // Sort by similarity score and limit results
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching recommendations by type:', error);
    return [];
  }
};

// Get recommendations for various entity types
export const getRecommendations = async (
  userId: string,
  limit: number = 5
): Promise<Recommendation[]> => {
  try {
    // Get recommendations for different entity types
    const [players, clubs, coaches, agents] = await Promise.all([
      fetchRecommendationsByType(userId, 'player', limit),
      fetchRecommendationsByType(userId, 'club', limit),
      fetchRecommendationsByType(userId, 'coach', limit),
      fetchRecommendationsByType(userId, 'agent', limit),
    ]);
    
    // Combine and sort by score
    const allRecommendations = [...players, ...clubs, ...coaches, ...agents]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    // Add mock event/course/opportunity data (these would come from a separate table in production)
    const mockRecommendations: Recommendation[] = [
      {
        id: '101',
        title: 'Advanced Finishing Techniques',
        type: 'course',
        category: 'Training',
        description: 'Master the art of clinical finishing with this comprehensive course',
        imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d',
        tags: ['Technical', 'Attacking', 'Shooting'],
        reason: 'Based on your position and skill development goals',
        score: 0.92
      },
      {
        id: '102',
        title: 'Youth Tournament - Barcelona',
        type: 'event',
        category: 'Competition',
        description: 'International youth tournament with scouts from top European clubs',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
        location: 'Barcelona, Spain',
        date: 'June 15-20, 2025',
        reason: 'Matches your age group and performance level',
        score: 0.88
      },
      {
        id: '103',
        title: 'Trial Opportunity - Brighton & Hove U23',
        type: 'opportunity',
        category: 'Trial',
        description: 'Week-long trial with Premier League club\'s U23 team',
        location: 'Brighton, UK',
        date: 'July 10-17, 2025',
        reason: 'Matches your skill level and career aspirations',
        score: 0.85
      }
    ];
    
    // Ensure we don't have too many recommendations
    const finalRecommendations = [...allRecommendations, ...mockRecommendations]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit * 2); // Allow for doubled limit to include mock data
    
    // Convert score to percentage for display
    return finalRecommendations.map(rec => ({
      ...rec,
      score: Math.round(rec.score * 100)
    }));
    
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};
