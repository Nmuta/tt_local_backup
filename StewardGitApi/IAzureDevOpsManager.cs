using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Organization.Client;

namespace StewardGitApi
{
    /// <summary>
    ///     The interface for Steward git operations.
    /// </summary>
    public interface IAzureDevOpsManager
    {
        /// <summary>
        ///     Gets the connection context.
        /// </summary>
        public AzureContext AzureContext { get; }

        /// <summary>
        ///     Gets the organization.
        /// </summary>
        public Task<Organization> GetOrganizationAsync(string organizationId);

        /// <summary>
        ///     Gets the project from the current org that
        ///     matches the current <see cref="AzureContext.Settings"/>.ProjectId.
        /// </summary>
        public Task<TeamProjectReference> GetProjectAsync();

        /// <summary>
        ///     Gets a repository from the current project that
        ///     matches the current <see cref="AzureContext.Settings"/>.RepoId.
        /// </summary>
        public Task<GitRepository> GetRepositoryAsync();

        /// <summary>
        ///     Gets a list of repositories from the current project.
        /// </summary>
        public Task<IEnumerable<GitRepository>> GetRepositoriesAsync(Action<bool> onSuccess);

        /// <summary>
        ///     Gets an item from the repository.
        ///     Use GitObjectType to retrive blobs, commits, tags, refs or deltas.
        /// </summary>
        Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> onSuccess);

        /// <summary>
        ///     Commit and push a new file represented
        ///     by <paramref name="proxyChanges"/>.
        /// </summary>
        Task<GitPush> CreateNewFileAndPushAsync(CommitRefProxy changeToPush, Action<bool> onSuccess);

        /// <summary>
        ///     Commits and pushes content changes
        ///     represented by <paramref name="proxyChanges"/>.
        /// </summary>
        Task<GitPush> CommitAndPushAsync(IEnumerable<CommitRefProxy> changesToPush, Action<bool> onSuccess);

        /// <summary>
        ///     Gets pull request statuses.
        ///     A <c>null</c> <paramref name="mostRecent"/> will
        ///     retrive the repo's entire pull request status history.
        /// </summary>
        Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(int? mostRecent, Action<bool> onSuccess);

        /// <summary>
        ///     Gets a pull request by id.
        /// </summary>
        Task<GitPullRequest> GetPullRequestAsync(int pullRequestId, Action<bool> onSuccess);

        /// <summary>
        ///     Get pull requests scheduled for merge into the default branch.
        ///     A <c>null</c> <paramref name="mostRecent"/> will
        ///     retrieve all matching pull requests.
        /// </summary>
        Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(PullRequestStatus status, int? mostRecent, Action<bool> onSuccess);

        /// <summary>
        ///     Creates a pull request.
        /// </summary>
        Task<GitPullRequest> CreatePullRequestAsync(GitPush push, string title, string description, Action<bool> onSuccess);

        /// <summary>
        ///     Deletes a branch.
        /// </summary>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitRef gitRef, Action<bool> onSuccess);

        /// <summary>
        ///     Deletes a branch pushed to.
        /// </summary>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitPush gitPush, Action<bool> onSuccess);

        /// <summary>
        ///     Deletes an udpated branch.
        /// </summary>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitRefUpdate gitRefUpdate, Action<bool> onSuccess);

        /// <summary>
        /// Abandons pull request.
        /// </summary>
        public Task<GitPullRequest> AbandonPullRequestAsync(int pullRequestId);

        /// <summary>
        ///     Gets current user id.
        /// </summary>
        public Guid GetCurrentUserId();

        /// <summary>
        ///     Gets current user display name.
        /// </summary>
        public string GetCurrentUserDisplayName();

        /// <summary>
        ///     Gets a list of all branches.
        /// </summary>
        public Task<IEnumerable<GitRef>> GetAllBranchesAsync();

        /// <summary>
        ///     Kick off a build to format the provided branch.
        /// </summary>
        public Task<Build> RunPipelineAsync(GitPush push, int buildDefinition);
    }
}
