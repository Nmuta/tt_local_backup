﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Castle.Core.Internal;
using Kusto.Cloud.Platform.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.VisualStudio.Services.Common;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Settings;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
namespace Turn10.LiveOps.StewardApi.Controllers.v2
{
    /// <summary>
    ///     Handles requests for woodstock permission management.
    /// </summary>
    [Route("api/v{version:apiVersion}/permissions")]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [Authorize]
    [ApiVersion("2.0")]
    [Tags(Title.Agnostic, Topic.StewardPermissions)]
    public sealed class PermissionsController : V2ControllerBase
    {
        private readonly IStewardUserProvider userProvider;
        private readonly IGeneralSettingsProvider generalSettingsProvider;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PermissionsController"/> class.
        /// </summary>
        public PermissionsController(IStewardUserProvider userProvider, IGeneralSettingsProvider generalSettingsProvider, IRefreshableCacheStore refreshableCacheStore, IMapper mapper)
        {
            userProvider.ShouldNotBeNull(nameof(userProvider));
            generalSettingsProvider.ShouldNotBeNull(nameof(generalSettingsProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.userProvider = userProvider;
            this.generalSettingsProvider = generalSettingsProvider;
            this.refreshableCacheStore = refreshableCacheStore;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets full permissions list.
        /// </summary>
        [HttpGet]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
        [SwaggerResponse(200, type: typeof(Dictionary<string, IList<string>>))]
        [Authorize(Policy = UserAttributeValues.ManageStewardTeam)]
        public async Task<IActionResult> GetAllPermissionsAsync()
        {
            var permissionsKey = $"AllPermAttributes";

            Dictionary<string, IList<string>> GetPermissionAttributes()
            {
                var permissions = new Dictionary<string, IList<string>>();
#pragma warning disable CA1308 // Normalize strings to uppercase, UI string enum is expecting title lowercased
                permissions.Add(UserAttributeValues.TitleAccess, new List<string>()
                {
                        nameof(TitleCodeName.Forte).ToLowerInvariant(),
                });

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

                // Remove all non-manageable attributes from list
                permissions.Remove(UserAttributeValues.ManageStewardTeam);

                // Sort each action's titles
                foreach (var entry in permissions)
                {
                    permissions[entry.Key] = entry.Value.OrderByDescending(x => x).Reverse().ToList();
                }

                this.refreshableCacheStore.PutItem(permissionsKey, TimeSpan.FromDays(7), permissions);

                return permissions;
            }

            var permAttributes = this.refreshableCacheStore.GetItem<Dictionary<string, IList<string>>>(permissionsKey)
                   ?? GetPermissionAttributes();

            return this.Ok(permAttributes);
        }

        /// <summary>
        ///     Gets user permission attributes.
        /// </summary>
        [HttpGet("user/{userId}")]
        [SwaggerResponse(200, type: typeof(IEnumerable<AuthorizationAttributeData>))]
        public async Task<IActionResult> GetUserPermissionsAsync(string userId)
        {
            var user = await this.userProvider.GetStewardUserAsync(userId).ConfigureAwait(true);
            if (user == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {userId})");
            }

            return this.Ok(user.AuthorizationAttributes());
        }

        /// <summary>
        ///     Sets user permission attributes.
        /// </summary>
        [HttpPost("user/{userId}")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
        [SwaggerResponse(200, type: typeof(IEnumerable<AuthorizationAttributeData>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.StewardUser, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.None, StewardAction.Update, StewardSubject.UserPermissions)]
        [Authorize(Policy = UserAttributeValues.ManageStewardTeam)]
        public async Task<IActionResult> SetUserPermissionsAsync(string userId, [FromBody] AuthPermissionChanges permChanges)
        {
            // Throw if any attributes contain an null or empty string attribute name
            foreach (var attribute in permChanges.AttributesToAdd)
            {
                if (attribute.Attribute.IsNullOrEmpty())
                {
                    throw new BadRequestStewardException("Cannot assign permission attribute with a null or empty attribute name");
                }
            }

            var internalUser = await this.userProvider.GetStewardUserAsync(userId).ConfigureAwait(true);
            if (internalUser == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {userId})");
            }

            var user = this.mapper.SafeMap<StewardUser>(internalUser);
            if (this.HttpContext.User.IsInRole(UserRole.GeneralUser))
            {
                // If the user is a general user, they must be a team lead due to auth policy restrictions set in the auth attribute.
                var requestor = await this.userProvider.GetStewardUserAsync(this.User.UserClaims().ObjectId).ConfigureAwait(false);
                if (!requestor.DeserializeTeam().Members.Contains(new Guid(userId)))
                {
                    throw new BadRequestStewardException("Team lead cannot assign permissions to member not in their team.");
                }

                // Verify the current user has the attributes they are attempting to assign to another user
                var requestorAttributes = requestor.AuthorizationAttributes().ToList();
                var allPermChanges = permChanges.AttributesToAdd.Concat(permChanges.AttributesToRemove).ToList();
                var leadMissingPermissions = allPermChanges.Exists(attribute => requestorAttributes.FirstOrDefault(requestionAttribute => requestionAttribute.Matches(attribute)) == null);
                if (leadMissingPermissions)
                {
                    throw new BadRequestStewardException("Team lead cannot assign permissions they do not have to a team member.");
                }
            }

            var newAttributeList = user.Attributes.ToList();

            // Check for any invalid perms from old titles/environments
            var titleEndpoints = this.GetLspEndpointsAsDict();
            foreach (var existingAttribute in user.Attributes)
            {
                var endpoints = titleEndpoints.GetValueOrDefault(existingAttribute.Title.ToLowerInvariant());
                var endpoint = endpoints?.FirstOrDefault(endpoint => existingAttribute.Environment == endpoint.Name) ?? null;
                if (endpoint == default(LspEndpoint))
                {
                    newAttributeList.Remove(existingAttribute);
                }
            }

            foreach (var attribute in permChanges.AttributesToAdd)
            {
                var foundAttribute = newAttributeList.FirstOrDefault(existingAttribute => existingAttribute.Matches(attribute));
                if (foundAttribute == null)
                {
                    newAttributeList.Add(attribute);
                }
            }

            foreach (var attribute in permChanges.AttributesToRemove)
            {
                var foundAttribute = newAttributeList.FirstOrDefault(existingAttribute => existingAttribute.Matches(attribute));
                if (foundAttribute != null)
                {
                    newAttributeList.Remove(foundAttribute);
                }
            }

            user.Attributes = newAttributeList;

            await this.userProvider.UpdateStewardUserAsync(user).ConfigureAwait(true);

            return await this.GetUserPermissionsAsync(userId).ConfigureAwait(true);
        }

        private Dictionary<string, IEnumerable<LspEndpoint>> GetLspEndpointsAsDict()
        {
            // Check for any invalid perms from old titles/environments
            var titleEndpoints = this.generalSettingsProvider.GetLspEndpoints();
            var titleEndpointDict = new Dictionary<string, IEnumerable<LspEndpoint>>();
            foreach (var prop in titleEndpoints.GetType().GetProperties())
            {
                var type = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
                if (type == typeof(IEnumerable<LspEndpoint>))
                {
                    var value = (IEnumerable<LspEndpoint>)prop.GetValue(titleEndpoints, null);
                    titleEndpointDict.Add(prop.Name.ToLowerInvariant(), value);
                }
            }

            return titleEndpointDict;
        }
    }
}
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
