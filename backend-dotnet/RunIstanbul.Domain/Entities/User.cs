using System.ComponentModel.DataAnnotations;
using RunIstanbul.Domain.Common;

namespace RunIstanbul.Domain.Entities;

// User entity with record type
public record User : BaseEntity
{
    [Required, MaxLength(100)]
    public string Username { get; init; } = string.Empty;
    
    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; init; } = string.Empty;
    
    [MaxLength(100)]
    public string? FirstName { get; set; }
    
    [MaxLength(100)]
    public string? LastName { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    [Required]
    public UserProfile Profile { get; set; } = null!;
    
    // Navigation properties
    public ICollection<UserRun> Runs { get; init; } = new List<UserRun>();
    public ICollection<TerritoryOwnership> OwnedTerritories { get; init; } = new List<TerritoryOwnership>();
    public ICollection<UserAchievement> Achievements { get; init; } = new List<UserAchievement>();
    public ICollection<TeamMember> TeamMemberships { get; init; } = new List<TeamMember>();
}