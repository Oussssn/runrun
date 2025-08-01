using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.Interfaces;

public interface IAchievementRepository : IRepository<Achievement>
{
    Task<IEnumerable<Achievement>> GetByTypeAsync(AchievementType type, CancellationToken cancellationToken = default);
    Task<IEnumerable<Achievement>> GetByRarityAsync(AchievementRarity rarity, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserAchievement>> GetUserAchievementsAsync(Guid userId, CancellationToken cancellationToken = default);
}