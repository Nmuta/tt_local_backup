using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Organization.Client;
using System.Runtime.Serialization;

namespace StewardGitApi
{
    /// <summary>
    ///     Manages Steward's Azure DevOps git operations.
    /// </summary>
    public class AzureDevOpsManager : IAzureDevOpsManager
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="AzureDevOpsManager"/> class.
        /// </summary>
        public AzureDevOpsManager(Uri organizationUrl, VssBasicCredential credential, RepoSettings connectionSettings)
        {
            this.AzureContext = new AzureContext(organizationUrl, credential, connectionSettings);
        }

        /// <inheritdoc/>
        public AzureContext AzureContext { get; }

        /// <inheritdoc/>
        public Guid GetCurrentUserId()
        {
            return GitHelper.GetCurrentUserId(this.AzureContext);
        }

        /// <inheritdoc/>
        public string GetCurrentUserDisplayName()
        {
            return GitHelper.GetCurrentUserDisplayName(this.AzureContext);
        }

        /// <inheritdoc/>
        public async Task<Organization> GetOrganizationAsync(string organizationId)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetOrganizationAsync(this.AzureContext, organizationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<TeamProjectReference> GetProjectAsync()
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetProjectAsync(this.AzureContext).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitRepository> GetRepositoryAsync()
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            return await GitHelper.GetRepositoryAsync(this.AzureContext).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitRepository>> GetRepositoriesAsync(Action<bool> onSuccess = null)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            IEnumerable<GitRepository> repos = await GitHelper.GetRepositoriesAsync(this.AzureContext).ConfigureAwait(false);
            onSuccess?.Invoke(repos.Any());
            return repos;
        }

