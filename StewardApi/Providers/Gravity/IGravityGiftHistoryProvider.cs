using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity gift history.
    /// </summary>
    public interface IGravityGiftHistoryProvider
    {
        /// <summary>
        ///     Updates gift history.
        /// </summary>
        /// <param name="id">The ID.</param>
        /// <param name="title">The title.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="giftHistoryAntecedent">The gift history antecedent.</param>
        /// <param name="gift">The gift sent to the player.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdateGiftHistoryAsync(string id, string title, string requestingAgent, GiftHistoryAntecedent giftHistoryAntecedent, GravityGift gift);

        /// <summary>
        ///     Gets gift histories.
        /// </summary>
        /// <param name="id">The ID.</param>
        /// <param name="title">The title.</param>
        /// <param name="giftHistoryAntecedent">The gift history antecedent.</param>
        /// <returns>
        ///     The <see cref="GiftHistory"/>.
        /// </returns>
        Task<IList<GravityGiftHistory>> GetGiftHistoriesAsync(string id, string title, GiftHistoryAntecedent giftHistoryAntecedent);
    }
}
