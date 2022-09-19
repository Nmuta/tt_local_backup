using System;
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
        public AzureContext AzureContext { get; }

        public Task<Organization> GetOrganizationAsync(string organizationId);

        public Task<TeamProjectReference> GetProjectAsync(string projectId);

        public Task<GitRepository> GetRepositoryAsync();

        public Task<GitRepository> GetRepositoryAsync(string repoId, string projectId);

        public Task<IEnumerable<GitRepository>> GetRepositoriesAsync(Action<bool> OnSuccess);

        public Task<IEnumerable<GitRepository>> GetRepositoriesAsync(string projectId, Action<bool> OnSuccess);

        Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> OnSuccess);

        public Task<GitItem> GetItemAsync(string path, string repoId, string projectId, GitObjectType gitObjectType, Action<bool> OnSuccess);

        public Guid GetCurrentUserId();

        public string GetCurrentUserDisplayName();

        // create commit / push

        // create pr

        // get pr iteration status

    }
}
