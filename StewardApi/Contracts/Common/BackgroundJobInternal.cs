using System;
using Microsoft.Azure.Cosmos.Table;
using System.Text.Json.Serialization;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a background job.
    /// </summary>
    public sealed class BackgroundJobInternal : TableEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJobInternal"/> class.
        /// </summary>
        public BackgroundJobInternal()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJobInternal"/> class.
        /// </summary>
        public BackgroundJobInternal(string jobId, string userObjectId, string reason, BackgroundJobStatus backgroundJobStatus)
            : this(jobId, userObjectId, reason, backgroundJobStatus, string.Empty)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJobInternal"/> class.
        /// </summary>
        public BackgroundJobInternal(string jobId, string userObjectId, string reason, BackgroundJobStatus backgroundJobStatus, string result)
        {
            jobId.ShouldNotBeNull(nameof(jobId));
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));
            reason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(reason));
            backgroundJobStatus.ShouldNotBeNull(nameof(backgroundJobStatus));

            this.PartitionKey = userObjectId;
            this.RowKey = jobId;
            this.Reason = reason;
            this.Status = backgroundJobStatus.ToString();
            this.Result = result;
            this.IsRead = false;
            this.CreatedTimeUtc = DateTime.UtcNow;
        }

        /// <summary>
        ///     Gets the object Id for this job.
        /// </summary>
        [JsonIgnore]
        public string ObjectId
        {
            get { return this.PartitionKey; }
        }

        /// <summary>
        ///     Gets the job Id.
        /// </summary>
        public string JobId
        {
            get { return this.RowKey; }
        }

        /// <summary>
        ///     Gets or sets the status.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        ///     Gets or sets the status.
        /// </summary>
        public string Result { get; set; }

        /// <summary>
        ///     Gets or sets the reason.
        /// </summary>
        public string Reason { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the job has been read.
        /// </summary>
        public bool? IsRead { get; set; }

        /// <summary>
        ///     Gets or sets the created time.
        /// </summary>
        public DateTime? CreatedTimeUtc { get; set; }
    }
}
