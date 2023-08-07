using System.Threading.Tasks;
using Forza.WebServices.FH3.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Opus User Service..
    /// </summary>
    public interface IOpusService
    {
        /// <summary>
        ///     Gets user master data by gamertag.
        /// </summary>
        Task<UserService.GetUserMasterDataByGamerTagOutput> GetUserMasterDataByGamerTagAsync(string gamertag);

        /// <summary>
        ///     Gets user master data by xuid.
        /// </summary>
        Task<UserService.GetUserMasterDataByXuidOutput> GetUserMasterDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Gets user user inventory using admin endpoint.
        /// </summary>
        Task<OnlineProfileService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid);

        /// <summary>
        ///     Gets user inventory by profile Id using admin endpoint.
        /// </summary>
        Task<OnlineProfileService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId);

        /// <summary>
        ///     Gets user profiles using admin endpoint.
        /// </summary>
        Task<OnlineProfileService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles);
    }
}
