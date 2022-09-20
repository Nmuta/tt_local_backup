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
        internal static async Task<GitItem> GetItemAsync(AzureContext context, string path, GitObjectType gitObjectType)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            TeamProjectReference project = await ClientHelper.GetProjectAsync(context);
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

        public static async Task<GitPush> CreateNewFilePush(AzureContext context, string commitComment, string filePathOnRepo, string content)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            var (pId, rId) = context.Settings.Ids;

            TeamProjectReference project = await ClientHelper.GetProjectAsync(context);
            GitRepository repo = await GetRepositoryAsync(context);

            // we will create a new push by making a small change to the default branch
            // first, find the default branch
            string defaultBranchName = WithoutRefsPrefix(repo.DefaultBranch);
            GitRef defaultBranch = (await gitClient.GetRefsAsync(repo.Id, filter: defaultBranchName)).First();

            // next, craft the branch and commit that we'll push
            GitRefUpdate newBranch = new GitRefUpdate()
            {
                Name = $"refs/heads/steward-git-api", // TODO determine pattern later
                OldObjectId = defaultBranch.ObjectId,
            };
            //string newFileName = $"{filename}"; // get filename from filePathOnRepo
            GitCommitRef newCommit = new GitCommitRef()
            {
                Comment = $"{commitComment}",
                Changes = new GitChange[]
                {
                    new GitChange()
                    {
                        ChangeType = VersionControlChangeType.Add,
                        Item = new GitItem() { Path = $"/steward-git-api/{filePathOnRepo}" }, // this path should match repo, get from filename after push
                        NewContent = new ItemContent()
                        {
                            Content = $"{content}# Thank you for using VSTS!",
                            ContentType = ItemContentType.RawText,
                        },
                    }
                },
            };

            // create the push with the new branch and commit
            GitPush push = gitClient.CreatePushAsync(new GitPush()
            {
                RefUpdates = new GitRefUpdate[] { newBranch },
                Commits = new GitCommitRef[] { newCommit },
            }, repo.Id).Result;

            Console.WriteLine("project {0}, repo {1}", project.Name, repo.Name);
            Console.WriteLine("push {0} updated {1} to {2}",
                push.PushId, push.RefUpdates.First().Name, push.Commits.First().CommitId);

            // now clean up after ourselves (and in case logging is on, don't log these calls)
            //ClientSampleHttpLogger.SetSuppressOutput(this.Context, true);

            // delete the branch
            GitRefUpdateResult refDeleteResult = gitClient.UpdateRefsAsync(
                new GitRefUpdate[]
                {
                    new GitRefUpdate()
                    {
                        OldObjectId = push.RefUpdates.First().NewObjectId,
                        NewObjectId = new string('0', 40),
                        Name = push.RefUpdates.First().Name,
                    }
                },
                repositoryId: repo.Id).Result.First();

            // pushes and commits are immutable, so no way to clean them up
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
    }
}
