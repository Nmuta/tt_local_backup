using System.Threading.Tasks;
using UserInventoryManagementService = Turn10.Services.LiveOps.FM8.Generated.UserInventoryManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    public interface IUserInventoryManagementService
    {
        /// <summary>
        ///     Gets inventory profiles for a player.
        /// </summary>
        Task<UserInventoryManagementService.GetAdminUserProfilesOutput> GetAdminUserProfiles(
            ulong xuid,
            uint maxProfiles);
    }
}
