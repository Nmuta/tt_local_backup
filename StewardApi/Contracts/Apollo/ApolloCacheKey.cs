using Turn10.LiveOps.StewardApi.Providers;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents cache key for Apollo.
    /// </summary>
    public static class ApolloCacheKey
    {
        /// <summary>
        ///     Generate key used in identity lookup.
        /// </summary>
        public static string MakeIdentityLookupKey(string endpoint, string gamertag, ulong? xuid)
        {
            return Invariant($"{TitleConstants.ApolloCodeName}|{endpoint}:(g:{gamertag},x:{xuid})");
        }
    }
}
