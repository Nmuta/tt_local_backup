using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using static Forza.WebServices.FMG.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///      Exposes methods for interacting with the Gravity User Service.
    /// </summary>
    public interface IGravityUserService
    {
        /// <summary>
        ///      Gets user details by gamertag.
        /// </summary>
        Task<LiveOpsGetUserDetailsByGamerTagOutput> LiveOpsGetUserDetailsByGamerTagAsync(string gamerTag, int maxResults);

        /// <summary>
        ///      Gets user details by T10 ID.
        /// </summary>
        Task<LiveOpsGetUserDetailsByT10IdOutput> LiveOpsGetUserDetailsByT10IdAsync(string t10Id);

        /// <summary>
        ///      Gets user details by xuid.
        /// </summary>
        Task<LiveOpsGetUserDetailsByXuidOutput> LiveOpsGetUserDetailsByXuidAsync(ulong xuid, int maxResults);

        /// <summary>
        ///    Logs the user on.
        /// </summary>
        Task<LogonOutput> LogonAsync(UserLogonData loginData);
    }
}
