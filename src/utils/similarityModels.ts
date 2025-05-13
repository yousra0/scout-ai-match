
/**
 * Utility functions for KNN and Cosine Similarity computations
 * Used by the matching system and recommendations
 */

// Calculate Euclidean distance between two vectors
export const euclideanDistance = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  return Math.sqrt(
    a.reduce((sum, value, index) => {
      const diff = value - b[index];
      return sum + diff * diff;
    }, 0)
  );
};

// Calculate cosine similarity between two vectors
export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  // Handle empty vectors to avoid NaN
  if (a.length === 0 || b.length === 0) {
    return 0;
  }
  
  // Calculate dot product
  const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
  
  // Calculate magnitudes
  const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  
  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  // Return cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
};

// Find K nearest neighbors
export const kNearestNeighbors = (
  dataPoints: Array<{ id: string; vector: number[] }>,
  query: number[],
  k: number,
  distanceFunction: (a: number[], b: number[]) => number = euclideanDistance
): Array<{ id: string; distance: number }> => {
  // Check for empty data
  if (dataPoints.length === 0) {
    return [];
  }
  
  // Calculate distances
  const distances = dataPoints.map(point => ({
    id: point.id,
    distance: distanceFunction(point.vector, query)
  }));
  
  // Sort by distance (ascending for Euclidean, descending for Cosine)
  const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
  
  // Return k nearest neighbors or all if fewer than k
  return sortedDistances.slice(0, Math.min(k, sortedDistances.length));
};

// Normalize a feature vector to have values between 0 and 1
export const normalizeFeatures = (features: number[]): number[] => {
  if (features.length === 0) {
    return [];
  }
  
  const min = Math.min(...features);
  const max = Math.max(...features);
  
  if (min === max) {
    return features.map(() => 0.5); // All values are the same
  }
  
  return features.map(value => (value - min) / (max - min));
};

// Convert user profile to feature vector
export const profileToFeatureVector = (profile: any): number[] => {
  // This function extracts numerical features from a user profile
  if (!profile) {
    return [0, 0, 0, 0, 0]; // Default empty vector
  }
  
  const features: number[] = [];
  const userType = profile.user_type;
  
  // Common features across all user types
  // Normalize ID to a simple hash number (this is just for demo purposes)
  const idHash = hashStringToNumber(profile.id) / 1000000;
  features.push(idHash % 1); // Keep it between 0 and 1
  
  // Example: Extract player attributes
  if (userType === 'player') {
    const playerDetails = profile.player_details || {};
    
    // Age (normalized to 0-1 range assuming players are between 15-40)
    const age = playerDetails.age || 20;
    const ageNorm = Math.max(0, Math.min(1, (age - 15) / 25));
    features.push(ageNorm);
    
    // Position encoded (simplified)
    const positionMap: {[key: string]: number} = {
      'goalkeeper': 0.1,
      'defender': 0.3,
      'midfielder': 0.6,
      'forward': 0.9,
      'striker': 1.0
    };
    
    const position = playerDetails.position?.toLowerCase() || '';
    const positionValue = positionMap[position] || 0.5;
    features.push(positionValue);
    
    // Country/Region value (simplified - just using string hash)
    const countryValue = playerDetails.country 
      ? hashStringToNumber(playerDetails.country) % 1
      : 0.5;
    features.push(countryValue);
    
    // Club value (simplified)
    const clubValue = playerDetails.club
      ? hashStringToNumber(playerDetails.club) % 1
      : 0.5;
    features.push(clubValue);
    
  } else if (userType === 'club') {
    const clubDetails = profile.club_details || {};
    
    // League level
    const leagueValue = clubDetails.league
      ? hashStringToNumber(clubDetails.league) % 1
      : 0.5;
    features.push(leagueValue);
    
    // Country/Region
    const countryValue = clubDetails.country 
      ? hashStringToNumber(clubDetails.country) % 1
      : 0.5;
    features.push(countryValue);
    
    // Club age/establishment (normalized 0-1 assuming 0-150 years)
    const foundedYear = clubDetails.founded_year || 2000;
    const currentYear = new Date().getFullYear();
    const ageNorm = Math.min(1, Math.max(0, (currentYear - foundedYear) / 150));
    features.push(ageNorm);
    
    // Placeholder for other features
    features.push(0.5);
    
  } else if (userType === 'coach') {
    const coachDetails = profile.coach_details || {};
    
    // Specialization
    const specializationValue = coachDetails.specialization
      ? hashStringToNumber(coachDetails.specialization) % 1
      : 0.5;
    features.push(specializationValue);
    
    // Experience (assuming text like "5 years", extract number)
    let experienceYears = 0;
    if (coachDetails.experience) {
      const match = coachDetails.experience.match(/\d+/);
      if (match) {
        experienceYears = parseInt(match[0], 10);
      }
    }
    const experienceNorm = Math.min(1, Math.max(0, experienceYears / 30));
    features.push(experienceNorm);
    
    // Current club
    const clubValue = coachDetails.current_club
      ? hashStringToNumber(coachDetails.current_club) % 1
      : 0.5;
    features.push(clubValue);
    
    // Coaching philosophy
    const philosophyValue = coachDetails.coaching_philosophy
      ? hashStringToNumber(coachDetails.coaching_philosophy) % 1
      : 0.5;
    features.push(philosophyValue);
    
  } else if (userType === 'agent') {
    const agentDetails = profile.agent_details || {};
    
    // Agency
    const agencyValue = agentDetails.agency
      ? hashStringToNumber(agentDetails.agency) % 1
      : 0.5;
    features.push(agencyValue);
    
    // Specialization
    const specializationValue = agentDetails.specialization
      ? hashStringToNumber(agentDetails.specialization) % 1
      : 0.5;
    features.push(specializationValue);
    
    // Experience years (normalized 0-1 assuming 0-30 years)
    const experienceYears = agentDetails.experience_years || 5;
    const experienceNorm = Math.min(1, Math.max(0, experienceYears / 30));
    features.push(experienceNorm);
    
    // Client count (normalized 0-1 assuming 0-100 clients)
    const clientCount = agentDetails.clients_count || 10;
    const clientsNorm = Math.min(1, Math.max(0, clientCount / 100));
    features.push(clientsNorm);
  } else {
    // For other user types, add placeholder features
    features.push(0.5, 0.5, 0.5, 0.5);
  }
  
  return features;
};

// Simple string hash function for demo purposes
const hashStringToNumber = (str: string): number => {
  if (!str) return 0;
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Calculate match score between two profiles
export const calculateMatchScore = (
  profileA: any,
  profileB: any,
  similarityMethod: 'cosine' | 'euclidean' = 'cosine'
): number => {
  // Convert profiles to feature vectors
  const vectorA = profileToFeatureVector(profileA);
  const vectorB = profileToFeatureVector(profileB);
  
  // Calculate similarity
  let similarityScore: number;
  
  if (similarityMethod === 'cosine') {
    similarityScore = cosineSimilarity(vectorA, vectorB);
    // Cosine similarity ranges from -1 to 1, normalize to 0-100
    return Math.round((similarityScore + 1) / 2 * 100);
  } else {
    // For Euclidean distance, closer to 0 is better
    const distance = euclideanDistance(vectorA, vectorB);
    // Normalize to 0-100 score (inverted, since lower distance is better)
    // Assuming max possible distance is sqrt(dimensions) for normalized features
    const maxDistance = Math.sqrt(vectorA.length);
    return Math.round((1 - Math.min(1, distance / maxDistance)) * 100);
  }
};
