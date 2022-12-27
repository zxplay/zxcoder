using Newtonsoft.Json;

namespace SteveR.Auth.Model;

public class Session
{
    [JsonProperty("session_id")]
    public string? SessionId { get; set; }
    
    [JsonProperty("expires")]
    public string? Expires { get; set; }
    
    [JsonProperty("user")]
    public User? User { get; set; }
}
