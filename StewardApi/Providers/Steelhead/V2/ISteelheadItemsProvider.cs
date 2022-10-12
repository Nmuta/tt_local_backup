using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <summary>
    ///     Exposes methods for getting Steelhead items.
    /// </summary>
    public interface ISteelheadItemsProvider
    {
        /// <summary>
        ///     Gets the Steelhead master inventory.
        /// </summary>
        Task<SteelheadMasterInventory> GetMasterInventoryAsync();

        /// <summary>
        ///     Gets the Steelhead cars detailed.
        /// </summary>
        Task<IEnumerable<SimpleCar>> GetCarsAsync(string slotId = "live");
    }
}
