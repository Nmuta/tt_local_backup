using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead bounty.
    /// </summary>
    public sealed class SteelheadBounty
    {
        /// <summary>
        ///     asdf
        /// </summary>
        public string MessageTitle { get; set; }

        /// <summary>
        ///     asdf
        /// </summary>
        public string MessageDescription { get; set; }

        public int RivalsEventId { get; set; }

        public string RivalsEventTitle { get; set; }

        public string RivalsEventDescription { get; set; }

        public string Target { get; set; }
    }
}
