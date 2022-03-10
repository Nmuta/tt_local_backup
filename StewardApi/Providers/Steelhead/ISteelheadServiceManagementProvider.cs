using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <summary>
    ///     Exposes methods for managing the Steelhead service.
    /// </summary>
    public interface ISteelheadServiceManagementProvider
    {
        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<IList<LspGroup>> GetLspGroupsAsync(string endpoint);

        /// <summary>
        ///     Gets CMS Racer Cup schedule.
        /// </summary>
        Task<RacersCupSchedule> GetCmsRacersCupScheduleAsync(
            string environment,
            string slotId,
            string snapshotId,
            DateTime startTimeUtc,
            int daysForward,
            string endpoint);
    }
}
