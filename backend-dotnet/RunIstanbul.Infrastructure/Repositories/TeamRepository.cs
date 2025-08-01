using Microsoft.EntityFrameworkCore;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Interfaces;
using RunIstanbul.Infrastructure.Data;

namespace RunIstanbul.Infrastructure.Repositories;

public class TeamRepository : BaseRepository<Team>, ITeamRepository
{
    public TeamRepository(RunIstanbulDbContext context) : base(context) { }

    public async Task<IEnumerable<Team>> GetPublicTeamsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.IsPublic && t.IsActive)
            .Include(t => t.Members.Where(m => m.IsActive))
                .ThenInclude(m => m.User)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Team>> GetByDistrictAsync(string district, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.District == district && t.IsActive)
            .Include(t => t.Members.Where(m => m.IsActive))
                .ThenInclude(m => m.User)
            .ToListAsync(cancellationToken);
    }

    public async Task<Team?> GetWithMembersAsync(Guid teamId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.Id == teamId)
            .Include(t => t.Members.Where(m => m.IsActive))
                .ThenInclude(m => m.User)
            .Include(t => t.CreatedBy)
            .FirstOrDefaultAsync(cancellationToken);
    }
}