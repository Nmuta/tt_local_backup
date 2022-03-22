using System.Threading.Tasks;
using Forza.LiveOps.FH5_main.Generated;
using Forza.WebServices.FH5_main.Generated;
using AuctionManagementService = Forza.LiveOps.FH5_main.Generated.AuctionManagementService;
using GiftingService = Forza.LiveOps.FH5_main.Generated.GiftingService;
using RareCarShopService = Forza.WebServices.FH5_main.Generated.RareCarShopService;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;
using UserInventoryService = Forza.LiveOps.FH5_main.Generated.UserInventoryService;

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
        ///     Prepares a <see cref="UserInventoryService" />.
        /// </summary>
        Task<UserInventoryService> PrepareUserInventoryServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="NotificationsManagementService" />.
        /// </summary>
        Task<NotificationsManagementService> PrepareNotificationsManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="GiftingService" />.
        /// </summary>
        Task<GiftingService> PrepareGiftingServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="LiveOpsService" />.
        /// </summary>
        Task<LiveOpsService> PrepareLiveOpsServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="AuctionManagementService" />.
        /// </summary>
        Task<AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="AuctionService" />.
        /// </summary>
        Task<AuctionService> PrepareAuctionServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="RareCarShopService" />.
        /// </summary>
        Task<RareCarShopService> PrepareRareCarShopServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="StorefrontManagementService" />.
        /// </summary>
        Task<StorefrontManagementService> PrepareStorefrontManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="StorefrontService" />.
        /// </summary>
        Task<StorefrontService> PrepareStorefrontServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="LiveOpsService" />.
        /// </summary>
        Task<LiveOpsService> PrepareUserLookupServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ScoreboardManagementService" />.
        /// </summary>
        Task<ScoreboardManagementService> PrepareScoreboardManagementService(string endpoint);
    }
}
