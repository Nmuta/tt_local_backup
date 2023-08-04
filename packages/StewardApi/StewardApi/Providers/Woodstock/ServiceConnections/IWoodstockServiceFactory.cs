﻿using Forza.WebServices.FH5_main.Generated;
using System.Threading.Tasks;
using RareCarShopService = Forza.WebServices.FH5_main.Generated.RareCarShopService;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <summary>
    ///     Prepares Woodstock Service objects.
    /// </summary>
    public interface IWoodstockServiceFactory
    {
        /// <summary>
        ///     Prepares a <see cref="ServicesLiveOps.UserManagementService" />.
        /// </summary>
        Task<ServicesLiveOps.UserManagementService> PrepareUserManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ServicesLiveOps.UserInventoryManagementService" />.
        /// </summary>
        Task<ServicesLiveOps.UserInventoryManagementService> PrepareUserInventoryManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ServicesLiveOps.NotificationsManagementService" />.
        /// </summary>
        Task<ServicesLiveOps.NotificationsManagementService> PrepareNotificationsManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ServicesLiveOps.GiftingManagementService" />.
        /// </summary>
        Task<ServicesLiveOps.GiftingManagementService> PrepareGiftingManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="LiveOpsService" />.
        /// </summary>
        Task<LiveOpsService> PrepareLiveOpsServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ServicesLiveOps.AuctionManagementService" />.
        /// </summary>
        Task<ServicesLiveOps.AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="RareCarShopService" />.
        /// </summary>
        Task<RareCarShopService> PrepareRareCarShopServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ServicesLiveOps.StorefrontManagementService" />.
        /// </summary>
        Task<ServicesLiveOps.StorefrontManagementService> PrepareStorefrontManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ServicesLiveOps.ScoreboardManagementService" />.
        /// </summary>
        Task<ServicesLiveOps.ScoreboardManagementService> PrepareScoreboardManagementServiceAsync(string endpoint);
    }
}
