using System.ComponentModel.DataAnnotations;

namespace RunIstanbul.Domain.ValueObjects;

// Weather data value object
public record WeatherData
{
    [Range(-50, 60)]
    public double TemperatureCelsius { get; init; }
    
    [Range(0, 100)]
    public int Humidity { get; init; }
    
    [Range(0, double.MaxValue)]
    public double WindSpeedKmh { get; init; }
    
    [MaxLength(50)]
    public string? Conditions { get; init; }
    
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}