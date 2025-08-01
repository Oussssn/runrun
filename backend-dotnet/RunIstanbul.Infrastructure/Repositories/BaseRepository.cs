using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Common;
using RunIstanbul.Domain.Interfaces;
using RunIstanbul.Infrastructure.Data;

namespace RunIstanbul.Infrastructure.Repositories;

// Base repository implementation
public class BaseRepository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly RunIstanbulDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public BaseRepository(RunIstanbulDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.ToListAsync(cancellationToken);
    }

    public virtual async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public virtual async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id, cancellationToken);
        if (entity != null)
        {
            entity.IsDeleted = true;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public virtual async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.AnyAsync(e => e.Id == id, cancellationToken);
    }
}

// Spatial repository base implementation
public class SpatialRepository<T> : BaseRepository<T>, ISpatialRepository<T> where T : BaseEntity
{
    public SpatialRepository(RunIstanbulDbContext context) : base(context) { }

    public virtual async Task<IEnumerable<T>> GetWithinDistanceAsync(Point point, double distanceMeters, CancellationToken cancellationToken = default)
    {
        // This is a base implementation - derived classes should override for specific spatial properties
        return await _dbSet.ToListAsync(cancellationToken);
    }

    public virtual async Task<IEnumerable<T>> GetIntersectingAsync(Geometry geometry, CancellationToken cancellationToken = default)
    {
        // This is a base implementation - derived classes should override for specific spatial properties
        return await _dbSet.ToListAsync(cancellationToken);
    }
}