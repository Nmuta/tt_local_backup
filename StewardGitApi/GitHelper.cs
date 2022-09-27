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
        private const string AutogenBranchNameRoot = "steward-api-autogen";
        private const int GitCommitHashLength = 40;

        internal static async Task<TeamProjectReference> GetProjectAsync(AzureContext context)
        {
            string projectId = context.Settings.Ids.projectId.ToString();

            if (context.Settings.TryGetValue(projectId, out TeamProjectReference project))
            {
                return project;
            }
            else
            {
                ProjectHttpClient projectClient = context.Connection.GetClient<ProjectHttpClient>();

                try
                {
                    project = await projectClient.GetProject(projectId).ConfigureAwait(false);
                    context.Settings.CacheValue(projectId, project);
                }
                catch (ProjectDoesNotExistException) { project = null; }
            }

            return project;
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
            TeamProjectReference project = await GetProjectAsync(context).ConfigureAwait(false);
            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);

            // get a filename we know exists
            List<GitItem> gitItems = await gitClient.GetItemsAsync(
                repo.Id,
                scopePath: path,
                recursionLevel: VersionControlRecursionType.OneLevel).ConfigureAwait(false);

            string filename = gitItems.Where(o => o.GitObjectType == gitObjectType).FirstOrDefault().Path;

            // retrieve the contents of the file
            GitItem item = await gitClient.GetItemAsync(repo.Id, filename, includeContent: true).ConfigureAwait(false);

            return item;
        }

        internal static async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(AzureContext context)
        {
            GitHttpClient gitHttpClient = context.Connection.GetClient<GitHttpClient>();
            (Guid projectId, Guid _) = context.Settings.Ids;
            try
            {
                return await gitHttpClient.GetRepositoriesAsync(projectId).ConfigureAwait(false);
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
                    repo = projectId == Guid.Empty
                        ? await gitClient.GetRepositoryAsync(repoId).ConfigureAwait(false)
                        : await gitClient.GetRepositoryAsync(projectId, repoId).ConfigureAwait(false);

                    context.Settings.CacheValue(repoId.ToString(), repo);
                }
                catch (VssServiceException) { repo = null; }
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

            var pr = await gitClient.CreatePullRequestAsync(
                new GitPullRequest()
                {
                    SourceRefName = push.RefUpdates.First().Name,
                    TargetRefName = repo.DefaultBranch,
                    Title = $"{title}",
                    Description = $"{description}",
                },
                projectId,
                repo.Id).ConfigureAwait(false);

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
                },
                top: mostRecent).ConfigureAwait(false);

            return prs;
        }

        internal static async Task<GitPush> CommitAndPushAsync(AzureContext context, IEnumerable<CommitRefProxy> proxyChanges)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();

            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);

            // Find the default branch
            string defaultBranchName = WithoutRefsPrefix(repo.DefaultBranch);
            GitRef defaultBranch = (await gitClient.GetRefsAsync(repo.Id, filter: defaultBranchName).ConfigureAwait(false)).First();

            // Craft the branch and commit that we'll push
            string refId = GetUniqueRefId();
            GitRefUpdate newBranch = new ()
            {
                Name = $"refs/heads/{BuildBranchName(context, refId)}",
                OldObjectId = defaultBranch.ObjectId,
            };

            // Create the push with the new branch and commit
            IEnumerable<GitCommitRef> gitChanges = ToGitCommitRef(proxyChanges);

            GitPush push = await gitClient.CreatePushAsync(
                new GitPush()
                {
                    RefUpdates = new GitRefUpdate[] { newBranch },
                    Commits = gitChanges, // GitCommitRef[]
                }, repo.Id).ConfigureAwait(false);

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
                        NewObjectId = new string('0', GitCommitHashLength),
                        Name = push.RefUpdates.First().Name,
                    },
               },
               repositoryId: repoId).ConfigureAwait(false)).First();

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
                        NewObjectId = new string('0', GitCommitHashLength),
                        Name = refUpdate.Name,
                    },
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
                        NewObjectId = new string('0', GitCommitHashLength),
                        Name = gitRef.Name,
                    },
               },
               repositoryId: repoId).ConfigureAwait(false)).First();

            return refDeleteResult;
        }

        private static string WithoutRefsPrefix(string refName)
        {
            if (!refName.StartsWith("refs/", StringComparison.InvariantCulture))
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
            StringBuilder sb = new StringBuilder();
            sb.Append(AutogenBranchNameRoot);
            sb.Append('/');
            var name = string.Concat(GetCurrentUserDisplayName(context).Split()); // removes whitespace
            sb.Append(name);
            sb.Append('-');
            sb.Append(refId);
            return sb.ToString();
        }

        private static IEnumerable<GitCommitRef> ToGitCommitRef(IEnumerable<CommitRefProxy> proxyCommits)
        {
            List<GitCommitRef> commitRefs = new ();

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
                                Path = $"/{c.PathToFile}",
                            },
                            NewContent = new ItemContent()
                            {
                                Content = $"{c.NewFileContent}",
                                ContentType = ItemContentType.RawText,
                            },
                        },
                    },
                });
            }

            return commitRefs;
        }
    }
}
