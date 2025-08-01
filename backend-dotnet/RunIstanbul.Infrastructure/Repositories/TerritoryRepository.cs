using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Interfaces;
using RunIstanbul.Infrastructure.Data;

namespace RunIstanbul.Infrastructure.Repositories;

public class TerritoryRepository : SpatialRepository<Territory>, ITerritoryRepository
{
    public TerritoryRepository(RunIstanbulDbContext context) : base(context) { }

    public override async Task<Territory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(t => t.Ownerships.Where(o => o.IsActive))
                .ThenInclude(o => o.User)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public override async Task<IEnumerable<Territory>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(t => t.Ownerships.Where(o => o.IsActive))
            .ToListAsync(cancellationToken);
    }

    public override async Task<IEnumerable<Territory>> GetWithinDistanceAsync(Point point, double distanceMeters, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.CenterPoint.Distance(point) <= distanceMeters)
            .Include(t => t.Ownerships.Where(o => o.IsActive))
            .ToListAsync(cancellationToken);
    }

    public override async Task<IEnumerable<Territory>> GetIntersectingAsync(Geometry geometry, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.Boundary.Intersects(geometry))
            .Include(t => t.Ownerships.Where(o => o.IsActive))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Territory>> GetByDistrictAsync(string district, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.District == district)
            .Include(t => t.Ownerships.Where(o => o.IsActive))
            .ToListAsync(cancellationToken);
    }

    public async Task<Territory?> GetContainingPointAsync(Point point, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.Boundary.Contains(point))
            .Include(t => t.Ownerships.Where(o => o.IsActive))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<Territory>> GetIntersectingRouteAsync(LineString route, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.Boundary.Intersects(route))
            .Include(t => t.Ownerships.Where(o => o.IsActive))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Territory>> GetAvailableForCaptureAsync(Point userLocation, double maxDistance, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.IsActive && 
                       t.CenterPoint.Distance(userLocation) <= maxDistance)
            .Include(t => t.Ownerships.Where(o => o.IsActive))
            .OrderBy(t => t.CenterPoint.Distance(userLocation))
            .ToListAsync(cancellationToken);
    }
}