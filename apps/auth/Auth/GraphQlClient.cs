using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;

namespace SteveR.Auth;

public class GraphQlClient
{
    // MIT License
    // Copyright (c) 2017 Benjamin Kniffler
    // https://github.com/bkniffler/graphql-net-client
    
    private class GraphQlQuery
    {
        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        [JsonProperty("query")]
        public string? Query { get; set; }
        
        // ReSharper disable once UnusedAutoPropertyAccessor.Local
        [JsonProperty("variables")]
        public object? Variables { get; set; }
    }

    public class GraphQlQueryResult
    {
        private readonly string? _raw;
        private readonly JObject? _data;
        private readonly Exception? _exception;

        public GraphQlQueryResult(string? text, Exception? ex = null)
        {
            _exception = ex;
            _raw = text;
            try
            {
                _data = text != null ? JObject.Parse(text) : null;
            }
            catch
            {
                Log.Debug($"text = \"{text}\"");
                throw;
            }
        }

        public void EnsureNoErrors()
        {
            if (_exception != null)
            {
                throw _exception;
            }
            
            if (_data != null && _data.ContainsKey("errors"))
            {
                throw new Exception($"GraphQL errors: {_raw}");
            }
        }

        public T? Get<T>(string key)
        {
            if (_data == null) return default;
            try
            {
                #pragma warning disable CS8602
                return JsonConvert.DeserializeObject<T>(_data["data"][key].ToString());
                #pragma warning restore CS8602
            }
            catch
            {
                return default;
            }
        }
    }

    private readonly HttpClient _httpClient = new();
    private readonly string _url;

    public GraphQlClient(string url, Dictionary<string, string> headers)
    {
        _url = url;
        
        foreach (var header in headers)
        {
            _httpClient.DefaultRequestHeaders.Add(header.Key, header.Value);
        }
    }

    public async Task<GraphQlQueryResult> Query(string query, object variables)
    {
        var content = JsonConvert.SerializeObject(new GraphQlQuery()
        {
            Query = query,
            Variables = variables
        });
        
        var response = await _httpClient.PostAsync(
            _url, new StringContent(content, Encoding.UTF8, "application/json"));
        
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync();
        return new GraphQlQueryResult(json);
    }
}
