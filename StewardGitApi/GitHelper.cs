using System.Text;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Organization.Client;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitApi
{
    /// <summary>
    ///     Contains the git operation implementations.
    /// </summary>
    internal class GitHelper
    {
        private const string AutogenBranchNameRoot = "steward-api-autogen";
        private const int GitCommitHashLength = 40;

        /// <summary>
        ///     Gets the project from the current org that
        ///     matches the current <see cref="AzureContext.Settings"/>.ProjectId.
        /// </summary>
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

        /// <summary>
        ///     Gets the organization.
        /// </summary>
        internal static async Task<Organization> GetOrganizationAsync(AzureContext context, string organizationId)
        {
            VssConnection connection = context.Connection;
            OrganizationHttpClient organizationHttpClient = connection.GetClient<OrganizationHttpClient>();
            return await organizationHttpClient.GetOrganizationAsync(organizationId).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets current user id.
        /// </summary>
        internal static Guid GetCurrentUserId(AzureContext context)
        {
            return context.Connection.AuthorizedIdentity.Id;
        }

        /// <summary>
        ///     Gets current user display name.
        /// </summary>
        internal static string GetCurrentUserDisplayName(AzureContext context)
        {
            return context.Connection.AuthorizedIdentity.ProviderDisplayName;
        }

        /// <summary>
        ///     Gets an item from the repository.
        ///     Use GitObjectType to retrive blobs, commits, tags, refs or deltas.
        /// </summary>
        internal static async Task<GitItem> GetItemAsync(AzureContext context, string path, GitObjectType gitObjectType)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            TeamProjectReference project = await GetProjectAsync(context).ConfigureAwait(false);
            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);

            // get a filepath we know exists
            List<GitItem> gitItems = await gitClient.GetItemsAsync(
                repo.Id,
                scopePath: path,
                recursionLevel: VersionControlRecursionType.OneLevel).ConfigureAwait(false);

            string filepath = gitItems.Where(o => o.GitObjectType == gitObjectType).FirstOrDefault().Path;

            // retrieve the contents of the file
            GitItem item = await gitClient.GetItemAsync(repo.Id, filepath, includeContent: true).ConfigureAwait(false);

            return item;
        }

        /// <summary>
        ///     Gets a list of repositories from the current project.
        /// </summary>
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

        /// <summary>
        ///     Gets a repository from the current project that
        ///     matches the current <see cref="AzureContext.Settings"/>.RepoId.
        /// </summary>
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

        /// <summary>
        ///     Gets pull request statuses.
        ///     A <c>null</c> <paramref name="mostRecent"/> will
        ///     retrive the repo's entire pull request status history.
        /// </summary>
        internal static async Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(AzureContext context, int? mostRecent = null)
        {
            IEnumerable<GitPullRequest> gitPullRequests = await GetPullRequestsIntoDefaultBranchAsync(context, mostRecent: mostRecent).ConfigureAwait(false);
            return gitPullRequests.Select(pr => pr.Status);
        }

        /// <summary>
        ///     Gets a pull request by id.
        /// </summary>
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

        /// <summary>
        ///     Creates a pull request.
        /// </summary>
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

        /// <summary>
        ///     Get pull requests scheduled for merge into the default branch.
        ///     A <c>null</c> <paramref name="mostRecent"/> will
        ///     retrieve all matching pull requests.
        /// </summary>
        internal static async Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(
            AzureContext context,
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

        /// <summary>
        ///     Commits and pushes content changes
        ///     represented by <paramref name="proxyChanges"/>.
        /// </summary>
        internal static async Task<GitPush> CommitAndPushAsync(AzureContext context, IEnumerable<CommitRefProxy> proxyChanges)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();

            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);

            // Find the default branch
            string defaultBranchName = WithoutRefsPrefix(repo.DefaultBranch);
            GitRef defaultBranch = (await gitClient.GetRefsAsync(repo.Id, filter: defaultBranchName).ConfigureAwait(false)).First();

            // Craft the new branch that we'll push
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
                    Commits = gitChanges,
                }, repo.Id).ConfigureAwait(false);

            return push;
        }

        /// <summary>
        ///     Deletes a branch pushed to.
        /// </summary>
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

        /// <summary>
        ///     Deletes an udpated branch.
        /// </summary>
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

        /// <summary>
        ///     Deletes a branch.
        /// </summary>
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

        /// <summary>
        /// Abandons pull request.
        /// </summary>
        internal static async Task<GitPullRequest> AbandonPullRequestAsync(AzureContext context, int pullRequestId)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();

            var repoId = context.Settings.Ids.repoId;

            GitPullRequest updatedPr = new ()
            {
                Status = PullRequestStatus.Abandoned,
            };

            var pullRequest = await gitClient.UpdatePullRequestAsync(updatedPr, repoId, pullRequestId).ConfigureAwait(false);

            return pullRequest;
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
                    Comment = c.CommitComment,
                    Changes = new GitChange[]
                    {
                        new GitChange()
                        {
                            ChangeType = c.VersionControlChangeType,
                            Item = new GitItem()
                            {
                                Path = c.PathToFile,
                            },
                            NewContent = new ItemContent()
                            {
                                Content = c.NewFileContent,
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
