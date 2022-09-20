using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.TeamFoundation.Core.WebApi;
using Microsoft.VisualStudio.Services.Organization.Client;
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
    }
}
