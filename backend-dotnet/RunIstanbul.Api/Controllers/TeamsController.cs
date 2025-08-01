using MediatR;
using Microsoft.AspNetCore.Mvc;
using RunIstanbul.Application.Common.Mappings;

namespace RunIstanbul.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TeamsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all public teams
    /// </summary>
    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<TeamDto>>> GetPublicTeams()
    {
        // This would require implementing the GetPublicTeams query
        return Ok(new List<TeamDto>());
    }

    /// <summary>
    /// Get teams by district
    /// </summary>
    [HttpGet("district/{district}")]
    public async Task<ActionResult<IEnumerable<TeamDto>>> GetTeamsByDistrict(string district)
    {
        // This would require implementing the GetTeamsByDistrict query
        return Ok(new List<TeamDto>());
    }

    /// <summary>
    /// Get team with members
    /// </summary>
    [HttpGet("{id:guid}/members")]
    public async Task<ActionResult<TeamDto>> GetTeamWithMembers(Guid id)
    {
        // This would require implementing the GetTeamWithMembers query
        return NotFound();
    }
}