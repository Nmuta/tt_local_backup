﻿using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents the Live Ops ban history comparer.
    /// </summary>
    public sealed class LiveOpsBanHistoryComparer : IEqualityComparer<LiveOpsBanHistory>
    {
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

            var liveOpsBanHistoryOneStartTime = liveOpsBanHistoryOne.StartTimeUtc.AddTicks(-liveOpsBanHistoryOne.StartTimeUtc.Ticks % TimeSpan.TicksPerSecond);
            var liveOpsBanHistoryTwoStartTime = liveOpsBanHistoryTwo.StartTimeUtc.AddTicks(-liveOpsBanHistoryTwo.StartTimeUtc.Ticks % TimeSpan.TicksPerSecond);
            var liveOpsBanHistoryOneExpireTime = liveOpsBanHistoryOne.ExpireTimeUtc.AddTicks(-liveOpsBanHistoryOne.ExpireTimeUtc.Ticks % TimeSpan.TicksPerSecond);
            var liveOpsBanHistoryTwoExpireTime = liveOpsBanHistoryTwo.ExpireTimeUtc.AddTicks(-liveOpsBanHistoryTwo.ExpireTimeUtc.Ticks % TimeSpan.TicksPerSecond);
            var liveOpsBanHistoryOneLastExtendedTime = liveOpsBanHistoryOne.LastExtendedTimeUtc.AddTicks(-liveOpsBanHistoryOne.LastExtendedTimeUtc.Ticks % TimeSpan.TicksPerSecond);
            var liveOpsBanHistoryTwoLastExtendedTime = liveOpsBanHistoryTwo.LastExtendedTimeUtc.AddTicks(-liveOpsBanHistoryTwo.LastExtendedTimeUtc.Ticks % TimeSpan.TicksPerSecond);

            var matchesExtension = liveOpsBanHistoryOneLastExtendedTime.CompareTo(liveOpsBanHistoryTwoStartTime) == 0
                                || liveOpsBanHistoryTwoLastExtendedTime.CompareTo(liveOpsBanHistoryOneStartTime) == 0;

            var matchesStart = liveOpsBanHistoryOneExpireTime.CompareTo(liveOpsBanHistoryTwoExpireTime) == 0;
            var matchesExpire = liveOpsBanHistoryOneExpireTime.CompareTo(liveOpsBanHistoryTwoExpireTime) == 0;

            var validStart = matchesStart || matchesExtension;

            return validStart && matchesExpire;
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
