using System;
using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Gravity User Service.
    /// </summary>
    public interface IGravityService
    {
        /// <summary>
        ///     Gets user details by gamertag.
        /// </summary>
        Task<UserService.LiveOpsGetUserDetailsByGamerTagOutput> LiveOpsGetUserDetailsByGamerTagAsync(string gamerTag, int maxResults);

        /// <summary>
        ///     Gets user details by T10 ID.
        /// </summary>
        Task<UserService.LiveOpsGetUserDetailsByT10IdOutput> LiveOpsGetUserDetailsByT10IdAsync(string t10Id);

        /// <summary>
        ///     Gets user details by xuid.
        /// </summary>
        Task<UserService.LiveOpsGetUserDetailsByXuidOutput> LiveOpsGetUserDetailsByXuidAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Gets user inventory by profile ID.
        /// </summary>
        Task<UserInventoryService.LiveOpsGetInventoryByProfileIdOutput> LiveOpsGetInventoryByProfileIdAsync(string t10Id, string profileId);

        /// <summary>
        ///     Gets user inventory.
        /// </summary>
        Task<UserInventoryService.LiveOpsGetUserInventoryOutput> LiveOpsGetUserInventoryAsync(string t10Id);

        /// <summary>
        ///     Gets user inventory by t10Id.
        /// </summary>
        Task<UserInventoryService.LiveOpsGetUserInventoryByT10IdOutput> LiveOpsGetUserInventoryByT10IdAsync(string t10Id);

        /// <summary>
        ///     Resets user inventory.
        /// </summary>
        Task ResetUserInventoryAsync(string t10Id);

        /// <summary>
        ///     Grants an item to a player's inventory.
        /// </summary>
        Task LiveOpsGrantItemAsync(string t10Id, Guid gameSettingsId, ForzaUserInventoryItemType type, int id, int quantity);

        /// <summary>
        ///     Gets the the game settings.
        /// </summary>
        Task<GameSettingsService.LiveOpsGetGameSettingsOutput> GetGameSettingsAsync(Guid gameSettingsId);
    }
}
