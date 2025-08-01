using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Common;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.Entities;

// Istanbul landmarks
public record Landmark : BaseEntity
{
    [Required, MaxLength(100)]
    public string Name { get; init; } = string.Empty;
    
    [Required, MaxLength(100)]
    public string NameTurkish { get; init; } = string.Empty;
    
    [Required]
    public Point Location { get; init; } = null!;
    
    public LandmarkType Type { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [MaxLength(500)]
    public string? DescriptionTurkish { get; set; }
    
    public string? ImageUrl { get; set; }
    
    [Range(0, int.MaxValue)]
    public int BonusPoints { get; set; } = 50;
    
    [Range(0, double.MaxValue)]
    public double ProximityRadiusMeters { get; set; } = 100;
    
    public bool IsActive { get; set; } = true;
}