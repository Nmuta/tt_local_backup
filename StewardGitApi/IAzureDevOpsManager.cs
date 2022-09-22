﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Organization.Client;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitApi
{
    public interface IAzureDevOpsManager
    {
        public Task<Organization> GetOrganizationAsync(string organizationId);

        public Task<TeamProjectReference> GetProjectAsync();

        public Task<GitRepository> GetRepositoryAsync();

        public Task<IEnumerable<GitRepository>> GetRepositoriesAsync(Action<bool> OnSuccess);

        Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> OnSuccess);

        Task<GitPush> CreateNewFileAndPushAsync(CommitRefProxy proxyChange, Action<bool> OnSuccess);

        Task<GitPush> CommitAndPushAsync(IEnumerable<CommitRefProxy> proxyChanges, Action<bool> OnSuccess);

        Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(int? mostRecent, Action<bool> OnSuccess);

        Task<GitPullRequest> GetPullRequestAsync(int pullRequestId, Action<bool> OnSuccess);

        Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(PullRequestStatus status, int? mostRecent, Action<bool> OnSuccess);

        Task<GitPullRequest> CreatePullRequestAsync(GitPush push, string title, string description, Action<bool> OnSuccess);

        public Guid GetCurrentUserId();

        public string GetCurrentUserDisplayName();
    }
}
