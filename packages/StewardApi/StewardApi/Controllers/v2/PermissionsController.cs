﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO;
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
using Microsoft.Azure.KeyVault.Models;
using Microsoft.Identity.Web;
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
    [Authorize]
    [ApiVersion("2.0")]
    [Tags(Title.Agnostic, Topic.StewardPermissions)]
    public sealed class PermissionsController : V2ControllerBase
    {
        private readonly IStewardUserProvider userProvider;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PermissionsController"/> class.
        /// </summary>
        public PermissionsController(IStewardUserProvider userProvider, IRefreshableCacheStore refreshableCacheStore, IMapper mapper)
        {
            userProvider.ShouldNotBeNull(nameof(userProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.userProvider = userProvider;
            this.refreshableCacheStore = refreshableCacheStore;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets full permissions list.
        /// </summary>
        [HttpGet]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(Dictionary<string, IList<string>>))]
        public async Task<IActionResult> GetAllPermissionsAsync()
        {
            var permissionsKey = $"AllPermAttributes";

            Dictionary<string, IList<string>> GetPermissionAttributes()
            {
                var permissions = new Dictionary<string, IList<string>>();
#pragma warning disable CA1308 // Normalize strings to uppercase, UI string enum is expecting title lowercased
                permissions.Add(UserAttribute.TitleAccess, new List<string>()
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

                // Sort each action's titles
                foreach (KeyValuePair<string, IList<string>> entry in permissions)
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
        [SwaggerResponse(200, type: typeof(IEnumerable<AuthorizationAttribute>))]
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
        [SwaggerResponse(200, type: typeof(IEnumerable<AuthorizationAttribute>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.StewardUser, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.None, StewardAction.Update, StewardSubject.UserPermissions)]
        [Authorize(Policy = UserAttribute.AdminFeature)]
        public async Task<IActionResult> SetUserPermissionsAsync(string userId, [FromBody] IEnumerable<AuthorizationAttribute> attributes)
        {
            if (this.HttpContext.User.IsInRole(UserRole.GeneralUser))
            {
                // If the user is a general user, they must be a team lead
                var objectId = this.HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == ClaimConstants.ObjectId);

                if (objectId == null)
                {
                    throw new BadRequestStewardException("ObjectId Claim must be provided");
                }

                var thisUser = await this.userProvider.GetStewardUserAsync(objectId.Value).ConfigureAwait(false);
                if (thisUser == null)
                {
                    throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {objectId.Value})");
                }

                if (!thisUser.DeserializeTeam().Members.Contains(new Guid(userId)))
                {
                    throw new BadRequestStewardException("Team lead cannot assign permissions to member not in their team.");
                }

                // Also verify the current user has the attributes they are attempting to assign to another user
                var matches = thisUser.AuthorizationAttributes().SelectMany(a => attributes.Where(b => a.Matches(b)));
                if (matches.Count() != attributes.Count())
                {
                    throw new BadRequestStewardException("Team lead cannot assign permissions they do not have to a team member.");
                }
            }

            // Throw if any attributes contain an null or empty string attribute name
            attributes.ForEach(value =>
            {
                if (value.Attribute.IsNullOrEmpty())
                {
                    throw new BadRequestStewardException("Cannot assign permission attribute with a null or empty attribute name");
                }
            });

            var internalUser = await this.userProvider.GetStewardUserAsync(userId).ConfigureAwait(true);
            if (internalUser == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {userId})");
            }

            var user = this.mapper.SafeMap<StewardUser>(internalUser);
            // If user is team lead, add manage team attribute to new attributes list
            if (user.Attributes.HasManageTeamAttribute())
            {
                attributes = attributes.AddManageTeamAttribute();
            }

            user.Attributes = attributes;

            await this.userProvider.UpdateStewardUserAsync(user).ConfigureAwait(true);

            return await this.GetUserPermissionsAsync(userId).ConfigureAwait(true);
        }
    }
}