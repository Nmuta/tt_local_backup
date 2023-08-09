using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead ban history.
    /// </summary>
    public interface ISteelheadBanHistoryProvider
    {
        /// <summary>
        ///     Updates ban history.
        /// </summary>
        Task UpdateBanHistoryAsync(
            ulong xuid,
            int banEntryId,
            string title,
            string requesterObjectId,
            V2BanParametersInput banParameters,
            BanResult banResult,
            string endpoint,
            string featureAreas);

        /// <summary>
        ///     Gets ban histories.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetBanHistoriesAsync(
            ulong xuid,
            string title,
            string endpoint);
    }
}
