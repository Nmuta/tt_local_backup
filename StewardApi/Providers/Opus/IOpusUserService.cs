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
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="GetUserMasterDataByGamerTagOutput"/>.
        /// </returns>
        Task<GetUserMasterDataByGamerTagOutput> GetUserMasterDataByGamerTagAsync(string gamertag);

        /// <summary>
        ///      Gets user master data by xuid.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GetUserMasterDataByXuidOutput"/>.
        /// </returns>
        Task<GetUserMasterDataByXuidOutput> GetUserMasterDataByXuidAsync(ulong xuid);
    }
}
