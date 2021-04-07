using Microsoft.Azure.Cosmos.Table;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts
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
        public BackgroundJobInternal(string jobId, string objectId, BackgroundJobStatus backgroundJobStatus)
            : this(jobId, objectId, backgroundJobStatus, string.Empty)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJobInternal"/> class.
        /// </summary>
        public BackgroundJobInternal(string jobId, string objectId, BackgroundJobStatus backgroundJobStatus, string result)
        {
            jobId.ShouldNotBeNull(nameof(jobId));
            objectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(objectId));
            backgroundJobStatus.ShouldNotBeNull(nameof(backgroundJobStatus));

            this.PartitionKey = objectId;
            this.RowKey = jobId;
            this.Status = backgroundJobStatus.ToString();
            this.Result = result;
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
    }
}
