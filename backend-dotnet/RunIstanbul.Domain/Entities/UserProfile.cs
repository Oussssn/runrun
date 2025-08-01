using System.ComponentModel.DataAnnotations;

namespace RunIstanbul.Domain.Entities;

// User profile with value object characteristics
public record UserProfile
{
    [Required]
    public Guid UserId { get; set; }
    
    public int Level { get; set; } = 1;
    public long TotalExperience { get; set; } = 0;
    public double TotalDistanceKm { get; set; } = 0;
    public TimeSpan TotalRunningTime { get; set; } = TimeSpan.Zero;
    public int TerritoriesCaptured { get; set; } = 0;
    public int TerritoriesLost { get; set; } = 0;
    
    [MaxLength(50)]
    public string PreferredLanguage { get; set; } = "tr-TR";
    
    [MaxLength(100)]
    public string? HomeDistrict { get; set; }
    
    // Computed property
    public double AverageSpeedKmh => TotalRunningTime.TotalHours > 0 
        ? TotalDistanceKm / TotalRunningTime.TotalHours 
        : 0;
    
    // Navigation
    public User User { get; set; } = null!;
}