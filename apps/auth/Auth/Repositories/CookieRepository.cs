using SteveR.Auth.Tokens;

namespace SteveR.Auth.Repositories;

public class CookieRepository
{
    private readonly IConfiguration _configuration;
    private readonly SessionRepository _sessionRepository;

    public CookieRepository(IConfiguration configuration, SessionRepository sessionRepository)
    {
        _configuration = configuration;
        _sessionRepository = sessionRepository;
    }

    public async Task<string?> GetAuthToken(HttpRequest request)
    {
        var cookieName = _configuration["SAML:AuthCookieName"];

        if (!request.Cookies.ContainsKey(cookieName))
        {
            return null;
        }

        var cookie = request.Cookies[cookieName];
        if (cookie == null)
        {
            return null;
        }

        var cookieReader = new SessionTokenCookieReader(_configuration, cookie);
        var sessionId = cookieReader.GetAuthToken();
        if (sessionId == null)
        {
            return null;
        }
            
        return await _sessionRepository.IsValidSession(sessionId) ? sessionId : null;
    }

    public async Task<bool> IsAuthenticated(HttpRequest request)
    {
        var cookieName = _configuration["SAML:AuthCookieName"];
        var authToken = request.Cookies[cookieName];
        if (authToken == null) return false;
        var validSession = await _sessionRepository.IsValidSession(authToken);
        return request.Cookies.ContainsKey(cookieName) && validSession;
    }

    public void StoreReturnUrl(string returnUrl, HttpResponse response)
    {
        var cookieName = _configuration["SAML:ReturnUrlCookieName"];

        response.Cookies.Append(cookieName, returnUrl, new CookieOptions
        {
            // The cookie has to survive a redirect to a 3rd-party site.
            // NOTE: SameSiteMode.Unspecified option is only option that will work where Secure = false.
            // NOTE: SameSiteMode.None works when using Secure = true.
#if DEBUG
            // Development settings.
            SameSite = SameSiteMode.Unspecified,
            Secure = false,
#else
            // Production settings.
            SameSite = SameSiteMode.None, 
            Secure = true,
#endif
            HttpOnly = true, // This cookie is not available to JavaScript.
            Expires = DateTime.Now.AddMinutes(10), // No sense in leaving this lying around for a long time.
            IsEssential = true
        });
    }

    public string PopReturnUrl(HttpRequest request, HttpResponse response)
    {
        var cookieName = _configuration["SAML:ReturnUrlCookieName"];
        var result = request.Cookies[cookieName];

        response.Cookies.Delete(cookieName);

        var authRedirect = _configuration["AuthRedirect"];

#if DEBUG

        if (string.IsNullOrEmpty(authRedirect))
        {
            // Use Codespaces environment variable if no auth base URL is set.
            authRedirect = Codespaces.GetAuthRedirect();
        }

#endif

        if (result != null && result.StartsWith(authRedirect))
        {
            return result;
        }

        return authRedirect;
    }

    public void DeleteAuthCookies(HttpResponse response)
    {
        response.Cookies.Delete(_configuration["SAML:AuthCookieName"]);
        response.Cookies.Delete(_configuration["SAML:ReturnUrlCookieName"]);
    }
}