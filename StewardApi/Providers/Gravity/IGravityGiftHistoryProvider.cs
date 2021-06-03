using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
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
        Task UpdateGiftHistoryAsync(string id, string title, string requesterObjectId, GiftIdentityAntecedent giftHistoryAntecedent, GravityGift gift);

        /// <summary>
        ///     Gets gift histories.
        /// </summary>
        Task<IList<GravityGiftHistory>> GetGiftHistoriesAsync(string id, string title, GiftIdentityAntecedent giftHistoryAntecedent);
    }
}
