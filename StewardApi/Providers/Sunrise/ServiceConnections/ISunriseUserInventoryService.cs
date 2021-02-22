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
        /// <param name="clientInventory">The Client Inventory.</param>
        /// <returns>
        ///     The <see cref="SyncUserInventoryOutput"/>.
        /// </returns>
        Task<SyncUserInventoryOutput> SyncUserInventoryAsync(ForzaUserInventorySummary clientInventory);

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
        ///      Gets user inventory using admin endpoint.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GetAdminUserInventoryOutput"/>.
        /// </returns>
        Task<GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///      Gets user inventory by profileID using admin endpoint.
        /// </summary>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GetAdminUserInventoryByProfileIdOutput"/>.
        /// </returns>
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);
    }
}
