using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Common;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.Entities;

// Territory entity
public record Territory : BaseEntity
{
    [Required, MaxLength(100)]
    public string Name { get; init; } = string.Empty;
    
    [Required, MaxLength(50)]
    public string District { get; init; } = string.Empty;
    
    [Required]
    public Polygon Boundary { get; init; } = null!; // PostGIS Polygon
    
    [Required]
    public Point CenterPoint { get; init; } = null!;
    
    [Range(0, int.MaxValue)]
    public int BasePoints { get; set; } = 100;
    
    public TerritoryType Type { get; set; } = TerritoryType.Regular;
    
    [Range(1, 10)]
    public int DifficultyLevel { get; set; } = 1;
    
    public bool IsActive { get; set; } = true;
    
    // Special properties for landmarks
    [MaxLength(200)]
    public string? Description { get; set; }
    
    public string? ImageUrl { get; set; }
    
    // Navigation properties
    public ICollection<TerritoryOwnership> Ownerships { get; init; } = new List<TerritoryOwnership>();
    public ICollection<TerritoryCapture> Captures { get; init; } = new List<TerritoryCapture>();
    
    // Current owner (computed)
    public TerritoryOwnership? CurrentOwnership => 
        Ownerships.Where(o => o.IsActive).OrderByDescending(o => o.CapturedAt).FirstOrDefault();
}