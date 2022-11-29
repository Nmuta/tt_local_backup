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

        /// <summary>
        ///     Gets player inventory by profile id.
        /// </summary>
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(int profileId);

        Task PersistUgcFile(Guid fileId);

        Task CloneUgcFile(Guid fileId, string shareCode, ForzaUGCContentType contentType, bool isSearchable, bool keepGuid);
    }
}
