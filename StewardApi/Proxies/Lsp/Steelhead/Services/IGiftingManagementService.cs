using System;
using System.Threading.Tasks;
using GiftingManagementService = Turn10.Services.LiveOps.FM8.Generated.GiftingManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    public interface IGiftingManagementService
    {
        Task<GiftingManagementService.AdminSendCarGiftV2Output> AdminSendCarGiftV2(ulong recipientXuid, int carId, Guid bodyLocStringId, Guid titleLocStringId);

        /// <summary>
        ///     Sends car livery to a player.
        /// </summary>
        Task<GiftingManagementService.AdminSendLiveryGiftV2Output> AdminSendLiveryGiftV2(
            ulong[] recipientXuids,
            int xuidCount,
            Guid liveryId,
            Guid bodyLocStringId,
            Guid titleLocStringId,
            bool hasExpiration,
            uint timeSpanInDays);

        /// <summary>
        ///     Sends car livery to an LSP user group.
        /// </summary>
        Task<GiftingManagementService.AdminSendGroupLiveryGiftV2Output> AdminSendGroupLiveryGiftV2(
            int groupId,
            Guid liveryId,
            Guid bodyLocStringId,
            Guid titleLocStringId,
            bool hasExpiration,
            uint timeSpanInDays);

        /// <summary>
        ///     Sends a quantity of an item to a player.
        /// </summary>
        Task<GiftingManagementService.AdminSendInventoryItemGiftOutput> AdminSendInventoryItemGift(
            ulong recipientXuid,
            string itemType,
            int itemId,
            uint quantity,
            Guid bodyLocStringId,
            Guid titleLocStringId,
            bool hasExpiration,
            uint timeSpanInDays);

        /// <summary>
        ///     Sends a quantity of an item to an LSP user group.
        /// </summary>
        Task<GiftingManagementService.AdminSendInventoryItemGroupGiftOutput> AdminSendInventoryItemGroupGift(
            int groupId,
            string itemType,
            int itemId,
            uint quantity,
            Guid bodyLocStringId,
            Guid titleLocStringId,
            bool hasExpiration,
            uint timeSpanInDays);

        /// <summary>
        ///     Gets all supported gift types.
        /// </summary>
        Task<GiftingManagementService.AdminGetSupportedGiftTypesV2Output> AdminGetSupportedGiftTypesV2(
            int maxResults);
    }
}
