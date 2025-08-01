using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Infrastructure.Data.Configurations;

public class TerritoryOwnershipConfiguration : IEntityTypeConfiguration<TerritoryOwnership>
{
    public void Configure(EntityTypeBuilder<TerritoryOwnership> builder)
    {
        builder.HasKey(o => o.Id);
        
        builder.Property(o => o.CaptureMethod)
            .HasConversion<string>()
            .HasMaxLength(20);

        // IsActive property (computed in PostgreSQL, calculated at runtime for InMemory)
        builder.Ignore(o => o.IsActive);

        // Indexes for performance (removed IsActive index since property is ignored)
        builder.HasIndex(o => new { o.TerritoryId, o.UserId });
        builder.HasIndex(o => o.CapturedAt);
        
        // Note: Unique constraint with filter not supported in InMemory database
    }
}