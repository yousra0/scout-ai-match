
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
      console.error('Error fetching user profile:', userError);
      return getMockRecommendations(type, limit);
    }
    
    if (!userProfile) {
      console.log('User profile not found, using mock data');
      return getMockRecommendations(type, limit);
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
      console.error('Error fetching profiles:', profilesError);
      return getMockRecommendations(type, limit);
    }
    
    if (!profiles || profiles.length === 0) {
      console.log(`No ${type} profiles found, using mock data`);
      return getMockRecommendations(type, limit);
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
          reason = `Player with ${details?.position || 'similar skills'} matches your preferences`;
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
          score: Math.round(similarity * 100) // Convert from 0-1 to percentage
        };
      })
      .filter(Boolean) as Recommendation[];
    
    // Sort by similarity score and limit results
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching recommendations by type:', error);
    return getMockRecommendations(type, limit);
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
      
    // If we didn't get enough recommendations, use mock data
    if (allRecommendations.length < limit) {
      const mockEvents = getMockRecommendations('event', limit);
      const mockCourses = getMockRecommendations('course', limit);
      const mockOpportunities = getMockRecommendations('opportunity', limit);
      
      // Add mock event/course/opportunity data 
      const mockRecommendations: Recommendation[] = [
        ...mockEvents,
        ...mockCourses,
        ...mockOpportunities
      ];
      
      // Fill the remaining slots with mock data
      const remainingSlots = limit - allRecommendations.length;
      allRecommendations.push(...mockRecommendations.slice(0, remainingSlots));
    }
    
    // Ensure we don't have too many recommendations
    const finalRecommendations = allRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit); 
    
    return finalRecommendations;
    
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return getMockRecommendations('all', limit);
  }
};

// Get mock recommendations by type
const getMockRecommendations = (type: string, limit: number = 5): Recommendation[] => {
  const allMockRecommendations: Recommendation[] = [
    {
      id: '101',
      title: 'Advanced Finishing Techniques',
      type: 'course',
      category: 'Training',
      description: 'Master the art of clinical finishing with this comprehensive course',
      imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d',
      tags: ['Technical', 'Attacking', 'Shooting'],
      reason: 'Based on your position and skill development goals',
      score: 92
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
      score: 88
    },
    {
      id: '103',
      title: 'Trial Opportunity - Brighton & Hove U23',
      type: 'opportunity',
      category: 'Trial',
      description: 'Week-long trial with Premier League club\'s U23 team',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
      location: 'Brighton, UK',
      date: 'July 10-17, 2025',
      reason: 'Matches your skill level and career aspirations',
      score: 85
    },
    {
      id: '104',
      title: 'FC Ajax Youth Academy',
      type: 'club',
      category: 'Academy',
      description: 'Renowned for developing technical players with strong fundamentals',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Ajax_Amsterdam.svg/1200px-Ajax_Amsterdam.svg.png',
      location: 'Amsterdam, Netherlands',
      reason: 'Aligns with your playing style and development needs',
      score: 86
    },
    {
      id: '105',
      title: 'Mental Performance Coach - Sarah Williams',
      type: 'coach',
      category: 'Mental Training',
      description: 'Sports psychologist specializing in young athlete mental preparation',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      location: 'Online Sessions Available',
      reason: 'Could help improve your mental game based on recent performances',
      score: 84
    },
    {
      id: '106',
      title: 'Elite Sports Management',
      type: 'agent',
      category: 'Career Management',
      description: 'Boutique agency specializing in youth development and career planning',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
      location: 'London, UK',
      reason: 'Their focus on youth players matches your career stage',
      score: 82
    },
    {
      id: '107',
      title: 'Advanced Tactical Training',
      type: 'course',
      category: 'Education',
      description: 'Learn professional-level tactical understanding and positional awareness',
      imageUrl: 'https://images.unsplash.com/photo-1611156340633-8964be513ee4',
      date: 'Online, self-paced',
      reason: 'Would complement your technical skills with tactical knowledge',
      score: 87
    },
    {
      id: '108',
      title: 'Global Youth Cup',
      type: 'event',
      category: 'Tournament',
      description: 'Premier international tournament for elite youth players',
      imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9',
      location: 'Miami, USA',
      date: 'August 5-12, 2025',
      reason: 'High visibility event with international scouts attending',
      score: 89
    },
    {
      id: '109',
      title: 'Professional Trial Series - Germany',
      type: 'opportunity',
      category: 'Trial',
      description: 'Series of trial matches with Bundesliga academy scouts',
      imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377',
      location: 'Frankfurt, Germany',
      date: 'September 5-15, 2025',
      reason: 'Your playing style would be appreciated in German football',
      score: 83
    }
  ];
  
  // Filter by type if specified
  let filteredRecommendations = allMockRecommendations;
  if (type !== 'all') {
    filteredRecommendations = allMockRecommendations.filter(rec => rec.type === type);
    
    // If we still need more, grab from other types to fill
    if (filteredRecommendations.length < limit) {
      const remaining = allMockRecommendations.filter(rec => rec.type !== type);
      filteredRecommendations = [...filteredRecommendations, ...remaining];
    }
  }
  
  // Return only the requested number of recommendations
  return filteredRecommendations.slice(0, limit);
};
