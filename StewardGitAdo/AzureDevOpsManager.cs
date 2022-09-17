using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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

        public AzureDevOpsManager(Uri organizationUrl, VssCredentials credentials, ConnectionSettings connectionSettings)
        {
            AzureContext = new AzureContext(organizationUrl, credentials, connectionSettings);
        }

        public async Task<TeamProjectReference> FindProjectByNameOrGuidAsync(string projectId)
        {
            return await ClientHelper.FindProjectByNameOrGuid(AzureContext, projectId).ConfigureAwait(false);
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

            return await GitHelper.GetRepositoryAsync(AzureContext, repoId, projectId, (success) =>
            {
                if (success) AzureContext.ConnectionSettings?.SetIfUnset(projectId, repoId);

            }).ConfigureAwait(false);
        }

        public async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(string projectId)
        {
            await AzureContext.Connection.ConnectAsync();

            return await GitHelper.GetRepositoriesAsync(AzureContext, projectId, (success) =>
            {
                if (success) AzureContext.ConnectionSettings?.SetIfUnset(projectId);

            }).ConfigureAwait(false);
        }

        public async Task<GitItem> GetItemAsync(string path, string repoId, string projectId)
        {
            // Ensure connection because Connection.Disconnect()
            // could have been called during disposal.
            await AzureContext.Connection.ConnectAsync();

            return await GitHelper.GetItemAsync(AzureContext, path, repoId, projectId, (success) =>
            {
                if (success) AzureContext.ConnectionSettings?.SetIfUnset(projectId, repoId);

            }).ConfigureAwait(false);
        }
    }
}
