using AutoMapper;
using MediatR;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.Territories.Queries.GetAvailableTerritoriesForCapture;

public class GetAvailableTerritoriesForCaptureQueryHandler : IRequestHandler<GetAvailableTerritoriesForCaptureQuery, IEnumerable<TerritoryDto>>
{
    private readonly ITerritoryRepository _territoryRepository;
    private readonly IMapper _mapper;

    public GetAvailableTerritoriesForCaptureQueryHandler(ITerritoryRepository territoryRepository, IMapper mapper)
    {
        _territoryRepository = territoryRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TerritoryDto>> Handle(GetAvailableTerritoriesForCaptureQuery request, CancellationToken cancellationToken)
    {
        var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        var userPoint = geometryFactory.CreatePoint(new Coordinate(request.UserLocation.Longitude, request.UserLocation.Latitude));

        var territories = await _territoryRepository.GetAvailableForCaptureAsync(userPoint, request.MaxDistanceMeters, cancellationToken);
        return _mapper.Map<IEnumerable<TerritoryDto>>(territories);
    }
}