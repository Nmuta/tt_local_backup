using System;
using System.Collections.Generic;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a Live Ops ban history.
    /// </summary>
    public sealed class LiveOpsBanHistory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="LiveOpsBanHistory"/> class.
        /// </summary>
        public LiveOpsBanHistory(long xuid, string title, string requestingAgent, DateTime startTimeUtc, DateTime expireTimeUtc, string featureArea, string reason, string banParameters)
        {
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            featureArea.ShouldNotBeNullEmptyOrWhiteSpace(nameof(featureArea));
            reason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(reason));
            banParameters.ShouldNotBeNullEmptyOrWhiteSpace(nameof(banParameters));

            this.Xuid = xuid;
            this.Title = title;
            this.RequestingAgent = requestingAgent;
            this.StartTimeUtc = startTimeUtc;
            this.ExpireTimeUtc = expireTimeUtc;
            this.FeatureArea = featureArea;
            this.Reason = reason;
            this.BanParameters = banParameters;
        }

        /// <summary>
        ///     Gets or sets a value indicating whether the ban is still active.
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        ///     Gets or sets the start time in UTC.
        /// </summary>
        public DateTime StartTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the expire time in UTC.
        /// </summary>
        public DateTime ExpireTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the last extended time in UTC.
        /// </summary>
        public DateTime LastExtendedTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the count of times the ban has been extended.
        /// </summary>
        public int CountOfTimesExtended { get; set; }

        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public long Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        ///     Gets or sets the requesting agent.
        /// </summary>
        public string RequestingAgent { get; set; }

        /// <summary>
        ///     Gets or sets the feature area.
        /// </summary>
        public string FeatureArea { get; set; }

        /// <summary>
        ///     Gets or sets the reason.
        /// </summary>
        public string Reason { get; set; }

        /// <summary>
        ///     Gets or sets the ban parameters.
        /// </summary>
        public string BanParameters { get; set; }
    }
}
