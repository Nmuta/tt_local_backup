using Forza.WebServices.FM7.Generated;
using System.Threading.Tasks;
using static Forza.WebServices.FM7.Generated.UserService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="UserService"/>.
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        ///     Gets user data by xuid.
        /// </summary>
        Task<LiveOpsGetUserDataByXuidOutput> LiveOpsGetUserDataByXuid(ulong xuid);

        /// <summary>
        ///     Gets ban history summaries by xuids.
        /// </summary>
        Task<GetUserBanSummariesV2Output> GetUserBanSummariesV2(ulong[] xuids);
    }
}
