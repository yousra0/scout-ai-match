
import pickle
import os
from typing import Dict, Any, Optional
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
        """Load all ML models from disk"""
        try:
            # Load KNN model for player matching
            if os.path.exists(settings.KNN_MODEL_PATH):
                with open(settings.KNN_MODEL_PATH, 'rb') as f:
                    self._models['knn'] = pickle.load(f)
                print(f"KNN model loaded from {settings.KNN_MODEL_PATH}")
            else:
                print(f"Warning: KNN model not found at {settings.KNN_MODEL_PATH}")
            
            # Load similarity model
            if os.path.exists(settings.SIMILARITY_MODEL_PATH):
                with open(settings.SIMILARITY_MODEL_PATH, 'rb') as f:
                    self._models['similarity'] = pickle.load(f)
                print(f"Similarity model loaded from {settings.SIMILARITY_MODEL_PATH}")
            else:
                print(f"Warning: Similarity model not found at {settings.SIMILARITY_MODEL_PATH}")
                
        except Exception as e:
            print(f"Error loading models: {str(e)}")
    
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
            return []
        
        # Implementation depends on the specific model
        if model_name == 'knn':
            # Convert user features to the format expected by the model
            feature_vector = self._preprocess_features(user_features)
            
            # Use the model to find nearest neighbors
            distances, indices = model.kneighbors(feature_vector.reshape(1, -1), n_neighbors=top_n)
            
            # Return the indices and distances
            return [
                {"id": str(idx), "score": float(1 / (1 + dist))}
                for idx, dist in zip(indices[0], distances[0])
            ]
        
        elif model_name == 'similarity':
            # Implement similarity-based matching
            pass
        
        return []
    
    def _preprocess_features(self, features: Dict[str, Any]) -> np.ndarray:
        """
        Preprocess user features for model input
        
        Args:
            features: Dictionary of user features
            
        Returns:
            Preprocessed feature vector
        """
        # This is a placeholder - actual implementation will depend on your model
        # Convert the features dictionary to a feature vector that your model expects
        # You might need to use the same preprocessing that was used during model training
        
        # Example (very simplified):
        feature_list = [
            features.get('age', 0),
            features.get('height', 0),
            features.get('weight', 0),
            # Add other numerical features
        ]
        
        return np.array(feature_list)

# Create a singleton instance
model_registry = ModelRegistry()
