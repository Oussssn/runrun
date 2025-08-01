using MediatR;
using RunIstanbul.Application.Common.Mappings;

namespace RunIstanbul.Application.Users.Queries.GetUser;

public record GetUserQuery(Guid Id) : IRequest<UserDto?>;