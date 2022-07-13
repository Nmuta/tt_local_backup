using System;
using System.Threading.Tasks;
using static Forza.WebServices.FH5_main.Generated.LiveOpsService;

#pragma warning disable VSTHRD200 // Use Async Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock
{
    public interface ILiveOpsService
    {
        Task<GetHasPlayedRecordOutput> GetHasPlayedRecord(ulong xuid, Guid externalProfileId);
        Task<GetAdminUserInventoryOutput> GetAdminUserInventory(ulong xuid);
        Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(int profileId);
    }
}
