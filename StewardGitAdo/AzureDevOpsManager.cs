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

namespace StewardGitClient
{
    internal class AzureDevOpsManager : IAzureDevOpsManager
    {
        public AzureContext AzureContext { get; }

        public AzureDevOpsManager(Uri organizationUrl, VssCredentials credentials, ConnectionSettings connectionSettings)
        {
            AzureContext = new AzureContext(organizationUrl, credentials, connectionSettings);
        }

        public Guid GetCurrentUserId()
        {
            return ClientHelper.GetCurrentUserId(AzureContext);
        }

        public string GetCurrentUserDisplayName()
        {
            return ClientHelper.GetCurrentUserDisplayName(AzureContext);
        }

        public async Task<Organization> GetOrganizationAsync(string organizationId)
        {
            return await ClientHelper.GetOrganizationAsync(AzureContext, organizationId).ConfigureAwait(false);
        }

        public async Task<TeamProjectReference> GetProjectAsync(string projectId)
        {
            return await ClientHelper.GetProjectAsync(AzureContext, projectId).ConfigureAwait(false);
        }

        public async Task<GitRepository> GetRepositoryAsync()
        {
            if (AzureContext.ConnectionSettings == ConnectionSettings.Default)
                throw new InvalidOperationException($"No connection settings provided in {nameof(AzureContext)}");
            var settings = AzureContext.ConnectionSettings;
            return await GitHelper.GetRepositoryAsync(AzureContext, settings.RepoId.ToString(), settings.ProjectId.ToString()).ConfigureAwait(false);
        }

        public async Task<GitRepository> GetRepositoryAsync(string repoId, string projectId = null)
        {
            await AzureContext.Connection.ConnectAsync();
            return await GitHelper.GetRepositoryAsync(AzureContext, repoId, projectId).ConfigureAwait(false);
        }

        public async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(Action<bool> OnSuccess = null)
        {
            if (AzureContext.ConnectionSettings == ConnectionSettings.Default)
                throw new InvalidOperationException($"No connection settings provided in {nameof(AzureContext)}");
            var settings = AzureContext.ConnectionSettings;
            return await GetRepositoriesAsync(settings.ProjectId.ToString(), OnSuccess).ConfigureAwait(false);
        }

        public async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(string projectId, Action<bool> OnSuccess = null)
        {
            await AzureContext.Connection.ConnectAsync();
            var repos = await GitHelper.GetRepositoriesAsync(AzureContext, projectId).ConfigureAwait(false);
            OnSuccess?.Invoke(repos != null && repos.Any());
            return repos;
        }

        public async Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> OnSuccess = null)
        {
            if (AzureContext.ConnectionSettings == ConnectionSettings.Default)
                throw new InvalidOperationException($"No connection settings provided in {nameof(AzureContext)}");
            var settings = AzureContext.ConnectionSettings;
            return await GetItemAsync(path, settings.RepoId.ToString(), settings.ProjectId.ToString(), gitObjectType, OnSuccess).ConfigureAwait(false);
        }

        public async Task<GitItem> GetItemAsync(string path, string repoId, string projectId, GitObjectType gitObjectType, Action<bool> OnSuccess = null)
        {
            // Ensure connection because AzureContext.Dispose()
            // possibly called, resulting in Connection.Disconnect()
            await AzureContext.Connection.ConnectAsync();
            GitItem item = await GitHelper.GetItemAsync(AzureContext, path, repoId, projectId, gitObjectType).ConfigureAwait(false);
            OnSuccess?.Invoke(item != null);
            return item;
        }
    }
}
