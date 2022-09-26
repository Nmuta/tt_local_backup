using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Organization.Client;

namespace StewardGitApi
{
    /// <summary>
    /// Manages Steward's Azure DevOps git operations.
    /// </summary>
    public class AzureDevOpsManager : IAzureDevOpsManager
    {
        internal AzureContext AzureContext { get; }

        public AzureDevOpsManager(Uri organizationUrl, VssBasicCredential credential, Settings connectionSettings)
        {
            AzureContext = new AzureContext(organizationUrl, credential, connectionSettings);
        }

        public Guid GetCurrentUserId()
        {
            return GitHelper.GetCurrentUserId(AzureContext);
        }

        public string GetCurrentUserDisplayName()
        {
            return GitHelper.GetCurrentUserDisplayName(AzureContext);
        }

        public async Task<Organization> GetOrganizationAsync(string organizationId)
        {
            await AzureContext.Connection.ConnectAsync();
            return await GitHelper.GetOrganizationAsync(AzureContext, organizationId).ConfigureAwait(false);
        }

        public async Task<TeamProjectReference> GetProjectAsync()
        {
            await AzureContext.Connection.ConnectAsync();
            return await GitHelper.GetProjectAsync(AzureContext).ConfigureAwait(false);
        }

        public async Task<GitRepository> GetRepositoryAsync()
        {
            await AzureContext.Connection.ConnectAsync();
            return await GitHelper.GetRepositoryAsync(AzureContext).ConfigureAwait(false);
        }

        public async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(Action<bool> OnSuccess = null)
        {
            await AzureContext.Connection.ConnectAsync();
            IEnumerable<GitRepository> repos = await GitHelper.GetRepositoriesAsync(AzureContext).ConfigureAwait(false);
            OnSuccess?.Invoke(repos.Any());
            return repos;
        }

        public async Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> OnSuccess = null)
        {
            await AzureContext.Connection.ConnectAsync();
            GitItem item = await GitHelper.GetItemAsync(AzureContext, path, gitObjectType).ConfigureAwait(false);
            OnSuccess?.Invoke(item != null);
            return item;
        }

        public async Task<GitPush> CreateNewFileAndPushAsync(CommitRefProxy proxyChange, Action<bool> OnSuccess = null)
        {
            _ = Check.ForNull(proxyChange, nameof(proxyChange));
            proxyChange.VersionControlChangeType = VersionControlChangeType.Add;
            await AzureContext.Connection.ConnectAsync();
            GitPush gitPush = await GitHelper.CommitAndPushAsync(AzureContext, new CommitRefProxy[] { proxyChange }).ConfigureAwait(false);
            OnSuccess?.Invoke(gitPush != null);
            return gitPush;
        }

        public async Task<GitPush> CommitAndPushAsync(IEnumerable<CommitRefProxy> proxyChanges, Action<bool> OnSuccess = null)
        {
            _ = Check.ForNullOrEmpty(proxyChanges, nameof(proxyChanges));
            await AzureContext.Connection.ConnectAsync();
            GitPush gitPush = await GitHelper.CommitAndPushAsync(AzureContext, proxyChanges).ConfigureAwait(false);
            OnSuccess?.Invoke(gitPush != null);
            return gitPush;
        }

        public async Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(int? mostRecent = null, Action<bool> OnSuccess = null)
        {
            _ = Check.ForGreaterThanZero(mostRecent, nameof(mostRecent));
            await AzureContext.Connection.ConnectAsync();
            IEnumerable<PullRequestStatus> prStatuses = await GitHelper.GetPullRequestStatusAsync(AzureContext, mostRecent);
            OnSuccess?.Invoke(prStatuses.Any());
            return prStatuses;
        }

        public async Task<GitPullRequest> GetPullRequestAsync(int pullRequestId, Action<bool> OnSuccess = null)
        {
            await AzureContext.Connection.ConnectAsync();
            GitPullRequest pullRequest = await GitHelper.GetPullRequestAsync(AzureContext, pullRequestId).ConfigureAwait(false);
            OnSuccess?.Invoke(pullRequest != null);
            return pullRequest;
        }

        public async Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(PullRequestStatus status, int? mostRecent = null, Action<bool> OnSuccess = null)
        {
            _ = Check.ForGreaterThanZero(mostRecent, nameof(mostRecent));
            await AzureContext.Connection.ConnectAsync();
            IEnumerable<GitPullRequest> pullRequests = await GitHelper.GetPullRequestsIntoDefaultBranchAsync(AzureContext, status, mostRecent);
            OnSuccess?.Invoke(true);
            return pullRequests;
        }

        public async Task<GitPullRequest> CreatePullRequestAsync(GitPush push, string title, string description, Action<bool> OnSuccess = null)
        {
            _ = Check.ForNullEmptyOrWhiteSpace(new string[] { title, description });
            await AzureContext.Connection.ConnectAsync();
            GitPullRequest pullRequest = await GitHelper.CreatePullRequestAsync(AzureContext, push, title, description).ConfigureAwait(false);
            OnSuccess?.Invoke(pullRequest != null);
            return pullRequest;
        }

        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitRef gitRef, Action<bool> OnSuccess = null)
        {
            _ = Check.ForNull(gitRef, nameof(gitRef));
            await AzureContext.Connection.ConnectAsync();
            GitRefUpdateResult result = await GitHelper.DeleteBranchAsync(AzureContext, gitRef).ConfigureAwait(false);
            OnSuccess?.Invoke(result.Success);
            return result;
        }

        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitPush gitPush, Action<bool> OnSuccess = null)
        {
            _ = Check.ForNull(gitPush, nameof(gitPush));
            await AzureContext.Connection.ConnectAsync();
            GitRefUpdateResult result = await GitHelper.DeleteBranchAsync(AzureContext, gitPush).ConfigureAwait(false);
            OnSuccess?.Invoke(result.Success);
            return result;
        }

        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitRefUpdate gitRefUpdate, Action<bool> OnSuccess = null)
        {
            _ = Check.ForNull(gitRefUpdate, nameof(gitRefUpdate));
            await AzureContext.Connection.ConnectAsync();
            GitRefUpdateResult result = await GitHelper.DeleteBranchAsync(AzureContext, gitRefUpdate).ConfigureAwait(false);
            OnSuccess?.Invoke(result.Success);
            return result;
        }
    }
}
