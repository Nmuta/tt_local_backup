using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using OldUserInventoryManagementService = Forza.LiveOps.FM8.Generated.UserInventoryService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    public interface IOldUserInventoryManagementService
    {
        /// <summary>
        ///     Gets latest inventory from a player.
        /// </summary>
        /// <remarks>This is on the old submodule.</remarks>
        Task<OldUserInventoryManagementService.GetAdminUserInventoryOutput> GetAdminUserInventory(
            ulong xuid);

        /// <summary>
        ///     Gets specific inventory from a player.
        /// </summary>
        /// <remarks>This is on the old submodule.</remarks>
        Task<OldUserInventoryManagementService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(
            int profileId);
    }
}
