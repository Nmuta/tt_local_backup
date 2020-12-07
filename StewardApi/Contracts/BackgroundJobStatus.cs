﻿namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents the available background job statuses.
    /// </summary>
    public enum BackgroundJobStatus
    {
        /// <summary>
        ///     The job is completed.
        /// </summary>
        Completed,

        /// <summary>
        ///     The job is in progress.
        /// </summary>
        InProgress,

        /// <summary>
        ///     The job has failed.
        /// </summary>
        Failed
    }
}