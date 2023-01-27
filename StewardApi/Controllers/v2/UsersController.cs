using System;
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
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.MsGraph;
using static System.Collections.Specialized.BitVector32;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2
{
    /// <summary>
    ///     Handles requests for Steward users.
    /// </summary>
    [Route("api/v{version:apiVersion}/users")]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [Authorize]
    [ApiVersion("2.0")]
    [StandardTags(Title.Agnostic, Topic.StewardUsers)]
    public sealed class UsersController : V2ControllerBase
    {
        private readonly IStewardUserProvider stewardUserProvider;
        private readonly IMsGraphService msGraphService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UsersController"/> class.
        /// </summary>
        public UsersController(
            IStewardUserProvider stewardUserProvider,
            IMsGraphService msGraphService)
        {
            stewardUserProvider.ShouldNotBeNull(nameof(stewardUserProvider));
            msGraphService.ShouldNotBeNull(nameof(msGraphService));

            this.stewardUserProvider = stewardUserProvider;
            this.msGraphService = msGraphService;
        }

        /// <summary>
        ///    Syns AAD users list with the Cosmos DB users list.
        /// </summary>
        [HttpPost("sync")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Cosmos)]
        [LogTagAction(ActionTargetLogTags.StewardUser, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.None, StewardAction.Update, StewardSubject.Users)]
        [Authorize(Policy = UserAttribute.AdminFeature)]
        public async Task<IActionResult> SyncUsers()
        {
            var getAadUsers = this.msGraphService.GetAadAppUsersAsync();
            var getDbUsers = this.stewardUserProvider.GetAllStewardUsersAsync();

            await Task.WhenAll(getAadUsers, getDbUsers).ConfigureAwait(true);

            var aadUsers = getAadUsers.Result;
            var dbUsers = getDbUsers.Result;

            var usersToAdd = new List<StewardUser>();
            var usersToUpdate = new List<StewardUserInternal>();
            // Figure out which users are new and which need updated in Cosmos DB.
            foreach (var aadUser in aadUsers)
            {
                var dbUser = dbUsers.Where(dbUser => aadUser.ObjectId == dbUser.ObjectId).FirstOrDefault();
                if (dbUser == null)
                {
                    usersToAdd.Add(aadUser);
                    continue;
                }

                if (dbUser.Role != aadUser.Role)
                {
                    dbUser.Role = aadUser.Role;
                    usersToUpdate.Add(dbUser);
                }
            }

            var addAndUpdateTasks = new List<Task>();
            addAndUpdateTasks.AddRange(usersToAdd.Select(userToAdd => this.SyncAddNewUserAsync(userToAdd)));
            addAndUpdateTasks.AddRange(usersToUpdate.Select(userToUpdate => this.SyncUpdateUserAsync(userToUpdate)));

            var awaitableTasks = Task.WhenAll(addAndUpdateTasks);
            try
            {
                await awaitableTasks.ConfigureAwait(true);
            }
            catch
            {
                throw new UnknownFailureStewardException($"Failures found when syncing users in AAD and DB.", awaitableTasks.Exception);
            }

            return this.Ok();
        }

        private async Task SyncAddNewUserAsync(StewardUser userToAdd)
        {
            try
            {
                var aadUserProfile = await this.msGraphService.GetAadUserAsync(userToAdd.ObjectId).ConfigureAwait(true);
                if (aadUserProfile == null)
                {
                    throw new UnknownFailureStewardException($"Failed to pull AAD user profile during sync. (aadUserId: {userToAdd.ObjectId})");
                }

                userToAdd.EmailAddress = aadUserProfile.Mail;
                await this.stewardUserProvider.CreateStewardUserAsync(userToAdd).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to add new AAD user to DB during sync. (aadUserId: {userToAdd.ObjectId})", ex);
            }
        }

        private async Task SyncUpdateUserAsync(StewardUserInternal userToUpdate)
        {
            try
            {
                await this.stewardUserProvider.UpdateStewardUserAsync(userToUpdate.ObjectId, userToUpdate.Name, userToUpdate.EmailAddress, userToUpdate.Role, userToUpdate.Attributes).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to updated AAD user to DB during sync. (aadUserId: {userToUpdate.ObjectId})", ex);
            }
        }
    }
}
