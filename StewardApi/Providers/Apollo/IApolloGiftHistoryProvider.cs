﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///     Exposes methods for interacting with the Apollo gift history.
    /// </summary>
    public interface IApolloGiftHistoryProvider
    {
        /// <summary>
        ///     Updates gift history.
        /// </summary>
        /// <param name="id">The ID.</param>
        /// <param name="title">The title.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <param name="giftHistoryAntecedent">The gift history antecedent.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdateGiftHistoryAsync(string id, string title, string requestingAgent, GiftHistoryAntecedent giftHistoryAntecedent, ApolloPlayerInventory playerInventory);

        /// <summary>
        ///     Gets gift histories.
        /// </summary>
        /// <param name="id">The ID.</param>
        /// <param name="title">The title.</param>
        /// <param name="giftHistoryAntecedent">The gift history antecedent.</param>
        /// <returns>
        ///     The list of <see cref="GiftHistory"/>.
        /// </returns>
        Task<IList<ApolloGiftHistory>> GetGiftHistoriesAsync(string id, string title, GiftHistoryAntecedent giftHistoryAntecedent);
    }
}
