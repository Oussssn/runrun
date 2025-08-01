using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.DTOs;

public record TerritoryOwnershipDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public string OwnerUsername { get; init; } = string.Empty;
    public DateTime CapturedAt { get; init; }
    public TimeSpan OwnershipDuration { get; init; }
    public int PointsEarned { get; init; }
    public CaptureMethod CaptureMethod { get; init; }
}