using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead
{
    /// <summary>
    ///     Prepares Steelhead Service objects.
    /// </summary>
    public interface ISteelheadProxyFactory
    {
        /// <summary>
        ///     Prepares a <see cref="IUserInventoryService" />.
        /// </summary>
        IUserInventoryService PrepareUserInventoryService(string endpoint);
    }
}
