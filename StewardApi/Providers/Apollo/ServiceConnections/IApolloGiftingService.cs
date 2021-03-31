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
        Task<AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults);

        /// <summary>
        ///     Sends item gift.
        /// </summary>
        Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Sends item group gifts.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Get gifts for user.
        /// </summary>
        Task<GetGiftsForUserOutput> GetGiftsForUserAsync(int startAt, int maxResults);

        /// <summary>
        ///     Mark vanity item gift as retrieved.
        /// </summary>
        Task MarkVanityItemGiftRetrievedAsync(int vanityItemGiftId);

        /// <summary>
        ///     Retrieve car gift.
        /// </summary>
        Task<RetrieveCarGiftOutput> RetrieveCarGiftAsync(
                                                         int giftId,
                                                         uint liveryDetailsBufferSize,
                                                         uint partsInstalledBufferSize,
                                                         uint partsInTrunkBufferSize);

        /// <summary>
        ///     Retrieve credit gift.
        /// </summary>
        Task<RetrieveCreditsGiftOutput> RetrieveCreditsGiftAsync(int giftId);
    }
}
