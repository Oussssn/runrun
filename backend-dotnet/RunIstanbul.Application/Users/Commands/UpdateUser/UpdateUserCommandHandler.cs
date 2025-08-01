using AutoMapper;
using MediatR;
using RunIstanbul.Application.Common.Mappings;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.Users.Commands.UpdateUser;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UpdateUserCommandHandler(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);
        if (user == null)
        {
            throw new ArgumentException($"User with ID '{request.Id}' not found");
        }

        // Update user properties
        if (!string.IsNullOrEmpty(request.FirstName))
            user.FirstName = request.FirstName;
        
        if (!string.IsNullOrEmpty(request.LastName))
            user.LastName = request.LastName;
        
        if (!string.IsNullOrEmpty(request.AvatarUrl))
            user.AvatarUrl = request.AvatarUrl;

        // Update profile properties
        if (!string.IsNullOrEmpty(request.HomeDistrict))
            user.Profile.HomeDistrict = request.HomeDistrict;
        
        if (!string.IsNullOrEmpty(request.PreferredLanguage))
            user.Profile.PreferredLanguage = request.PreferredLanguage;

        var updatedUser = await _userRepository.UpdateAsync(user, cancellationToken);
        return _mapper.Map<UserDto>(updatedUser);
    }
}