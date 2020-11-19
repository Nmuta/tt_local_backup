using System.Threading.Tasks;
using static Forza.WebServices.FH3.Generated.OnlineProfileService;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <summary>
    ///      Exposes methods for interacting with the Opus Online Profile Service.
    /// </summary>
    public interface IOpusOnlineProfileService
    {
        /// <summary>
        ///      Gets user user inventory using admin endpoint.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GetAdminUserInventoryOutput"/>.
        /// </returns>
        Task<GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///      Gets user inventory by profile Id using admin endpoint.
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
    }
}
