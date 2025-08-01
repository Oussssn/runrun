using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Common;

namespace RunIstanbul.Domain.Interfaces;

// Repository pattern with spatial support
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
}

public interface ISpatialRepository<T> : IRepository<T> where T : BaseEntity
{
    Task<IEnumerable<T>> GetWithinDistanceAsync(Point point, double distanceMeters, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> GetIntersectingAsync(Geometry geometry, CancellationToken cancellationToken = default);
}