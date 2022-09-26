using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Organization.Client;

namespace StewardGitApi
{
    public interface IAzureDevOpsManager
    {
        /// <summary>
        /// Gets the organization.
        /// </summary>
        /// <param name="organizationId">The org id.</param>
        /// <returns>The organization.</returns>
        public Task<Organization> GetOrganizationAsync(string organizationId);

        /// <summary>
        /// Gets the project from the current org.
        /// that matches the current 
        /// <see cref="AzureContext.Settings"/>.ProjectId.
        /// </summary>
        /// <returns>The project.</returns>
        public Task<TeamProjectReference> GetProjectAsync();

        /// <summary>
        /// Gets a repository from the current project
        /// that matches the current
        /// <see cref="AzureContext.Settings"/>.RepoId.
        /// </summary>
        /// <returns>A repository.</returns>
        public Task<GitRepository> GetRepositoryAsync();

        /// <summary>
        /// Gets a list of repositories from the current project.
        /// </summary>
        /// <returns>A task representing an enumerable of repos.</returns>
        public Task<IEnumerable<GitRepository>> GetRepositoriesAsync(Action<bool> OnSuccess);

        /// <summary>
        /// Gets an item from the repository.
        /// Use GitObjectType to retrive blobs,
        /// commits, tags, refs or deltas.
        /// </summary>
        /// <param name="path">The path to the item in repo.</param>
        /// <param name="gitObjectType">The type of item to get.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>The <see cref="GitItem"/> task.</returns>
        Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> OnSuccess);

        /// <summary>
        /// Commit and push a new file represented
        /// by <paramref name="proxyChanges"/>.
        /// </summary>
        /// <param name="proxyChange">The changes to be pushed.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A <see cref="GitPush"/> task.</returns>
        Task<GitPush> CreateNewFileAndPushAsync(CommitRefProxy proxyChange, Action<bool> OnSuccess);

        /// <summary>
        /// Commits and pushes content changes
        /// represented by <paramref name="proxyChanges"/>.
        /// </summary>
        /// <param name="proxyChanges">The changes to be pushed.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A <see cref="GitPush"/> task.</returns>
        Task<GitPush> CommitAndPushAsync(IEnumerable<CommitRefProxy> proxyChanges, Action<bool> OnSuccess);

        /// <summary>
        /// Gets pull request statuses.
        /// </summary>
        /// <remarks>A <c>null</c> <paramref name="mostRecent"/> will
        /// retrive the entire PR status history.</remarks>
        /// <param name="mostRecent">The most recent PRs.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A task containing an enumerable of PR statuses.</returns>
        Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(int? mostRecent, Action<bool> OnSuccess);

        /// <summary>
        /// Gets a pull request by id.
        /// </summary>
        /// <param name="pullRequestId">The PR id.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A <see cref="GitPullRequest"/> task.</returns>
        Task<GitPullRequest> GetPullRequestAsync(int pullRequestId, Action<bool> OnSuccess);

        /// <summary>
        /// Get pull requests scheduled for merge
        /// into the default branch.
        /// </summary>
        /// <param name="status">Filter by PR status.</param>
        /// <param name="mostRecent">Filter by most recent PRs.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A task representing an enumerable of pull requests.</returns>
        Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(PullRequestStatus status, int? mostRecent, Action<bool> OnSuccess);

        /// <summary>
        /// Creates a pull request.
        /// </summary>
        /// <param name="push">The content object to push.</param>
        /// <param name="title">The PR title.</param>
        /// <param name="description">The PR description.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A reference to the PR created.</returns>
        Task<GitPullRequest> CreatePullRequestAsync(GitPush push, string title, string description, Action<bool> OnSuccess);

        /// <summary>
        /// Deletes a branch.
        /// </summary>
        /// <param name="gitRef">The branch to delete.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A <see cref="GitRefUpdateResult"/> task.</returns>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitRef gitRef, Action<bool> OnSuccess);

        /// <summary>
        /// Deletes a branch pushed to.
        /// </summary>
        /// <param name="gitPush">The push containing 
        /// branch info to delete.</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A <see cref="GitRefUpdateResult"/> task.</returns>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitPush gitPush, Action<bool> OnSuccess);

        /// <summary>
        /// Deletes an udpated branch.
        /// </summary>
        /// <param name="refUpdate">The branch to delete</param>
        /// <param name="OnSuccess">Callback on success.</param>
        /// <returns>A <see cref="GitRefUpdateResult"/> task.</returns>
        Task<GitRefUpdateResult> DeleteBranchAsync(GitRefUpdate gitRefUpdate, Action<bool> OnSuccess);

        /// <summary>
        /// Gets current user id.
        /// </summary>
        /// <returns>The id.</returns>
        public Guid GetCurrentUserId();

        /// <summary>
        /// Gets current user display name.
        /// </summary>
        /// <returns>The name.</returns>
        public string GetCurrentUserDisplayName();
    }
}
