# RunIstanbul Backend - .NET 8 Web API

A comprehensive C# Web API backend for the RunIstanbul location-based running game, built with modern .NET 8, Entity Framework Core, PostGIS spatial data support, CQRS with MediatR, and Generic Repository pattern.

## Architecture Overview

### Clean Architecture Layers

1. **Domain Layer** (`RunIstanbul.Domain`)
   - Core business entities and value objects
   - Domain interfaces and enums
   - DTOs for data transfer
   - No dependencies on external frameworks

2. **Application Layer** (`RunIstanbul.Application`)
   - CQRS implementation with MediatR
   - Command and Query handlers
   - Business logic orchestration
   - AutoMapper profiles

3. **Infrastructure Layer** (`RunIstanbul.Infrastructure`)
   - Entity Framework Core DbContext
   - Repository implementations
   - Database configurations
   - Spatial data handling with PostGIS

4. **API Layer** (`RunIstanbul.Api`)
   - Web API controllers
   - Dependency injection configuration
   - Middleware setup
   - Swagger documentation

## Key Features

### Spatial Data Support
- PostGIS integration for geographical data
- Territory boundaries and user routes as spatial geometries
- Distance calculations and spatial queries
- Landmark proximity detection

### CQRS Pattern with MediatR
- Separate commands and queries
- Centralized request handling
- Clean separation of concerns
- Easy to test and maintain

### Generic Repository Pattern
- Base repository with common CRUD operations
- Specialized repositories for domain-specific queries
- Spatial repository extensions
- Unit of work pattern ready

### Domain Entities

#### User Management
- **User**: User accounts with profiles
- **UserProfile**: Extended user information and statistics
- **UserAchievement**: Achievement tracking

#### Running & Territory System
- **UserRun**: GPS-tracked running sessions with routes
- **Territory**: Capturable geographical areas
- **TerritoryOwnership**: Territory ownership tracking
- **TerritoryCapture**: Individual capture events
- **RunCheckpoint**: Detailed GPS tracking points

#### Game Elements
- **Landmark**: Istanbul landmarks for bonus points
- **Achievement**: Gamification achievements
- **Team**: Social team functionality
- **TeamMember**: Team membership management

### API Endpoints

#### Users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/username/{username}` - Get user by username
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user information
- `DELETE /api/users/{id}` - Soft delete user

#### Territories
- `GET /api/territories/{id}` - Get territory by ID
- `GET /api/territories/district/{district}` - Get territories by district
- `POST /api/territories/available-for-capture` - Get available territories near location
- `POST /api/territories` - Create new territory

#### User Runs
- `GET /api/userruns/user/{userId}` - Get user runs with pagination
- `GET /api/userruns/user/{userId}/statistics` - Get user running statistics
- `POST /api/userruns` - Create new run

#### Teams, Achievements, Landmarks
- Additional endpoints for social features and gamification

## Technology Stack

- **.NET 8** - Latest .NET framework
- **Entity Framework Core 8** - ORM with spatial support
- **PostGIS/PostgreSQL** - Spatial database
- **NetTopologySuite** - Spatial data library
- **MediatR** - CQRS implementation
- **AutoMapper** - Object mapping
- **Swagger/OpenAPI** - API documentation

## Database Setup

### Prerequisites
1. PostgreSQL with PostGIS extension
2. .NET 8 SDK

### Connection String
Update `appsettings.json` with your PostgreSQL connection:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=runistanbul;Username=postgres;Password=password;Include Error Detail=true"
  }
}
```

### Database Initialization
The application automatically:
1. Creates database if it doesn't exist
2. Applies migrations
3. Seeds initial data including Istanbul landmarks, territories, and sample users

## Running the Application

### Development
```bash
cd backend-dotnet/RunIstanbul.Api
dotnet run
```

### Production Build
```bash
dotnet build --configuration Release
dotnet publish --configuration Release
```

## Project Structure

```
backend-dotnet/
├── RunIstanbul.Domain/           # Domain layer
│   ├── Common/                   # Base entities
│   ├── Entities/                 # Domain entities
│   ├── Enums/                    # Domain enumerations
│   ├── ValueObjects/             # Value objects
│   ├── DTOs/                     # Data transfer objects
│   └── Interfaces/               # Repository interfaces
├── RunIstanbul.Application/      # Application layer
│   ├── Common/Mappings/          # AutoMapper profiles
│   ├── Users/                    # User CQRS operations
│   ├── Territories/              # Territory CQRS operations
│   └── UserRuns/                 # UserRun CQRS operations
├── RunIstanbul.Infrastructure/   # Infrastructure layer
│   ├── Data/                     # DbContext and configurations
│   ├── Repositories/             # Repository implementations
│   └── Extensions/               # Service collection extensions
└── RunIstanbul.Api/              # Web API layer
    ├── Controllers/              # API controllers
    └── Program.cs                # Application startup
```

## Istanbul-Specific Features

### Sample Data Included
- **Landmarks**: Hagia Sophia, Galata Tower, Bosphorus Bridge, Dolmabahçe Palace, Taksim Square
- **Territories**: Beşiktaş Center, Ortaköy, Kadıköy Center with realistic boundaries
- **Achievements**: Turkish/English descriptions, distance and territory-based
- **Sample Users**: Pre-configured with Turkish names and Istanbul districts

### Spatial Features
- Territory boundaries as PostGIS polygons
- Running routes as LineString geometries
- Proximity-based landmark detection
- District-based territory grouping
- GPS accuracy validation

## Development Notes

### Adding New Entities
1. Create entity in `Domain/Entities/`
2. Add to `DbContext` and create configuration
3. Create repository interface and implementation
4. Add CQRS commands/queries
5. Create API controller

### Spatial Queries
The repository layer provides spatial query capabilities:
- `GetWithinDistanceAsync()` - Find entities within distance
- `GetIntersectingAsync()` - Find intersecting geometries
- `GetContainingPointAsync()` - Find territory containing point

### Testing
The architecture supports easy unit testing:
- Repository interfaces for mocking
- MediatR handlers are testable in isolation
- Clean separation of concerns

## Security Considerations
- Input validation through DTOs
- Soft delete implementation
- SQL injection prevention through EF Core
- Spatial data validation

## Performance Features
- Spatial indexing with PostGIS
- Computed columns for frequently accessed data
- Pagination for large datasets
- Efficient spatial queries

This backend provides a solid foundation for the RunIstanbul mobile application with all CRUD operations, spatial data handling, and a scalable architecture following modern .NET best practices.