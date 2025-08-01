using MediatR;
using Microsoft.AspNetCore.Mvc;
using RunIstanbul.Application.Territories.Commands.CreateTerritory;
using RunIstanbul.Application.Territories.Queries.GetAvailableTerritoriesForCapture;
using RunIstanbul.Application.Territories.Queries.GetTerritoriesByDistrict;
using RunIstanbul.Application.Territories.Queries.GetTerritory;
using RunIstanbul.Domain.DTOs;

namespace RunIstanbul.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TerritoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public TerritoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get territory by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TerritoryDto>> GetTerritory(Guid id)
    {
        var result = await _mediator.Send(new GetTerritoryQuery(id));
        return result != null ? Ok(result) : NotFound();
    }

    /// <summary>
    /// Get territories by district
    /// </summary>
    [HttpGet("district/{district}")]
    public async Task<ActionResult<IEnumerable<TerritoryDto>>> GetTerritoriesByDistrict(string district)
    {
        var result = await _mediator.Send(new GetTerritoriesByDistrictQuery(district));
        return Ok(result);
    }

    /// <summary>
    /// Get available territories for capture near user location
    /// </summary>
    [HttpPost("available-for-capture")]
    public async Task<ActionResult<IEnumerable<TerritoryDto>>> GetAvailableTerritoriesForCapture(
        [FromBody] GetAvailableTerritoriesForCaptureQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Create a new territory
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TerritoryDto>> CreateTerritory([FromBody] CreateTerritoryCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetTerritory), new { id = result.Id }, result);
    }
}