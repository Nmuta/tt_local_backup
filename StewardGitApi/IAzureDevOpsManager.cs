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
        public Task<IEnumerable<GitRepository>> GetRepositoriesAsync();

        /// <summary>
        ///     Gets an item from the repository.
        ///     Use GitObjectType to retrive blobs, commits, tags, refs or deltas.
        /// </summary>
        Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType);

        /// <summary>
        ///     List items along the repository by the specified path.
        /// </summary>
        Task<IEnumerable<GitItem>> ListItemsAsync(string path);

        /// <summary>
        ///     Commit and push a new file represented
        ///     by <paramref name="proxyChanges"/>.
        /// </summary>
        Task<GitPush> CreateNewFileAndPushAsync(CommitRefProxy changeToPush);

        /// <summary>
        ///     Commits and pushes content changes
        ///     represented by <paramref name="proxyChanges"/>.
        /// </summary>
        Task<GitPush> CommitAndPushAsync(IEnumerable<CommitRefProxy> changesToPush);

        /// <summary>
        ///     Gets pull request statuses.
        ///     A <c>null</c> <paramref name="mostRecent"/> will
        ///     retrive the repo's entire pull request status history.
        /// </summary>
        Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(int? mostRecent);

        /// <summary>
        ///     Gets a pull request by id.
        /// </summary>
        Task<GitPullRequest> GetPullRequestAsync(int pullRequestId);

        /// <summary>
        ///     Get pull requests scheduled for merge into the default branch.
        ///     A <c>null</c> <paramref name="mostRecent"/> will
        ///     retrieve all matching pull requests.
        /// </summary>
        Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(PullRequestStatus status, int? mostRecent);

        /// <summary>
        ///     Creates a pull request.
        /// </summary>
        Task<GitPullRequest> CreatePullRequestAsync(GitPush push, string title, string description);

        /// <summary>
        ///     Deletes a branch.
        /// </summary>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitRef gitRef);

        /// <summary>
        ///     Deletes a branch pushed to.
        /// </summary>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitPush gitPush);

        /// <summary>
        ///     Deletes an udpated branch.
        /// </summary>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitRefUpdate gitRefUpdate);

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
