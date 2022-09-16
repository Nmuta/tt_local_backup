using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.VisualStudio.Services.WebApi;

namespace StewardGitClient
{
    internal class ClientHelper
    {
        /// <summary>
        /// Finds a project in the current
        /// organization by name or id.
        /// </summary>
        /// <param name="context">The git operation context.</param>
        /// <param name="projectId">The project name or id.</param>
        /// <returns></returns>
        /// <exception cref="ProjectNotFoundException"></exception>
        public static async Task<TeamProjectReference> FindProjectByNameOrGuid(AzureContext context, string projectId)
        {
            if (context.TryGetValue(projectId, out TeamProjectReference project))
            {
                return project;
            }
            else
            {
                VssConnection connection = context.Connection;
                ProjectHttpClient projectClient = connection.GetClient<ProjectHttpClient>();

                project = await projectClient.GetProject(projectId).ConfigureAwait(false);
            }

            if (project != null)
            {
                context.SetValue(projectId, project);
            }
            else
            {
                throw new ProjectNotFoundException($"No project found with name: {projectId}");
            }

            return project;
        }

        public static Guid GetCurrentUserId(AzureContext context)
        {
            return context.Connection.AuthorizedIdentity.Id;
        }

        public static string GetCurrentUserDisplayName(AzureContext context)
        {
            return context.Connection.AuthorizedIdentity.ProviderDisplayName;
        }
    }
}
