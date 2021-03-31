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
        Task<GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///      Gets user inventory by profile Id using admin endpoint.
        /// </summary>
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);

        /// <summary>
        ///      Gets user profiles using admin endpoint.
        /// </summary>
        Task<GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);
    }
}
