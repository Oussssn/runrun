using AutoMapper;
using MediatR;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.Territories.Commands.CreateTerritory;

public class CreateTerritoryCommandHandler : IRequestHandler<CreateTerritoryCommand, TerritoryDto>
{
    private readonly ITerritoryRepository _territoryRepository;
    private readonly IMapper _mapper;

    public CreateTerritoryCommandHandler(ITerritoryRepository territoryRepository, IMapper mapper)
    {
        _territoryRepository = territoryRepository;
        _mapper = mapper;
    }

    public async Task<TerritoryDto> Handle(CreateTerritoryCommand request, CancellationToken cancellationToken)
    {
        var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        // Convert boundary coordinates to a polygon
        var coordinates = request.Boundary
            .Select(loc => new Coordinate(loc.Longitude, loc.Latitude))
            .ToArray();

        // Close the polygon if not already closed
        if (coordinates.Length > 0 && !coordinates.First().Equals(coordinates.Last()))
        {
            coordinates = coordinates.Append(coordinates.First()).ToArray();
        }

        var boundary = geometryFactory.CreatePolygon(coordinates);
        var centerPoint = geometryFactory.CreatePoint(new Coordinate(request.CenterPoint.Longitude, request.CenterPoint.Latitude));

        var territory = new Territory
        {
            Name = request.Name,
            District = request.District,
            Boundary = boundary,
            CenterPoint = centerPoint,
            Type = request.Type,
            BasePoints = request.BasePoints,
            DifficultyLevel = request.DifficultyLevel,
            Description = request.Description,
            ImageUrl = request.ImageUrl
        };

        var createdTerritory = await _territoryRepository.AddAsync(territory, cancellationToken);
        return _mapper.Map<TerritoryDto>(createdTerritory);
    }
}