using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead
{
    /// <summary>
    ///     Prepares Steelhead Service objects.
    /// </summary>
    public interface ISteelheadProxyFactory
    {
        /// <summary>
        ///     Prepares a <see cref="IAuctionManagementService" />.
        /// </summary>
        IAuctionManagementService PrepareAuctionManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IGiftingManagementService" />.
        /// </summary>
        IGiftingManagementService PrepareGiftingManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ILiveOpsService" />.
        /// </summary>
        ILiveOpsService PrepareLiveOpsService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ILocalizationManagementService" />.
        /// </summary>
        ILocalizationManagementService PrepareLocalizationManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IUserManagementService" />.
        /// </summary>
        IUserManagementService PrepareUserManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IUserInventoryManagementService" />.
        /// </summary>
        IUserInventoryManagementService PrepareUserInventoryManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IStorefrontManagementService" />.
        /// </summary>
        IStorefrontManagementService PrepareStorefrontManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="INotificationManagementService" />.
        /// </summary>
        INotificationManagementService PrepareNotificationManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IPermissionsManagementService" />.
        /// </summary>
        IPermissionsManagementService PreparePermissionsManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IScoreboardManagementService" />.
        /// </summary>
        IScoreboardManagementService PrepareScoreboardManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IConfigurationManagementService" />.
        /// </summary>
        IConfigurationManagementService PrepareConfigurationManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ITaskManagementService" />.
        /// </summary>
        ITaskManagementService PrepareTaskManagementService(string endpoint);
    }
}
