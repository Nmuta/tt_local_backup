﻿using System;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Providers;
using FH4Security = Xls.Security.FH4.Generated;
using FH4WebServices = Forza.LiveOps.FH4.Generated;
using FH5LiveOps = Turn10.Services.LiveOps.FH5_main.Generated;
using FH5Security = Xls.Security.FH5_main.Generated;
using FM7Security = Xls.Security.FM7.Generated;
using FM7WebServices = Forza.WebServices.FM7.Generated;
using FM8LiveOps = Turn10.Services.LiveOps.FM8.Generated;
using FM8Security = Xls.Security.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.ProfileMappers
{
    /// <summary>
    ///     The live ops ban history mapper.
    /// </summary>
    public static class LiveOpsBanHistoryMapper
    {
        private const string ServicesRequesterObjectId = "From Services";

        /// <summary>
        ///     Maps FH4 forza user ban description to live ops ban history.
        /// </summary>
        public static LiveOpsBanHistory Map(FH4WebServices.ForzaUserBanDescription banDescription, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var extendedReason = banDescription.ExtendTimes > 0
                ? $" [Extended {banDescription.ExtendTimes} times. Last extended on {banDescription.LastExtendTime} by {banDescription.LastExtendReason}.]"
                : string.Empty;

            var liveOpsBanHistory = new LiveOpsBanHistory(
                (long)banDescription.Xuid,
                TitleConstants.SunriseCodeName,
                ServicesRequesterObjectId,
                banDescription.StartTime,
                banDescription.ExpireTime,
                Enum.GetName(typeof(FH4Security.FeatureAreas), banDescription.FeatureAreas),
                banDescription.Reason + extendedReason,
                "{}",
                endpoint);

            liveOpsBanHistory.LastExtendedTimeUtc = banDescription.LastExtendTime;
            liveOpsBanHistory.CountOfTimesExtended = banDescription.ExtendTimes;

            return liveOpsBanHistory;
        }

        /// <summary>
        ///     Maps FM7 forza user ban description to live ops ban history.
        /// </summary>
        public static LiveOpsBanHistory Map(FM7WebServices.ForzaUserBanDescription banDescription, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveOpsBanHistory = new LiveOpsBanHistory(
                (long)banDescription.Xuid,
                TitleConstants.SunriseCodeName,
                ServicesRequesterObjectId,
                banDescription.StartTime,
                banDescription.ExpireTime,
                Enum.GetName(typeof(FM7Security.FeatureAreas), banDescription.FeatureAreas),
                banDescription.Reason,
                "{}",
                endpoint);

            liveOpsBanHistory.LastExtendedTimeUtc = banDescription.LastExtendTime;
            liveOpsBanHistory.CountOfTimesExtended = banDescription.ExtendTimes;

            return liveOpsBanHistory;
        }

        /// <summary>
        ///     Maps FM8 forza user ban description to live ops ban history.
        /// </summary>
        public static LiveOpsBanHistory Map(FM8LiveOps.ForzaUserBanDescription banDescription, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveOpsBanHistory = new LiveOpsBanHistory(
                (long)banDescription.Xuid,
                TitleConstants.SteelheadCodeName,
                ServicesRequesterObjectId,
                banDescription.StartTime,
                banDescription.ExpireTime,
                Enum.GetName(typeof(FM8Security.FeatureAreas), banDescription.FeatureAreas),
                banDescription.Reason,
                "{}",
                endpoint);

            liveOpsBanHistory.LastExtendedTimeUtc = banDescription.LastExtendTime;
            liveOpsBanHistory.CountOfTimesExtended = banDescription.ExtendTimes;

            return liveOpsBanHistory;
        }

        /// <summary>
        ///     Maps FH5 forza user ban description to live ops ban history.
        /// </summary>
        public static LiveOpsBanHistory Map(FH5LiveOps.ForzaUserBanDescription banDescription, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveOpsBanHistory = new LiveOpsBanHistory(
                (long)banDescription.Xuid,
                TitleConstants.WoodstockCodeName,
                ServicesRequesterObjectId,
                banDescription.StartTime,
                banDescription.ExpireTime,
                Enum.GetName(typeof(FH5Security.FeatureAreas), banDescription.FeatureAreas),
                banDescription.Reason,
                "{}",
                endpoint);

            liveOpsBanHistory.BanEntryId = banDescription.BanEntryId;
            liveOpsBanHistory.LastExtendedTimeUtc = banDescription.LastExtendTime;
            liveOpsBanHistory.CountOfTimesExtended = banDescription.ExtendTimes;
            liveOpsBanHistory.IsActive = banDescription.IsActive;

            return liveOpsBanHistory;
        }
    }
}
