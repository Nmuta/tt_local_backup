﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///      Exposes methods for interacting with the Apollo player inventory.
    /// </summary>
    public interface IApolloPlayerInventoryProvider
    {
        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<ApolloMasterInventory> GetPlayerInventoryAsync(ulong xuid);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<ApolloMasterInventory> GetPlayerInventoryAsync(int profileId);

        /// <summary>
        ///     Get player inventory.
        /// </summary>
        Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid);

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        Task<GiftResponse<ulong>> UpdatePlayerInventoryAsync(ulong xuid, ApolloGift gift, string requestingAgent, bool useAdminCreditLimit);

        /// <summary>
        ///     Update player inventories.
        /// </summary>
        Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(ApolloGroupGift groupGift, string requestingAgent, bool useAdminCreditLimit);

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        Task<GiftResponse<int>> UpdateGroupInventoriesAsync(int groupId, ApolloGift gift, string requestingAgent, bool useAdminCreditLimit);
    }
}
