using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise ban history.
    /// </summary>
    public interface ISunriseBanHistoryProvider
    {
        /// <summary>
        ///     Updates ban history.
        /// </summary>
        Task UpdateBanHistoryAsync(
            ulong xuid,
            string title,
            string requesterObjectId,
            SunriseBanParameters banParameters,
            string endpoint);

        /// <summary>
        ///     Gets ban histories.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetBanHistoriesAsync(ulong xuid, string title, string endpoint);
    }
}
