using System.ComponentModel.DataAnnotations;
using RunIstanbul.Domain.Common;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.Entities;

// Team membership
public record TeamMember : BaseEntity
{
    [Required]
    public Guid TeamId { get; init; }
    
    [Required]
    public Guid UserId { get; init; }
    
    public DateTime JoinedAt { get; init; } = DateTime.UtcNow;
    public DateTime? LeftAt { get; set; }
    
    public TeamRole Role { get; set; } = TeamRole.Member;
    
    public bool IsActive => LeftAt is null;
    
    // Navigation properties
    public Team Team { get; set; } = null!;
    public User User { get; set; } = null!;
}