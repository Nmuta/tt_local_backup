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
        ///     Target of the bounty. Can be either a percentage between 1-100 or a xuid
        /// </summary>
        public ulong Target { get; set; }

        public List<string> Rewards { get; set; }

        public string Phase { get; set; }
    }
}
