using System;
using System.Threading.Tasks;
using static Forza.WebServices.FH5_main.Generated.LiveOpsService;

#pragma warning disable VSTHRD200 // Use Async Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    public interface ILiveOpsService
    {
        /// <summary>
        ///     Gets the loyalty rewards 'Has Played' record.
        /// </summary>
        Task<GetHasPlayedRecordOutput> GetHasPlayedRecord(ulong xuid, Guid externalProfileId);

        /// <summary>
        ///     Gets player inventory by XUID.
        /// </summary>
        Task<GetAdminUserInventoryOutput> GetAdminUserInventory(ulong xuid);

        /// <summary>Gets a specific event blueprint.</summary>
        Task<GetUGCEventBlueprintOutput> GetUGCEventBlueprint(Guid id);

        /// <summary>Gets a specific community challenge.</summary>
        Task<GetUGCCommunityChallengeOutput> GetUGCCommunityChallenge(Guid id);

        /// <summary>
        ///     Gets player inventory by profile id.
        /// </summary>
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(int profileId);
    }
}
