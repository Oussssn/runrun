using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Domain.Interfaces;

public interface ILandmarkRepository : ISpatialRepository<Landmark>
{
    Task<IEnumerable<Landmark>> GetByTypeAsync(LandmarkType type, CancellationToken cancellationToken = default);
    Task<IEnumerable<Landmark>> GetNearRouteAsync(LineString route, double maxDistanceMeters, CancellationToken cancellationToken = default);
}