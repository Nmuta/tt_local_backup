using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using WoodstockLiveOpsContent;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for getting Woodstock items.
    /// </summary>
    public interface IWoodstockItemsProvider
    {
        /// <summary>
        ///     Gets the Woodstock master inventory.
        /// </summary>
        Task<WoodstockMasterInventory> GetMasterInventoryAsync();

        /// <summary>
        ///     Gets the Woodstock cars detailed.
        /// </summary>
        Task<IEnumerable<T>> GetCarsAsync<T>(string slotId = "live")
            where T : SimpleCar;
    }
}
