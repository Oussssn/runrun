using Microsoft.EntityFrameworkCore;
using RunIstanbul.Infrastructure.Extensions;
using RunIstanbul.Application.Common.Mappings;
using RunIstanbul.Infrastructure.Data;
using RunIstanbul.Domain.Interfaces;
using RunIstanbul.Infrastructure.Repositories;
using RunIstanbul.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

// Configure port
builder.WebHost.UseUrls("http://localhost:5001");

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration - Using InMemory for testing
// var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? 
//     "Host=localhost;Database=runistanbul;Username=postgres;Password=password;Include Error Detail=true";

// Infrastructure services with InMemory database for testing
builder.Services.AddDbContext<RunIstanbulDbContext>(options =>
{
    options.UseInMemoryDatabase("RunIstanbulTestDb");
    options.EnableSensitiveDataLogging(false);
    options.EnableServiceProviderCaching();
    options.EnableDetailedErrors();
});

// Repository registrations
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITerritoryRepository, TerritoryRepository>();
builder.Services.AddScoped<IUserRunRepository, UserRunRepository>();
builder.Services.AddScoped<ILandmarkRepository, LandmarkRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IAchievementRepository, AchievementRepository>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(MappingProfile).Assembly));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Ensure database is created and seed basic data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<RunIstanbulDbContext>();
    context.Database.EnsureCreated();
    
    // Add some basic test data
    if (!context.Users.Any())
    {
        var testUser = new User
        {
            Username = "testuser",
            Email = "test@runistanbul.com",
            FirstName = "Test",
            LastName = "User",
            Profile = new UserProfile
            {
                PreferredLanguage = "tr-TR",
                HomeDistrict = "Beşiktaş"
            }
        };
        testUser.Profile.UserId = testUser.Id;
        
        context.Users.Add(testUser);
        context.SaveChanges();
    }
}

app.Run();