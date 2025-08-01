using System.ComponentModel.DataAnnotations;
using RunIstanbul.Domain.Common;

namespace RunIstanbul.Domain.Entities;

// Teams for social gameplay
public record Team : BaseEntity
{
    [Required, MaxLength(100)]
    public string Name { get; init; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [Required]
    public Guid CreatedByUserId { get; init; }
    
    [MaxLength(50)]
    public string? District { get; set; }
    
    public string? LogoUrl { get; set; }
    
    [Range(1, 100)]
    public int MaxMembers { get; set; } = 20;
    
    public bool IsPublic { get; set; } = true;
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public User CreatedBy { get; set; } = null!;
    public ICollection<TeamMember> Members { get; init; } = new List<TeamMember>();
    
    // Computed properties (made settable for InMemory database)
    public int MemberCount { get; set; }
    public bool IsFull => MemberCount >= MaxMembers;
}