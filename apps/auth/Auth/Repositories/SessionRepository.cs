using SteveR.Auth.Model;

namespace SteveR.Auth.Repositories;

public class SessionRepository
{
    private readonly IConfiguration _configuration;

    public SessionRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private GraphQlClient GetGraphQlClient()
    {
        var endpoint = _configuration["GraphQL:Endpoint"];
        var secret = _configuration["GraphQL:AdminSecret"];
        var headers = new Dictionary<string, string> { { "X-Hasura-Admin-Secret", secret } };
        return new GraphQlClient(endpoint, headers);
    }

    public async Task<bool> IsValidSession(string authToken)
    {
        return await GetSession(authToken) != null;
    }

    public async Task<Session?> GetSession(string authToken)
    {
        if (authToken == null)
        {
            throw new ArgumentNullException(nameof(authToken));
        }
        
        // Query for session info for given auth token.
        var client = GetGraphQlClient();
        var query = await File.ReadAllTextAsync(Path.Combine("GraphQL", "GetSession.graphql"));
        var result = await client.Query(query, new { auth_token = authToken });
        result.EnsureNoErrors();
        
        var sessions = result.Get<Session[]>("session");
        
        // Handle auth token not found.
        if (sessions == null || sessions.Length == 0)
        {
            return null;
        }

        // Handle unexpected number of query results.
        if (sessions.Length > 1)
        {
            throw new Exception("Unexpected number of query results");
        }

        var session = sessions[0];

        // Ensure that the session has not expired.
        if (session.Expires == null || DateTime.Parse(session.Expires) <= DateTime.Now)
        {
            return null;
        }

        // Update session timestamp.
        // TODO: Consider extending the session expiry from this point.
        query = await File.ReadAllTextAsync(Path.Combine("GraphQL", "UpdateSessionTimestamp.graphql"));

        result = await client.Query(query, new
        {
            session_id = session.SessionId,
            updated = DateTime.UtcNow.ToString("o")
        });
        
        result.EnsureNoErrors();
        
        return session;
    }

    public async Task CreateSession(string userId, string authToken, DateTime created, DateTime expires)
    {
        // Query to create new session record. 
        var client = GetGraphQlClient();
        var query = await File.ReadAllTextAsync(Path.Combine("GraphQL", "CreateSession.graphql"));
        
        var result = await client.Query(query, new
        {
            user_id = userId,
            auth_token = authToken,
            created = created.ToString("o"),
            expires = expires.ToString("o")
        });
        
        result.EnsureNoErrors();
    }
}
