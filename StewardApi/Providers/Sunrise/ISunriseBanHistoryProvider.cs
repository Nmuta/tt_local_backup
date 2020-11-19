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
        /// <param name="xuid">The xuid.</param>
        /// <param name="title">The title.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="banParameters">The ban parameters.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdateBanHistoryAsync(ulong xuid, string title, string requestingAgent, SunriseBanParameters banParameters);

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
