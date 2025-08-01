using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Common;
using RunIstanbul.Domain.Enums;
using RunIstanbul.Domain.ValueObjects;

namespace RunIstanbul.Domain.Entities;

// User run entity
public record UserRun : BaseEntity
{
    [Required]
    public Guid UserId { get; init; }
    
    [Required]
    public LineString Route { get; init; } = null!; // PostGIS LineString
    
    [Required]
    public Point StartPoint { get; init; } = null!;
    
    [Required]
    public Point EndPoint { get; init; } = null!;
    
    [Range(0, double.MaxValue)]
    public double DistanceMeters { get; set; }
    
    public TimeSpan Duration { get; set; }
    
    [Range(0, double.MaxValue)]
    public double AverageSpeedKmh { get; set; }
    
    [Range(0, double.MaxValue)]
    public double MaxSpeedKmh { get; set; }
    
    public int CaloriesBurned { get; set; }
    
    public RunStatus Status { get; set; } = RunStatus.Completed;
    
    [MaxLength(500)]
    public string? Notes { get; set; }
    
    // Weather data snapshot
    public WeatherData? WeatherData { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<TerritoryCapture> Captures { get; init; } = new List<TerritoryCapture>();
    public ICollection<RunCheckpoint> Checkpoints { get; init; } = new List<RunCheckpoint>();
}