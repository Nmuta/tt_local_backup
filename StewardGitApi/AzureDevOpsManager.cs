using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Organization.Client;

namespace StewardGitApi
{
    public class AzureDevOpsManager : IAzureDevOpsManager
    {
        internal AzureContext AzureContext { get; }

        internal Stack<GitChange> GitChanges { get; }

        public AzureDevOpsManager(Uri organizationUrl, VssBasicCredential credential, Settings connectionSettings)
        {
            AzureContext = new AzureContext(organizationUrl, credential, connectionSettings);
            GitChanges = new Stack<GitChange>();
        }

        public int GetNumberOfUncommitChanges()
        {
            return GitChanges.Count;
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
            OnSuccess?.Invoke(repos != null && repos.Any());
            return repos;
        }

        public async Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> OnSuccess = null)
        {
            // Ensure connection because AzureContext.Dispose()
            // possibly called, resulting in Connection.Disconnect()
            await AzureContext.Connection.ConnectAsync();
            GitItem item = await GitHelper.GetItemAsync(AzureContext, path, gitObjectType).ConfigureAwait(false);
            OnSuccess?.Invoke(item != null);
            return item;
        }

        public async Task<GitPush> CreateNewFileAndPushAsync(CommitRefProxy proxyChange, Action<bool> OnSuccess = null)
        {
            _ = Check.ForNull(proxyChange, nameof(proxyChange));
            proxyChange.VersionControlChangeType = VersionControlChangeType.Add; // override user
            await AzureContext.Connection.ConnectAsync();
            GitPush pushResult = await GitHelper.CommitAndPushAsync(AzureContext, new CommitRefProxy[] { proxyChange }).ConfigureAwait(false);
            OnSuccess?.Invoke(pushResult != null && pushResult.Commits.First().ChangeCounts.Count > 0);
            return pushResult;
        }

        public async Task<GitPush> CommitAndPushAsync(IEnumerable<CommitRefProxy> proxyChanges, Action<bool> OnSuccess = null)
        {
            _ = Check.ForNullOrEmpty(proxyChanges, nameof(proxyChanges));
            await AzureContext.Connection.ConnectAsync();
            GitPush pushResult = await GitHelper.CommitAndPushAsync(AzureContext, proxyChanges).ConfigureAwait(false);
            OnSuccess?.Invoke(pushResult != null && pushResult.Commits.First().ChangeCounts.Count > 0);
            return pushResult;
        }

        public async Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(int? mostRecentPullRequests = null, Action<bool> OnSuccess = null)
        {
            // TODO add nullable case to Check.cs
            if (mostRecentPullRequests <= 0)
                throw new ArgumentOutOfRangeException(nameof(mostRecentPullRequests));
            await AzureContext.Connection.ConnectAsync();
            IEnumerable<PullRequestStatus> prStatuses = await GitHelper.GetPullRequestStatusAsync(AzureContext, mostRecentPullRequests);
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

        public async Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(PullRequestStatus status, int? mostRecentPullRequests = null, Action<bool> OnSuccess = null)
        {
            // TODO add nullable case to Check.cs
            if (mostRecentPullRequests <= 0)
                throw new ArgumentOutOfRangeException(nameof(mostRecentPullRequests));
            await AzureContext.Connection.ConnectAsync();
            IEnumerable<GitPullRequest> pullRequests = await GitHelper.GetPullRequestsIntoDefaultBranchAsync(AzureContext, status, mostRecentPullRequests); // expose top,status?
            OnSuccess?.Invoke(OnSuccess != null && pullRequests.Any());
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
    }
}
