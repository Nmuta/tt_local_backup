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
    internal class GitHelper
    {
        public static async Task<GitItem> GetItemAsync(AzureContext context, string path, string repoId, string projectId, Action<bool> OnSuccess = null)
        {
            VssConnection connection = context.Connection;
            GitHttpClient gitClient = connection.GetClient<GitHttpClient>();

            TeamProjectReference project = await ClientHelper.FindProjectByNameOrGuid(context, projectId);
            GitRepository repo = await GetRepositoryAsync(context, repoId);

            // get a filename we know exists
            List<GitItem> gitItems = await gitClient.GetItemsAsync(repo.Id, scopePath: path, recursionLevel: VersionControlRecursionType.OneLevel);
            string filename = gitItems.Where(o => o.GitObjectType == GitObjectType.Blob).FirstOrDefault().Path;

            // retrieve the contents of the file
            GitItem item = await gitClient.GetItemAsync(repo.Id, filename, includeContent: true);

            Console.WriteLine("File {0} at commit {1} is of length {2}", filename, item.CommitId, item.Content.Length);

            OnSuccess?.Invoke(item != null);

            return item;
        }

        public static async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(AzureContext context, string projectId, Action<bool> OnSuccess = null)
        {
            GitHttpClient gitHttpClient = context.Connection.GetClient<GitHttpClient>();

            var repos = await gitHttpClient.GetRepositoriesAsync(projectId);

            OnSuccess?.Invoke(repos != null && repos.Any());

            return repos;
        }

        public static async Task<GitRepository> GetRepositoryAsync(AzureContext context, string repoId, string projectId = null, Action<bool> OnSuccess = null)
        {
            var repo = await InternalGetRepositoryAsync(context, repoId, projectId);
            OnSuccess?.Invoke(repo != null);

            return repo;
        }

        private static async Task<GitRepository> InternalGetRepositoryAsync(AzureContext context, string repoId, string projectId)
        {
            if (context.ConnectionSettings.TryGetValue(repoId, out GitRepository repo))
            {
                return repo;
            }
            else
            {
                VssConnection connection = context.Connection;
                GitHttpClient gitClient = connection.GetClient<GitHttpClient>();

                repo = string.IsNullOrEmpty(projectId)
                    ? await gitClient.GetRepositoryAsync(projectId, repoId)
                    : await gitClient.GetRepositoryAsync(repoId);
            }

            if (repo != null)
            {
                context.ConnectionSettings.SetValue(repoId, repo);
            }
            else
            {
                // create a project here?
                throw new NoRepositoryFoundException($"No repos found with Id: {repoId}");
            }

            return repo;
        }
    }
}
