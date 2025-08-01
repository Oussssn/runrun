namespace RunIstanbul.Domain.DTOs;

public record TerritoryCaptureDto
{
    public Guid TerritoryId { get; init; }
    public string TerritoryName { get; init; } = string.Empty;
    public DateTime CapturedAt { get; init; }
    public double TimeInTerritorySeconds { get; init; }
    public double DistanceInTerritoryMeters { get; init; }
    public int PointsAwarded { get; init; }
    public bool WasSuccessful { get; init; }
}