import { supabase } from '@/integrations/supabase/client';
import { Stakeholder, StakeholderType, fetchStakeholdersByType } from './stakeholderService';

// Types for recommendations
export interface Recommendation {
  id: string;
  name: string;
  type: StakeholderType;
  avatar: string;
  matchPercentage: number;
  location: string;
  description?: string;
  tags?: string[];
}

// Get stakeholder location helper function
const getStakeholderLocation = (stakeholder: any) => {
  // Attempt to use .location, fallback to .country or .city, or empty string
  return stakeholder.location || stakeholder.country || stakeholder.city || "";
};

// Get recommendations for a user
export const getRecommendations = async (
  userId: string,
  stakeholderType: StakeholderType = 'player',
  limit: number = 10
): Promise<Recommendation[]> => {
  try {
    // In a real app, this would query a recommendations engine or algorithm
    // For now, we'll just fetch stakeholders of the requested type
    const stakeholders = await fetchStakeholdersByType(stakeholderType, limit);
    
    // Transform stakeholders into recommendations with match percentages
    const recommendations = stakeholders
      .filter(stakeholder => stakeholder.id !== userId) // Filter out the current user
      .map(stakeholder => ({
        id: stakeholder.id,
        name: stakeholder.name,
        type: stakeholder.type,
        avatar: stakeholder.avatar,
        matchPercentage: Math.floor(Math.random() * 30) + 70, // Random match % between 70-99
        location: getStakeholderLocation(stakeholder),
        description: stakeholder.description,
        tags: getStakeholderTags(stakeholder),
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage); // Sort by match percentage
    
    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

// Helper function to generate tags based on stakeholder type
const getStakeholderTags = (stakeholder: Stakeholder): string[] => {
  const tags: string[] = [];
  
  switch (stakeholder.type) {
    case 'player':
      if ('position' in stakeholder) tags.push(stakeholder.position);
      if ('club' in stakeholder) tags.push(stakeholder.club);
      break;
    case 'coach':
      if ('role' in stakeholder) tags.push(stakeholder.role || '');
      if ('club' in stakeholder) tags.push(stakeholder.club || '');
      break;
    case 'club':
      if ('league' in stakeholder) tags.push(stakeholder.league || '');
      break;
    case 'agent':
      if ('agency' in stakeholder) tags.push(stakeholder.agency || '');
      if ('specialties' in stakeholder && stakeholder.specialties) {
        tags.push(...stakeholder.specialties.slice(0, 2));
      }
      break;
    case 'sponsor':
    case 'equipment_supplier':
      if ('services' in stakeholder && stakeholder.services) {
        tags.push(...stakeholder.services.slice(0, 2));
      }
      break;
  }
  
  return tags.filter(Boolean); // Remove empty strings
};

// Get top matches for a specific user
export const getTopMatches = async (
  userId: string,
  limit: number = 5
): Promise<Recommendation[]> => {
  try {
    // In a real app, this would use a more sophisticated matching algorithm
    // For now, we'll just return the top recommendations
    const recommendations = await getRecommendations(userId, 'player', limit * 2);
    return recommendations.slice(0, limit);
  } catch (error) {
    console.error('Error getting top matches:', error);
    return [];
  }
};

// Get recommendations by category (e.g., players, clubs, coaches)
export const getRecommendationsByCategory = async (
  userId: string,
  categories: StakeholderType[] = ['player', 'club', 'coach', 'agent'],
  limitPerCategory: number = 3
): Promise<Record<StakeholderType, Recommendation[]>> => {
  try {
    const results: Record<StakeholderType, Recommendation[]> = {} as Record<StakeholderType, Recommendation[]>;
    
    // Get recommendations for each category
    for (const category of categories) {
      results[category] = await getRecommendations(userId, category, limitPerCategory);
    }
    
    return results;
  } catch (error) {
    console.error('Error getting recommendations by category:', error);
    return {} as Record<StakeholderType, Recommendation[]>;
  }
};
