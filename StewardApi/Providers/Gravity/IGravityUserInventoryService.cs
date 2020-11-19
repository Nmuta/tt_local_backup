using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using static Forza.WebServices.FMG.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity User Inventory Service.
    /// </summary>
    public interface IGravityUserInventoryService
    {
        /// <summary>
        ///     Gets the user inventory by T10Id.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <param name="inventoryToApply">The inventory to apply.</param>
        /// <param name="shouldResetFirst">A value indicating whether should reset first.</param>
        /// <param name="grantStartingPackage">A value indicating whether to grant starting package.</param>
        /// <param name="preserveBookingItems">A value indicating whether to preserved booking items.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task LiveOpsApplyUserInventoryByT10IdAsync(string t10Id, LiveOpsUserInventory inventoryToApply, bool shouldResetFirst, bool grantStartingPackage, bool preserveBookingItems);

        /// <summary>
        ///      Gets user inventory by profile ID.
        /// </summary>
        /// <param name="t10Id">The t10Id.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetInventoryByProfileIdOutput"/>.
        /// </returns>
        Task<LiveOpsGetInventoryByProfileIdOutput> LiveOpsGetInventoryByProfileIdAsync(string t10Id, string profileId);

        /// <summary>
        ///      Gets user inventory.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserInventoryOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserInventoryOutput> LiveOpsGetUserInventoryAsync(string t10Id);

        /// <summary>
        ///      Gets user inventory by t10Id.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserInventoryByT10IdOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserInventoryByT10IdOutput> LiveOpsGetUserInventoryByT10IdAsync(string t10Id);

        /// <summary>
        ///     Applies user inventory.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <param name="inventoryToApply">The inventory to apply.</param>
        /// <param name="shouldResetFirst">A value indicating whether should reset first.</param>
        /// <param name="grantStartingPackage">A value indicating whether to grant starting package.</param>
        /// <param name="preserveBookingItems">A value indicating whether to preserve booking items.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task LiveOpsApplyUserInventoryAsync(string t10Id, LiveOpsUserInventory inventoryToApply, bool shouldResetFirst, bool grantStartingPackage, bool preserveBookingItems);

        /// <summary>
        ///      Resets user inventory.
        /// </summary>
        /// <param name="t10Id">The T10 ID.</param>
        /// <returns>
        ///     A task with a status.</returns>
        Task ResetUserInventoryAsync(string t10Id);
    }
}
