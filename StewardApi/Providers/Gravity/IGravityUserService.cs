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
        /// <param name="gamerTag">The gamertag.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserDetailsByGamerTagOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserDetailsByGamerTagOutput> LiveOpsGetUserDetailsByGamerTagAsync(string gamerTag, int maxResults);

        /// <summary>
        ///      Gets user details by T10 ID.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserDetailsByT10IdOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserDetailsByT10IdOutput> LiveOpsGetUserDetailsByT10IdAsync(string t10Id);

        /// <summary>
        ///      Gets user details by xuid.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserDetailsByXuidOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserDetailsByXuidOutput> LiveOpsGetUserDetailsByXuidAsync(ulong xuid, int maxResults);

        /// <summary>
        ///    Logs the user on.
        /// </summary>
        /// <param name="loginData">The logon data.</param>
        /// <returns>
        ///     The <see cref="LogonOutput"/>.
        /// </returns>
        Task<LogonOutput> LogonAsync(UserLogonData loginData);
    }
}
