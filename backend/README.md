
# Scout AI Match API

Backend API for an AI-powered football scouting platform.

## Features

- JWT-based authentication with role-based access control
- Full CRUD operations for users, profiles, and scouting data
- AI-powered matching system leveraging machine learning models
- Recommendation system based on user interactions
- Real-time notifications and messaging using WebSockets
- Admin dashboard API for analytics

## Tech Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis for caching
- Machine Learning with scikit-learn
- WebSockets for real-time communication
- Docker for containerization

## Getting Started

### Prerequisites

- Python 3.9+
- Docker and Docker Compose
- Machine Learning models for matching and recommendations

### Running the API

1. Clone the repository
2. Configure environment variables:
   ```
   cp .env.example .env
   # Edit .env with your settings
   ```
3. Start the services with Docker Compose:
   ```
   docker-compose up -d
   ```
4. The API will be available at http://localhost:8000
5. API Documentation will be available at http://localhost:8000/api/docs

### Development Setup

For local development without Docker:

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Configure your database connection in `.env`
4. Run the API with auto-reload:
   ```
   uvicorn main:app --reload
   ```

## API Endpoints

The API provides the following main endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/players/*` - Player profiles and data
- `/api/clubs/*` - Club profiles and data
- `/api/agents/*` - Agent profiles and data
- `/api/coaches/*` - Coach profiles and data
- `/api/matches/*` - AI matching system
- `/api/recommendations/*` - Recommendation endpoints
- `/api/messages/*` - Messaging system
- `/api/analytics/*` - Admin analytics

## Machine Learning Models

The API uses pre-trained machine learning models for the matching and recommendation systems:

- KNN-based player matching
- Collaborative filtering for recommendations

Place your model files in the `app/ml/models/` directory.
