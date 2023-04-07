using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents the Live Ops ban history comparer that prioritizes matching on ban entry ID.
    /// </summary>
    public sealed class LiveOpsBanHistoryIdComparer : IEqualityComparer<LiveOpsBanHistory>
    {
        // In December of 2022 bans were changed to start on next login.
        // This made ban start/expiry no longer a good way to associate bans.
        // For bans before this time, correlate on date, for times after, prefer ban entry id.
        private readonly DateTime cutOffTime = new DateTime(2022, 11, 29);

        /// <summary>
        ///     Compares two <see cref="LiveOpsBanHistory"/> models.
        /// </summary>
        public bool Equals(LiveOpsBanHistory x, LiveOpsBanHistory y)
        {
            var liveOpsBanHistoryOne = x;
            var liveOpsBanHistoryTwo = y;

            if (liveOpsBanHistoryOne is null && liveOpsBanHistoryTwo is null)
            {
                return true;
            }

            if (liveOpsBanHistoryOne is null || liveOpsBanHistoryTwo is null || liveOpsBanHistoryOne.FeatureArea != liveOpsBanHistoryTwo.FeatureArea)
            {
                return false;
            }

            if (liveOpsBanHistoryOne.StartTimeUtc > this.cutOffTime || liveOpsBanHistoryTwo.StartTimeUtc > this.cutOffTime)
            {
                return liveOpsBanHistoryOne.BanEntryId == liveOpsBanHistoryTwo.BanEntryId;
            }

            // If it's an entry that predates inclusion of banEntryId, default to using timeframes to correlate
            var timeComparitor = new LiveOpsBanHistoryComparer();

            return timeComparitor.Equals(x, y);
        }

        /// <summary>
        ///     Creates a hash code for <see cref="LiveOpsBanHistory"/> object.
        /// </summary>
        public int GetHashCode(LiveOpsBanHistory obj)
        {
            return (obj.Xuid, obj.Title, obj.FeatureArea).GetHashCode();
        }
    }
}
