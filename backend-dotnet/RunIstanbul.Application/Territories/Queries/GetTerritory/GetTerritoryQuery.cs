using MediatR;
using RunIstanbul.Domain.DTOs;

namespace RunIstanbul.Application.Territories.Queries.GetTerritory;

public record GetTerritoryQuery(Guid Id) : IRequest<TerritoryDto?>;