using AutoMapper;
using MediatR;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.Territories.Queries.GetTerritoriesByDistrict;

public class GetTerritoriesByDistrictQueryHandler : IRequestHandler<GetTerritoriesByDistrictQuery, IEnumerable<TerritoryDto>>
{
    private readonly ITerritoryRepository _territoryRepository;
    private readonly IMapper _mapper;

    public GetTerritoriesByDistrictQueryHandler(ITerritoryRepository territoryRepository, IMapper mapper)
    {
        _territoryRepository = territoryRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TerritoryDto>> Handle(GetTerritoriesByDistrictQuery request, CancellationToken cancellationToken)
    {
        var territories = await _territoryRepository.GetByDistrictAsync(request.District, cancellationToken);
        return _mapper.Map<IEnumerable<TerritoryDto>>(territories);
    }
}