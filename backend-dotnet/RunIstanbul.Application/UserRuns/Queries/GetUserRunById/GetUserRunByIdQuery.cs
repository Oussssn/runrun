using MediatR;
using RunIstanbul.Domain.DTOs;

namespace RunIstanbul.Application.UserRuns.Queries.GetUserRunById;

public record GetUserRunByIdQuery(Guid Id) : IRequest<UserRunDto?>;