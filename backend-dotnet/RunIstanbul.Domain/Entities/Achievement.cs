using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RunIstanbul.Domain.Common;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.Entities;

// Achievement system
public record Achievement : BaseEntity
{
    [Required, MaxLength(100)]
    public string Name { get; init; } = string.Empty;
    
    [Required, MaxLength(100)]
    public string NameTurkish { get; init; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [MaxLength(500)]
    public string? DescriptionTurkish { get; set; }
    
    public string? IconUrl { get; set; }
    
    [Range(0, int.MaxValue)]
    public int Points { get; set; }
    
    public AchievementType Type { get; set; }
    
    public AchievementRarity Rarity { get; set; } = AchievementRarity.Common;
    
    // Conditions (stored as JSON)
    [Column(TypeName = "jsonb")]
    public string ConditionsJson { get; set; } = "{}";
    
    public bool IsActive { get; set; } = true;
}