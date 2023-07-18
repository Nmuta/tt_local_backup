﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;

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
        Task UpdateGiftHistoryAsync(
            string id,
            string title,
            string requesterObjectId,
            GiftIdentityAntecedent giftHistoryAntecedent,
            ApolloGift gift,
            string endpoint);

        /// <summary>
        ///     Gets gift histories.
        /// </summary>
        Task<IList<ApolloGiftHistory>> GetGiftHistoriesAsync(
            string id,
            string title,
            GiftIdentityAntecedent giftHistoryAntecedent,
            string endpoint,
            DateTimeOffset? startDate,
            DateTimeOffset? endDate);
    }
}
