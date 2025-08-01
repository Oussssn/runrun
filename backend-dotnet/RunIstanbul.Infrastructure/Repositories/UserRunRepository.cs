using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Enums;
using RunIstanbul.Domain.Interfaces;
using RunIstanbul.Infrastructure.Data;

namespace RunIstanbul.Infrastructure.Repositories;

public class UserRunRepository : BaseRepository<UserRun>, IUserRunRepository
{
    public UserRunRepository(RunIstanbulDbContext context) : base(context) { }

    public async Task<IEnumerable<UserRun>> GetByUserIdAsync(Guid userId, int skip = 0, int take = 50, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(r => r.UserId == userId)
            .Include(r => r.Captures)
                .ThenInclude(c => c.Territory)
            .OrderByDescending(r => r.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);
    }

    public async Task<UserRun?> GetActiveRunAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(r => r.UserId == userId && (r.Status == RunStatus.Active || r.Status == RunStatus.Paused))
            .Include(r => r.Checkpoints)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<UserRun>> GetRunsInAreaAsync(Polygon area, DateTime? since = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(r => r.Route.Intersects(area));
        
        if (since.HasValue)
        {
            query = query.Where(r => r.CreatedAt >= since.Value);
        }

        return await query
            .Include(r => r.User)
            .ToListAsync(cancellationToken);
    }

    public async Task<UserRunStatistics> GetUserStatisticsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var completedRuns = await _dbSet
            .Where(r => r.UserId == userId && r.Status == RunStatus.Completed)
            .ToListAsync(cancellationToken);

        var totalRuns = completedRuns.Count;
        var totalDistanceKm = completedRuns.Sum(r => r.DistanceMeters) / 1000.0;
        var totalDuration = TimeSpan.FromSeconds(completedRuns.Sum(r => r.Duration.TotalSeconds));
        var averageSpeedKmh = totalDuration.TotalHours > 0 ? totalDistanceKm / totalDuration.TotalHours : 0;
        var bestSpeedKmh = completedRuns.Count > 0 ? completedRuns.Max(r => r.MaxSpeedKmh) : 0;
        var longestRunKm = completedRuns.Count > 0 ? completedRuns.Max(r => r.DistanceMeters) / 1000.0 : 0;

        var territoriesCaptured = await _context.TerritoryCaptures
            .Where(tc => tc.UserId == userId && tc.WasSuccessful)
            .Select(tc => tc.TerritoryId)
            .Distinct()
            .CountAsync(cancellationToken);

        // Calculate unique districts visited
        var uniqueDistrictsVisited = await _context.TerritoryCaptures
            .Where(tc => tc.UserId == userId && tc.WasSuccessful)
            .Include(tc => tc.Territory)
            .Select(tc => tc.Territory.District)
            .Distinct()
            .CountAsync(cancellationToken);

        var lastRunDate = completedRuns.Count > 0 ? completedRuns.Max(r => r.CreatedAt) : (DateTime?)null;

        return new UserRunStatistics
        {
            UserId = userId,
            TotalRuns = totalRuns,
            TotalDistanceKm = Math.Round(totalDistanceKm, 2),
            TotalDuration = totalDuration,
            AverageSpeedKmh = Math.Round(averageSpeedKmh, 2),
            BestSpeedKmh = Math.Round(bestSpeedKmh, 2),
            LongestRunKm = Math.Round(longestRunKm, 2),
            TerritoriesCaptured = territoriesCaptured,
            UniqueDistrictsVisited = uniqueDistrictsVisited,
            LandmarksVisited = 0, // This would require more complex query with landmarks
            LastRunDate = lastRunDate,
            CurrentStreak = 0, // This would require streak calculation logic
            BestStreak = 0 // This would require streak calculation logic
        };
    }
}