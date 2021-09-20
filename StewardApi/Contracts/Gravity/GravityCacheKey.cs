using Turn10.LiveOps.StewardApi.Providers;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents cache key for Gravity.
    /// </summary>
    public static class GravityCacheKey
    {
        /// <summary>
        ///     Generate key for LSP authorization token.
        /// </summary>
        public static string MakeAuthTokenKey()
        {
            return Invariant($"{TitleConstants.GravityCodeName}ServiceAuthToken");
        }

        /// <summary>
        ///     Generate key used in identity lookup.
        /// </summary>
        public static string MakeIdentityLookupKey(string gamertag, ulong? xuid, string t10Id)
        {
            return Invariant($"{TitleConstants.GravityCodeName}|:(g:{gamertag},x:{xuid},t:{t10Id})");
        }
    }
}
