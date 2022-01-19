﻿using System.Threading.Tasks;
using Forza.LiveOps.FH5_main.Generated;
using Forza.WebServices.FH5_main.Generated;
using AuctionManagementService = Forza.LiveOps.FH5_main.Generated.AuctionManagementService;
using GiftingService = Forza.LiveOps.FH5_main.Generated.GiftingService;
using RareCarShopService = Forza.WebServices.FH5_main.Generated.RareCarShopService;
using UserInventoryService = Forza.LiveOps.FH5_main.Generated.UserInventoryService;
using UserManagementService = Forza.LiveOps.FH5_main.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <summary>
    ///     Prepares Woodstock Service objects.
    /// </summary>
    public interface IWoodstockServiceFactory
    {
        /// <summary>
        ///     Prepares a <see creaf="UserManagementService" />.
        /// </summary>
        Task<UserManagementService> PrepareUserManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="UserInventoryService" />.
        /// </summary>
        Task<UserInventoryService> PrepareUserInventoryServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="NotificationsManagementService" />.
        /// </summary>
        Task<NotificationsManagementService> PrepareNotificationsManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="GiftingService" />.
        /// </summary>
        Task<GiftingService> PrepareGiftingServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="LiveOpsService" />.
        /// </summary>
        Task<LiveOpsService> PrepareLiveOpsServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="AuctionManagementService" />.
        /// </summary>
        Task<AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="RareCarShopService" />.
        /// </summary>
        Task<RareCarShopService> PrepareRareCarShopServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="StorefrontManagementService" />.
        /// </summary>
        Task<StorefrontManagementService> PrepareStorefrontManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="StorefrontService" />.
        /// </summary>
        Task<StorefrontService> PrepareStorefrontServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="LiveOpsService" />.
        /// </summary>
        Task<LiveOpsService> PrepareUserLookupServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="ScoreboardManagementService" />.
        /// </summary>
        Task<ScoreboardManagementService> PrepareScoreboardManagementService(string endpoint);
    }
}
