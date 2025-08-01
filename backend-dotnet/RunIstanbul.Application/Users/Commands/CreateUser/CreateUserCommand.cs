using MediatR;
using RunIstanbul.Application.Common.Mappings;

namespace RunIstanbul.Application.Users.Commands.CreateUser;

public record CreateUserCommand : IRequest<UserDto>
{
    public string Username { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? AvatarUrl { get; init; }
    public string? HomeDistrict { get; init; }
    public string PreferredLanguage { get; init; } = "tr-TR";
}