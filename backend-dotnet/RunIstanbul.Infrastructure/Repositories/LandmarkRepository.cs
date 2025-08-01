using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Enums;
using RunIstanbul.Domain.Interfaces;
using RunIstanbul.Infrastructure.Data;

namespace RunIstanbul.Infrastructure.Repositories;

public class LandmarkRepository : SpatialRepository<Landmark>, ILandmarkRepository
{
    public LandmarkRepository(RunIstanbulDbContext context) : base(context) { }

    public override async Task<IEnumerable<Landmark>> GetWithinDistanceAsync(Point point, double distanceMeters, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(l => l.Location.Distance(point) <= distanceMeters && l.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Landmark>> GetByTypeAsync(LandmarkType type, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(l => l.Type == type && l.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Landmark>> GetNearRouteAsync(LineString route, double maxDistanceMeters, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(l => l.IsActive && l.Location.Distance(route) <= maxDistanceMeters)
            .ToListAsync(cancellationToken);
    }
}