using MediatR;
using Microsoft.AspNetCore.Mvc;
using RunIstanbul.Application.Common.Mappings;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LandmarksController : ControllerBase
{
    private readonly IMediator _mediator;

    public LandmarksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get landmarks by type
    /// </summary>
    [HttpGet("type/{type}")]
    public async Task<ActionResult<IEnumerable<LandmarkDto>>> GetLandmarksByType(LandmarkType type)
    {
        // This would require implementing the GetLandmarksByType query
        return Ok(new List<LandmarkDto>());
    }

    /// <summary>
    /// Get landmarks near a location
    /// </summary>
    [HttpPost("near-location")]
    public async Task<ActionResult<IEnumerable<LandmarkDto>>> GetLandmarksNearLocation([FromBody] GetLandmarksNearLocationRequest request)
    {
        // This would require implementing the GetLandmarksNearLocation query
        return Ok(new List<LandmarkDto>());
    }
}

public record GetLandmarksNearLocationRequest
{
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public double RadiusMeters { get; init; } = 1000;
}