using System.Net;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SteveR.Auth.Repositories;
using SteveR.Auth.Saml;

namespace SteveR.Auth.Controllers;

[ApiController]
[Route("")]
[Route("login")]
public class LoginController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public LoginController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<HttpStatusCode> GetLogin(
        [FromServices] SessionRepository sessionRepository,
        [FromServices] UserRepository userRepository,
        [FromServices] CookieRepository cookieRepository,
        [FromQuery(Name = "redirect_url")] string? redirect)
    {

#if DEBUG

        // Auto-login in dev environment so SAML IdP server is not required.
        var defaultExpirationMinutes = int.Parse(_configuration["SAML:DefaultExpirationMinutes"]);
        var expiry = DateTime.Now.AddMinutes(defaultExpirationMinutes);
        return await UserLogin.PerformLoginAsync(
            _configuration["DebugAutoLoginUsername"],
            expiry,
            userRepository,
            sessionRepository,
            cookieRepository,
            _configuration,
            Request,
            Response);

#endif

#pragma warning disable CS0162
        
        var isAuthenticated = await cookieRepository.IsAuthenticated(Request);
        if (isAuthenticated)
        {
            Response.Redirect(GetReturnUrl(redirect));
            return HttpStatusCode.Redirect;
        }

        cookieRepository.StoreReturnUrl(GetReturnUrl(redirect), Response);
        Response.Redirect(GetAuthenticationRedirectUrl());
        return HttpStatusCode.Redirect;
        
#pragma warning restore CS0162
        
    }

    private string GetReturnUrl(string? redirect)
    {
        var baseUrl = _configuration["AuthRedirect"];

#if DEBUG

        if (string.IsNullOrEmpty(baseUrl))
        {
            // Use Codespaces environment variable if no auth base URL is set.
            baseUrl = Codespaces.GetAuthRedirect();
        }

#endif

        if (redirect == null) return baseUrl;

        if (!redirect.StartsWith(baseUrl))
        {
            Log.Debug($"baseUrl = \"{baseUrl}\"");
            Log.Debug($"redirect = \"{redirect}\"");
            throw new InvalidOperationException();
        }

        return redirect;
    }

    /// <summary>
    /// Redirect to SAML IdP endpoint with info required for the authentication request.
    /// </summary>
    /// <returns>Authentication redirect URL</returns>
    private string GetAuthenticationRedirectUrl()
    {
        var appId = _configuration["SAML:AppId"];
        var assertionConsumer = _configuration["SAML:AssertionConsumer"];
        var ssoEndpoint = _configuration["SAML:SsoEndpoint"];
        var authnRequest = new AuthnRequest(appId, assertionConsumer);
        return authnRequest.GetRedirectUrl(ssoEndpoint);
    }
}