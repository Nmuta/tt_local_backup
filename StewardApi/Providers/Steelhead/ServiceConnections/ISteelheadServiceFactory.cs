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
        ///     Prepares a <see creaf="UserManagementService" />.
        /// </summary>
        Task<UserManagementService> PrepareUserManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="LiveOpsService" />.
        /// </summary>
        Task<LiveOpsService> PrepareUserLookupServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="UserInventoryService" />.
        /// </summary>
        Task<UserInventoryService> PrepareUserInventoryServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="GiftingService" />.
        /// </summary>
        Task<GiftingService> PrepareGiftingServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="NotificationsManagementService" />.
        /// </summary>
        Task<NotificationsManagementService> PrepareNotificationsManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see creaf="AuctionManagementService" />.
        /// </summary>
        Task<AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint);
    }
}
