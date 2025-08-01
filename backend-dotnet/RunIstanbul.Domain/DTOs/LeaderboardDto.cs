using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.DTOs;

public record LeaderboardDto
{
    public LeaderboardType Type { get; init; }
    public string? District { get; init; }
    public DateTime GeneratedAt { get; init; }
    public IEnumerable<LeaderboardEntryDto> Entries { get; init; } = Enumerable.Empty<LeaderboardEntryDto>();
}

public record LeaderboardEntryDto
{
    public int Rank { get; init; }
    public Guid UserId { get; init; }
    public string Username { get; init; } = string.Empty;
    public double Score { get; init; }
    public string ScoreType { get; init; } = string.Empty; // Distance, Territories, Points, etc.
    public string? AvatarUrl { get; init; }
    public int Level { get; init; }
}