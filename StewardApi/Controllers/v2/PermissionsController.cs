using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Kusto.Cloud.Platform.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Azure.KeyVault.Models;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;
using Turn10;
using Turn10.Data.Common;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using static System.Collections.Specialized.BitVector32;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2
{
    /// <summary>
    ///     Handles requests for woodstock permission management.
    /// </summary>
    [Route("api/v{version:apiVersion}/permissions")]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Agnostic, Topic.StewardPermissions)]
    public sealed class PermissionsController : V2ControllerBase
    {
        private readonly IStewardUserProvider userProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PermissionsController"/> class.
        /// </summary>
        public PermissionsController(IStewardUserProvider userProvider, IMapper mapper)
        {
            userProvider.ShouldNotBeNull(nameof(userProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.userProvider = userProvider;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets full permissions list.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(Dictionary<string, IList<string>>))]
        public async Task<IActionResult> GetAllPermissionsAsync()
        {
            var permAttributesFilePath = $"{Environment.CurrentDirectory}/JSON/all-attributes.json";
            var permAttributes = GetPermissionAttributes();

            var permAttributesAsString = JsonConvert.SerializeObject(permAttributes);
            System.IO.File.WriteAllText(permAttributesFilePath, permAttributesAsString);

            return this.Ok(permAttributes);
        }

        /// <summary>
        ///     Gets user permission attributes.
        /// </summary>
        [HttpGet("user/{userId}")]
        [SwaggerResponse(200, type: typeof(IEnumerable<AuthorizationAttribute>))]
        public async Task<IActionResult> GetUserPermissionsAsync(string userId)
        {
            var user = await this.userProvider.GetStewardUserAsync(userId).ConfigureAwait(true);
            if (user == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {userId})");
            }

            return this.Ok(user.Attributes);
        }

        /// <summary>
        ///     Sets user permission attributes.
        /// </summary>
        [HttpPost("user/{userId}")]
        [SwaggerResponse(200, type: typeof(IEnumerable<AuthorizationAttribute>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.StewardUser, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.None, StewardAction.Update, StewardSubject.UserPermissions)]
        [Authorize(Policy = UserAttribute.AdminFeature)]
        public async Task<IActionResult> SetUserPermissionsAsync(string userId, [FromBody] IEnumerable<AuthorizationAttribute> attributes)
        {
            var internalUser = await this.userProvider.GetStewardUserAsync(userId).ConfigureAwait(true);
            if (internalUser == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {userId})");
            }

            var user = this.mapper.SafeMap<StewardUser>(internalUser);
            user.Attributes = attributes;
            await this.userProvider.UpdateStewardUserAsync(user).ConfigureAwait(true);

            return this.Ok(attributes);
        }

        private Dictionary<string, IList<string>> GetPermissionAttributes()
        {
            var permissions = new Dictionary<string, IList<string>>();

            var collection = this.HttpContext.RequestServices
                .GetService(typeof(IActionDescriptorCollectionProvider)) as ActionDescriptorCollectionProvider;

            foreach (var descriptor in collection.ActionDescriptors.Items)
            {
                var cad = descriptor as ControllerActionDescriptor;
                var allActions = cad.MethodInfo.GetCustomAttributes(typeof(AuthorizeAttribute), true)
                        .Where(attr => (attr as AuthorizeAttribute).Policy != null)
                    .Concat(cad.ControllerTypeInfo.GetCustomAttributes(typeof(AuthorizeAttribute), true)
                        .Where(attr => (attr as AuthorizeAttribute).Policy != null))
                    .Select(attr => (attr as AuthorizeAttribute).Policy);

                if (!allActions.Any())
                {
                    continue;
                }

                // Title
                var segments = cad.AttributeRouteInfo.Template.Split("/");
                var titlePathIndex = segments.IndexOf(segment => string.Equals(segment, "title", StringComparison.OrdinalIgnoreCase));
                var titleIndex = titlePathIndex + 1;
                var hasTitle = titlePathIndex >= 0;
#pragma warning disable CA1308 // Normalize strings to uppercase, UI string enum is expecting title lowercased
                var title = segments[titleIndex].ToLowerInvariant();

                foreach (var action in allActions)
                {
                    if (!permissions.ContainsKey(action))
                    {
                        permissions.Add(action, new List<string>());
                    }

                    if (hasTitle && !permissions[action].Contains(title))
                    {
                        permissions[action].Add(title);
                    }
                }
            }

            // Sort each action's titles
            foreach (KeyValuePair<string, IList<string>> entry in permissions)
            {
                permissions[entry.Key] = entry.Value.OrderByDescending(x => x).Reverse().ToList();
            }

            return permissions;
        }
    }
}
