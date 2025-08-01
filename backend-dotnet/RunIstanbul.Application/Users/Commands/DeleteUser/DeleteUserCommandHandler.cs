using MediatR;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.Users.Commands.DeleteUser;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Unit>
{
    private readonly IUserRepository _userRepository;

    public DeleteUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var exists = await _userRepository.ExistsAsync(request.Id, cancellationToken);
        if (!exists)
        {
            throw new ArgumentException($"User with ID '{request.Id}' not found");
        }

        await _userRepository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}