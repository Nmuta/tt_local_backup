using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise ban history.
    /// </summary>
    public sealed class SunriseBanHistory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseBanHistory"/> class.
        /// </summary>
        /// <param name="servicesBanHistory">The services ban history.</param>
        /// <param name="liveOpsBanHistory">The live ops ban history.</param>
        public SunriseBanHistory(IList<SunriseBanDescription> servicesBanHistory, IList<LiveOpsBanHistory> liveOpsBanHistory)
        {
            this.ServicesBanHistory = servicesBanHistory;
            this.LiveOpsBanHistory = liveOpsBanHistory;
        }

        /// <summary>
        ///     Gets or sets the services ban history.
        /// </summary>
        public IList<SunriseBanDescription> ServicesBanHistory { get; set; }

        /// <summary>
        ///     Gets or sets the live ops ban history.
        /// </summary>
        public IList<LiveOpsBanHistory> LiveOpsBanHistory { get; set; }
    }
}
