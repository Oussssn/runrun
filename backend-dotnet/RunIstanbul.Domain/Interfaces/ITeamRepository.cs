using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Domain.Interfaces;

public interface ITeamRepository : IRepository<Team>
{
    Task<IEnumerable<Team>> GetPublicTeamsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Team>> GetByDistrictAsync(string district, CancellationToken cancellationToken = default);
    Task<Team?> GetWithMembersAsync(Guid teamId, CancellationToken cancellationToken = default);
}