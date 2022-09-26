using System.Text;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Organization.Client;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitApi
{
    internal class GitHelper
    {
        private const string _autogenBranchNameRoot = "steward-api-autogen";
        private const int _gitCommitHashLength = 40;

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

                try
                {
                    projectRef = await projectClient.GetProject(pId).ConfigureAwait(false);
                }
                catch (ProjectDoesNotExistException) { projectRef = null; }
            }

            if (projectRef != null)
            {
                context.Settings.CacheValue(pId, projectRef);
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

        internal static async Task<GitItem> GetItemAsync(AzureContext context, string path, GitObjectType gitObjectType)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            TeamProjectReference project = await GetProjectAsync(context);
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
            try
            {
                return await gitHttpClient.GetRepositoriesAsync(context.Settings.ProjectId).ConfigureAwait(false);
            }
            catch (ProjectDoesNotExistException) { return new List<GitRepository>(); }
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

                try
                {
                    repo = Guid.Empty == projectId
                        ? await gitClient.GetRepositoryAsync(repoId)
                        : await gitClient.GetRepositoryAsync(projectId, repoId);
                }
                catch (VssServiceException) { repo = null; }
            }

            if (repo != null)
            {
                context.Settings.CacheValue(repoId.ToString(), repo);
            }

            return repo;
        }

        internal static async Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(AzureContext context, int? mostRecent = null)
        {
            IEnumerable<GitPullRequest> gitPullRequests = await GetPullRequestsIntoDefaultBranchAsync(context, mostRecent: mostRecent).ConfigureAwait(false);
            return gitPullRequests.Select(pr => pr.Status);
        }

        internal static async Task<GitPullRequest> GetPullRequestAsync(AzureContext context, int pullRequestId)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            (Guid projectId, _) = context.Settings.Ids;
            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);
            try
            {
                return await gitClient.GetPullRequestAsync(projectId, repo.Id, pullRequestId).ConfigureAwait(false);
            }
            catch (Exception e) when (e is VssException or ProjectDoesNotExistException)
            {
                return null;
            }
        }

        internal static async Task<GitPullRequest> CreatePullRequestAsync(AzureContext context, GitPush push, string title, string description)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            (Guid projectId, _) = context.Settings.Ids;

            var repo = await GetRepositoryAsync(context).ConfigureAwait(false);

            var pr = await gitClient.CreatePullRequestAsync(new GitPullRequest()
            {
                SourceRefName = push.RefUpdates.First().Name,
                TargetRefName = repo.DefaultBranch,
                Title = $"{title}",
                Description = $"{description}",
            },
            projectId,
            repo.Id).ConfigureAwait(false);

            Console.WriteLine("repo {0}", repo.Name);
            Console.WriteLine("{0} (#{1}) {2} -> {3}",
                pr.Title[..Math.Min(_gitCommitHashLength, pr.Title.Length)],
                pr.PullRequestId,
                pr.SourceRefName,
                pr.TargetRefName);

            return pr;
        }

        internal static async Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(AzureContext context,
            PullRequestStatus status = PullRequestStatus.NotSet,
            int? mostRecent = null)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();

            TeamProjectReference project = await GetProjectAsync(context).ConfigureAwait(false);
            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);

            string branchName = repo.DefaultBranch;

            List<GitPullRequest> prs = await gitClient.GetPullRequestsAsync(
                project.Id,
                repo.Id,
                new GitPullRequestSearchCriteria()
                {
                    TargetRefName = branchName,
                    Status = status,
                    // other search criteria
                },
                top: mostRecent).ConfigureAwait(false);

            Console.WriteLine("project {0}, repo {1}", project.Name, repo.Name);
            foreach (GitPullRequest pr in prs)
            {
                Console.WriteLine("{0} #{1} {2} -> {3}",
                    pr.Title[..Math.Min(_gitCommitHashLength, pr.Title.Length)],
                    pr.PullRequestId,
                    pr.SourceRefName,
                    pr.TargetRefName);
            }

            return prs;
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
            string refId = GetUniqueRefId();
            GitRefUpdate newBranch = new()
            {
                Name = $"refs/heads/{BuildBranchName(context, refId)}",
                OldObjectId = defaultBranch.ObjectId,
            };

            // Create the push with the new branch and commit
            IEnumerable<GitCommitRef> gitChanges = ToGitCommitRef(proxyChanges);

            GitPush push = await gitClient.CreatePushAsync(new GitPush()
            {
                RefUpdates = new GitRefUpdate[] { newBranch },
                Commits = gitChanges, // GitCommitRef[]
            }, repo.Id).ConfigureAwait(false);

            Console.WriteLine("project {0}, repo {1}", project.Name, repo.Name);
            Console.WriteLine("push {0} updated {1} to {2}", push.PushId, push.RefUpdates.First().Name, push.Commits.First().CommitId);

            return push;
        }

        internal static async Task<GitRefUpdateResult> DeleteBranchAsync(AzureContext context, GitPush push)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            (_, Guid repoId) = context.Settings.Ids;

            GitRefUpdateResult refDeleteResult = (await gitClient.UpdateRefsAsync(
               new GitRefUpdate[]
               {
                    new GitRefUpdate()
                    {
                        OldObjectId = push.RefUpdates.First().NewObjectId,
                        NewObjectId = new string('0', _gitCommitHashLength),
                        Name = push.RefUpdates.First().Name,
                    }
               },
               repositoryId: repoId).ConfigureAwait(false)).First();

            Console.WriteLine("deleted branch {0} (success={1} status={2})", refDeleteResult.Name, refDeleteResult.Success, refDeleteResult.UpdateStatus);

            // Pushes and commits are immutable, so no way to clean them up
            // but the commit will be unreachable after this

            return refDeleteResult;
        }

        internal static async Task<GitRefUpdateResult> DeleteBranchAsync(AzureContext context, GitRefUpdate refUpdate)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            (_, Guid repoId) = context.Settings.Ids;

            GitRefUpdateResult refDeleteResult = (await gitClient.UpdateRefsAsync(
               new GitRefUpdate[]
               {
                    new GitRefUpdate()
                    {
                        OldObjectId = refUpdate.NewObjectId,
                        NewObjectId = new string('0', _gitCommitHashLength),
                        Name = refUpdate.Name,
                    }
               },
               repositoryId: repoId).ConfigureAwait(false)).First();

            return refDeleteResult;
        }

        internal static async Task<GitRefUpdateResult> DeleteBranchAsync(AzureContext context, GitRef gitRef)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            (_, Guid repoId) = context.Settings.Ids;

            GitRefUpdateResult refDeleteResult = (await gitClient.UpdateRefsAsync(
               new GitRefUpdate[]
               {
                    new GitRefUpdate()
                    {
                        OldObjectId = gitRef.ObjectId,
                        NewObjectId = new string('0', _gitCommitHashLength),
                        Name = gitRef.Name,
                    }
               },
               repositoryId: repoId).ConfigureAwait(false)).First();

            return refDeleteResult;
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

        private static string BuildBranchName(AzureContext context, string refId)
        {
            StringBuilder sb = new();
            sb.Append(_autogenBranchNameRoot);
            sb.Append('/');
            var name = string.Concat(GetCurrentUserDisplayName(context).Split()); // removes whitespace
            sb.Append(name);
            sb.Append('-');
            sb.Append(refId);
            return sb.ToString();
        }

        private static IEnumerable<GitCommitRef> ToGitCommitRef(IEnumerable<CommitRefProxy> proxyCommits)
        {
            List<GitCommitRef> commitRefs = new();

            foreach (var c in proxyCommits)
            {
                commitRefs.Add(new GitCommitRef
                {
                    Comment = $"{c.CommitComment}",
                    Changes = new GitChange[]
                    {
                        new GitChange()
                        {
                            ChangeType = c.VersionControlChangeType,
                            Item = new GitItem()
                            {
                                Path = $"/{c.PathToFile}"
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
