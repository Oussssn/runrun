using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Common;

namespace RunIstanbul.Domain.Entities;

// Run checkpoints for detailed tracking
public record RunCheckpoint : BaseEntity
{
    [Required]
    public Guid RunId { get; init; }
    
    [Required]
    public Point Location { get; init; } = null!;
    
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
    
    [Range(0, double.MaxValue)]
    public double SpeedKmh { get; set; }
    
    [Range(0, double.MaxValue)]
    public double Accuracy { get; set; }
    
    [Range(0, double.MaxValue)]
    public double Altitude { get; set; }
    
    public int HeartRate { get; set; }
    
    // Navigation
    public UserRun Run { get; set; } = null!;
}