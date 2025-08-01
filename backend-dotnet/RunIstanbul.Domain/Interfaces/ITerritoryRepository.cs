using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Entities;

namespace RunIstanbul.Domain.Interfaces;

// Specialized repositories
public interface ITerritoryRepository : ISpatialRepository<Territory>
{
    Task<IEnumerable<Territory>> GetByDistrictAsync(string district, CancellationToken cancellationToken = default);
    Task<Territory?> GetContainingPointAsync(Point point, CancellationToken cancellationToken = default);
    Task<IEnumerable<Territory>> GetIntersectingRouteAsync(LineString route, CancellationToken cancellationToken = default);
    Task<IEnumerable<Territory>> GetAvailableForCaptureAsync(Point userLocation, double maxDistance, CancellationToken cancellationToken = default);
}