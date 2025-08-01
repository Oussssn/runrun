using MediatR;
using RunIstanbul.Application.Common.Mappings;

namespace RunIstanbul.Application.Users.Queries.GetUserByUsername;

public record GetUserByUsernameQuery(string Username) : IRequest<UserDto?>;