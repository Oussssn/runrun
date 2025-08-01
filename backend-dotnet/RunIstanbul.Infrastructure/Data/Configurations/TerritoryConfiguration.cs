using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Infrastructure.Data.Configurations;

public class TerritoryConfiguration : IEntityTypeConfiguration<Territory>
{
    public void Configure(EntityTypeBuilder<Territory> builder)
    {
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(t => t.District)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.Property(t => t.Boundary)
            .IsRequired()
            .HasColumnType("geometry(POLYGON, 4326)");
        
        builder.Property(t => t.CenterPoint)
            .IsRequired()
            .HasColumnType("geometry(POINT, 4326)");

        builder.Property(t => t.Type)
            .HasConversion<string>()
            .HasMaxLength(20);

        // Indexes
        builder.HasIndex(t => t.District);
        builder.HasIndex(t => t.Type);
        builder.HasIndex(t => t.IsActive);
        
        // Spatial indexes
        builder.HasIndex(t => t.Boundary)
            .HasDatabaseName("IX_Territories_Boundary_Spatial")
            .HasMethod("gist");
        
        builder.HasIndex(t => t.CenterPoint)
            .HasDatabaseName("IX_Territories_CenterPoint_Spatial")
            .HasMethod("gist");

        // Relationships
        builder.HasMany(t => t.Ownerships)
            .WithOne(o => o.Territory)
            .HasForeignKey(o => o.TerritoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}