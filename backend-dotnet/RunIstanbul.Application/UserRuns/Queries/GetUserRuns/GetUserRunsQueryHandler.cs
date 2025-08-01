using AutoMapper;
using MediatR;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.UserRuns.Queries.GetUserRuns;

public class GetUserRunsQueryHandler : IRequestHandler<GetUserRunsQuery, IEnumerable<UserRunDto>>
{
    private readonly IUserRunRepository _userRunRepository;
    private readonly IMapper _mapper;

    public GetUserRunsQueryHandler(IUserRunRepository userRunRepository, IMapper mapper)
    {
        _userRunRepository = userRunRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserRunDto>> Handle(GetUserRunsQuery request, CancellationToken cancellationToken)
    {
        var runs = await _userRunRepository.GetByUserIdAsync(request.UserId, request.Skip, request.Take, cancellationToken);
        return _mapper.Map<IEnumerable<UserRunDto>>(runs);
    }
}