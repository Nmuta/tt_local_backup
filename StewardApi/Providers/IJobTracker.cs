using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Exposes methods for job tracking.
    /// </summary>
    public interface IJobTracker
    {
        /// <summary>
        ///     Adds a job into the tracker.
        /// </summary>
        Task<string> CreateNewJobAsync(string requestBody, string userObjectId, string reason);

        /// <summary>
        ///     Gets the job status.
        /// </summary>
        Task<BackgroundJobInternal> GetJobStatusAsync(string jobId);

        /// <summary>
        ///     Updates the job status.
        /// </summary>
        Task UpdateJobAsync(string jobId, string userObjectId, BackgroundJobStatus backgroundJobStatus, object jobResult);

        /// <summary>
        ///     Updates the job status.
        /// </summary>
        Task UpdateJobAsync(string jobId, string userObjectId, BackgroundJobStatus backgroundJobStatus);

        /// <summary>
        ///     Gets all jobs with given Azure object ID.
        /// </summary>
        Task<IList<BackgroundJobInternal>> GetJobsByUserAsync(string userObjectId, TimeSpan? resultsFrom);

        /// <summary>
        ///     Gets all jobs with given Azure object ID.
        /// </summary>
        Task<IList<BackgroundJobInternal>> GetUnreadJobsByUserAsync(string userObjectId);

        /// <summary>
        ///     Sets the job's IsRead status.
        /// </summary>
        Task SetJobIsReadAsync(string jobId, string userObjectId, bool isRead);

        /// <summary>
        ///     Gets all the "InProgress" jobs.
        /// </summary>
        Task<IList<BackgroundJobInternal>> GetInProgressJobsAsync();
    }
}
