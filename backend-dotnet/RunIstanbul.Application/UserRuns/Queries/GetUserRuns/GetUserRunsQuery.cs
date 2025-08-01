using MediatR;
using RunIstanbul.Domain.DTOs;

namespace RunIstanbul.Application.UserRuns.Queries.GetUserRuns;

public record GetUserRunsQuery : IRequest<IEnumerable<UserRunDto>>
{
    public Guid UserId { get; init; }
    public int Skip { get; init; } = 0;
    public int Take { get; init; } = 50;
}