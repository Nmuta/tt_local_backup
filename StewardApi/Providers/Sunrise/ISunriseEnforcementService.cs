using System.Threading.Tasks;
using Forza.WebServices.FH4.master.Generated;
using Turn10.Services.ForzaClient;
using Xls.FH4.master.Generated;
using static Forza.WebServices.FH4.master.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///      Exposes methods for interacting with the Sunrise Enforcement Service.
    /// </summary>
    public interface ISunriseEnforcementService
    {
        /// <summary>
        ///    Bans users.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <param name="xuidCount">The number of xuids.</param>
        /// <param name="banParameters">The ban parameters.</param>
        /// <returns>
        ///     The <see cref="BanUsersOutput"/>.
        /// </returns>
        Task<BanUsersOutput> BanUsersAsync(ulong[] xuids, int xuidCount, ForzaUserBanParameters banParameters);

        /// <summary>
        ///    Checks user for MP ban.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="CheckUserForMPBanOutput"/>.
        /// </returns>
        Task<CheckUserForMPBanOutput> CheckUserForMPBanAsync(ulong xuid);

        /// <summary>
        ///    Get compare stats by bucket.
        /// </summary>
        /// <param name="bucketId">The bucket ID.</param>
        /// <param name="numUsers">The number of users.</param>
        /// <param name="xuids">The xuids.</param>
        /// <returns>
        ///     The <see cref="GetCompareStatsByBucketOutput"/>.
        /// </returns>
        Task<GetCompareStatsByBucketOutput> GetCompareStatsByBucketAsync(int bucketId, int numUsers, ulong[] xuids);

        /// <summary>
        ///    Get compare stats for related users.
        /// </summary>
        /// <param name="numDesiredUsers">The number of desired users.</param>
        /// <returns>
        ///     The <see cref="GetCompareStatsForRelatedUsersOutput"/>.
        /// </returns>
        Task<GetCompareStatsForRelatedUsersOutput> GetCompareStatsForRelatedUsersAsync(int numDesiredUsers);

        /// <summary>
        ///    Get legacy license plate.
        /// </summary>
        /// <returns>
        ///     The <see cref="GetLegacyLicensePlateOutput"/>.
        /// </returns>
        Task<GetLegacyLicensePlateOutput> GetLegacyLicensePlateAsync();

        /// <summary>
        ///    Get permissions table.
        /// </summary>
        /// <param name="maxPermissions">The max permissions.</param>
        /// <returns>
        ///     The <see cref="GetPermissionsTableOutput"/>.
        /// </returns>
        Task<GetPermissionsTableOutput> GetPermissionsTableAsync(uint maxPermissions);

        /// <summary>
        ///    Get treatment.
        /// </summary>
        /// <returns>
        ///     The <see cref="GetTreatmentOutput"/>.
        /// </returns>
        Task<GetTreatmentOutput> GetTreatmentAsync();

        /// <summary>
        ///    Get user ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetUserBanHistoryOutput"/>.
        /// </returns>
        Task<GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///    Get user ban summaries.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <param name="xuidCount">The xuid count.</param>
        /// <returns>
        ///     The <see cref="GetUserBanSummariesOutput"/>.
        /// </returns>
        Task<GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount);

        /// <summary>
        ///    Get vip state.
        /// </summary>
        /// <returns>
        ///     The <see cref="GetVipStateOutput"/>.
        /// </returns>
        Task<GetVipStateOutput> GetVipStateAsync();

        /// <summary>
        ///    Log on.
        /// </summary>
        /// <param name="loginData">The login data.</param>
        /// <returns>
        ///     The <see cref="LogonOutput"/>.
        /// </returns>
        Task<LogonOutput> LogonAsync(UserLogonData loginData);

        /// <summary>
        ///    Renegotiate.
        /// </summary>
        /// <returns>
        ///     The <see cref="IncludeEncryptionKey"/>.
        /// </returns>
        Task<IncludeEncryptionKey> RenegotiateAsync();

        /// <summary>
        ///    Report player for license plate.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="currentLicensePlate">The current license plate.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task ReportPlayerForLicensePlateAsync(ulong xuid, string currentLicensePlate);

        /// <summary>
        ///    Retrieve online credits.
        /// </summary>
        /// <param name="unused">The unused.</param>
        /// <returns>
        ///     The <see cref="RetrieveOnlineCreditsOutput"/>.
        /// </returns>
        Task<RetrieveOnlineCreditsOutput> RetrieveOnlineCreditsAsync(bool unused);

        /// <summary>
        ///    Set player card info.
        /// </summary>
        /// <param name="currentCareerLevel">The current career level.</param>
        /// <param name="currentBadgeId">The current badge ID.</param>
        /// <param name="currentPlayerTitleId">The current player title ID.</param>
        /// <param name="driverModelId">The driver model ID.</param>
        /// <param name="painterThreadLevel">The painter thread level.</param>
        /// <param name="tunerThreadLevel">The tuner thread level.</param>
        /// <param name="photoThreadLevel">The photo thread level.</param>
        /// <param name="blueprintThreadLevel">The blueprint thread level.</param>
        /// <param name="customizationSlots">The customization slots.</param>
        /// <param name="isClubIdKnown">A value that indicates whether the club Id is known.</param>
        /// <param name="clubId">The club ID.</param>
        /// <param name="isTeamIdKnown">A value that indicates whether the team ID is known.</param>
        /// <param name="teamId">The team ID.</param>
        /// <param name="licensePlate">The license plate.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetPlayerCardInfoAsync(
                               uint currentCareerLevel,
                               ushort currentBadgeId,
                               ushort currentPlayerTitleId,
                               int driverModelId,
                               ushort painterThreadLevel,
                               ushort tunerThreadLevel,
                               ushort photoThreadLevel,
                               ushort blueprintThreadLevel,
                               short[] customizationSlots,
                               bool isClubIdKnown,
                               string clubId,
                               bool isTeamIdKnown,
                               string teamId,
                               string licensePlate);

        /// <summary>
        ///    Sets player flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="userFlags">The user flags.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetPlayerFlagsAsync(ulong xuid, ForzaUserFlags userFlags);

        /// <summary>
        ///    Sets vip state.
        /// </summary>
        /// <param name="isVip">The is vip.</param>
        /// <param name="isUltimateVip">The is ultimate vip.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetVipStateAsync(bool isVip, bool isUltimateVip);

        /// <summary>
        ///    Sets web privacy for player.
        /// </summary>
        /// <param name="isWebProfilePrivate">The is web profile private.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetWebPrivacyForPlayerAsync(bool isWebProfilePrivate);

        /// <summary>
        ///    Update profile checkpoint.
        /// </summary>
        /// <param name="clientProfile">The client profile.</param>
        /// <param name="titleVersion">The title version.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task UpdateProfileCheckpointAsync(UserProfileCheckpoint clientProfile, int titleVersion);

        /// <summary>
        ///    Validate profile checkpoint.
        /// </summary>
        /// <param name="clientProfile">The client profile.</param>
        /// <param name="titleVersion">The title version.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task ValidateProfileCheckpointAsync(UserProfileCheckpoint clientProfile, int titleVersion);
    }
}
