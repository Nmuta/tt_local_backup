using System;
using System.Collections.Generic;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    /// LiveOpsBanHistoryComparer.
    /// </summary>
    public class LiveOpsBanHistoryComparer : IEqualityComparer<LiveOpsBanHistory>
    {
        /// <summary>
        /// Compares two LiveOpsBanHistory models.
        /// </summary>
        /// <param name="x">First object.</param>
        /// <param name="y">Second object.</param>
        /// <returns>True is ban histories are the same.</returns>
        public bool Equals(LiveOpsBanHistory x, LiveOpsBanHistory y)
        {
            if (x is null || y is null || x.FeatureArea != y.FeatureArea)
            {
                return false;
            }

            var xStartTimeMinusMilliseconds = x.StartTimeUtc.AddMilliseconds(-x.StartTimeUtc.Millisecond);
            var yStartTimeMinusMilliseconds = y.StartTimeUtc.AddMilliseconds(-y.StartTimeUtc.Millisecond);
            var xExpireTimeMinusMilliseconds = x.ExpireTimeUtc.AddMilliseconds(-x.ExpireTimeUtc.Millisecond);
            var yExpireTimeMinusMilliseconds = y.ExpireTimeUtc.AddMilliseconds(-y.ExpireTimeUtc.Millisecond);

            return xStartTimeMinusMilliseconds.CompareTo(yStartTimeMinusMilliseconds) == 0
                && xExpireTimeMinusMilliseconds.CompareTo(yExpireTimeMinusMilliseconds) == 0;
        }

        /// <summary>
        /// Creates a hash code for LiveOpsBanHIstory object.
        /// </summary>
        /// <param name="obj">Ban history to get hash code for.</param>
        /// <returns>Hash code</returns>
        public int GetHashCode(LiveOpsBanHistory obj)
        {
            if (obj is null)
            {
                return 0;
            }

            return (obj.Xuid, obj.Title, obj.FeatureArea).GetHashCode();
        }
    }
}
