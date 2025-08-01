using MediatR;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.UserRuns.Queries.GetUserStatistics;

public class GetUserStatisticsQueryHandler : IRequestHandler<GetUserStatisticsQuery, UserRunStatistics>
{
    private readonly IUserRunRepository _userRunRepository;

    public GetUserStatisticsQueryHandler(IUserRunRepository userRunRepository)
    {
        _userRunRepository = userRunRepository;
    }

    public async Task<UserRunStatistics> Handle(GetUserStatisticsQuery request, CancellationToken cancellationToken)
    {
        return await _userRunRepository.GetUserStatisticsAsync(request.UserId, cancellationToken);
    }
}