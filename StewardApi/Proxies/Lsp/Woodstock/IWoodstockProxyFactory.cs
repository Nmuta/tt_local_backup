using System.Threading.Tasks;

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
        ///     Prepares a <see cref="IStorefrontManagementService" />.
        /// </summary>
        IStorefrontManagementService PrepareStorefrontManagementService(string endpoint);
    }
}
