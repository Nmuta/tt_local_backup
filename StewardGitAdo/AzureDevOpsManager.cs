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
            return ClientHelper.GetCurrentUserId(AzureContext);
        }

        public string GetCurrentUserDisplayName()
        {
            return ClientHelper.GetCurrentUserDisplayName(AzureContext);
        }

        public async Task<Organization> GetOrganizationAsync(string organizationId)
        {
            await AzureContext.Connection.ConnectAsync();
            return await ClientHelper.GetOrganizationAsync(AzureContext, organizationId).ConfigureAwait(false);
        }

        public async Task<TeamProjectReference> GetProjectAsync()
        {
            await AzureContext.Connection.ConnectAsync();
            return await ClientHelper.GetProjectAsync(AzureContext).ConfigureAwait(false);
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
    }
}
