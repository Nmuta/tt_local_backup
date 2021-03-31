using System.Threading.Tasks;
using static Forza.WebServices.FH3.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <summary>
    ///      Exposes methods for interacting with the Opus User Service..
    /// </summary>
    public interface IOpusUserService
    {
        /// <summary>
        ///      Gets user master data by gamertag.
        /// </summary>
        Task<GetUserMasterDataByGamerTagOutput> GetUserMasterDataByGamerTagAsync(string gamertag);

        /// <summary>
        ///      Gets user master data by xuid.
        /// </summary>
        Task<GetUserMasterDataByXuidOutput> GetUserMasterDataByXuidAsync(ulong xuid);
    }
}
