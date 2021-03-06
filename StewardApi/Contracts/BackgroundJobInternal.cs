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
        /// <param name="jobId">The job ID.</param>
        /// <param name="username">The username.</param>
        /// <param name="backgroundJobStatus">The background job status.</param>
        public BackgroundJobInternal(string jobId, string username, BackgroundJobStatus backgroundJobStatus)
            : this(jobId, username, backgroundJobStatus, string.Empty)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJobInternal"/> class.
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <param name="username">The username.</param>
        /// <param name="backgroundJobStatus">The background job status.</param>
        /// <param name="result">The result.</param>
        public BackgroundJobInternal(string jobId, string username, BackgroundJobStatus backgroundJobStatus, string result)
        {
            jobId.ShouldNotBeNull(nameof(jobId));
            username.ShouldNotBeNullEmptyOrWhiteSpace(nameof(username));
            backgroundJobStatus.ShouldNotBeNull(nameof(backgroundJobStatus));

            this.PartitionKey = jobId;
            this.JobId = jobId;
            this.RowKey = username;
            this.Status = backgroundJobStatus.ToString();
            this.Result = result;
        }

        /// <summary>
        ///     Gets or sets the job Id.
        /// </summary>
        public string JobId { get; set; }

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
