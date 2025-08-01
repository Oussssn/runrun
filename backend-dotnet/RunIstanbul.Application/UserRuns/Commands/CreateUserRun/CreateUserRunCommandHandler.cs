using AutoMapper;
using MediatR;
using NetTopologySuite.Geometries;
using RunIstanbul.Domain.DTOs;
using RunIstanbul.Domain.Entities;
using RunIstanbul.Domain.Enums;
using RunIstanbul.Domain.Interfaces;

namespace RunIstanbul.Application.UserRuns.Commands.CreateUserRun;

public class CreateUserRunCommandHandler : IRequestHandler<CreateUserRunCommand, UserRunDto>
{
    private readonly IUserRunRepository _userRunRepository;
    private readonly IMapper _mapper;

    public CreateUserRunCommandHandler(IUserRunRepository userRunRepository, IMapper mapper)
    {
        _userRunRepository = userRunRepository;
        _mapper = mapper;
    }

    public async Task<UserRunDto> Handle(CreateUserRunCommand request, CancellationToken cancellationToken)
    {
        var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        // Convert route coordinates to LineString
        var routeCoordinates = request.Route
            .Select(loc => new Coordinate(loc.Longitude, loc.Latitude))
            .ToArray();

        var route = geometryFactory.CreateLineString(routeCoordinates);
        var startPoint = geometryFactory.CreatePoint(new Coordinate(request.StartPoint.Longitude, request.StartPoint.Latitude));
        var endPoint = geometryFactory.CreatePoint(new Coordinate(request.EndPoint.Longitude, request.EndPoint.Latitude));

        var userRun = new UserRun
        {
            UserId = request.UserId,
            Route = route,
            StartPoint = startPoint,
            EndPoint = endPoint,
            DistanceMeters = request.DistanceMeters,
            Duration = request.Duration,
            AverageSpeedKmh = request.AverageSpeedKmh,
            MaxSpeedKmh = request.MaxSpeedKmh,
            CaloriesBurned = request.CaloriesBurned,
            Status = RunStatus.Completed,
            Notes = request.Notes,
            WeatherData = request.WeatherData
        };

        var createdRun = await _userRunRepository.AddAsync(userRun, cancellationToken);
        return _mapper.Map<UserRunDto>(createdRun);
    }
}