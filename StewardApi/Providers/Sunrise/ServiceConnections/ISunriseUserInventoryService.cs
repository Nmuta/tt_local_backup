using System.Threading.Tasks;
using Forza.WebServices.FH4.master.Generated;
using static Forza.WebServices.FH4.master.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise User Inventory Service.
    /// </summary>
    public interface ISunriseUserInventoryService
    {
        /// <summary>
        ///      Syncs user inventory service.
        /// </summary>
        Task<SyncUserInventoryOutput> SyncUserInventoryAsync(ForzaUserInventorySummary clientInventory);

        /// <summary>
        ///      Gets user profiles using admin endpoint.
        /// </summary>
        Task<GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);

        /// <summary>
        ///      Gets user inventory using admin endpoint.
        /// </summary>
        Task<GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///      Gets user inventory by profileID using admin endpoint.
        /// </summary>
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);
    }
}
