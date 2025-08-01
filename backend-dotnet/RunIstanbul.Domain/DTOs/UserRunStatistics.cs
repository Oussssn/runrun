namespace RunIstanbul.Domain.DTOs;

public record UserRunStatistics
{
    public Guid UserId { get; init; }
    public int TotalRuns { get; init; }
    public double TotalDistanceKm { get; init; }
    public TimeSpan TotalDuration { get; init; }
    public double AverageSpeedKmh { get; init; }
    public double BestSpeedKmh { get; init; }
    public double LongestRunKm { get; init; }
    public int TerritoriesCaptured { get; init; }
    public int UniqueDistrictsVisited { get; init; }
    public int LandmarksVisited { get; init; }
    public DateTime? LastRunDate { get; init; }
    public int CurrentStreak { get; init; }
    public int BestStreak { get; init; }
}