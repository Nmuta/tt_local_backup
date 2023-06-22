#pragma warning disable SA1600

using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    public class AuthResponse
    {
        [JsonProperty("token_type")]
        public string TokenType { get; set; }

        [JsonProperty("access_token")]
        public string AccessToken { get; set; }

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }
    }
}
