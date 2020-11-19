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
        /// <param name="xuid">The xuid.</param>
        /// <param name="title">The title.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="banParameters">The ban parameters.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdateBanHistoryAsync(ulong xuid, string title, string requestingAgent, ApolloBanParameters banParameters);

        /// <summary>
        ///     Gets ban histories.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="title">The title.</param>
        /// <returns>
        ///     The list of <see cref="LiveOpsBanHistory"/>.
        /// </returns>
        Task<IList<LiveOpsBanHistory>> GetBanHistoriesAsync(ulong xuid, string title);
    }
}