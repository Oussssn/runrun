using Microsoft.EntityFrameworkCore;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Enums;
using RunIstanbul.Domain.Interfaces;
using RunIstanbul.Infrastructure.Data;

namespace RunIstanbul.Infrastructure.Repositories;

public class AchievementRepository : BaseRepository<Achievement>, IAchievementRepository
{
    public AchievementRepository(RunIstanbulDbContext context) : base(context) { }

    public async Task<IEnumerable<Achievement>> GetByTypeAsync(AchievementType type, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.Type == type && a.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Achievement>> GetByRarityAsync(AchievementRarity rarity, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.Rarity == rarity && a.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<UserAchievement>> GetUserAchievementsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Include(ua => ua.Achievement)
            .OrderByDescending(ua => ua.EarnedAt)
            .ToListAsync(cancellationToken);
    }
}