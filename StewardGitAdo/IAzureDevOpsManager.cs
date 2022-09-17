using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitClient
{
    public interface IAzureDevOpsManager
    {
        public AzureContext AzureContext { get; }

        public Task<TeamProjectReference> FindProjectByNameOrGuidAsync(string projectId);

        public Task<GitRepository> GetRepositoryAsync(string repoId, string projectId = null);

        public Task<IEnumerable<GitRepository>> GetRepositoriesAsync(string projectId);

        public Task<GitItem> GetItemAsync(string path, string repoId, string projectId);

        public Guid GetCurrentUserId();

        public string GetCurrentUserDisplayName();

    }
}
