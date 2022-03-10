using System.Threading.Tasks;
using Forza.LiveOps.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using AuctionManagementService = Forza.LiveOps.FM8.Generated.AuctionManagementService;
using GiftingService = Forza.LiveOps.FM8.Generated.GiftingService;
using UserInventoryService = Forza.LiveOps.FM8.Generated.UserInventoryService;
using UserManagementService = Forza.LiveOps.FM8.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <summary>
    ///     Prepares Steelhead Service objects.
    /// </summary>
    public interface ISteelheadServiceFactory
    {
        /// <summary>
        ///     Prepares a <see cref="UserManagementService" />.
        /// </summary>
        Task<UserManagementService> PrepareUserManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="LiveOpsService" />.
        /// </summary>
        Task<LiveOpsService> PrepareUserLookupServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="UserInventoryService" />.
        /// </summary>
        Task<UserInventoryService> PrepareUserInventoryServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="GiftingService" />.
        /// </summary>
        Task<GiftingService> PrepareGiftingServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="NotificationsManagementService" />.
        /// </summary>
        Task<NotificationsManagementService> PrepareNotificationsManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="AuctionManagementService" />.
        /// </summary>
        Task<AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint);
    }
}
