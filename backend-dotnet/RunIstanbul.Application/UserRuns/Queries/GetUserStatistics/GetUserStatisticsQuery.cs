using MediatR;
using RunIstanbul.Domain.DTOs;

namespace RunIstanbul.Application.UserRuns.Queries.GetUserStatistics;

public record GetUserStatisticsQuery(Guid UserId) : IRequest<UserRunStatistics>;