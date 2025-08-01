using System.ComponentModel.DataAnnotations;
using RunIstanbul.Domain.Common;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.Entities;

// Territory ownership tracking
public record TerritoryOwnership : BaseEntity
{
    [Required]
    public Guid TerritoryId { get; init; }
    
    [Required]
    public Guid UserId { get; init; }
    
    public DateTime CapturedAt { get; init; } = DateTime.UtcNow;
    public DateTime? LostAt { get; set; }
    
    public bool IsActive => LostAt is null;
    
    public TimeSpan OwnershipDuration => (LostAt ?? DateTime.UtcNow) - CapturedAt;
    
    [Range(0, int.MaxValue)]
    public int PointsEarned { get; set; }
    
    // How the territory was captured
    public CaptureMethod CaptureMethod { get; set; }
    
    // Navigation properties
    public Territory Territory { get; set; } = null!;
    public User User { get; set; } = null!;
}