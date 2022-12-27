using System.Text.Json;

namespace SteveR.Auth;

public static class Codespaces
{
    private static string? GetUrl()
    {
        var codespaceName = System.Environment.GetEnvironmentVariable("CODESPACE_NAME");
        var forwardingDomain = System.Environment.GetEnvironmentVariable("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN");

        if (string.IsNullOrEmpty(codespaceName) || string.IsNullOrEmpty(forwardingDomain))
        {
            return null;
        }

        const int port = 8080; // NOTE: Port number is hard-coded.
        return $"https://{codespaceName}-{port}.{forwardingDomain}";
    }

    public static string? GetAuthRedirect()
    {
        var url = GetUrl();
        return string.IsNullOrEmpty(url) ? null : $"{url}/";
    }

    public static string? GetCorsOrigin()
    {
        var url = GetUrl();

        if (string.IsNullOrEmpty(url))
        {
            return url;
        }

        var arr = new List<string>();
        arr.Add(url);
        return JsonSerializer.Serialize(arr.ToArray<string>());
    }
}