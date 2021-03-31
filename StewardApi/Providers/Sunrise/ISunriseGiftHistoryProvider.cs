using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise gift history.
    /// </summary>
    public interface ISunriseGiftHistoryProvider
    {
        /// <summary>
        ///     Updates gift history.
        /// </summary>
        Task UpdateGiftHistoryAsync(string id, string title, string requestingAgent, GiftIdentityAntecedent giftHistoryAntecedent, SunriseGift gift);

        /// <summary>
        ///     Gets gift histories.
        /// </summary>
        Task<IList<SunriseGiftHistory>> GetGiftHistoriesAsync(string id, string title, GiftIdentityAntecedent giftHistoryAntecedent);
    }
}
