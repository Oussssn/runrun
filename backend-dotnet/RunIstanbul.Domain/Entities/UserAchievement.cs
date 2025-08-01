using System.ComponentModel.DataAnnotations;
using RunIstanbul.Domain.Common;

namespace RunIstanbul.Domain.Entities;

// User achievements
public record UserAchievement : BaseEntity
{
    [Required]
    public Guid UserId { get; init; }
    
    [Required]
    public Guid AchievementId { get; init; }
    
    public DateTime EarnedAt { get; init; } = DateTime.UtcNow;
    
    [Range(0, double.MaxValue)]
    public double Progress { get; set; } = 100.0; // Percentage
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Achievement Achievement { get; set; } = null!;
}