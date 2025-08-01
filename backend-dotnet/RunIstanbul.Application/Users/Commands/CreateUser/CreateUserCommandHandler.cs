using AutoMapper;
using MediatR;
using RunIstanbul.Application.Common.Mappings;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.Users.Commands.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public CreateUserCommandHandler(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        if (await _userRepository.ExistsByUsernameAsync(request.Username, cancellationToken))
        {
            throw new ArgumentException($"User with username '{request.Username}' already exists");
        }

        if (await _userRepository.ExistsByEmailAsync(request.Email, cancellationToken))
        {
            throw new ArgumentException($"User with email '{request.Email}' already exists");
        }

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            AvatarUrl = request.AvatarUrl,
            Profile = new UserProfile
            {
                PreferredLanguage = request.PreferredLanguage,
                HomeDistrict = request.HomeDistrict
            }
        };

        user.Profile.UserId = user.Id;

        var createdUser = await _userRepository.AddAsync(user, cancellationToken);
        return _mapper.Map<UserDto>(createdUser);
    }
}