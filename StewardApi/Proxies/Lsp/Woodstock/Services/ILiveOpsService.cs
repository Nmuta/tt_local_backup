using System;
using System.Threading.Tasks;
using LiveOpsService = Forza.WebServices.FH5_main.Generated.LiveOpsService;

#pragma warning disable VSTHRD200 // Use Async Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    /// <summary>
    ///     Interface proxy for <see cref="LiveOpsService"/>.
    /// </summary>
    public interface ILiveOpsService
    {
        /// <summary>
        ///     Gets the loyalty rewards 'Has Played' record.
        /// </summary>
        Task<LiveOpsService.GetHasPlayedRecordOutput> GetHasPlayedRecord(ulong xuid, Guid externalProfileId);

        /// <summary>
        ///     Gets player inventory by XUID.
        /// </summary>
        Task<LiveOpsService.GetAdminUserInventoryOutput> GetAdminUserInventory(ulong xuid);

        /// <summary>
        ///     Gets player inventory by profile id.
        /// </summary>
        Task<LiveOpsService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(int profileId);
    }
}
