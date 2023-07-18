using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock
{
    /// <summary>
    ///     Prepares Woodstock Service objects.
    /// </summary>
    public interface IWoodstockProxyFactory
    {
        /// <summary>
        ///     Prepares a <see cref="ILiveOpsService" />.
        /// </summary>
        ILiveOpsService PrepareLiveOpsService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IUserInventoryManagementService" />.
        /// </summary>
        IUserInventoryManagementService PrepareUserInventoryManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IUserManagementService" />.
        /// </summary>
        IUserManagementService PrepareUserManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IPermissionsManagementService" />.
        /// </summary>
        IPermissionsManagementService PreparePermissionsManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IStorefrontManagementService" />.
        /// </summary>
        IStorefrontManagementService PrepareStorefrontManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IGiftingManagementService" />.
        /// </summary>
        IGiftingManagementService PrepareGiftingManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IRareCarShopService" />.
        /// </summary>
        IRareCarShopService PrepareRareCarShopService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="INotificationsManagementService" />.
        /// </summary>
        INotificationsManagementService PrepareNotificationsManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IAuctionManagementService" />.
        /// </summary>
        IAuctionManagementService PrepareAuctionManagementService(string endpoint);


        /// <summary>
        ///     Prepares a <see cref="IConfigurationManagementService" />.
        /// </summary>
        IConfigurationManagementService PrepareConfigurationManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IScoreboardManagementService" />.
        /// </summary>
        IScoreboardManagementService PrepareScoreboardManagementService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="ITaskManagementService" />.
        /// </summary>
        ITaskManagementService PrepareTaskManagementService(string endpoint);
    }
}
