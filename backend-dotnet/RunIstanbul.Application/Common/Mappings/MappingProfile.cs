using AutoMapper;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.ValueObjects;

namespace RunIstanbul.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<UserProfile, UserProfileDto>();

        // Territory mappings
        CreateMap<Territory, TerritoryDto>()
            .ForMember(dest => dest.Boundary, opt => opt.MapFrom(src => ConvertToGeoLocations(src.Boundary.Coordinates)))
            .ForMember(dest => dest.CenterPoint, opt => opt.MapFrom(src => new GeoLocation(src.CenterPoint.Y, src.CenterPoint.X)));

        CreateMap<TerritoryOwnership, TerritoryOwnershipDto>()
            .ForMember(dest => dest.OwnerUsername, opt => opt.MapFrom(src => src.User.Username));

        // Run mappings
        CreateMap<UserRun, UserRunDto>()
            .ForMember(dest => dest.Route, opt => opt.MapFrom(src => ConvertToGeoLocations(src.Route.Coordinates)))
            .ForMember(dest => dest.StartPoint, opt => opt.MapFrom(src => new GeoLocation(src.StartPoint.Y, src.StartPoint.X)))
            .ForMember(dest => dest.EndPoint, opt => opt.MapFrom(src => new GeoLocation(src.EndPoint.Y, src.EndPoint.X)));

        CreateMap<TerritoryCapture, TerritoryCaptureDto>()
            .ForMember(dest => dest.TerritoryName, opt => opt.MapFrom(src => src.Territory.Name));

        // Achievement mappings
        CreateMap<Achievement, AchievementDto>();
        CreateMap<UserAchievement, UserAchievementDto>();

        // Team mappings
        CreateMap<Team, TeamDto>();
        CreateMap<TeamMember, TeamMemberDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username));

        // Landmark mappings
        CreateMap<Landmark, LandmarkDto>()
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => new GeoLocation(src.Location.Y, src.Location.X)));
    }

    private static IEnumerable<GeoLocation> ConvertToGeoLocations(NetTopologySuite.Geometries.Coordinate[] coordinates)
    {
        return coordinates.Select(c => new GeoLocation(c.Y, c.X));
    }
}

// Additional DTOs that weren't in the domain layer
public record UserDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? AvatarUrl { get; init; }
    public UserProfileDto Profile { get; init; } = null!;
}

public record UserProfileDto
{
    public int Level { get; init; }
    public long TotalExperience { get; init; }
    public double TotalDistanceKm { get; init; }
    public TimeSpan TotalRunningTime { get; init; }
    public int TerritoriesCaptured { get; init; }
    public string PreferredLanguage { get; init; } = string.Empty;
    public string? HomeDistrict { get; init; }
    public double AverageSpeedKmh { get; init; }
}

public record AchievementDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string NameTurkish { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? DescriptionTurkish { get; init; }
    public string? IconUrl { get; init; }
    public int Points { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Rarity { get; init; } = string.Empty;
}

public record UserAchievementDto
{
    public Guid Id { get; init; }
    public DateTime EarnedAt { get; init; }
    public double Progress { get; init; }
    public AchievementDto Achievement { get; init; } = null!;
}

public record TeamDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? District { get; init; }
    public string? LogoUrl { get; init; }
    public int MaxMembers { get; init; }
    public bool IsPublic { get; init; }
    public int MemberCount { get; init; }
    public bool IsFull { get; init; }
}

public record TeamMemberDto
{
    public Guid Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public DateTime JoinedAt { get; init; }
    public string Role { get; init; } = string.Empty;
}

public record LandmarkDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string NameTurkish { get; init; } = string.Empty;
    public GeoLocation Location { get; init; }
    public string Type { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? DescriptionTurkish { get; init; }
    public int BonusPoints { get; init; }
    public double ProximityRadiusMeters { get; init; }
}