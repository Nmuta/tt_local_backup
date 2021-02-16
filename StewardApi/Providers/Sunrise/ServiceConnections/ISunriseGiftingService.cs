using System;
using System.Threading.Tasks;
using Forza.UserInventory.FH4.master.Generated;
using static Forza.WebServices.FH4.master.Generated.GiftingService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///      Exposes methods for interacting with the Sunrise Gifting Service.
    /// </summary>
    public interface ISunriseGiftingService
    {
        /// <summary>
        ///     Gets supported gift types using the admin endpoint.
        /// </summary>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="AdminGetSupportedGiftTypesOutput"/>.
        /// </returns>
        Task<AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults);

        /// <summary>
        ///      Sends car gift using admin endpoint.
        /// </summary>
        /// <param name="recipientXuid">The recipient xuid.</param>
        /// <param name="carId">The carId.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AdminSendCarGiftAsync(ulong recipientXuid, int carId);

        /// <summary>
        ///      Sends credit gifts using admin endpoint.
        /// </summary>
        /// <param name="recipientXuid">The recipient xuid.</param>
        /// <param name="creditAmount">The credit amount.</param>
        /// <param name="reason">The reason.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AdminSendCreditsGiftAsync(ulong recipientXuid, uint creditAmount, string reason);

        /// <summary>
        ///      Sends item gift using admin endpoint.
        /// </summary>
        /// <param name="recipientXuid">The recipient xuid.</param>
        /// <param name="itemType">The item type.</param>
        /// <param name="itemValue">The item value.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///      Gets gifts for user.
        /// </summary>
        /// <param name="startAt">The start at.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetGiftsForUserOutput"/>.
        /// </returns>
        Task<GetGiftsForUserOutput> GetGiftsForUserAsync(int startAt, int maxResults);

        /// <summary>
        ///      Marks item gift retrieved.
        /// </summary>
        /// <param name="itemType">The item type.</param>
        /// <param name="itemGiftId">The item gift ID.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task MarkItemGiftRetrievedAsync(InventoryItemType itemType, Guid itemGiftId);

        /// <summary>
        ///      Retrieves car gift.
        /// </summary>
        /// <param name="giftId">The gift ID.</param>
        /// <param name="liveryDetailsBufferSize">The livery details buffer size.</param>
        /// <param name="partsInstalledBufferSize">The parts installed buffer size.</param>
        /// <param name="partsInTrunkBufferSize">The parts in trunk buffer size.</param>
        /// <returns>
        ///     The list of <see cref="RetrieveCarGiftOutput"/>.
        /// </returns>
        Task<RetrieveCarGiftOutput> RetrieveCarGiftAsync(Guid giftId, uint liveryDetailsBufferSize, uint partsInstalledBufferSize, uint partsInTrunkBufferSize);

        /// <summary>
        ///      Retrieves credits gift.
        /// </summary>
        /// <param name="giftId">The gift ID.</param>
        /// <returns>
        ///     The list of <see cref="RetrieveCreditsGiftOutput"/>.
        /// </returns>
        Task<RetrieveCreditsGiftOutput> RetrieveCreditsGiftAsync(Guid giftId);

        /// <summary>
        ///      Sends gift to LSP group.
        /// </summary>
        /// <param name="groupId">The LSP group ID.</param>
        /// <param name="itemType">The item type.</param>
        /// <param name="itemValue">The item value.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);
    }
}
