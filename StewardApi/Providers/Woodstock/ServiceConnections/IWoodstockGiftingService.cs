using System.Threading.Tasks;
using Forza.UserInventory.FH5_master.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <summary>
    ///      Exposes methods for interacting with the Woodstock Gifting Service.
    /// </summary>
    public interface IWoodstockGiftingService
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
