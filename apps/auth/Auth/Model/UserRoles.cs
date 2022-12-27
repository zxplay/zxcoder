using Newtonsoft.Json;

namespace SteveR.Auth.Model;

public class UserRoles
{
    [JsonProperty("role")]
    public Role? Role { get; set; }
}
