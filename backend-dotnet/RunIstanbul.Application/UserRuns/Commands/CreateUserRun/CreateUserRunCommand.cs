using MediatR;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.ValueObjects;

namespace RunIstanbul.Application.UserRuns.Commands.CreateUserRun;

public record CreateUserRunCommand : IRequest<UserRunDto>
{
    public Guid UserId { get; init; }
    public IEnumerable<GeoLocation> Route { get; init; } = Enumerable.Empty<GeoLocation>();
    public GeoLocation StartPoint { get; init; }
    public GeoLocation EndPoint { get; init; }
    public double DistanceMeters { get; init; }
    public TimeSpan Duration { get; init; }
    public double AverageSpeedKmh { get; init; }
    public double MaxSpeedKmh { get; init; }
    public int CaloriesBurned { get; init; }
    public string? Notes { get; init; }
    public WeatherData? WeatherData { get; init; }
}