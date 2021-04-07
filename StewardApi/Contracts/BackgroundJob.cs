﻿using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents a background job.
    /// </summary>
    public sealed class BackgroundJob
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
        public BackgroundJob(string jobId, BackgroundJobStatus backgroundJobStatus)
            : this(jobId, backgroundJobStatus, string.Empty)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="BackgroundJob"/> class.
        /// </summary>
        public BackgroundJob(string jobId, BackgroundJobStatus backgroundJobStatus, object rawResult)
        {
            jobId.ShouldNotBeNull(nameof(jobId));
            backgroundJobStatus.ShouldNotBeNull(nameof(backgroundJobStatus));

            this.JobId = jobId;
            this.Status = backgroundJobStatus;
            this.RawResult = rawResult;
        }

        /// <summary>
        ///     Gets or sets the job Id.
        /// </summary>
        public string JobId { get; set; }

        /// <summary>
        ///     Gets or sets the status.
        /// </summary>
        public BackgroundJobStatus Status { get; set; }

        /// <summary>
        ///     Gets or sets the raw result.
        /// </summary>
        public object RawResult { get; set; }
    }
}
