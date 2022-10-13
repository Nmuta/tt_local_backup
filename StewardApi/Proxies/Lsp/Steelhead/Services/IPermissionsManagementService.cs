using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using PermissionsManagementService = Turn10.Services.LiveOps.FM8.Generated.PermissionsManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    public interface IPermissionsManagementService
    {
        /// <summary>
        ///     Gets API permissions.
        /// </summary>
        Task<PermissionsManagementService.GetApiPermissionsOutput> GetApiPermissions(int deviceRegion, int startAt, int maxResults);

        /// <summary>
        ///     Updates API permissions.
        /// </summary>
        Task<PermissionsManagementService.UpdateApiPermissionsOutput> UpdateApiPermissions(ForzaLiveOpsPermissionsUpdateParameters[] parametersList);
    }
}
