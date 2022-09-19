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
        internal static async Task<GitItem> GetItemAsync(AzureContext context, string path, string repoId, string projectId, GitObjectType gitObjectType)
        {
            VssConnection connection = context.Connection;
            GitHttpClient gitClient = connection.GetClient<GitHttpClient>();

            TeamProjectReference project = await ClientHelper.GetProjectAsync(context, projectId);
            GitRepository repo = await GetRepositoryAsync(context, repoId, projectId);

            // get a filename we know exists
            List<GitItem> gitItems = await gitClient.GetItemsAsync(repo.Id, scopePath: path, recursionLevel: VersionControlRecursionType.OneLevel);
            string filename = gitItems.Where(o => o.GitObjectType == gitObjectType).FirstOrDefault().Path;

            // retrieve the contents of the file
            GitItem item = await gitClient.GetItemAsync(repo.Id, filename, includeContent: true);

            Console.WriteLine("File {0} at commit {1} is of length {2}", filename, item.CommitId, item.Content.Length);

            return item;
        }

        internal static async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(AzureContext context, string projectId)
        {
            GitHttpClient gitHttpClient = context.Connection.GetClient<GitHttpClient>();

            var repos = await gitHttpClient.GetRepositoriesAsync(projectId);

            return repos;
        }

        internal static async Task<GitRepository> GetRepositoryAsync(AzureContext context, string repoId, string projectId)
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
                // TODO ret null or create a project here?
                throw new NoRepositoryFoundException($"No repos found with Id: {repoId}");
            }

            return repo;
        }
    }
}
