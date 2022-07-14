using System.Threading.Tasks;
using AuctionManagementService = Turn10.Services.LiveOps.FM8.Generated.AuctionManagementService;
using GiftingManagementService = Turn10.Services.LiveOps.FM8.Generated.GiftingManagementService;
using LiveOpsService = Forza.WebServices.FM8.Generated.LiveOpsService;
using LocalizationManagementService = Turn10.Services.LiveOps.FM8.Generated.LocalizationManagementService;
using NotificationManagementService = Turn10.Services.LiveOps.FM8.Generated.NotificationsManagementService;
using OldUserInventoryManagementService = Forza.LiveOps.FM8.Generated.UserInventoryService;
using StorefrontManagementService = Turn10.Services.LiveOps.FM8.Generated.StorefrontManagementService;
using UserInventoryManagementService = Turn10.Services.LiveOps.FM8.Generated.UserInventoryManagementService;
using UserManagementService = Turn10.Services.LiveOps.FM8.Generated.UserManagementService;

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
        Task<LiveOpsService> PrepareLiveOpsServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="UserInventoryManagementService" />.
        /// </summary>
        Task<UserInventoryManagementService> PrepareUserInventoryManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="OldUserInventoryManagementService" />.
        /// </summary>
        Task<OldUserInventoryManagementService> PrepareOldUserInventoryManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="GiftingManagementService" />.
        /// </summary>
        Task<GiftingManagementService> PrepareGiftingManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="NotificationManagementService" />.
        /// </summary>
        Task<NotificationManagementService> PrepareNotificationManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="AuctionManagementService" />.
        /// </summary>
        Task<AuctionManagementService> PrepareAuctionManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="LocalizationManagementService" />.
        /// </summary>
        Task<LocalizationManagementService> PrepareLocalizationManagementServiceAsync(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="StorefrontManagementService" />.
        /// </summary>
        Task<StorefrontManagementService> PrepareStorefrontManagementServiceAsync(string endpoint);
    }
}
