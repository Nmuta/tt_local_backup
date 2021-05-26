using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead gift history.
    /// </summary>
    public interface ISteelheadGiftHistoryProvider
    {
        /// <summary>
        ///     Updates gift history.
        /// </summary>
        Task UpdateGiftHistoryAsync(string id, string title, string requesterObjectId, GiftIdentityAntecedent giftHistoryAntecedent, SteelheadGift gift);

        /// <summary>
        ///     Gets gift histories.
        /// </summary>
        Task<IList<SteelheadGiftHistory>> GetGiftHistoriesAsync(string id, string title, GiftIdentityAntecedent giftHistoryAntecedent);
    }
}
