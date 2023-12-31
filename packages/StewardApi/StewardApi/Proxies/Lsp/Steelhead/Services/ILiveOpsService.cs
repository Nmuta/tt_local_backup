﻿using System;
using System.Threading.Tasks;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using static Forza.WebServices.FM8.Generated.LiveOpsService;
using LiveOpsService = Forza.WebServices.FM8.Generated.LiveOpsService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    /// <summary>
    ///     Manages live-ops specific data. Proxy for Client object.
    /// </summary>
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
        Task<LiveOpsService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileId(int profileId, ulong xuid);

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
        Task<LiveOpsUpdateCarDataV2Output> LiveOpsUpdateCarDataV2(ulong xuid, Guid externalProfileId, AdminForzaCarUserInventoryItem[] carsToUpdate, ForzaCarDataUpdateAccessLevel accessLevel);

        /// <summary>
        ///     Removes non-car type inventory items from user's profile.
        /// </summary>
        Task LiveOpsRemoveInventoryItems(ulong xuid, Guid externalProfileId, ForzaUserInventoryItemWrapper[] items);

        /// <summary>
        ///     Get tune blob data.
        /// </summary>
        Task<LiveOpsGetUGCTuneBlobsOutput> LiveOpsGetUGCTuneBlobs(Guid[] ids);

        /// <summary>
        ///     Retrieves player profiles for a given xuid.
        /// </summary>
        Task<GetPlayerProfilesOutput> GetPlayerProfiles(ulong xuid, int maxProfiles);

        /// <summary>
        ///     Retrieves player safety rating by xuid.
        /// </summary>
        Task<GetLiveOpsSafetyRatingByXuidOutput> GetLiveOpsSafetyRatingByXuid(ulong xuid);

        /// <summary>
        ///     Clears player safety rating history by xuid.
        /// </summary>
        Task DeleteLiveOpsOverallSafetyRatingByXuid(ulong xuid);

        /// <summary>
        ///     Adds a safety rating entry to user's safety rating history.
        /// </summary>
        Task<AddLiveOpsSafetyRatingHistoryByXuidOutput> AddLiveOpsSafetyRatingHistoryByXuid(ulong xuid, double scoreValue);

        /// <summary>
        ///     Sets safety rating history by xuid.
        /// </summary>
        Task<SetLiveOpsSafetyRatingHistoryOutput> SetLiveOpsSafetyRatingHistory(ulong xuid, double[] ratingHistory);

        /// <summary>
        ///     Retrieves player skill rating by xuid and profileId.
        /// </summary>
        Task<GetUserSkillRatingOutput> GetUserSkillRating(ulong xuid, Guid externalProfileId);

        /// <summary>
        ///     Override player skill rating by xuid and profileId.
        /// </summary>
        Task OverrideUserSkillRating(ulong xuid, Guid externalProfileId, double skillRating);

        /// <summary>
        ///     Clears override of player skill rating by xuid and profileId.
        /// </summary>
        Task ClearUserSkillRatingOverride(ulong xuid, Guid externalProfileId);

        /// <summary>
        ///     Gets UGC game options.
        /// </summary>
        Task<LiveOpsGetUGCGameOptionsOutput> LiveOpsGetUGCGameOptions(Guid[] ids);

        /// <summary>
        ///     Downloads UGC profile and metadata by xuid and profileId
        /// </summary>
        Task<DownloadUGCProfileOutput> DownloadUGCProfile(ulong xuid, Guid externalProfileId);

        /// <summary>
        ///     Uploads UGC profile by xuid and profileId
        /// </summary>
        Task UploadUGCProfile(ulong xuid, Guid externalProfileId, string profileDataStr);

        /// <summary>
        ///     Get active bounties.
        /// </summary>
        Task<GetActiveBountiesOutput> GetActiveBounties(int startAt, int maxEntries);
    }
}
