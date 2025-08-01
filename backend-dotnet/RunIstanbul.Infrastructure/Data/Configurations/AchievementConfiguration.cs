using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Infrastructure.Data.Configurations;

public class AchievementConfiguration : IEntityTypeConfiguration<Achievement>
{
    public void Configure(EntityTypeBuilder<Achievement> builder)
    {
        builder.HasKey(a => a.Id);
        
        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(a => a.NameTurkish)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.Type)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(a => a.Rarity)
            .HasConversion<string>()
            .HasMaxLength(20);

        // JSON column for conditions
        builder.Property(a => a.ConditionsJson)
            .HasColumnType("jsonb")
            .HasDefaultValue("{}");

        // Indexes
        builder.HasIndex(a => a.Type);
        builder.HasIndex(a => a.Rarity);
        builder.HasIndex(a => a.IsActive);
        
        // GIN index for JSON column (PostgreSQL specific)
        builder.HasIndex(a => a.ConditionsJson)
            .HasDatabaseName("IX_Achievements_Conditions_GIN")
            .HasMethod("gin");
    }
}