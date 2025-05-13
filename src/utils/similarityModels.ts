
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
  // Calculate distances
  const distances = dataPoints.map(point => ({
    id: point.id,
    distance: distanceFunction(point.vector, query)
  }));
  
  // Sort by distance (ascending for Euclidean, descending for Cosine)
  const sortedDistances = distanceFunction === euclideanDistance
    ? distances.sort((a, b) => a.distance - b.distance)
    : distances.sort((a, b) => b.distance - a.distance);
  
  // Return k nearest neighbors
  return sortedDistances.slice(0, k);
};

// Normalize a feature vector to have values between 0 and 1
export const normalizeFeatures = (features: number[]): number[] => {
  const min = Math.min(...features);
  const max = Math.max(...features);
  
  if (min === max) {
    return features.map(() => 0.5); // All values are the same
  }
  
  return features.map(value => (value - min) / (max - min));
};

// Convert user profile to feature vector
export const profileToFeatureVector = (profile: any): number[] => {
  // This function needs to extract numerical features from a user profile
  // This is a simplified example - adapt based on your specific user data structure
  const features: number[] = [];
  
  // Example: Extract player attributes
  if (profile.user_type === 'player') {
    // Age (normalized to 0-1 range assuming players are between 15-40)
    const ageNorm = profile.player_details?.age 
      ? Math.max(0, Math.min(1, (profile.player_details.age - 15) / 25)) 
      : 0.5;
    features.push(ageNorm);
    
    // Position encoded (simplified)
    const positionMap: {[key: string]: number} = {
      'goalkeeper': 0.1,
      'defender': 0.3,
      'midfielder': 0.6,
      'forward': 0.9
    };
    const positionValue = profile.player_details?.position 
      ? (positionMap[profile.player_details.position.toLowerCase()] || 0.5)
      : 0.5;
    features.push(positionValue);
    
    // Add more features based on your data model
    // Example: skill levels, experience, etc.
    
  } else if (profile.user_type === 'club') {
    // Club-specific features
    // Example: league level, budget, etc.
    
  } else if (profile.user_type === 'coach') {
    // Coach-specific features
    // Example: experience years, specialization, etc.
    
  } else if (profile.user_type === 'agent') {
    // Agent-specific features
  }
  
  // Add more generic features applicable to all user types
  
  return features;
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
    // Assuming max possible distance is 1 (for normalized features)
    return Math.round((1 - Math.min(1, distance)) * 100);
  }
};
