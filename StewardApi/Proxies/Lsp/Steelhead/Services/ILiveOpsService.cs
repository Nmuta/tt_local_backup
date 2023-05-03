using Forza.WebServices.FM8.Generated;
using System;
using System.Threading.Tasks;
using static Forza.WebServices.FM8.Generated.LiveOpsService;
using LiveOpsService = Forza.WebServices.FM8.Generated.LiveOpsService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    public interface ILiveOpsService
    {
        /// <summary>
        ///     Gets user data by xuid.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuid(
            ulong xuid);

        /// <summary>
        ///     Gets user data by gamertag.
        /// </summary>
        Task<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTag(
            string gamertag);

        /// <summary>
        ///     Gets Racer's Cup schedule for user.
        /// </summary>
        Task<GetCMSRacersCupScheduleForUserV2Output> GetCMSRacersCupScheduleForUserV2(ulong xuid, DateTime startDate, int daysForwardToProject);

        /// <summary>
        ///     Gets Racer's Cup schedule.
        /// </summary>
        Task<GetCMSRacersCupScheduleV2Output> GetCMSRacersCupScheduleV2(string environment, string slotId, string snapshotId, DateTime startDate, int daysForwardToProject);

        /// <summary>
        ///     Saves a profile id to a player.
        /// </summary>
        Task SaveProfile(
            Guid profileId,
            string templateName,
            bool overwriteIfExists);

        /// <summary>
        ///     Loads a profile id to a player.
        /// </summary>
        Task<LiveOpsService.LoadProfileOutput> LoadProfile(
            Guid profileId,
            string templateName,
            bool continueOnBreakingChanges,
            ForzaSandbox userSandbox);

        /// <summary>
        ///     Gets all profile template names.
        /// </summary>
        Task<LiveOpsService.GetAllProfileTemplateNamesOutput> GetAllProfileTemplateNames();

        /// <summary>
        ///     Resets the profile. A single car will be applied to the reset profile.
        /// </summary>
        Task<LiveOpsService.ResetProfileOutput> ResetProfile(ForzaProfileResetConfiguration configuration, Guid profileId);

        /// <summary>
        ///     Gets active user inventory for user.
        /// </summary>
        Task<LiveOpsService.GetAdminUserInventoryOutput> GetAdminUserInventory(ulong xuid);

        /// <summary>
        ///     Gets specific user inventory by Profile ID.
        /// </summary>
        Task<LiveOpsService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(int profileId);

        /// <summary>
        ///     Gets purchased entitlements by Profile ID.
        /// </summary>
        Task<GetAdminPurchasablesOutput> GetAdminPurchasables(int profileId);

        /// <summary>
        ///     Add a product to a profile's purchased entitlements.
        /// </summary>
        Task AdminEntitlePurchasable(int profileId, string productId);

        /// <summary>
        ///     Set driver level and prestige rank by xuid.
        /// </summary>
        Task SetDriverLevel(ulong xuid, uint driverLevel, uint prestigeRank);

        /// <summary>
        ///     Get driver level, prestige rank and experience points for a given xuid.
        /// </summary>
        Task<GetDriverLevelOutput> GetDriverLevel(ulong xuid);

        /// <summary>
        ///     Retrieves list of legacy titles a user has played.
        /// </summary>
        /// <remarks>Used for determining legacy rewards.</remarks>
        Task<GetTitlesUserPlayedOutput> GetTitlesUserPlayed(ulong xuid);

        /// <summary>
        ///     Adds a title to a user's list of legacy titles played.
        /// </summary>
        /// <remarks>When added, a user should expect to recieve legacy rewards on next login.</remarks>
        Task AddToTitlesUserPlayed(ulong xuid, ForzaLoyaltyRewardsSupportedTitles titleToAdd);

        /// <summary>
        ///     Adds or edits non-car inventory items in user's profile.
        /// </summary>
        Task<LiveOpsAddInventoryItemsOutput> LiveOpsAddInventoryItems(ulong xuid, Guid externalProfileId, ForzaUserInventoryItemWrapper[] items);

        /// <summary>
        ///     Adds or edits car type inventory items in user's profile.
        /// </summary>
        Task<LiveOpsUpdateCarDataOutput> LiveOpsUpdateCarData(ulong xuid, Guid externalProfileId, ForzaCarUserInventoryItem[] clientCars, ForzaCarDataUpdateAccessLevel accessLevel);

        /// <summary>
        ///     Removes non-car type inventory items from user's profile.
        /// </summary>
        Task LiveOpsRemoveInventoryItems(ulong xuid, Guid externalProfileId, ForzaUserInventoryItemWrapper[] items);
    }
}
