using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Logging;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Used for consolidating services and kusto ban history information.
    /// </summary>
    public static class BanHistoryConsolidationHelper
    {
        /// <summary>
        ///     Consolidates kusto ban history information with services ban history information.
        /// </summary>
        public static List<LiveOpsBanHistory> ConsolidateBanHistory(IList<LiveOpsBanHistory> liveOpsBanHistory, IList<LiveOpsBanHistory> servicesBanHistory, ILoggingService loggingService, string gameTitle)
        {
            IEqualityComparer<LiveOpsBanHistory> titleAppropriateBanHistoryComparer =
                gameTitle == TitleCodeName.Woodstock.ToString() || gameTitle == TitleCodeName.Steelhead.ToString()
                    ? new LiveOpsBanHistoryIdComparer()
                    : new LiveOpsBanHistoryComparer();

            return liveOpsBanHistory.Concat(servicesBanHistory)
                                                .GroupBy(history => history, titleAppropriateBanHistoryComparer)
                                                .Select(banGroups => ConsolidateBanHistory(banGroups, loggingService, gameTitle))
                                                .Where(entry => entry != null)
                                                .ToList();
        }

        private static LiveOpsBanHistory ConsolidateBanHistory(IGrouping<LiveOpsBanHistory, LiveOpsBanHistory> historyGroupings, ILoggingService loggingService, string gameTitle)
        {
            var serviceEntry = historyGroupings.SingleOrDefault(v => v.RequesterObjectId == "From Services");
            var liveOpsEntry = historyGroupings.Where(v => v.RequesterObjectId != "From Services").OrderByDescending(v => v.ExpireTimeUtc).FirstOrDefault();

            if (serviceEntry == null && liveOpsEntry == null)
            {
                loggingService.LogException(new ConversionFailedAppInsightsException($"BanHistory lookup consolidation for {gameTitle} has failed."));
                return null;
            }

            var resultEntry = new LiveOpsBanHistory(
                serviceEntry?.Xuid ?? liveOpsEntry.Xuid,
                serviceEntry?.BanEntryId ?? liveOpsEntry.BanEntryId,
                serviceEntry?.Title ?? liveOpsEntry?.Title,
                liveOpsEntry?.RequesterObjectId ?? serviceEntry?.RequesterObjectId,
                serviceEntry?.StartTimeUtc ?? liveOpsEntry.StartTimeUtc,
                serviceEntry?.ExpireTimeUtc ?? liveOpsEntry.ExpireTimeUtc,
                serviceEntry?.FeatureArea ?? liveOpsEntry?.FeatureArea,
                serviceEntry?.Reason ?? liveOpsEntry?.Reason,
                liveOpsEntry?.BanParameters ?? serviceEntry?.BanParameters,
                serviceEntry?.Endpoint ?? liveOpsEntry?.Endpoint);

            resultEntry.IsActive = serviceEntry?.IsActive ?? false;
            resultEntry.CountOfTimesExtended = serviceEntry?.CountOfTimesExtended ?? liveOpsEntry.CountOfTimesExtended;
            resultEntry.LastExtendedTimeUtc = serviceEntry?.LastExtendedTimeUtc ?? liveOpsEntry.LastExtendedTimeUtc;
            resultEntry.IsDeleted = serviceEntry == null;

            return resultEntry;
        }
    }
}
