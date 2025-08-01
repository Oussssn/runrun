using MediatR;
using RunIstanbul.Domain.DTOs;

namespace RunIstanbul.Application.Territories.Queries.GetTerritoriesByDistrict;

public record GetTerritoriesByDistrictQuery(string District) : IRequest<IEnumerable<TerritoryDto>>;