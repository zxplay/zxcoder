using System.Net;
using Microsoft.AspNetCore.Mvc;
using SteveR.Auth.Repositories;

namespace SteveR.Auth.Controllers;

[ApiController]
[Route("logout")]
public class LogoutController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public LogoutController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<HttpStatusCode> GetLogout(
        [FromServices] SessionRepository sessionRepository,
        [FromServices] CookieRepository cookieRepository,
        [FromQuery(Name = "redirect_url")] string? redirect)
    {
        // Authorise request.
        // NOTE: Authentication token is used in the response below.
        var authToken = await cookieRepository.GetAuthToken(Request);
        if (authToken == null)
        {
            return HttpStatusCode.Unauthorized;
        }

        cookieRepository.DeleteAuthCookies(Response);

        var session = await sessionRepository.GetSession(authToken);
        if (session == null)
        {
            return HttpStatusCode.Unauthorized;
        }

        if (!string.IsNullOrEmpty(_configuration["SAML:LogoutLink"]))
        {
            cookieRepository.StoreReturnUrl(GetReturnUrl(redirect), Response);
            Response.Redirect(_configuration["SAML:LogoutLink"]);
            return HttpStatusCode.Redirect;
        }

        var authRedirect = _configuration["AuthRedirect"];

#if DEBUG

        if (string.IsNullOrEmpty(authRedirect))
        {
            // Use Codespaces environment variable if no auth base URL is set.
            authRedirect = Codespaces.GetAuthRedirect();
        }

#endif

        Response.Redirect(authRedirect);
        return HttpStatusCode.Redirect;
    }

    private string GetReturnUrl(string? route)
    {
        // Normalise base URL.
        var baseUrl = _configuration["AuthRedirect"];
        if (!baseUrl.EndsWith('/')) baseUrl = $"{baseUrl}/";

        // Append route to base URL as required.
        if (route == null) return baseUrl;
        if (route.StartsWith('/')) route = route.Substring(1);
        return $"{baseUrl}{route}";
    }

    [HttpGet]
    [Route("return")]
    public void GetLogoutCompleted([FromServices] CookieRepository cookieRepository)
    {
        Response.Redirect(cookieRepository.PopReturnUrl(Request, Response));
    }
}