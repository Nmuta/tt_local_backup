using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for <see cref="IdentityQueryAlpha"/>.
    /// </summary>
    public static class IdentityQueryAlphaExtensions
    {
        /// <summary>
        ///     Checks is an IdentityQueryAlpha is valid.
        /// </summary>
        public static bool IsValid(this IdentityQueryAlpha query)
        {

            if (query == null || (string.IsNullOrWhiteSpace(query.Gamertag) && !query.Xuid.HasValue))
            {
                return false;
            }

            return true;
        }
    }
}
