using MediatR;
using Microsoft.AspNetCore.Mvc;
using RunIstanbul.Application.UserRuns.Commands.CreateUserRun;
using RunIstanbul.Application.UserRuns.Queries.GetUserRuns;
using RunIstanbul.Application.UserRuns.Queries.GetUserRunById;
using RunIstanbul.Application.UserRuns.Queries.GetUserStatistics;
using RunIstanbul.Domain.DTOs;

namespace RunIstanbul.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserRunsController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserRunsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get a specific user run by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserRunDto>> GetUserRunById(Guid id)
    {
        var result = await _mediator.Send(new GetUserRunByIdQuery(id));
        
        if (result == null)
            return NotFound();
            
        return Ok(result);
    }

    /// <summary>
    /// Get user runs with pagination
    /// </summary>
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<UserRunDto>>> GetUserRuns(
        Guid userId, 
        [FromQuery] int skip = 0, 
        [FromQuery] int take = 50)
    {
        var query = new GetUserRunsQuery { UserId = userId, Skip = skip, Take = take };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Get user running statistics
    /// </summary>
    [HttpGet("user/{userId:guid}/statistics")]
    public async Task<ActionResult<UserRunStatistics>> GetUserStatistics(Guid userId)
    {
        var result = await _mediator.Send(new GetUserStatisticsQuery(userId));
        return Ok(result);
    }

    /// <summary>
    /// Create a new user run
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<UserRunDto>> CreateUserRun([FromBody] CreateUserRunCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetUserRunById), new { id = result.Id }, result);
    }
}