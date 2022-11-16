using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

using Microsoft.VisualStudio.Services.Common;

namespace StewardGitApi
{
    /// <summary>
    ///     Factory interface.
    /// </summary>
    public interface IAzureDevOpsFactory
    {
        /// <summary>
        ///     Factory creation method.
        /// </summary>
        public IAzureDevOpsManager Create(string orgUrl, string personalAccessToken, Guid projectId, Guid repoId);
    }

    /// <summary>
    ///     The AzureDevOps factory class.
    /// </summary>
    public class AzureDevOpsFactory : IAzureDevOpsFactory
    {
        /// <summary>
        ///     Creates a manager instance.
        /// </summary>
        public IAzureDevOpsManager Create(string orgUrl, string personalAccessToken, Guid projectId, Guid repoId)
        {
            return new AzureDevOpsManager(
                new Uri(orgUrl),
                new VssBasicCredential(string.Empty, personalAccessToken),
                new RepoSettings(projectId, repoId));
        }
    }
}
