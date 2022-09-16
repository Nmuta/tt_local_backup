using System;
using System.Threading.Tasks;
using static Turn10.Services.LiveOps.FH5_main.Generated.UserInventoryManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    public interface IUserInventoryManagementService
    {
        /// <summary>
        ///     Gets all player inventory profiles.
        /// </summary>
        Task<GetAdminUserProfilesOutput> GetAdminUserProfiles(ulong xuid, uint maxProfiles);
    }
}
