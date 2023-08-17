using System.Threading.Tasks;
using static Turn10.Services.LiveOps.FM8.Generated.ConfigurationManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    /// <summary>
    ///     Manages configurations. Proxy for Client object.
    /// </summary>
    public interface IConfigurationManagementService
    {
        /// <summary>
        ///     Retrieves table configuration
        /// </summary>
        Task<GetTableConfigurationOutput> GetTableConfiguration();
    }
}
