using System.Threading.Tasks;
using Forza.LiveOps.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using AuctionManagementService = Forza.LiveOps.FH4.Generated.AuctionManagementService;
using GiftingService = Forza.LiveOps.FH4.Generated.GiftingService;
using RareCarShopService = Forza.WebServices.FH4.Generated.RareCarShopService;
using UserInventoryService = Forza.LiveOps.FH4.Generated.UserInventoryService;
using UserManagementService = Forza.LiveOps.FH4.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections
{
    /// <summary>
    ///     Prepares Sunrise Service objects.
    /// </summary>
    public interface ISunriseServiceFactory
    {
        /// <summary>
        ///     Prepares a <see cref="UserManagementService" />.
        /// </summary>
        Task<UserManagementService> PrepareUserManagementServiceAsync(string endpoint);

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
        ///     Prepares a <see cref="UserService" />.
        /// </summary>
        Task<UserService> PrepareUserServiceAsync(string endpoint);
    }
}
