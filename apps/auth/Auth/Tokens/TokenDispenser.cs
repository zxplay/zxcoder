using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SteveR.Auth.Tokens;

internal abstract class TokenDispenser
{
    private readonly IConfiguration _configuration;

    private readonly string _configPrefix;

    private string DefaultRole => _configuration["JWT:DefaultRole"];

    private bool AddDefaultRole => _configuration["JWT:AddDefaultRole"] != null && bool.Parse(_configuration["JWT:AddDefaultRole"]);
    
    private string JwtIssuer => _configuration[$"{_configPrefix}Issuer"];
        
    private string JwtAudience => _configuration[$"{_configPrefix}Audience"];
        
    private int JwtExpirationSecs => int.Parse(_configuration[$"{_configPrefix}ExpirationSeconds"]);
        
    private SymmetricSecurityKey Key => new(Encoding.UTF8.GetBytes(_configuration[$"{_configPrefix}Secret"]));
        
    private SigningCredentials Credentials => new(Key, SecurityAlgorithms.HmacSha256);

    protected TokenDispenser(IConfiguration configuration, string configPrefix)
    {
        _configuration = configuration;
        _configPrefix = configPrefix;
    }

    protected JwtSecurityToken GetJwtSecurityToken()
    {
        return new JwtSecurityToken(
            JwtIssuer,
            JwtAudience,
            null,
            expires: DateTime.Now.AddSeconds(JwtExpirationSecs),
            signingCredentials: Credentials);
    }

    protected string? GetDefaultRole()
    {
        return AddDefaultRole ? DefaultRole : null; 
    }
}