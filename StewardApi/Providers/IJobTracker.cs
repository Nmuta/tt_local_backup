using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;

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
        /// <param name="requestBody">The request body.</param>
        /// <param name="username">The username.</param>
        /// <returns>The job ID.</returns>
        Task<string> CreateNewJobAsync(string requestBody, string username);

        /// <summary>
        ///     Gets the job status.
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <returns>The background job status.</returns>
        Task<BackgroundJob> GetJobStatusAsync(string jobId);

        /// <summary>
        ///     Updates the job status.
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <param name="username">The username.</param>
        /// <param name="backgroundJobStatus">The background job status.</param>
        /// <param name="jobResult">The job result.</param>
        /// <returns>A task with the status of the operation.</returns>
        Task UpdateJobAsync(string jobId, string username, BackgroundJobStatus backgroundJobStatus, string jobResult);

        /// <summary>
        ///     Updates the job status.
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <param name="username">The username.</param>
        /// <param name="backgroundJobStatus">The background job status.</param>
        /// <returns>A task with the status of the operation.</returns>
        Task UpdateJobAsync(string jobId, string username, BackgroundJobStatus backgroundJobStatus);
    }
}
