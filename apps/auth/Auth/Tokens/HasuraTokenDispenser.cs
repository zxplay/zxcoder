using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SteveR.Auth.Repositories;

namespace SteveR.Auth.Tokens;

internal class HasuraTokenDispenser : TokenDispenser
{
    public HasuraTokenDispenser(IConfiguration configuration)
        : base(configuration, "JWT:HasuraToken:")
    {
        
    }
    
    public async Task<string> GenerateAccessToken(
        string userId, [FromServices] UserRepository userRepository)
    {
        var token = GetJwtSecurityToken();
        var roles = await userRepository.GetRoles(userId);

        Log.Debug(string.Join(",", roles));
        
        token.Payload["https://hasura.io/jwt/claims"] = new Dictionary<string, dynamic>
        {
            ["X-Hasura-User-Id"] = userId,
            ["X-Hasura-Allowed-Roles"] = roles,
            ["X-Hasura-Default-Role"] = GetDefaultRole()!
        };

        var str = new JwtSecurityTokenHandler().WriteToken(token);
        Log.Debug($"API Token Data: {token}");
        Log.Debug($"API Token Base64: {str}");
        return str;
    }
}