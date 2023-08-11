using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Git
{
    /// <summary>
    ///     Represents a Steward git pull request.
    /// </summary>
    public class PullRequest
    {
        /// <summary>
        ///     Gets or sets the pull request Id.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        ///     Gets or sets the pull request URL.
        /// </summary>
        public string WebUrl { get; set; }

        /// <summary>
        ///     Gets or sets the pull request creation date.
        /// </summary>
        public DateTime CreationDateUtc { get; set; }

        /// <summary>
        ///     Gets or sets the pull request title.
        /// </summary>
        public string Title { get; set; }
    }
}
