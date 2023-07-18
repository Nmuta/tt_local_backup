using Turn10.LiveOps.StewardApi.Providers;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents cache key for Steelhead.
    /// </summary>
    public static class SteelheadCacheKey
    {
        /// <summary>
        ///     Generate key for LSP authorization token.
        /// </summary>
        public static string MakeAuthTokenKey()
        {
            return Invariant($"{TitleConstants.SteelheadCodeName}ServiceAuthToken");
        }

        /// <summary>
        ///     Generate key used in identity lookup.
        /// </summary>
        public static string MakeIdentityLookupKey(string endpoint, string gamertag, ulong? xuid)
        {
            return Invariant($"{TitleConstants.SteelheadCodeName}|{endpoint}:(g:{gamertag},x:{xuid})");
        }
    }
}
