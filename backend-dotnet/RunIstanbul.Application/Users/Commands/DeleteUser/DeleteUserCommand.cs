using MediatR;

namespace RunIstanbul.Application.Users.Commands.DeleteUser;

public record DeleteUserCommand(Guid Id) : IRequest<Unit>;