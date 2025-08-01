using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Enums;
using System.Text.Json;

namespace RunIstanbul.Infrastructure.Data.Seed;

// Seed data service
public class DatabaseSeeder : IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public DatabaseSeeder(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<RunIstanbulDbContext>();
        
        await context.Database.MigrateAsync(cancellationToken);
        await SeedDataAsync(context, cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private static async Task SeedDataAsync(RunIstanbulDbContext context, CancellationToken cancellationToken)
    {
        await SeedLandmarksAsync(context, cancellationToken);
        await SeedTerritoriesAsync(context, cancellationToken); 
        await SeedAchievementsAsync(context, cancellationToken);
        await SeedDefaultUsersAsync(context, cancellationToken);
    }

    private static async Task SeedLandmarksAsync(RunIstanbulDbContext context, CancellationToken cancellationToken)
    {
        if (await context.Landmarks.AnyAsync(cancellationToken))
            return;

        var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        var landmarks = new List<Landmark>
        {
            new()
            {
                Name = "Hagia Sophia",
                NameTurkish = "Ayasofya",
                Location = geometryFactory.CreatePoint(new Coordinate(28.9802, 41.0086)),
                Type = LandmarkType.Historic,
                Description = "Former Greek Orthodox cathedral, later an Ottoman mosque, now a museum and mosque",
                DescriptionTurkish = "Eski Rum Ortodoks katedrali, sonra Osmanlı camii, şimdi müze ve cami",
                BonusPoints = 200,
                ProximityRadiusMeters = 150
            },
            new()
            {
                Name = "Galata Tower",
                NameTurkish = "Galata Kulesi", 
                Location = geometryFactory.CreatePoint(new Coordinate(28.9744, 41.0256)),
                Type = LandmarkType.Historic,
                Description = "Medieval stone tower in the Galata district",
                DescriptionTurkish = "Galata semtindeki ortaçağ taş kulesi",
                BonusPoints = 150,
                ProximityRadiusMeters = 100
            },
            new()
            {
                Name = "Bosphorus Bridge",
                NameTurkish = "Boğaziçi Köprüsü",
                Location = geometryFactory.CreatePoint(new Coordinate(29.0350, 41.0391)),
                Type = LandmarkType.Bridge,
                Description = "Suspension bridge connecting Europe and Asia",
                DescriptionTurkish = "Avrupa ve Asya'yı birleştiren asma köprü",
                BonusPoints = 300,
                ProximityRadiusMeters = 200
            },
            new()
            {
                Name = "Dolmabahçe Palace",
                NameTurkish = "Dolmabahçe Sarayı",
                Location = geometryFactory.CreatePoint(new Coordinate(29.0003, 41.0391)),
                Type = LandmarkType.Historic,
                Description = "19th-century palace that served as the main administrative center of the Ottoman Empire",
                DescriptionTurkish = "19. yüzyıl sarayı, Osmanlı İmparatorluğu'nun ana idari merkezi",
                BonusPoints = 180,
                ProximityRadiusMeters = 120
            },
            new()
            {
                Name = "Taksim Square",
                NameTurkish = "Taksim Meydanı",
                Location = geometryFactory.CreatePoint(new Coordinate(28.9857, 41.0369)),
                Type = LandmarkType.Cultural,
                Description = "Major tourist and leisure district famous for its restaurants, shops and hotels",
                DescriptionTurkish = "Restoranları, mağazaları ve otelleriyle ünlü başlıca turist ve eğlence bölgesi",
                BonusPoints = 120,
                ProximityRadiusMeters = 100
            }
        };

        await context.Landmarks.AddRangeAsync(landmarks, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedTerritoriesAsync(RunIstanbulDbContext context, CancellationToken cancellationToken)
    {
        if (await context.Territories.AnyAsync(cancellationToken))
            return;

        var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        var territories = new List<Territory>
        {
            // Beşiktaş territories
            new()
            {
                Name = "Beşiktaş Center",
                District = "Beşiktaş",
                Boundary = geometryFactory.CreatePolygon(new[]
                {
                    new Coordinate(29.0000, 41.0400),
                    new Coordinate(29.0100, 41.0400),
                    new Coordinate(29.0100, 41.0500),
                    new Coordinate(29.0000, 41.0500),
                    new Coordinate(29.0000, 41.0400)
                }),
                CenterPoint = geometryFactory.CreatePoint(new Coordinate(29.0050, 41.0450)),
                Type = TerritoryType.Regular,
                BasePoints = 100,
                DifficultyLevel = 2
            },
            new()
            {
                Name = "Ortaköy",
                District = "Beşiktaş",
                Boundary = geometryFactory.CreatePolygon(new[]
                {
                    new Coordinate(29.0250, 41.0450),
                    new Coordinate(29.0350, 41.0450),
                    new Coordinate(29.0350, 41.0550),
                    new Coordinate(29.0250, 41.0550),
                    new Coordinate(29.0250, 41.0450)
                }),
                CenterPoint = geometryFactory.CreatePoint(new Coordinate(29.0300, 41.0500)),
                Type = TerritoryType.Scenic,
                BasePoints = 150,
                DifficultyLevel = 3
            },
            
            // Kadıköy territories
            new()
            {
                Name = "Kadıköy Center", 
                District = "Kadıköy",
                Boundary = geometryFactory.CreatePolygon(new[]
                {
                    new Coordinate(29.0200, 40.9900),
                    new Coordinate(29.0300, 40.9900),
                    new Coordinate(29.0300, 41.0000),
                    new Coordinate(29.0200, 41.0000),
                    new Coordinate(29.0200, 40.9900)
                }),
                CenterPoint = geometryFactory.CreatePoint(new Coordinate(29.0250, 40.9950)),
                Type = TerritoryType.Commercial,
                BasePoints = 120,
                DifficultyLevel = 2
            }
        };

        await context.Territories.AddRangeAsync(territories, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedAchievementsAsync(RunIstanbulDbContext context, CancellationToken cancellationToken)
    {
        if (await context.Achievements.AnyAsync(cancellationToken))
            return;

        var achievements = new List<Achievement>
        {
            // Distance achievements
            new()
            {
                Name = "First Steps",
                NameTurkish = "İlk Adımlar",
                Description = "Complete your first run",
                DescriptionTurkish = "İlk koşunuzu tamamlayın",
                Type = AchievementType.Distance,
                Rarity = AchievementRarity.Common,
                Points = 50,
                ConditionsJson = JsonSerializer.Serialize(new { MinRuns = 1 })
            },
            new()
            {
                Name = "5K Runner",
                NameTurkish = "5K Koşucusu",
                Description = "Run 5 kilometers in a single session",
                DescriptionTurkish = "Tek seferde 5 kilometre koşun",
                Type = AchievementType.Distance,
                Rarity = AchievementRarity.Common,
                Points = 100,
                ConditionsJson = JsonSerializer.Serialize(new { MinDistanceKm = 5.0 })
            },
            new()
            {
                Name = "Territory Conqueror",
                NameTurkish = "Bölge Fatiri",
                Description = "Capture your first territory",
                DescriptionTurkish = "İlk bölgenizi ele geçirin",
                Type = AchievementType.Territory,
                Rarity = AchievementRarity.Common,
                Points = 75,
                ConditionsJson = JsonSerializer.Serialize(new { MinTerritories = 1 })
            }
        };

        await context.Achievements.AddRangeAsync(achievements, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedDefaultUsersAsync(RunIstanbulDbContext context, CancellationToken cancellationToken)
    {
        if (await context.Users.AnyAsync(cancellationToken))
            return;

        var users = new List<User>
        {
            new()
            {
                Username = "istanbul_runner",
                Email = "runner@istanbul.com",
                FirstName = "Mehmet",
                LastName = "Koşucu",
                Profile = new UserProfile
                {
                    Level = 5,
                    TotalExperience = 2500,
                    TotalDistanceKm = 150.5,
                    TotalRunningTime = TimeSpan.FromHours(25),
                    TerritoriesCaptured = 12,
                    PreferredLanguage = "tr-TR",
                    HomeDistrict = "Beşiktaş"
                }
            },
            new()
            {
                Username = "bosphorus_explorer",
                Email = "explorer@bosphorus.com", 
                FirstName = "Ayşe",
                LastName = "Gezgin",
                Profile = new UserProfile
                {
                    Level = 3,
                    TotalExperience = 1200,
                    TotalDistanceKm = 89.2,
                    TotalRunningTime = TimeSpan.FromHours(18),
                    TerritoriesCaptured = 7,
                    PreferredLanguage = "tr-TR",
                    HomeDistrict = "Kadıköy"
                }
            }
        };

        // Set profile user IDs
        foreach (var user in users)
        {
            user.Profile.UserId = user.Id;
        }

        await context.Users.AddRangeAsync(users, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }
}