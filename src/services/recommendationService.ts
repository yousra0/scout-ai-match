
import { supabase } from '@/integrations/supabase/client';
import { 
  profileToFeatureVector, 
  calculateMatchScore, 
  cosineSimilarity 
} from '@/utils/similarityModels';
import {
  mockPlayers,
  mockCoaches,
  mockClubs,
  mockAgents,
  mockSponsors
} from '@/components/player/PlayerData';

export interface Recommendation {
  id: string;
  title: string;
  type: 'player' | 'club' | 'agent' | 'coach' | 'event' | 'course' | 'opportunity' | 'sponsor' | 'equipment_supplier';
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
        agent_details(*),
        sponsor_details(*),
        equipment_supplier_details(*)
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
        agent_details(*),
        sponsor_details(*),
        equipment_supplier_details(*)
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
        } else if (profile.user_type === 'sponsor') {
          reason = `Sponsor interested in ${details?.sponsorship_focus || 'athletes like you'} could be a good partnership`;
        } else if (profile.user_type === 'equipment_supplier') {
          reason = `Equipment supplier specializing in ${details?.specialization || 'your sport'} might be a good fit`;
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
    const [players, clubs, coaches, agents, sponsors] = await Promise.all([
      fetchRecommendationsByType(userId, 'player', limit),
      fetchRecommendationsByType(userId, 'club', limit),
      fetchRecommendationsByType(userId, 'coach', limit),
      fetchRecommendationsByType(userId, 'agent', limit),
      fetchRecommendationsByType(userId, 'sponsor', limit),
    ]);
    
    // Combine and sort by score
    const allRecommendations = [...players, ...clubs, ...coaches, ...agents, ...sponsors]
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

// Enhanced mock recommendations with more data
const getMockRecommendations = (type: string, limit: number = 5): Recommendation[] => {
  // Course recommendations
  const courseRecommendations: Recommendation[] = [
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
      id: '111',
      title: 'Performance Psychology for Athletes',
      type: 'course',
      category: 'Mental Training',
      description: 'Techniques to improve mental toughness, focus, and game preparation',
      imageUrl: 'https://images.unsplash.com/photo-1508706000025-411d1788f9b9',
      tags: ['Psychology', 'Mental Strength', 'Performance'],
      reason: 'Could help you improve your mental game under pressure',
      score: 86
    },
    {
      id: '112',
      title: 'Leadership Skills for Team Captains',
      type: 'course',
      category: 'Leadership',
      description: 'Develop the leadership qualities needed to captain your team effectively',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
      tags: ['Leadership', 'Communication', 'Team Building'],
      reason: 'Based on your team role and career trajectory',
      score: 83
    },
    {
      id: '113',
      title: 'Recovery & Injury Prevention',
      type: 'course',
      category: 'Fitness',
      description: 'Science-backed approaches to staying fit and avoiding injuries',
      imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2',
      tags: ['Recovery', 'Injury Prevention', 'Fitness'],
      reason: 'Essential knowledge for prolonging your athletic career',
      score: 81
    }
  ];

  // Event recommendations
  const eventRecommendations: Recommendation[] = [
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
      id: '114',
      title: 'Football Tech Showcase',
      type: 'event',
      category: 'Exhibition',
      description: 'The latest in football technology, training equipment and analytics',
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
      location: 'London, UK',
      date: 'September 8-10, 2025',
      reason: 'Could help you discover new tools to improve your game',
      score: 84
    },
    {
      id: '115',
      title: 'Elite Skills Workshop',
      type: 'event',
      category: 'Training',
      description: 'Intensive two-day workshop with professional coaches',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
      location: 'Paris, France',
      date: 'July 22-23, 2025',
      reason: 'Focused on skills relevant to your playing style',
      score: 86
    },
    {
      id: '116',
      title: 'Football Agents Networking Day',
      type: 'event',
      category: 'Networking',
      description: 'Connect with licensed agents from top agencies around the world',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
      location: 'Frankfurt, Germany',
      date: 'May 15, 2025',
      reason: 'Could help advance your professional career opportunities',
      score: 82
    }
  ];

  // Opportunity recommendations
  const opportunityRecommendations: Recommendation[] = [
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
    },
    {
      id: '117',
      title: 'US College Scholarship Program',
      type: 'opportunity',
      category: 'Scholarship',
      description: 'Full athletic scholarship opportunities at Division 1 US colleges',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
      location: 'USA, Various',
      date: 'Applications due October 1, 2025',
      reason: 'Combines athletic development with quality education',
      score: 87
    },
    {
      id: '118',
      title: 'Football Media Internship',
      type: 'opportunity',
      category: 'Internship',
      description: 'Learn sports media skills with leading broadcaster',
      imageUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1',
      location: 'Remote/London',
      date: 'Starting January 2026',
      reason: 'Could provide valuable skills for your post-playing career',
      score: 79
    },
    {
      id: '119',
      title: 'Youth Coaching Certification',
      type: 'opportunity',
      category: 'Certification',
      description: 'Get certified as a youth coach while still playing',
      imageUrl: 'https://images.unsplash.com/photo-1591343395902-1adcb454c4e2',
      location: 'Online with practical sessions',
      date: 'Flexible enrollment',
      reason: 'Build valuable coaching skills alongside your playing career',
      score: 81
    }
  ];
  
  // Convert our mock player/coach/club etc data to recommendations format
  const playerRecommendations: Recommendation[] = mockPlayers.map(player => ({
    id: player.id,
    title: player.name,
    type: 'player',
    category: player.position || 'Player',
    description: player.description,
    imageUrl: player.avatarUrl,
    location: player.location,
    tags: player.skills,
    reason: `Player with similar style and complementary skills`,
    score: player.matchScore
  }));
  
  const coachRecommendations: Recommendation[] = mockCoaches.map(coach => ({
    id: coach.id,
    title: coach.name,
    type: 'coach',
    category: 'Coaching',
    description: coach.description,
    imageUrl: coach.avatarUrl,
    location: coach.location,
    tags: coach.skills,
    reason: `Coach with expertise that matches your development needs`,
    score: coach.matchScore
  }));
  
  const clubRecommendations: Recommendation[] = mockClubs.map(club => ({
    id: club.id,
    title: club.name,
    type: 'club',
    category: 'Club',
    description: club.description,
    imageUrl: club.avatarUrl,
    location: club.location,
    reason: `Club that fits your playing style and career goals`,
    score: club.matchScore
  }));
  
  const agentRecommendations: Recommendation[] = mockAgents.map(agent => ({
    id: agent.id,
    title: agent.name,
    type: 'agent',
    category: 'Agent',
    description: agent.description,
    imageUrl: agent.avatarUrl,
    location: agent.location,
    tags: agent.skills,
    reason: `Agent with expertise in your career development needs`,
    score: agent.matchScore
  }));
  
  const sponsorRecommendations: Recommendation[] = mockSponsors.map(sponsor => ({
    id: sponsor.id,
    title: sponsor.name,
    type: 'sponsor',
    category: 'Sponsor',
    description: sponsor.description,
    imageUrl: sponsor.avatarUrl,
    location: sponsor.location,
    reason: `Sponsor interested in athletes with your profile`,
    score: sponsor.matchScore
  }));

  // Combine all recommendation types
  const allRecommendations = [
    ...courseRecommendations,
    ...eventRecommendations,
    ...opportunityRecommendations,
    ...playerRecommendations,
    ...coachRecommendations,
    ...clubRecommendations,
    ...agentRecommendations,
    ...sponsorRecommendations
  ];
  
  // Filter by type if specified
  let filteredRecommendations = allRecommendations;
  if (type !== 'all') {
    filteredRecommendations = allRecommendations.filter(rec => rec.type === type);
    
    // If we still need more, grab from other types to fill
    if (filteredRecommendations.length < limit) {
      const remaining = allRecommendations.filter(rec => rec.type !== type);
      filteredRecommendations = [...filteredRecommendations, ...remaining];
    }
  }
  
  // Return only the requested number of recommendations
  return filteredRecommendations.slice(0, limit);
};
