using System.Runtime.Serialization;
using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Organization.Client;

namespace StewardGitApi
{
    /// <summary>
    ///     Manages Steward's Azure DevOps git operations.
    /// </summary>
    public class AzureDevOpsManager : IAzureDevOpsManager
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="AzureDevOpsManager"/> class.
        /// </summary>
        public AzureDevOpsManager(Uri organizationUrl, VssBasicCredential credential, RepoSettings connectionSettings)
        {
            this.AzureContext = new AzureContext(organizationUrl, credential, connectionSettings);
        }

        /// <inheritdoc/>
        public AzureContext AzureContext { get; }

        /// <inheritdoc/>
        public Guid GetCurrentUserId()
        {
            return GitHelper.GetCurrentUserId(this.AzureContext);
        }

        /// <inheritdoc/>
        public string GetCurrentUserDisplayName()
        {
            return GitHelper.GetCurrentUserDisplayName(this.AzureContext);
        }

        /// <inheritdoc/>
        public async Task<Organization> GetOrganizationAsync(string organizationId)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetOrganizationAsync(this.AzureContext, organizationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<TeamProjectReference> GetProjectAsync()
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetProjectAsync(this.AzureContext).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitRepository> GetRepositoryAsync()
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetRepositoryAsync(this.AzureContext).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitRepository>> GetRepositoriesAsync()
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetRepositoriesAsync(this.AzureContext).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType)
        {
            path.CheckForNull(nameof(path));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetItemAsync(this.AzureContext, path, gitObjectType).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitPush> CreateNewFileAndPushAsync(CommitRefProxy changeToPush)
        {
            changeToPush.CheckForNull(nameof(changeToPush));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.CommitAndPushAsync(this.AzureContext, new CommitRefProxy[] { changeToPush }).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitPush> CommitAndPushAsync(IEnumerable<CommitRefProxy> changesToPush)
        {
            changesToPush.CheckForNullOrEmpty(nameof(changesToPush));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.CommitAndPushAsync(this.AzureContext, changesToPush).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(int? mostRecent = null)
        {
            mostRecent.CheckForGreaterThanZero(nameof(mostRecent));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetPullRequestStatusAsync(this.AzureContext, mostRecent).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> GetPullRequestAsync(int pullRequestId)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetPullRequestAsync(this.AzureContext, pullRequestId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(PullRequestStatus status, int? mostRecent = null)
        {
            mostRecent.CheckForGreaterThanZero(nameof(mostRecent));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetPullRequestsIntoDefaultBranchAsync(this.AzureContext, status, mostRecent).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> CreatePullRequestAsync(GitPush push, string title, string description)
        {
            Check.CheckForNull(push, nameof(push));
            Check.CheckForNullEmptyOrWhiteSpace(new string[] { title, description });
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.CreatePullRequestAsync(this.AzureContext, push, title, description).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<Build> RunPipelineAsync(GitPush push, int buildDefinition)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.RunPipelineAsync(this.AzureContext, push.RefUpdates.FirstOrDefault().Name, buildDefinition).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitRef gitRef)
        {
            gitRef.CheckForNull(nameof(gitRef));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.DeleteBranchAsync(this.AzureContext, gitRef).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitPush gitPush)
        {
            gitPush.CheckForNull(nameof(gitPush));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.DeleteBranchAsync(this.AzureContext, gitPush).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitRefUpdate gitRefUpdate)
        {
            gitRefUpdate.CheckForNull(nameof(gitRefUpdate));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.DeleteBranchAsync(this.AzureContext, gitRefUpdate).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> AbandonPullRequestAsync(int pullRequestId)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.AbandonPullRequestAsync(this.AzureContext, pullRequestId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitRef>> GetAllBranchesAsync()
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetAllBranchesAsync(this.AzureContext).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitItem>> ListItemsAsync(string path)
        {
            path.CheckForNull(nameof(path));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.ListItemsAsync(this.AzureContext, path).ConfigureAwait(false);
        }
    }
}
