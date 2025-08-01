using Microsoft.EntityFrameworkCore;
using RunIstanbul.Domain.Common;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Infrastructure.Data;

// Main DbContext with spatial support
public class RunIstanbulDbContext : DbContext
{
    public RunIstanbulDbContext(DbContextOptions<RunIstanbulDbContext> options) : base(options) { }

    // DbSets with nullable reference types
    public DbSet<User> Users => Set<User>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<UserRun> UserRuns => Set<UserRun>();
    public DbSet<Territory> Territories => Set<Territory>();
    public DbSet<TerritoryOwnership> TerritoryOwnerships => Set<TerritoryOwnership>();
    public DbSet<TerritoryCapture> TerritoryCaptures => Set<TerritoryCapture>();
    public DbSet<RunCheckpoint> RunCheckpoints => Set<RunCheckpoint>();
    public DbSet<Landmark> Landmarks => Set<Landmark>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(RunIstanbulDbContext).Assembly);

        // Global query filters for soft delete
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserRun>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Territory>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Team>().HasQueryFilter(e => !e.IsDeleted);

        // Spatial reference system configuration
        ConfigureSpatialTypes(modelBuilder);
    }

    private static void ConfigureSpatialTypes(ModelBuilder modelBuilder)
    {
        // SRID configuration will be handled in individual entity configurations
        // using HasColumnType with explicit SRID specification
    }

    // Override SaveChanges to handle UpdatedAt automatically
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.State is EntityState.Modified);

        foreach (var entry in entries)
        {
            entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
    }
}