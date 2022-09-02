using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise.Services;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise
{
    /// <summary>
    ///     Prepares Sunrise Service objects.
    /// </summary>
    public interface ISunriseProxyFactory
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
