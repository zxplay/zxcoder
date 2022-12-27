using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SteveR.Auth.Repositories;

namespace SteveR.Auth.Tokens;

internal class SessionTokenDispenser : TokenDispenser
{
    public SessionTokenDispenser(IConfiguration configuration) 
        : base(configuration, "JWT:SessionToken:")
    {
        
    }
    
    public async Task<string> GenerateAccessToken(
        string authToken, string userId, [FromServices] UserRepository userRepository)
    {
        var token = GetJwtSecurityToken();
        var roles = await userRepository.GetRoles(userId);
        
        token.Payload["roles"] = roles;
        
        token.Payload["props"] = new Dictionary<string, dynamic>
        {
            ["auth"] = authToken
        };

        var str = new JwtSecurityTokenHandler().WriteToken(token);
        Log.Debug($"Session Token Data: {token}");
        Log.Debug($"Session Token Base64: {str}");
        return str;
    }
}