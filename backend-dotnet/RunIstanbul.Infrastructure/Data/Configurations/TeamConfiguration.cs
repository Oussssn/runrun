using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Infrastructure.Data.Configurations;

public class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(100);

        // Member count property (computed in PostgreSQL, regular property for InMemory)
        builder.Property(t => t.MemberCount)
            .HasDefaultValue(0);

        // Indexes
        builder.HasIndex(t => t.Name);
        builder.HasIndex(t => t.District);
        builder.HasIndex(t => t.IsPublic);
        builder.HasIndex(t => t.IsActive);

        // Relationships
        builder.HasOne(t => t.CreatedBy)
            .WithMany()
            .HasForeignKey(t => t.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.Members)
            .WithOne(m => m.Team)
            .HasForeignKey(m => m.TeamId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}