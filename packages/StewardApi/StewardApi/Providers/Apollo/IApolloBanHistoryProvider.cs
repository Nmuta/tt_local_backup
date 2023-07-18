using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///     Exposes methods for interacting with the Apollo ban history.
    /// </summary>
    public interface IApolloBanHistoryProvider
    {
        /// <summary>
        ///     Updates ban history.
        /// </summary>
        Task UpdateBanHistoryAsync(
            ulong xuid,
            string title,
            string requesterObjectId,
            ApolloBanParameters banParameters,
            string endpoint);

        /// <summary>
        ///     Gets ban histories.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetBanHistoriesAsync(
            ulong xuid,
            string title,
            string endpoint);
    }
}