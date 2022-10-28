using System;
using System.Threading.Tasks;
using GiftingManagementService = Turn10.Services.LiveOps.FH5_main.Generated.GiftingManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    public interface IGiftingManagementService
    {
        /// <summary>
        ///     Sends car livery to a player.
        /// </summary>
        Task<GiftingManagementService.AdminSendLiveryGiftOutput> AdminSendLiveryGift(ulong[] recipientXuids, int xuidCount, Guid liveryId, bool hasExpiration, uint timeSpanInDays);

        /// <summary>
        ///     Sends car livery to an LSP user group.
        /// </summary>
        Task<GiftingManagementService.AdminSendGroupLiveryGiftOutput> AdminSendGroupLiveryGift(int groupId, Guid liveryId, bool hasExpiration, uint timeSpanInDays);

        /// <summary>
        ///     Sends a quantity of an item to a player.
        /// </summary>
        Task<GiftingManagementService.AdminSendItemGiftV3Output> AdminSendItemGiftV3(ulong recipientXuid, string itemType, int itemId, uint quantity, bool hasExpiration, uint timeSpanInDays);

        /// <summary>
        ///     Sends a quantity of an item to an LSP user group.
        /// </summary>
        Task AdminSendItemGroupGiftV2(int groupId, string itemType, int itemValue, bool hasExpiration, uint timeSpanInDays);
    }
}
