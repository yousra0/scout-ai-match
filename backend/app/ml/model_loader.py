
import pickle
import os
from typing import Dict, Any, Optional, List
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

from app.core.config import settings

class ModelRegistry:
    """
    Registry for machine learning models used in the application.
    """
    _instance = None
    _models = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistry, cls).__new__(cls)
            cls._instance._load_models()
        return cls._instance
    
    def _load_models(self):
        """Load all ML models from disk or create default models if not found"""
        try:
            # Load KNN model for player matching
            if os.path.exists(settings.KNN_MODEL_PATH):
                with open(settings.KNN_MODEL_PATH, 'rb') as f:
                    self._models['knn'] = pickle.load(f)
                print(f"KNN model loaded from {settings.KNN_MODEL_PATH}")
            else:
                print(f"Warning: KNN model not found at {settings.KNN_MODEL_PATH}")
                self._create_default_knn_model()
            
            # Load similarity model
            if os.path.exists(settings.SIMILARITY_MODEL_PATH):
                with open(settings.SIMILARITY_MODEL_PATH, 'rb') as f:
                    self._models['similarity'] = pickle.load(f)
                print(f"Similarity model loaded from {settings.SIMILARITY_MODEL_PATH}")
            else:
                print(f"Warning: Similarity model not found at {settings.SIMILARITY_MODEL_PATH}")
                self._create_default_similarity_model()
                
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            # Create fallback models
            self._create_default_knn_model()
            self._create_default_similarity_model()
    
    def _create_default_knn_model(self):
        """Create a default KNN model with sample data"""
        try:
            print("Creating default KNN model")
            # Create sample data
            sample_data = np.array([
                # Age, Height, Speed, Strength, Skill
                [20, 180, 85, 75, 80],  # Player 1
                [22, 175, 90, 70, 85],  # Player 2
                [25, 185, 70, 85, 75],  # Player 3
                [19, 178, 88, 65, 78],  # Player 4
                [27, 182, 75, 80, 82],  # Player 5
            ])
            
            # Create and train KNN model
            scaler = StandardScaler()
            scaled_data = scaler.fit_transform(sample_data)
            knn_model = NearestNeighbors(n_neighbors=3, algorithm='auto', metric='euclidean')
            knn_model.fit(scaled_data)
            
            # Store scaler with model
            self._models['knn'] = {
                'model': knn_model,
                'scaler': scaler,
                'feature_names': ['age', 'height', 'speed', 'strength', 'skill']
            }
            
            print("Default KNN model created successfully")
        except Exception as e:
            print(f"Error creating default KNN model: {str(e)}")
    
    def _create_default_similarity_model(self):
        """Create a default similarity model based on cosine similarity"""
        try:
            print("Creating default similarity model")
            # For similarity model, we'll just create a placeholder since
            # actual calculation can be done on-the-fly
            self._models['similarity'] = {
                'feature_names': ['age', 'height', 'speed', 'strength', 'skill'],
                'user_vectors': {
                    # Sample user data with feature vectors
                    '1': np.array([20, 180, 85, 75, 80]),
                    '2': np.array([22, 175, 90, 70, 85]),
                    '3': np.array([25, 185, 70, 85, 75]),
                    '4': np.array([19, 178, 88, 65, 78]),
                    '5': np.array([27, 182, 75, 80, 82]),
                }
            }
            print("Default similarity model created successfully")
        except Exception as e:
            print(f"Error creating default similarity model: {str(e)}")
    
    def get_model(self, model_name: str) -> Optional[Any]:
        """
        Get a model by name
        
        Args:
            model_name: Name of the model to retrieve
            
        Returns:
            The requested model or None if not found
        """
        return self._models.get(model_name)
    
    def find_matches(self, user_features: Dict[str, Any], model_name: str = 'knn', top_n: int = 5) -> list:
        """
        Find matches for a user based on their features
        
        Args:
            user_features: Dictionary of user features
            model_name: Name of the model to use for matching
            top_n: Number of matches to return
            
        Returns:
            List of user IDs and match scores
        """
        model = self.get_model(model_name)
        if not model:
            return self._fallback_matches(top_n)
        
        try:
            # Implementation depends on the specific model
            if model_name == 'knn':
                # Convert user features to the format expected by the model
                feature_vector = self._preprocess_features(user_features, model_name)
                
                # Use the model to find nearest neighbors
                knn = model.get('model')
                distances, indices = knn.kneighbors(feature_vector.reshape(1, -1), n_neighbors=min(top_n, 5))
                
                # Return the indices and distances
                return [
                    {"id": str(idx), "score": float(1 / (1 + dist))}
                    for idx, dist in zip(indices[0], distances[0])
                ]
            
            elif model_name == 'similarity':
                # Calculate similarity between user and all vectors in the database
                user_vector = self._preprocess_features(user_features, model_name)
                user_vectors = model.get('user_vectors', {})
                
                similarities = []
                for user_id, vector in user_vectors.items():
                    similarity = self._cosine_similarity(user_vector, vector)
                    similarities.append({"id": user_id, "score": similarity})
                
                # Sort by similarity (descending) and return top N
                similarities.sort(key=lambda x: x["score"], reverse=True)
                return similarities[:top_n]
            
            return self._fallback_matches(top_n)
        except Exception as e:
            print(f"Error finding matches: {str(e)}")
            return self._fallback_matches(top_n)
    
    def _fallback_matches(self, top_n: int = 5) -> List[Dict[str, Any]]:
        """Return fallback match results when real models fail"""
        return [
            {"id": str(i), "score": float(0.9 - (i * 0.05))}
            for i in range(1, top_n + 1)
        ]
    
    def _preprocess_features(self, features: Dict[str, Any], model_name: str) -> np.ndarray:
        """
        Preprocess user features for model input
        
        Args:
            features: Dictionary of user features
            model_name: Name of the model to use
            
        Returns:
            Preprocessed feature vector
        """
        model = self.get_model(model_name)
        if not model:
            # Default preprocessing for test
            return np.array([0, 0, 0, 0, 0])
        
        # Get feature names for the model
        feature_names = model.get('feature_names', [])
        
        # Extract values for each feature
        feature_list = []
        for feature in feature_names:
            value = features.get(feature, 0)
            # Convert string values to numeric if necessary
            if isinstance(value, str):
                try:
                    value = float(value)
                except (ValueError, TypeError):
                    value = 0
            feature_list.append(value)
        
        feature_vector = np.array(feature_list)
        
        # Apply scaling if the model has a scaler
        scaler = model.get('scaler')
        if scaler and model_name == 'knn':
            feature_vector = scaler.transform(feature_vector.reshape(1, -1)).flatten()
            
        return feature_vector
    
    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """Calculate cosine similarity between two vectors"""
        if np.all(a == 0) or np.all(b == 0):
            return 0.0
        
        dot_product = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        
        similarity = dot_product / (norm_a * norm_b)
        # Convert from -1:1 range to 0:1 range
        return float((similarity + 1) / 2)

# Create a singleton instance
model_registry = ModelRegistry()
