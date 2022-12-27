using System.Dynamic;
using Microsoft.AspNetCore.Mvc;
using SteveR.Auth.Repositories;

namespace SteveR.Auth.Controllers;

[ApiController]
[Route("me")]
public class MeController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public MeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetMe(
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

        var roles = await userRepository.GetRoles(userId);

        dynamic result = new ExpandoObject();
        result.userId = userId;
        result.roles = roles;
        return new JsonResult(result);
    }
}