using System;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Providers;
using FH4Security = Xls.Security.FH4.master.Generated;
using FH4WebServices = Forza.WebServices.FH4.master.Generated;
using FM7Security = Xls.Security.FM7.Generated;
using FM7WebServices = Forza.WebServices.FM7.Generated;
using FM8LiveOps = Forza.LiveOps.Steelhead_master.Generated;
using FM8Security = Xls.Security.Steelhead_master.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     The live ops ban history mapper.
    /// </summary>
    public static class LiveOpsBanHistoryMapper
    {
        private const string ServicesRequestingAgent = "From Services";

        /// <summary>
        ///     Maps FH4 forza user ban description to live ops ban history.
        /// </summary>
        public static LiveOpsBanHistory Map(FH4WebServices.ForzaUserBanDescription banDescription)
        {
            var extendedReason = banDescription.ExtendTimes > 0
                ? $" [Extended {banDescription.ExtendTimes} times. Last extended on {banDescription.LastExtendTime} by {banDescription.LastExtendReason}.]"
                : string.Empty;

            var liveOpsBanHistory = new LiveOpsBanHistory(
                (long)banDescription.Xuid,
                TitleConstants.SunriseCodeName,
                ServicesRequestingAgent,
                banDescription.StartTime,
                banDescription.ExpireTime,
                Enum.GetName(typeof(FH4Security.FeatureAreas), banDescription.FeatureAreas),
                banDescription.Reason + extendedReason,
                "{}");

            liveOpsBanHistory.LastExtendedTimeUtc = banDescription.LastExtendTime;
            liveOpsBanHistory.CountOfTimesExtended = banDescription.ExtendTimes;

            return liveOpsBanHistory;
        }

        /// <summary>
        ///     Maps FM7 forza user ban description to live ops ban history.
        /// </summary>
        public static LiveOpsBanHistory Map(FM7WebServices.ForzaUserBanDescription banDescription)
        {
            var liveOpsBanHistory = new LiveOpsBanHistory(
                (long)banDescription.Xuid,
                TitleConstants.SunriseCodeName,
                ServicesRequestingAgent,
                banDescription.StartTime,
                banDescription.ExpireTime,
                Enum.GetName(typeof(FM7Security.FeatureAreas), banDescription.FeatureAreas),
                banDescription.Reason,
                "{}");

            liveOpsBanHistory.LastExtendedTimeUtc = banDescription.LastExtendTime;
            liveOpsBanHistory.CountOfTimesExtended = banDescription.ExtendTimes;

            return liveOpsBanHistory;
        }

        /// <summary>
        ///     Maps FM8 forza user ban description to live ops ban history.
        /// </summary>
        public static LiveOpsBanHistory Map(FM8LiveOps.ForzaUserBanDescription banDescription)
        {
            var liveOpsBanHistory = new LiveOpsBanHistory(
                (long)banDescription.Xuid,
                TitleConstants.SunriseCodeName,
                ServicesRequestingAgent,
                banDescription.StartTime,
                banDescription.ExpireTime,
                Enum.GetName(typeof(FM8Security.FeatureAreas), banDescription.FeatureAreas),
                banDescription.Reason,
                "{}");

            liveOpsBanHistory.LastExtendedTimeUtc = banDescription.LastExtendTime;
            liveOpsBanHistory.CountOfTimesExtended = banDescription.ExtendTimes;

            return liveOpsBanHistory;
        }
    }
}
