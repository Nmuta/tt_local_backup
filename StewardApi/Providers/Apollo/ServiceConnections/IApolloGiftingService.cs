using System.Threading.Tasks;
using Forza.UserInventory.FM7.Generated;
using static Forza.WebServices.FM7.Generated.GiftingService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///      Exposes methods for interacting with the Apollo Gifting Service.
    /// </summary>
    public interface IApolloGiftingService
    {
        /// <summary>
        ///     Gets supported gift types.
        /// </summary>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="AdminGetSupportedGiftTypesOutput"/>.
        /// </returns>
        Task<AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults);

        /// <summary>
        ///     Sends item gift.
        /// </summary>
        /// <param name="recipientXuid">The recipient xuid.</param>
        /// <param name="itemType">The item type.</param>
        /// <param name="itemValue">The item value.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Sends item group gifts.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="itemType">The item type.</param>
        /// <param name="itemValue">The item value.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Get gifts for user.
        /// </summary>
        /// <param name="startAt">The start at index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetGiftsForUserOutput"/>.
        /// </returns>
        Task<GetGiftsForUserOutput> GetGiftsForUserAsync(int startAt, int maxResults);

        /// <summary>
        ///     Mark vanity item gift as retrieved.
        /// </summary>
        /// <param name="vanityItemGiftId">The vanity item gift id.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task MarkVanityItemGiftRetrievedAsync(int vanityItemGiftId);

        /// <summary>
        ///     Retrieve car gift.
        /// </summary>
        /// <param name="giftId">The gift ID.</param>
        /// <param name="liveryDetailsBufferSize">The livery details buffer size.</param>
        /// <param name="partsInstalledBufferSize">The parts installed buffer size.</param>
        /// <param name="partsInTrunkBufferSize">The parts in trunk buffer size.</param>
        /// <returns>
        ///     The <see cref="RetrieveCarGiftOutput"/>.
        /// </returns>
        Task<RetrieveCarGiftOutput> RetrieveCarGiftAsync(
                                                         int giftId,
                                                         uint liveryDetailsBufferSize,
                                                         uint partsInstalledBufferSize,
                                                         uint partsInTrunkBufferSize);

        /// <summary>
        ///     Retrieve credit gift.
        /// </summary>
        /// <param name="giftId">The gift ID.</param>
        /// <returns>
        ///     The <see cref="RetrieveCreditsGiftOutput"/>.
        /// </returns>
        Task<RetrieveCreditsGiftOutput> RetrieveCreditsGiftAsync(int giftId);
    }
}
