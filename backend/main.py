
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

from app.api.routes import auth, users, players, clubs, agents, coaches, matches, recommendations, messaging, analytics
from app.core.config import settings

app = FastAPI(
    title="Scout AI Match API",
    description="Backend API for AI-powered football scouting platform",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(players.router, prefix="/api/players", tags=["Players"])
app.include_router(clubs.router, prefix="/api/clubs", tags=["Clubs"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(coaches.router, prefix="/api/coaches", tags=["Coaches"])
app.include_router(matches.router, prefix="/api/matches", tags=["Matching System"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(messaging.router, prefix="/api/messages", tags=["Messaging"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

# Custom OpenAPI and documentation endpoints
@app.get("/api/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=f"/api/openapi.json",
        title=f"{app.title} - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
    )

@app.get("/api/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    return get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
