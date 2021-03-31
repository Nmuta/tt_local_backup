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
        Task<BanUsersOutput> BanUsersAsync(ulong[] xuids, int xuidCount, ForzaUserBanParameters banParameters);

        /// <summary>
        ///    Checks user for MP ban.
        /// </summary>
        Task<CheckUserForMPBanOutput> CheckUserForMPBanAsync(ulong xuid);

        /// <summary>
        ///    Get compare stats by bucket.
        /// </summary>
        Task<GetCompareStatsByBucketOutput> GetCompareStatsByBucketAsync(int bucketId, int numUsers, ulong[] xuids);

        /// <summary>
        ///    Get compare stats for related users.
        /// </summary>
        Task<GetCompareStatsForRelatedUsersOutput> GetCompareStatsForRelatedUsersAsync(int numDesiredUsers);

        /// <summary>
        ///    Get legacy license plate.
        /// </summary>
        Task<GetLegacyLicensePlateOutput> GetLegacyLicensePlateAsync();

        /// <summary>
        ///    Get permissions table.
        /// </summary>
        Task<GetPermissionsTableOutput> GetPermissionsTableAsync(uint maxPermissions);

        /// <summary>
        ///    Get treatment.
        /// </summary>
        Task<GetTreatmentOutput> GetTreatmentAsync();

        /// <summary>
        ///    Get user ban history.
        /// </summary>
        Task<GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///    Get user ban summaries.
        /// </summary>
        Task<GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount);

        /// <summary>
        ///    Get vip state.
        /// </summary>
        Task<GetVipStateOutput> GetVipStateAsync();

        /// <summary>
        ///    Log on.
        /// </summary>
        Task<LogonOutput> LogonAsync(UserLogonData loginData);

        /// <summary>
        ///    Renegotiate.
        /// </summary>
        Task<IncludeEncryptionKey> RenegotiateAsync();

        /// <summary>
        ///    Report player for license plate.
        /// </summary>
        Task ReportPlayerForLicensePlateAsync(ulong xuid, string currentLicensePlate);

        /// <summary>
        ///    Retrieve online credits.
        /// </summary>
        Task<RetrieveOnlineCreditsOutput> RetrieveOnlineCreditsAsync(bool unused);

        /// <summary>
        ///    Set player card info.
        /// </summary>
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
        Task SetPlayerFlagsAsync(ulong xuid, ForzaUserFlags userFlags);

        /// <summary>
        ///    Sets vip state.
        /// </summary>
        Task SetVipStateAsync(bool isVip, bool isUltimateVip);

        /// <summary>
        ///    Sets web privacy for player.
        /// </summary>
        Task SetWebPrivacyForPlayerAsync(bool isWebProfilePrivate);

        /// <summary>
        ///    Update profile checkpoint.
        /// </summary>
        Task UpdateProfileCheckpointAsync(UserProfileCheckpoint clientProfile, int titleVersion);

        /// <summary>
        ///    Validate profile checkpoint.
        /// </summary>
        Task ValidateProfileCheckpointAsync(UserProfileCheckpoint clientProfile, int titleVersion);
    }
}
