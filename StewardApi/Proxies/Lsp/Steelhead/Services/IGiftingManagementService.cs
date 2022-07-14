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
        /// <summary>
        ///     Sends credits to a player.
        /// </summary>
        Task AdminSendCreditsGift(
            ulong recipientXuid,
            uint creditAmount,
            string reason);

        /// <summary>
        ///     Sends car to a player.
        /// </summary>
        Task AdminSendCarGift(
            ulong recipientXuid,
            int carId);

        /// <summary>
        ///     Sends car livery to a player.
        /// </summary>
        Task<GiftingManagementService.AdminSendLiveryGiftOutput> AdminSendLiveryGift(
            ulong[] recipientXuids,
            int xuidCount,
            Guid liveryId);

        /// <summary>
        ///     Sends car livery to an LSP user group.
        /// </summary>
        Task<GiftingManagementService.AdminSendGroupLiveryGiftOutput> AdminSendGroupLiveryGift(
            int groupId,
            Guid liveryId);

        /// <summary>
        ///     Sends a quantity of an item to a player.
        /// </summary>
        Task AdminSendItemGiftV2(
            ulong recipientXuid,
            string itemType,
            int itemValue);

        /// <summary>
        ///     Sends a quantity of an item to an LSP user group.
        /// </summary>
        Task AdminSendItemGroupGiftV2(
            int groupId,
            string itemType,
            int itemValue);

        /// <summary>
        ///     Gets all supported gift types.
        /// </summary>
        Task<GiftingManagementService.AdminGetSupportedGiftTypesV2Output> AdminGetSupportedGiftTypesV2(
            int maxResults);
    }
}
