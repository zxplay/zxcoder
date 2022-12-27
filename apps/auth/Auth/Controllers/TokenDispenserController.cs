using System.Dynamic;
using Microsoft.AspNetCore.Mvc;
using SteveR.Auth.Repositories;
using SteveR.Auth.Tokens;

namespace SteveR.Auth.Controllers;

/// <summary>
/// This issues tokens used by the Hasura API.
/// </summary>
[ApiController]
[Route("token")]
public class TokenDispenserController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public TokenDispenserController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetToken(
        [FromServices] SessionRepository sessionRepository,
        [FromServices] CookieRepository cookieRepository,
        [FromServices] UserRepository userRepository)
    {
        // Authorise request.
        // NOTE: Authentication token is used in the response below.
        var authToken = await cookieRepository.GetAuthToken(Request);
        if (authToken == null)
        {
            return Unauthorized();
        }
    
        // Check for active session.
        var session = await sessionRepository.GetSession(authToken);
        if (session == null)
        {
            return Unauthorized();
        }
    
        var userId = session.User?.UserId;
        
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new InvalidOperationException("No user ID");
        }

        // Generate token.
        var dispenser = new HasuraTokenDispenser(_configuration);
        var token = await dispenser.GenerateAccessToken(userId, userRepository);

        // Return JSON result.
        dynamic result = new ExpandoObject();
        result.token = token;
        return new JsonResult(result);
    }
}