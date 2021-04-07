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
        Task<string> CreateNewJobAsync(string requestBody, string objectId);

        /// <summary>
        ///     Gets the job status.
        /// </summary>
        Task<BackgroundJobInternal> GetJobStatusAsync(string jobId);

        /// <summary>
        ///     Updates the job status.
        /// </summary>
        Task UpdateJobAsync(string jobId, string objectId, BackgroundJobStatus backgroundJobStatus, object jobResult);

        /// <summary>
        ///     Updates the job status.
        /// </summary>
        Task UpdateJobAsync(string jobId, string objectId, BackgroundJobStatus backgroundJobStatus);
    }
}
