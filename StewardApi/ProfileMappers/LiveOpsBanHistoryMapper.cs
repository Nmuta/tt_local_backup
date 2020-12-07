using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Providers;
using FH4Security = Xls.Security.FH4.master.Generated;
using FH4WebServices = Forza.WebServices.FH4.master.Generated;
using FM7Security = Xls.Security.FM7.Generated;
using FM7WebServices = Forza.WebServices.FM7.Generated;

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
        /// <param name="banDescription">The FH4 ban description to map.</param>
        /// <returns>A live ops ban history.</returns>
        public static LiveOpsBanHistory Map(FH4WebServices.ForzaUserBanDescription banDescription)
        {
            var liveOpsBanHistory = new LiveOpsBanHistory(
                (long)banDescription.Xuid,
                TitleConstants.SunriseCodeName,
                ServicesRequestingAgent,
                banDescription.StartTime,
                banDescription.ExpireTime,
                Enum.GetName(typeof(FH4Security.FeatureAreas), banDescription.FeatureAreas),
                banDescription.Reason,
                "{}");

            liveOpsBanHistory.LastExtendedTimeUtc = banDescription.LastExtendTime;
            liveOpsBanHistory.CountOfTimesExtended = banDescription.ExtendTimes;

            return liveOpsBanHistory;
        }

        /// <summary>
        ///     Maps FM7 forza user ban description to live ops ban history.
        /// </summary>
        /// <param name="banDescription">The FM7 ban description to map.</param>
        /// <returns>A live ops ban history.</returns>
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
    }
}
