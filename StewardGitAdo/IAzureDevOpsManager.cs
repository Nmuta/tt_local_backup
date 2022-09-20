﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Organization.Client;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitClient
{
    public interface IAzureDevOpsManager
    {
        public Task<Organization> GetOrganizationAsync(string organizationId);

        public Task<TeamProjectReference> GetProjectAsync();

        public Task<GitRepository> GetRepositoryAsync();

        public Task<IEnumerable<GitRepository>> GetRepositoriesAsync(Action<bool> OnSuccess);

        Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> OnSuccess);

        public Guid GetCurrentUserId();

        public string GetCurrentUserDisplayName();

        // create commit / push

        // create pr

        // get pr iteration status

    }
}
