using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RunIstanbul.Domain.Interfaces;
using RunIstanbul.Infrastructure.Data;
using RunIstanbul.Infrastructure.Data.Seed;
using RunIstanbul.Infrastructure.Repositories;

namespace RunIstanbul.Infrastructure.Extensions;

// Database configuration for dependency injection
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<RunIstanbulDbContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsql =>
            {
                npgsql.UseNetTopologySuite(); // Enable spatial types
                npgsql.MigrationsAssembly(typeof(RunIstanbulDbContext).Assembly.FullName);
            });
            
            options.EnableSensitiveDataLogging(false);
            options.EnableServiceProviderCaching();
            options.EnableDetailedErrors();
        });

        // Add repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITerritoryRepository, TerritoryRepository>();
        services.AddScoped<IUserRunRepository, UserRunRepository>();
        services.AddScoped<ILandmarkRepository, LandmarkRepository>();
        services.AddScoped<ITeamRepository, TeamRepository>();
        services.AddScoped<IAchievementRepository, AchievementRepository>();
        
        // Add seeder
        services.AddHostedService<DatabaseSeeder>();

        return services;
    }
}