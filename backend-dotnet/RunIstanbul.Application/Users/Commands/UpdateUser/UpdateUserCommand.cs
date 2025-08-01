using MediatR;
using RunIstanbul.Application.Common.Mappings;

namespace RunIstanbul.Application.Users.Commands.UpdateUser;

public record UpdateUserCommand : IRequest<UserDto>
{
    public Guid Id { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? AvatarUrl { get; init; }
    public string? HomeDistrict { get; init; }
    public string? PreferredLanguage { get; init; }
}