using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Infrastructure.Data.Configurations;

public class UserRunConfiguration : IEntityTypeConfiguration<UserRun>
{
    public void Configure(EntityTypeBuilder<UserRun> builder)
    {
        builder.HasKey(r => r.Id);
        
        builder.Property(r => r.Route)
            .IsRequired()
            .HasColumnType("geometry(LINESTRING, 4326)");
        
        builder.Property(r => r.StartPoint)
            .IsRequired()
            .HasColumnType("geometry(POINT, 4326)");
        
        builder.Property(r => r.EndPoint)
            .IsRequired()
            .HasColumnType("geometry(POINT, 4326)");

        builder.Property(r => r.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        // Value object mapping for WeatherData
        builder.OwnsOne(r => r.WeatherData, weather =>
        {
            weather.Property(w => w.TemperatureCelsius).HasColumnName("weather_temperature");
            weather.Property(w => w.Humidity).HasColumnName("weather_humidity");
            weather.Property(w => w.WindSpeedKmh).HasColumnName("weather_wind_speed");
            weather.Property(w => w.Conditions).HasColumnName("weather_conditions").HasMaxLength(50);
            weather.Property(w => w.Timestamp).HasColumnName("weather_timestamp");
        });

        // Indexes for performance
        builder.HasIndex(r => r.UserId);
        builder.HasIndex(r => r.CreatedAt);
        builder.HasIndex(r => r.Status);
        
        // Spatial indexes
        builder.HasIndex(r => r.Route)
            .HasDatabaseName("IX_UserRuns_Route_Spatial")
            .HasMethod("gist");
        
        builder.HasIndex(r => r.StartPoint)
            .HasDatabaseName("IX_UserRuns_StartPoint_Spatial")
            .HasMethod("gist");
    }
}