using System.ComponentModel.DataAnnotations;
using RunIstanbul.Domain.Common;

namespace RunIstanbul.Domain.Entities;

// Individual territory captures during runs
public record TerritoryCapture : BaseEntity
{
    [Required]
    public Guid RunId { get; init; }
    
    [Required]
    public Guid TerritoryId { get; init; }
    
    [Required]
    public Guid UserId { get; init; }
    
    public DateTime CapturedAt { get; init; } = DateTime.UtcNow;
    
    [Range(0, double.MaxValue)]
    public double TimeInTerritorySeconds { get; set; }
    
    [Range(0, double.MaxValue)]
    public double DistanceInTerritoryMeters { get; set; }
    
    [Range(0, int.MaxValue)]
    public int PointsAwarded { get; set; }
    
    public bool WasSuccessful { get; set; }
    
    // Navigation properties
    public UserRun Run { get; set; } = null!;
    public Territory Territory { get; set; } = null!;
    public User User { get; set; } = null!;
}