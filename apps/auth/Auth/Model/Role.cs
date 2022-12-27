using Newtonsoft.Json;

namespace SteveR.Auth.Model;

public class Role
{
    [JsonProperty("name")]
    public string? Name { get; set; }
}
