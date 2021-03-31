using System.Threading.Tasks;
using Forza.WebServices.FM7.Generated;
using static Forza.WebServices.FM7.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///      Exposes methods for interacting with the Apollo User Inventory Service.
    /// </summary>
    public interface IApolloUserInventoryService
    {
        /// <summary>
        ///     Gets user inventory using admin endpoint.
        /// </summary>
        Task<GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///      Gets user inventory by profile ID using admin endpoint.
        /// </summary>
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);

        /// <summary>
        ///      Gets user profiles using admin endpoint.
        /// </summary>
        Task<GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);

        /// <summary>
        ///      Synchronizes the user inventory.
        /// </summary>
        Task<SyncUserInventoryOutput> SyncUserInventoryAsync(ForzaUserInventorySummary clientInventory);
    }
}
