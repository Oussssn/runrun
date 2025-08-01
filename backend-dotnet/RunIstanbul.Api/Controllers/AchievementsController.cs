using MediatR;
using Microsoft.AspNetCore.Mvc;
using RunIstanbul.Application.Common.Mappings;
using RunIstanbul.Domain.Enums;

namespace RunIstanbul.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AchievementsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AchievementsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get achievements by type
    /// </summary>
    [HttpGet("type/{type}")]
    public async Task<ActionResult<IEnumerable<AchievementDto>>> GetAchievementsByType(AchievementType type)
    {
        // This would require implementing the GetAchievementsByType query
        return Ok(new List<AchievementDto>());
    }

    /// <summary>
    /// Get achievements by rarity
    /// </summary>
    [HttpGet("rarity/{rarity}")]
    public async Task<ActionResult<IEnumerable<AchievementDto>>> GetAchievementsByRarity(AchievementRarity rarity)
    {
        // This would require implementing the GetAchievementsByRarity query
        return Ok(new List<AchievementDto>());
    }

    /// <summary>
    /// Get user achievements
    /// </summary>
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<UserAchievementDto>>> GetUserAchievements(Guid userId)
    {
        // This would require implementing the GetUserAchievements query
        return Ok(new List<UserAchievementDto>());
    }
}