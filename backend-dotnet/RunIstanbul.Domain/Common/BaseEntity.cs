using System.ComponentModel.DataAnnotations;

namespace RunIstanbul.Domain.Common;

// Base Entity with modern C# features
public abstract record BaseEntity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
}