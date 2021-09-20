using Turn10.LiveOps.StewardApi.Providers;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Represents cache key for Opus.
    /// </summary>
    public static class OpusCacheKey
    {
        /// <summary>
        ///     Generate key used in identity lookup.
        /// </summary>
        public static string MakeIdentityLookupKey(string gamertag, ulong? xuid)
        {
            return Invariant($"{TitleConstants.OpusCodeName}:(g:{gamertag},x:{xuid})");
        }
    }
}
