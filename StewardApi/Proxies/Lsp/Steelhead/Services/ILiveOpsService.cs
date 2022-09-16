﻿using Forza.WebServices.FM8.Generated;
using System;
using System.Threading.Tasks;
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
        Task<LiveOpsService.GetCMSRacersCupScheduleForUserOutput> GetCMSRacersCupScheduleForUser(
            ulong xuid,
            DateTime startDateUtc,
            int daysForward,
            ForzaEventSessionType[] gameOptionsFilter);

        /// <summary>
        ///     Gets Racer's Cup schedule.
        /// </summary>
        Task<LiveOpsService.GetCMSRacersCupScheduleOutput> GetCMSRacersCupSchedule(
            string environment,
            string slotId,
            string snapshotId,
            DateTime startDateUtc,
            int daysForward,
            ForzaEventSessionType[] gameOptionsFilter);

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
            bool continueOnBreakingChanges);

        /// <summary>
        ///     Gets all profile template names;
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
    }
}
