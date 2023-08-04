using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Obligation.UpstreamModels;
using Turn10.LiveOps.StewardApi.Providers.MsGraph;
using static Kusto.Data.Common.CslCommandGenerator;
using static Microsoft.VisualStudio.Services.Graph.GraphResourceIds;

namespace Turn10.LiveOps.StewardApi.Providers.MsGraph
{
    /// <inheritdoc />
    public sealed class MsGraphService : IMsGraphService
    {
        private readonly GraphServiceClient graphServiceClient;
        private readonly string servicePrincipalId;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MsGraphService"/> class.
        /// </summary>
        public MsGraphService(
            GraphServiceClient graphServiceClient,
            string servicePrincipalId)
        {
            graphServiceClient.ShouldNotBeNull(nameof(graphServiceClient));
            servicePrincipalId.ShouldNotBeNull(nameof(servicePrincipalId));

            this.graphServiceClient = graphServiceClient;
            this.servicePrincipalId = servicePrincipalId;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<StewardUser>> GetAadAppUsersAsync()
        {
            var appRoles = await this.GetAadAppRolesAsync().ConfigureAwait(true);
            var principal = this.graphServiceClient.ServicePrincipals[this.servicePrincipalId];
            var request = principal.AppRoleAssignedTo.Request();
            var roleAssignments = new List<AppRoleAssignment>();

            while (request != null)
            {
                var response = await request.GetAsync().ConfigureAwait(false);
                request = response.NextPageRequest ?? null;
                roleAssignments.AddRange((IEnumerable<AppRoleAssignment>)response);
            }

            var users = new List<StewardUser>();
            foreach (var user in roleAssignments)
            {
                var userRole = appRoles.Where(role => role.Id == user.AppRoleId).FirstOrDefault();
                if (userRole == null || user.PrincipalType != "User")
                {
                    continue;
                }

                users.Add(new StewardUser()
                {
                    ObjectId = user.PrincipalId.ToString(),
                    Name = user.PrincipalDisplayName,
                    Role = userRole.Value,
                });
            }

            return users;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<AppRole>> GetAadAppRolesAsync()
        {
            var principal = this.graphServiceClient.ServicePrincipals[this.servicePrincipalId];
            var response = await principal.Request().GetAsync().ConfigureAwait(false);

            return (IEnumerable<AppRole>)response.AppRoles;
        }

        /// <inheritdoc />
        public async Task<User> GetAadUserAsync(string userId)
        {
            var user = this.graphServiceClient.Users[userId];
            var response = await user.Request().GetAsync().ConfigureAwait(false);

            return response;
        }
    }
}
