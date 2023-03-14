using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for interacting with the Forum ban history kusto table.
    /// </summary>
    public interface IForumBanHistoryProvider
    {
        /// <summary>
        ///     Creates forum ban history.
        /// </summary>
        Task CreateForumBanHistoryAsync(
            ulong xuid,
            ForumBanParametersInput banParameters,
            string requesterObjectId);

        /// <summary>
        ///     Gets forum ban histories.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetForumBanHistoriesAsync(ulong xuid);

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids);
    }
}
