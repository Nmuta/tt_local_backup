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
        Task<AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults);

        /// <summary>
        ///      Sends car gift using admin endpoint.
        /// </summary>
        Task AdminSendCarGiftAsync(ulong recipientXuid, int carId);

        /// <summary>
        ///      Sends credit gifts using admin endpoint.
        /// </summary>
        Task AdminSendCreditsGiftAsync(ulong recipientXuid, uint creditAmount, string reason);

        /// <summary>
        ///      Sends item gift using admin endpoint.
        /// </summary>
        Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///      Gets gifts for user.
        /// </summary>
        Task<GetGiftsForUserOutput> GetGiftsForUserAsync(int startAt, int maxResults);

        /// <summary>
        ///      Marks item gift retrieved.
        /// </summary>
        Task MarkItemGiftRetrievedAsync(InventoryItemType itemType, Guid itemGiftId);

        /// <summary>
        ///      Retrieves car gift.
        /// </summary>
        Task<RetrieveCarGiftOutput> RetrieveCarGiftAsync(Guid giftId, uint liveryDetailsBufferSize, uint partsInstalledBufferSize, uint partsInTrunkBufferSize);

        /// <summary>
        ///      Retrieves credits gift.
        /// </summary>
        Task<RetrieveCreditsGiftOutput> RetrieveCreditsGiftAsync(Guid giftId);

        /// <summary>
        ///      Sends gift to LSP group.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);
    }
}
