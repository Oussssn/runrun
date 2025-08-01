using RunIstanbul.Domain.Enums;
using RunIstanbul.Domain.ValueObjects;

namespace RunIstanbul.Domain.DTOs;

// Data Transfer Objects with modern C# features
public record UserRunDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public IEnumerable<GeoLocation> Route { get; init; } = Enumerable.Empty<GeoLocation>();
    public GeoLocation StartPoint { get; init; }
    public GeoLocation EndPoint { get; init; }
    public double DistanceMeters { get; init; }
    public TimeSpan Duration { get; init; }
    public double AverageSpeedKmh { get; init; }
    public RunStatus Status { get; init; }
    public DateTime CreatedAt { get; init; }
    public WeatherData? WeatherData { get; init; }
    public IEnumerable<TerritoryCaptureDto> Captures { get; init; } = Enumerable.Empty<TerritoryCaptureDto>();
}