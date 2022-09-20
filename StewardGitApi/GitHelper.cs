using System;
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
    internal class GitHelper
    {
        //TODO simplify branch naming scheme, use commitId SHA-1
        private const string _autogenBranchNameRoot = "steward-api-autogen/vusername-383jgi";

        internal static async Task<TeamProjectReference> GetProjectAsync(AzureContext context)
        {
            var pId = context.Settings.ProjectId.ToString();

            if (context.Settings.TryGetValue(pId, out TeamProjectReference projectRef))
            {
                return projectRef;
            }
            else
            {
                ProjectHttpClient projectClient = context.Connection.GetClient<ProjectHttpClient>();

                projectRef = await projectClient.GetProject(pId).ConfigureAwait(false);
            }

            if (projectRef != null)
            {
                context.Settings.SetValue(pId, projectRef);
            }
            else
            {
                // TODO ret null?
                throw new ProjectNotFoundException($"No project found with id: {pId}");
            }

            return projectRef;
        }

        internal static async Task<Organization> GetOrganizationAsync(AzureContext context, string organizationId)
        {
            VssConnection connection = context.Connection;
            OrganizationHttpClient organizationHttpClient = connection.GetClient<OrganizationHttpClient>();
            return await organizationHttpClient.GetOrganizationAsync(organizationId).ConfigureAwait(false);
        }

        internal static Guid GetCurrentUserId(AzureContext context)
        {
            return context.Connection.AuthorizedIdentity.Id;
        }

        internal static string GetCurrentUserDisplayName(AzureContext context)
        {
            return context.Connection.AuthorizedIdentity.ProviderDisplayName;
        }

        internal static string GetCurrentUserUniqueName(AzureContext context)
        {
            // TODO get unique name (v-cactopus)
            //return context.Connection.AuthorizedIdentity.??
            throw new NotImplementedException();
        }

        internal static async Task<GitItem> GetItemAsync(AzureContext context, string path, GitObjectType gitObjectType)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            TeamProjectReference project = await GitHelper.GetProjectAsync(context);
            GitRepository repo = await GetRepositoryAsync(context);

            // get a filename we know exists
            List<GitItem> gitItems = await gitClient.GetItemsAsync(repo.Id, scopePath: path, recursionLevel: VersionControlRecursionType.OneLevel);
            string filename = gitItems.Where(o => o.GitObjectType == gitObjectType).FirstOrDefault().Path;

            // retrieve the contents of the file
            GitItem item = await gitClient.GetItemAsync(repo.Id, filename, includeContent: true);

            Console.WriteLine("File {0} at commit {1} is of length {2}", filename, item.CommitId, item.Content.Length);

            return item;
        }

        internal static async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(AzureContext context)
        {
            GitHttpClient gitHttpClient = context.Connection.GetClient<GitHttpClient>();
            var repos = await gitHttpClient.GetRepositoriesAsync(context.Settings.ProjectId).ConfigureAwait(false);
            return repos;
        }

        internal static async Task<GitRepository> GetRepositoryAsync(AzureContext context)
        {
            var (projectId, repoId) = context.Settings.Ids;

            if (context.Settings.TryGetValue(repoId.ToString(), out GitRepository repo))
            {
                return repo;
            }
            else
            {
                GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();

                repo = Guid.Empty == projectId
                    ? await gitClient.GetRepositoryAsync(repoId)
                    : await gitClient.GetRepositoryAsync(projectId, repoId);
            }

            if (repo != null)
            {
                context.Settings.SetValue(repoId.ToString(), repo);
            }
            else
            {
                // TODO ret null or create a project here?
                throw new NoRepositoryFoundException($"No repos found with Id: {repoId}");
            }

            return repo;
        }

        internal static async Task<GitPush> CommitAndPushAsync(AzureContext context, IEnumerable<CommitRefProxy> proxyChanges)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();

            TeamProjectReference project = await GetProjectAsync(context);
            GitRepository repo = await GetRepositoryAsync(context);

            // Find the default branch
            string defaultBranchName = WithoutRefsPrefix(repo.DefaultBranch);
            GitRef defaultBranch = (await gitClient.GetRefsAsync(repo.Id, filter: defaultBranchName)).First();

            // Craft the branch and commit that we'll push
            GitRefUpdate newBranch = new()
            {
                Name = $"refs/heads/{_autogenBranchNameRoot}",
                OldObjectId = defaultBranch.ObjectId,
            };

            // Create the push with the new branch and commit
            IEnumerable<GitCommitRef> gitChanges = ToGitCommitRef(proxyChanges);

            GitPush push = await gitClient.CreatePushAsync(new GitPush()
            {
                RefUpdates = new GitRefUpdate[] { newBranch },
                Commits = gitChanges, // GitCommitRef[]
            }, repo.Id);

            Console.WriteLine("project {0}, repo {1}", project.Name, repo.Name);
            Console.WriteLine("push {0} updated {1} to {2}", push.PushId, push.RefUpdates.First().Name, push.Commits.First().CommitId);

            // Now clean up, delete the branch
            _ = (await gitClient.UpdateRefsAsync(
               new GitRefUpdate[]
               {
                    new GitRefUpdate()
                    {
                        OldObjectId = push.RefUpdates.First().NewObjectId,
                        NewObjectId = new string('0', 40),
                        Name = push.RefUpdates.First().Name,
                    }
               },
               repositoryId: repo.Id).ConfigureAwait(false)).First();

            // Pushes and commits are immutable, so no way to clean them up
            // but the commit will be unreachable after this

            return push;
        }

        private static string WithoutRefsPrefix(string refName)
        {
            if (!refName.StartsWith("refs/"))
            {
                throw new ArgumentException("The ref name did not start with 'refs/'", nameof(refName));
            }
            return refName.Remove(0, "refs/".Length);
        }

        private static string GetUniqueRefId()
        {
            return Guid.NewGuid().ToString("D")[..6];
        }

        private static IEnumerable<GitCommitRef> ToGitCommitRef(IEnumerable<CommitRefProxy> proxyCommits)
        {
            List<GitCommitRef> commitRefs = new();

            foreach (var c in proxyCommits)
            {
                commitRefs.Add( new GitCommitRef
                {
                    Comment = $"{c.CommitComment}",
                    Changes = new GitChange[]
                    {
                        new GitChange()
                        {
                            ChangeType = c.VersionControlChangeType,
                            Item = new GitItem()
                            {
                                Path = $"/{_autogenBranchNameRoot}-{GetUniqueRefId()}/{c.PathToFile}"
                            },
                            NewContent = new ItemContent()
                            {
                                Content = $"{c.NewFileContent}",
                                ContentType = ItemContentType.RawText,
                            },
                        }
                    },
                });
            }

            return commitRefs;
        }
    }
}
