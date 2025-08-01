using AutoMapper;
using MediatR;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.Territories.Queries.GetTerritory;

public class GetTerritoryQueryHandler : IRequestHandler<GetTerritoryQuery, TerritoryDto?>
{
    private readonly ITerritoryRepository _territoryRepository;
    private readonly IMapper _mapper;

    public GetTerritoryQueryHandler(ITerritoryRepository territoryRepository, IMapper mapper)
    {
        _territoryRepository = territoryRepository;
        _mapper = mapper;
    }

    public async Task<TerritoryDto?> Handle(GetTerritoryQuery request, CancellationToken cancellationToken)
    {
        var territory = await _territoryRepository.GetByIdAsync(request.Id, cancellationToken);
        return territory != null ? _mapper.Map<TerritoryDto>(territory) : null;
    }
}