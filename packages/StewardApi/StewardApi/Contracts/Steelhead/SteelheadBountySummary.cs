using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead bounty summary.
    /// </summary>
    public sealed class SteelheadBountySummary
    {
        /// <summary>
        ///     Bounty Message Title
        /// </summary>
        public string MessageTitle { get; set; }

        /// <summary>
        ///     Bounty Message Description
        /// </summary>
        public string MessageDescription { get; set; }

        /// <summary>
        ///     Rivals Event Id
        /// </summary>
        public int RivalsEventId { get; set; }

        /// <summary>
        ///     Rivals Event Title
        /// </summary>
        public string RivalsEventTitle { get; set; }

        /// <summary>
        ///     Rivals Event Description
        /// </summary>
        public string RivalsEventDescription { get; set; }

        /// <summary>
        ///     Target of the bounty. Can be either a percentage between 1-100 or a xuid
        /// </summary>
        public string Target { get; set; }
    }
}