        /// <inheritdoc/>
        public async Task<GitItem> GetItemAsync(string path, GitObjectType gitObjectType, Action<bool> onSuccess = null)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            GitItem item = await GitHelper.GetItemAsync(this.AzureContext, path, gitObjectType).ConfigureAwait(false);
            onSuccess?.Invoke(item != null);
            return item;
        }

        /// <inheritdoc/>
        public async Task<GitPush> CreateNewFileAndPushAsync(CommitRefProxy changeToPush, Action<bool> onSuccess = null)
        {
            _ = changeToPush.CheckForNull(nameof(changeToPush));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            GitPush gitPush = await GitHelper.CommitAndPushAsync(this.AzureContext, new CommitRefProxy[] { changeToPush }).ConfigureAwait(false);
            onSuccess?.Invoke(gitPush != null);
            return gitPush;
        }

        /// <inheritdoc/>
        public async Task<GitPush> CommitAndPushAsync(IEnumerable<CommitRefProxy> changesToPush, Action<bool> onSuccess = null)
        {
            _ = changesToPush.CheckForNullOrEmpty(nameof(changesToPush));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            GitPush gitPush = await GitHelper.CommitAndPushAsync(this.AzureContext, changesToPush).ConfigureAwait(false);
            onSuccess?.Invoke(gitPush != null);
            return gitPush;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<PullRequestStatus>> GetPullRequestStatusAsync(int? mostRecent = null, Action<bool> onSuccess = null)
        {
            _ = mostRecent.CheckForGreaterThanZero(nameof(mostRecent));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            IEnumerable<PullRequestStatus> prStatuses = await GitHelper.GetPullRequestStatusAsync(this.AzureContext, mostRecent).ConfigureAwait(false);
            onSuccess?.Invoke(prStatuses.Any());
            return prStatuses;
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> GetPullRequestAsync(int pullRequestId, Action<bool> onSuccess = null)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            GitPullRequest pullRequest = await GitHelper.GetPullRequestAsync(this.AzureContext, pullRequestId).ConfigureAwait(false);
            onSuccess?.Invoke(pullRequest != null);
            return pullRequest;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitPullRequest>> GetPullRequestsIntoDefaultBranchAsync(PullRequestStatus status, int? mostRecent = null, Action<bool> onSuccess = null)
        {
            _ = mostRecent.CheckForGreaterThanZero(nameof(mostRecent));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            IEnumerable<GitPullRequest> pullRequests = await GitHelper.GetPullRequestsIntoDefaultBranchAsync(this.AzureContext, status, mostRecent).ConfigureAwait(false);
            onSuccess?.Invoke(true);
            return pullRequests;
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> CreatePullRequestAsync(GitPush push, string title, string description, Action<bool> onSuccess = null)
        {
            _ = Check.CheckForNull(push, nameof(push));
            _ = Check.CheckForNullEmptyOrWhiteSpace(new string[] { title, description });
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);

            // Kick off a pipeline run to format the branch
            await this.RunFormatPipeline(push.RefUpdates.FirstOrDefault().Name).ConfigureAwait(false);

            GitPullRequest pullRequest = await GitHelper.CreatePullRequestAsync(this.AzureContext, push, title, description).ConfigureAwait(false);
            onSuccess?.Invoke(pullRequest != null);
            return pullRequest;
        }

        /// <summary>
        /// Kick off a build to format the provided branch.
        /// </summary>
        /// <param name="branch">Branch to format.</param>
        /// <returns>Started Build</returns>
        public async Task<Build> RunFormatPipeline(string branch)
        {
            _ = Check.CheckForNullEmptyOrWhiteSpace(branch, nameof(branch));

            if (branch.StartsWith("refs/heads/", StringComparison.OrdinalIgnoreCase))
            {
                branch = branch.Substring(11);
            }

            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);

            var buildClient = this.AzureContext.Connection.GetClient<BuildHttpClient>();
            var projectClient = this.AzureContext.Connection.GetClient<ProjectHttpClient>();

            var project = projectClient.GetProject(this.AzureContext.Settings.Ids.projectId.ToString()).Result;
            var buildDefinition = buildClient.GetDefinitionAsync(this.AzureContext.Settings.Ids.projectId, 376).Result;

            var build = new BuildWithTemplateParameters()
            {
                Definition = buildDefinition,
                Project = project,
                SourceBranch = branch,
            };
            build.TemplateParameters.Add("branch", branch);

            return await buildClient.QueueBuildAsync(build).ConfigureAwait(false);
        }

        /// <summary>
        /// Extended build class that provides template parameters for the pipeline.
        /// </summary>
        public class BuildWithTemplateParameters : Build
        {
            [DataMember(EmitDefaultValue = false)]
            public Dictionary<string, string> TemplateParameters = new Dictionary<string, string>();
        }

        /// <inheritdoc/>
        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitRef gitRef, Action<bool> onSuccess = null)
        {
            _ = gitRef.CheckForNull(nameof(gitRef));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            GitRefUpdateResult result = await GitHelper.DeleteBranchAsync(this.AzureContext, gitRef).ConfigureAwait(false);
            onSuccess?.Invoke(result.Success);
            return result;
        }

        /// <inheritdoc/>
        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitPush gitPush, Action<bool> onSuccess = null)
        {
            _ = gitPush.CheckForNull(nameof(gitPush));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            GitRefUpdateResult result = await GitHelper.DeleteBranchAsync(this.AzureContext, gitPush).ConfigureAwait(false);
            onSuccess?.Invoke(result.Success);
            return result;
        }

        /// <inheritdoc/>
        public async Task<GitRefUpdateResult> DeleteBranchAsync(GitRefUpdate gitRefUpdate, Action<bool> onSuccess = null)
        {
            _ = gitRefUpdate.CheckForNull(nameof(gitRefUpdate));
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            GitRefUpdateResult result = await GitHelper.DeleteBranchAsync(this.AzureContext, gitRefUpdate).ConfigureAwait(false);
            onSuccess?.Invoke(result.Success);
            return result;
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> AbandonPullRequestAsync(int pullRequestId)
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            var pullrequest = await GitHelper.AbandonPullRequestAsync(this.AzureContext, pullRequestId).ConfigureAwait(false);
            return pullrequest;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitRef>> GetAllBranchesAsync()
        {
            await this.AzureContext.Connection.ConnectAsync().ConfigureAwait(false);
            var branches = await GitHelper.GetAllBranchesAsync(this.AzureContext).ConfigureAwait(false);
            return branches;
        }
    }
}
