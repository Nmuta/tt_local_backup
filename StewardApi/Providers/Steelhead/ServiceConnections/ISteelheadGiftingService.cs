using System.Threading.Tasks;
using Forza.UserInventory.Steelhead_master.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <summary>
    ///      Exposes methods for interacting with the Steelhead Gifting Service.
    /// </summary>
    public interface ISteelheadGiftingService
    {
        /// <summary>
        ///     Send an item gift.
        /// </summary>
        Task AdminSendItemGiftAsync(ulong xuid, InventoryItemType itemType, int itemValue);

        /// <summary>
        ///     Send a group item gift.
        /// </summary>
        Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue);
    }
}
