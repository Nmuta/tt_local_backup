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
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GetAdminUserInventoryOutput"/>.
        /// </returns>
        Task<GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///      Gets user inventory by profile ID using admin endpoint.
        /// </summary>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GetAdminUserInventoryByProfileIdOutput"/>.
        /// </returns>
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);

        /// <summary>
        ///      Gets user profiles using admin endpoint.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxProfiles">The max profiles.</param>
        /// <returns>
        ///     The <see cref="GetAdminUserProfilesOutput"/>.
        /// </returns>
        Task<GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);

        /// <summary>
        ///      Synchronizes the user inventory.
        /// </summary>
        /// <param name="clientInventory">The clientInventory.</param>
        /// <returns>
        ///     The <see cref="SyncUserInventoryOutput"/>.
        /// </returns>
        Task<SyncUserInventoryOutput> SyncUserInventoryAsync(ForzaUserInventorySummary clientInventory);
    }
}
