using System.Threading.Tasks;
using static Forza.LiveOps.FM8.Generated.UserInventoryService;

#pragma warning disable VSTHRD200 // Use Async Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead
{
    // TODO: Needs to be replaced with IUserInventoryManagementService once we move to Steelhead pre-release Nuget.
    public interface IUserInventoryService
    {
        Task<GetAdminUserProfilesOutput> GetAdminUserProfiles(ulong xuid, uint maxProfiles);
        Task<GetAdminUserInventoryOutput> GetAdminUserInventory(ulong xuid);
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(int profileId);
    }
}
