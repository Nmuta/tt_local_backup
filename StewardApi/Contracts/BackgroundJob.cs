using Microsoft.Azure.Cosmos.Table;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents a background job.
    /// </summary>
    public sealed class BackgroundJob : TableEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJob"/> class.
        /// </summary>
        public BackgroundJob()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJob"/> class.
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <param name="username">The username.</param>
        /// <param name="backgroundJobStatus">The background job status.</param>
        public BackgroundJob(string jobId, string username, BackgroundJobStatus backgroundJobStatus)
            : this(jobId, username, backgroundJobStatus, string.Empty)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJob"/> class.
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <param name="username">The username.</param>
        /// <param name="backgroundJobStatus">The background job status.</param>
        /// <param name="result">The result.</param>
        public BackgroundJob(string jobId, string username, BackgroundJobStatus backgroundJobStatus, string result)
        {
            jobId.ShouldNotBeNull(nameof(jobId));
            username.ShouldNotBeNullEmptyOrWhiteSpace(nameof(username));
            backgroundJobStatus.ShouldNotBeNull(nameof(backgroundJobStatus));

            this.PartitionKey = jobId;
            this.RowKey = username;
            this.Status = backgroundJobStatus.ToString();
            this.Result = result;
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
