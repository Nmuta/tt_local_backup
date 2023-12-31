﻿using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Organization.Client;
using Microsoft.VisualStudio.Services.WebApi;
using System.Runtime.Serialization;

namespace StewardGitApi
{
    /// <summary>
    ///     Contains the git operation implementations.
    /// </summary>
    internal static class GitHelper
    {
        private const string AutogenBranchName = "steward-api-autogen";
        // TODO: This is a hotfix. Currently we only integrate with Steelhead repo but in the future this helper SHOULD NOT know anything title-specific (lugeiken 10/16/2023)
        // https://dev.azure.com/t10motorsport/ForzaTech/_workitems/edit/1634273
        private const string SteelheadPlaytestBranch = "refs/heads/steelhead-playtest";
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
                    if (project == null)
                    {
                        throw new GitOperationException($"Project is in an unexpected state. Project Id: {projectId}");
                    }

                    context.Settings.CacheValue(projectId, project);
                }
                catch (ProjectDoesNotExistException ex)
                {
                    throw new GitOperationException("Project does not exist", ex);
                }
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
            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);
            var projectId = context.Settings.Ids.projectId;

            // get a filepath we know exists
            List<GitItem> gitItems = await gitClient.GetItemsAsync(
                projectId,
                repo.Id,
                scopePath: path,
                recursionLevel: VersionControlRecursionType.OneLevel).ConfigureAwait(false);

            string filepath = gitItems.Where(o => o.GitObjectType == gitObjectType).FirstOrDefault().Path;

            // retrieve the contents of the file
            GitItem item = await gitClient.GetItemAsync(repo.Id, filepath, includeContent: true).ConfigureAwait(false);

            return item;
        }

        /// <summary>
        ///     Gets a list of items from the repository.
        /// </summary>
        internal static async Task<IEnumerable<GitItem>> ListItemsAsync(AzureContext context, string path)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);
            var projectId = context.Settings.Ids.projectId;

            List<GitItem> gitItems = await gitClient.GetItemsAsync(
                projectId,
                repo.Id,
                scopePath: path,
                recursionLevel: VersionControlRecursionType.OneLevel).ConfigureAwait(false);

            return gitItems;
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
            catch (ProjectDoesNotExistException e)
            {
                throw new GitOperationException("Project does not exist", e);
            }
        }

        /// <summary>
        ///     Gets a repository from the current project that
        ///     matches the <see cref="AzureContext.Settings"/>.RepoId.
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

                    if (repo == null)
                    {
                        throw new GitOperationException($"Repository is in an unexpected state. Project Id: {projectId}, Repo Id: {repoId}");
                    }

                    context.Settings.CacheValue(repoId.ToString(), repo);
                }
                catch (VssServiceException e)
                {
                    throw new GitOperationException("The repository returned null", e);
                }
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
            IEnumerable<GitPullRequest> gitPullRequests = await GetPullRequestsIntoPlaytestBranchAsync(context, mostRecent: mostRecent).ConfigureAwait(false);
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
                var pr = await gitClient.GetPullRequestAsync(projectId, repo.Id, pullRequestId).ConfigureAwait(false);

                return pr ?? throw new GitOperationException($"Pull request is in an unexpected state. " +
                        $"Pull Request Id: {pullRequestId}, Project Id: {projectId}, Repo Id: {repo.Id}");
            }
            catch (Exception e) when (e is VssException or ProjectDoesNotExistException)
            {
                throw new GitOperationException("Cannot retrieve pull request", e);
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
                    TargetRefName = SteelheadPlaytestBranch,
                    Title = $"{title}",
                    Description = $"{description}",
                },
                projectId,
                repo.Id).ConfigureAwait(false);

            return pr;
        }

        /// <summary>
        ///     Get pull requests scheduled for merge into the playtest branch.
        ///     A <c>null</c> <paramref name="mostRecent"/> will
        ///     retrieve all matching pull requests.
        /// </summary>
        internal static async Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoPlaytestBranchAsync(
            AzureContext context,
            PullRequestStatus status = PullRequestStatus.NotSet,
            int? mostRecent = null)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();

            TeamProjectReference project = await GetProjectAsync(context).ConfigureAwait(false);
            GitRepository repo = await GetRepositoryAsync(context).ConfigureAwait(false);

            List<GitPullRequest> prs = await gitClient.GetPullRequestsAsync(
                project.Id,
                repo.Id,
                new GitPullRequestSearchCriteria()
                {
                    TargetRefName = SteelheadPlaytestBranch,
                    Status = status,
                },
                top: mostRecent).ConfigureAwait(false);

            // For some reason, the WebUrl property in the repository object of each PR is null
            prs.ForEach(x => x.Repository.WebUrl = repo.WebUrl);
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

            // Find the playtest branch
            GitRef playtestBranch = await GetBranchAsync(context, SteelheadPlaytestBranch).ConfigureAwait(false);

            // Craft the new branch that we'll push. Based on name of author.
            GitRefUpdate newBranch = new()
            {
                Name = $"refs/heads/{BuildBranchName(context, proxyChanges.First().AuthorName ?? AutogenBranchName)}",
                OldObjectId = playtestBranch.ObjectId,
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
        ///     Abandons pull request.
        /// </summary>
        internal static async Task<GitPullRequest> AbandonPullRequestAsync(AzureContext context, int pullRequestId, bool deleteSourceBranch)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();

            var repoId = context.Settings.Ids.repoId;

            GitPullRequest updatedPr = new()
            {
                Status = PullRequestStatus.Abandoned,
            };

            GitPullRequest pullRequest = await gitClient.UpdatePullRequestAsync(updatedPr, repoId, pullRequestId).ConfigureAwait(false);

            if (deleteSourceBranch)
            {
                GitRef gitref = await GitHelper.GetBranchAsync(context, pullRequest.SourceRefName).ConfigureAwait(false);

                if (gitref != null)
                {
                    await GitHelper.DeleteBranchAsync(context, gitref).ConfigureAwait(false);
                }
            }

            return pullRequest;
        }

        /// <summary>
        ///     Gets a single branch.
        /// </summary>
        internal static async Task<GitRef> GetBranchAsync(AzureContext context, string branchName)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            (_, Guid repoId) = context.Settings.Ids;

            var branchNameNoRefs = WithoutRefsPrefix(branchName);

            GitRef aref = (await gitClient.GetRefsAsync(repoId, filter: branchNameNoRefs).ConfigureAwait(false)).FirstOrDefault();

            return aref;
        }

        /// <summary>
        ///     Gets all branches.
        /// </summary>
        internal static async Task<IEnumerable<GitRef>> GetAllBranchesAsync(AzureContext context)
        {
            GitHttpClient gitClient = context.Connection.GetClient<GitHttpClient>();
            (_, Guid repoId) = context.Settings.Ids;

            List<GitRef> refs = await gitClient.GetRefsAsync(repoId, filter: "heads/").ConfigureAwait(false);

            return refs;
        }

        /// <summary>
        ///     Kick off a pipeline on the branch.
        /// </summary>
        internal static async Task<Build> RunPipelineAsync(AzureContext context, string branch, int buildDefinition)
        {
            if (branch.StartsWith("refs/heads/", StringComparison.OrdinalIgnoreCase))
            {
                branch = branch[11..];
            }

            var buildClient = context.Connection.GetClient<BuildHttpClient>();

            var project = await GetProjectAsync(context).ConfigureAwait(false);
            var definition = await buildClient.GetDefinitionAsync(project.Id, buildDefinition).ConfigureAwait(false);

            var build = new BuildWithTemplateParameters
            {
                Definition = definition,
                Project = project,
                SourceBranch = branch,
                TemplateParameters = new Dictionary<string, string>() { { "branch", branch } },
            };

            return await buildClient.QueueBuildAsync(build).ConfigureAwait(false);
        }

        private static string WithoutRefsPrefix(string refName)
        {
            if (!refName.StartsWith("refs/", StringComparison.InvariantCulture))
            {
                throw new ArgumentException("Invalid ref. The ref name did not start with 'refs/'", nameof(refName));
            }

            return refName.Remove(0, "refs/".Length);
        }

        private static string GetUniqueRefId()
        {
            return Guid.NewGuid().ToString("D")[..6];
        }

        private static string BuildBranchName(AzureContext context, string authorName)
        {
            // concat split removes whitespace
            var stewardName = GetCurrentUserDisplayName(context).RemoveWhiteSpace();
            var authorNameConcat = authorName.RemoveWhiteSpace();
            return $"{stewardName}/{authorNameConcat}-{GetUniqueRefId()}";
        }

        private static string RemoveWhiteSpace(this string str)
        {
            Check.CheckForNull(str, nameof(str));
            return string.Concat(str.Split());
        }

        private static IEnumerable<GitCommitRef> ToGitCommitRef(IEnumerable<CommitRefProxy> proxyCommits)
        {
            List<GitCommitRef> commitRefs = new();

            foreach (var c in proxyCommits)
            {
                commitRefs.Add(new GitCommitRef
                {
                    Comment = c.CommitMessage,
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

        /// <summary>
        /// Extended build class that provides template parameters for the pipeline.
        /// </summary>
        private class BuildWithTemplateParameters : Build
        {
            [DataMember(EmitDefaultValue = false)]
            public Dictionary<string, string> TemplateParameters { get; set; }
        }
    }
}
