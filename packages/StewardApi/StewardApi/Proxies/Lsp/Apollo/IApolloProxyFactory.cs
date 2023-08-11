using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo.Services;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo
{
    /// <summary>
    ///     Prepares Apollo Service objects.
    /// </summary>
    public interface IApolloProxyFactory
    {
        /// <summary>
        ///     Prepares a <see cref="IUserService" />.
        /// </summary>
        IUserService PrepareUserService(string endpoint);

        /// <summary>
        ///     Prepares a <see cref="IUserManagementService" />.
        /// </summary>
        IUserManagementService PrepareUserManagementService(string endpoint);
    }
}
