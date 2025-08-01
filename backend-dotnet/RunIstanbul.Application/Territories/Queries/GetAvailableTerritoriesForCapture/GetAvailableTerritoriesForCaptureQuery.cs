using MediatR;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.ValueObjects;

namespace RunIstanbul.Application.Territories.Queries.GetAvailableTerritoriesForCapture;

public record GetAvailableTerritoriesForCaptureQuery : IRequest<IEnumerable<TerritoryDto>>
{
    public GeoLocation UserLocation { get; init; }
    public double MaxDistanceMeters { get; init; } = 1000;
}