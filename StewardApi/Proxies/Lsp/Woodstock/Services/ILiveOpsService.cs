using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FH5_main.Generated;
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

        /// <summary>
        ///     Persist is a mechanism to allow Community to save a player UGC file for later user. Instead of pointing
        ///     to a file that could get deleted by the player the contents are copied to a new UGC entry and added
        ///     under the system PG user (xuid = 1).
        /// </summary>
        /// <param name="fileId">File to persist</param>
        Task<PersistUgcFileOutput> PersistUgcFile(Guid fileId);

        /// <summary>
        ///     Clone UGC File from an environment.
        ///     Provide a UGC Guid OR the Share Code and File Type. If you specify both, the Share Code will be used.
        /// </summary>
        /// <param name="fileId">UGC file Id</param>
        /// <param name="shareCode">File share code</param>
        /// <param name="contentType">type of file</param>
        /// <param name="isSearchable">if the new file will be searchable or not</param>
        /// <param name="keepGuid">keep the same fileId or not</param>
        Task<CloneUgcFileOutput> CloneUgcFile(Guid fileId, string shareCode, ForzaUGCContentType contentType, bool isSearchable, bool keepGuid);
    }
}
