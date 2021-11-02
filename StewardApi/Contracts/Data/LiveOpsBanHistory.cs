using System;
using System.Data;
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
        public LiveOpsBanHistory(
            long xuid,
            string title,
            string requesterObjectId,
            DateTime startTimeUtc,
            DateTime expireTimeUtc,
            string featureArea,
            string reason,
            string banParameters,
            string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            featureArea.ShouldNotBeNullEmptyOrWhiteSpace(nameof(featureArea));
            reason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(reason));
            banParameters.ShouldNotBeNullEmptyOrWhiteSpace(nameof(banParameters));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            this.Xuid = xuid;
            this.Title = title;
            this.RequesterObjectId = requesterObjectId;
            this.StartTimeUtc = startTimeUtc;
            this.ExpireTimeUtc = expireTimeUtc;
            this.FeatureArea = featureArea;
            this.Reason = reason;
            this.BanParameters = banParameters;
            this.Endpoint = endpoint;
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
        ///     Gets or sets the requester object ID.
        /// </summary>
        public string RequesterObjectId { get; set; }

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

        /// <summary>
        ///     Gets or sets the LSP endpoint key.
        /// </summary>
        public string Endpoint { get; set; }

        /// <summary>
        ///     Makes a query for ban history that this model can read.
        /// </summary>
        public static string MakeQuery(ulong xuid, string title, string endpoint)
        {
            return $"BanHistory | where Xuid == {xuid} and Title == '{title}' and Endpoint == '{endpoint}' | project Xuid, Title, RequesterObjectId = coalesce(RequesterObjectId, RequestingAgent), StartTimeUtc, ExpireTimeUtc, FeatureArea, Reason, BanParameters, Endpoint";
        }

        /// <summary>
        ///     Parses query results into a ban history object.
        /// </summary>
        public static LiveOpsBanHistory FromQueryResult(IDataReader reader)
        {
            return new LiveOpsBanHistory(
                reader.Get<long>(nameof(Xuid)),
                reader.Get<string>(nameof(Title)),
                reader.Get<string>(nameof(RequesterObjectId)),
                reader.Get<DateTime>(nameof(StartTimeUtc)),
                reader.Get<DateTime>(nameof(ExpireTimeUtc)),
                reader.Get<string>(nameof(FeatureArea)),
                reader.Get<string>(nameof(Reason)),
                reader.Get<string>(nameof(BanParameters)),
                reader.Get<string>(nameof(Endpoint))
            );
        }
    }
}
