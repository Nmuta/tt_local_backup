using System;
using System.Threading.Tasks;
using LiveOpsService = Forza.WebServices.FH5_main.Generated.LiveOpsService;
using Turn10.Services.LiveOps.FH5_main.Generated;

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

        /// <summary>Gets a specific event blueprint.</summary>
        Task<LiveOpsService.GetUGCEventBlueprintOutput> GetUGCEventBlueprint(Guid id);

        /// <summary>Gets a specific community challenge.</summary>
        Task<LiveOpsService.GetUGCCommunityChallengeOutput> GetUGCCommunityChallenge(Guid id);

        /// <summary>
        ///     Gets player inventory by profile id.
        /// </summary>
        Task<LiveOpsService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(int profileId);

        /// <summary>
        ///     Persist is a mechanism to allow Community to save a player UGC file for later user. Instead of pointing
        ///     to a file that could get deleted by the player the contents are copied to a new UGC entry and added
        ///     under the system PG user (xuid = 1).
        /// </summary>
        /// <param name="fileId">File to persist</param>
        /// <param name="title">Overrides the UGC title. Use empty string to persist the current title.</param>
        /// <param name="description">Overrides the UGC description. Use empty string to persist the current description.</param>
        Task<PersistUgcFileOutput> PersistUgcFile(Guid fileId, string title, string description);

        /// <summary>
        ///     Clone UGC File from an environment.
        ///     Provide a UGC Guid OR the Share Code and File Type. If you specify both, the Share Code will be used.
        /// </summary>
        /// <param name="fileId">UGC file Id</param>
        /// <param name="shareCode">File share code</param>
        /// <param name="contentType">type of file</param>
        /// <param name="isSearchable">if the new file will be searchable or not</param>
        /// <param name="keepGuid">keep the same fileId or not</param>
        Task<LiveOpsService.CloneUgcFileOutput> CloneUgcFile(Guid fileId, string shareCode, ForzaUGCContentType contentType, bool isSearchable, bool keepGuid);
    }
}
