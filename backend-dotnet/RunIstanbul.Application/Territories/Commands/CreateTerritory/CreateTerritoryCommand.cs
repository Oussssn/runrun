using MediatR;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Enums;
using RunIstanbul.Domain.ValueObjects;

namespace RunIstanbul.Application.Territories.Commands.CreateTerritory;

public record CreateTerritoryCommand : IRequest<TerritoryDto>
{
    public string Name { get; init; } = string.Empty;
    public string District { get; init; } = string.Empty;
    public IEnumerable<GeoLocation> Boundary { get; init; } = Enumerable.Empty<GeoLocation>();
    public GeoLocation CenterPoint { get; init; }
    public TerritoryType Type { get; init; } = TerritoryType.Regular;
    public int BasePoints { get; init; } = 100;
    public int DifficultyLevel { get; init; } = 1;
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
}