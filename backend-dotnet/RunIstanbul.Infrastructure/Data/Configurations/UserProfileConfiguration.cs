using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Infrastructure.Data.Configurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.HasKey(p => p.UserId);
        
        builder.Property(p => p.PreferredLanguage)
            .HasDefaultValue("tr-TR")
            .HasMaxLength(50);
        
        builder.Property(p => p.Level)
            .HasDefaultValue(1);
        
        builder.Property(p => p.TotalExperience)
            .HasDefaultValue(0L);

        // AverageSpeedKmh property (computed in PostgreSQL, calculated at runtime for InMemory)
        builder.Ignore(p => p.AverageSpeedKmh);
    }
}