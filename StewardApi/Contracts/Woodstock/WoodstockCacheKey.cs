using Turn10.LiveOps.StewardApi.Providers;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents cache key for Woodstock.
    /// </summary>
    public static class WoodstockCacheKey
    {
        /// <summary>
        ///     Generate key for LSP authorization token.
        /// </summary>
        public static string MakeAuthTokenKey()
        {
            return Invariant($"{TitleConstants.WoodstockCodeName}ServiceAuthToken");
        }

        /// <summary>
        ///     Generate key used in identity lookup.
        /// </summary>
        public static string MakeIdentityLookupKey(string endpoint, string gamertag, ulong? xuid)
        {
            return Invariant($"{TitleConstants.WoodstockCodeName}|{endpoint}:(g:{gamertag},x:{xuid})");
        }

        /// <summary>
        ///     Generate key used in credit updates.
        /// </summary>
        public static string MakeCreditUpdatesKey(string endpoint, ulong? xuid, int startIndex, int maxResults)
        {
            return Invariant($"{TitleConstants.WoodstockCodeName}|{endpoint}|CreditUpdates|{xuid}|{startIndex}|{maxResults}");
        }

        /// <summary>
        ///     Generate key used in backstage pass.
        /// </summary>
        public static string MakeBackstagePassKey(string endpoint, ulong? xuid)
        {
            return Invariant($"{TitleConstants.WoodstockCodeName}|{endpoint}|BackstagePassUpdates|{xuid}");
        }
    }
}
