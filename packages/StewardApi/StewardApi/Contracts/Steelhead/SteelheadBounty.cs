using System;
using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead bounty.
    /// </summary>
    public sealed class SteelheadBounty
    {
        public RivalsEvent RivalsEvent { get; set; }

        public string MessageTitle { get; set; }

        public string MessageDescription { get; set; }

        public DateTimeOffset EndTime { get; set; }

        public int UserGroupId { get; set; }

        public int PlayerRewardedCount { get; set; }

        public int TrackId { get; set; }

        /// <summary>
        ///     If a user gets a better position than this they get the reward
        /// </summary>
        public int PositionThreshold { get; set; }

        /// <summary>
        ///     If a user gets a better time than this they get the reward
        /// </summary>
        public double TimeThreshold { get; set; }

        /// <summary>
        ///     Target of the bounty. Can be either a percentage between 1-100 or a xuid
        /// </summary>
        public ulong Target { get; set; }

        public List<string> Rewards { get; set; }
    }
}
