using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;

namespace StewardGitClient
{
    internal class AzureDevOpsManager : IAzureDevOpsManager
    {
        public AzureContext AzureContext { get; }

        public AzureDevOpsManager(Uri organizationUrl, VssCredentials credentials)
        {
            AzureContext = new AzureContext(organizationUrl, credentials);
        }

        public async Task<TeamProjectReference> FindProjectByNameOrGuidAsync(string projectId)
        {
            await AzureContext.Connection.ConnectAsync();

            return await ClientHelper.FindProjectByNameOrGuid(AzureContext, projectId);
        }

        public Guid GetCurrentUserId()
        {
            return ClientHelper.GetCurrentUserId(AzureContext);
        }

        public string GetCurrentUserDisplayName()
        {
            return ClientHelper.GetCurrentUserDisplayName(AzureContext);
        }

        public async Task<GitRepository> GetRepositoryAsync(string repoId, string projectId = null)
        {
            await AzureContext.Connection.ConnectAsync();

            return await GitHelper.GetRepositoryAsync(AzureContext, repoId, projectId);
        }

        public async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(string projectId)
        {
            await AzureContext.Connection.ConnectAsync();

            return await GitHelper.GetRepositoriesAsync(AzureContext, projectId);
        }

        public async Task<GitItem> GetItemAsync(AzureContext context, string path, string repoId, string projectId)
        {
            await AzureContext.Connection.ConnectAsync();

            return await GitHelper.GetItemAsync(AzureContext, path, repoId, projectId);
        }
    }
}
