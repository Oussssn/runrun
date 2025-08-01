using AutoMapper;
using MediatR;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.UserRuns.Queries.GetUserRunById;

public class GetUserRunByIdHandler : IRequestHandler<GetUserRunByIdQuery, UserRunDto?>
{
    private readonly IUserRunRepository _userRunRepository;
    private readonly IMapper _mapper;

    public GetUserRunByIdHandler(IUserRunRepository userRunRepository, IMapper mapper)
    {
        _userRunRepository = userRunRepository;
        _mapper = mapper;
    }

    public async Task<UserRunDto?> Handle(GetUserRunByIdQuery request, CancellationToken cancellationToken)
    {
        var userRun = await _userRunRepository.GetByIdAsync(request.Id);
        
        if (userRun == null)
            return null;

        return _mapper.Map<UserRunDto>(userRun);
    }
}