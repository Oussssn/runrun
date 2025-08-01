using NetTopologySuite.Geometries;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Domain.Interfaces;

public interface IUserRunRepository : IRepository<UserRun>
{
    Task<IEnumerable<UserRun>> GetByUserIdAsync(Guid userId, int skip = 0, int take = 50, CancellationToken cancellationToken = default);
    Task<UserRun?> GetActiveRunAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserRun>> GetRunsInAreaAsync(Polygon area, DateTime? since = null, CancellationToken cancellationToken = default);
    Task<UserRunStatistics> GetUserStatisticsAsync(Guid userId, CancellationToken cancellationToken = default);
}