using RunIstanbul.Domain.Enums;
using RunIstanbul.Domain.ValueObjects;

namespace RunIstanbul.Domain.DTOs;

public record TerritoryDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string District { get; init; } = string.Empty;
    public IEnumerable<GeoLocation> Boundary { get; init; } = Enumerable.Empty<GeoLocation>();
    public GeoLocation CenterPoint { get; init; }
    public TerritoryType Type { get; init; }
    public int BasePoints { get; init; }
    public bool IsActive { get; init; }
    public TerritoryOwnershipDto? CurrentOwnership { get; init; }
}