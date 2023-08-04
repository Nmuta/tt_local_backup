using AutoMapper;
using Kusto.Cloud.Platform.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.MsGraph;
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
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UsersController"/> class.
        /// </summary>
        public UsersController(
            IStewardUserProvider stewardUserProvider,
            IMsGraphService msGraphService,
            IMapper mapper)
        {
            stewardUserProvider.ShouldNotBeNull(nameof(stewardUserProvider));
            msGraphService.ShouldNotBeNull(nameof(msGraphService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.stewardUserProvider = stewardUserProvider;
            this.msGraphService = msGraphService;
            this.mapper = mapper;
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
        [Authorize(Policy = UserAttributeValues.AdminFeature)]
        public async Task<IActionResult> SyncUsers()
        {
            var getAadUsers = this.msGraphService.GetAadAppUsersAsync();
            var getDbUsers = this.stewardUserProvider.GetAllStewardUsersAsync();

            await Task.WhenAll(getAadUsers, getDbUsers).ConfigureAwait(true);

            var aadUsers = getAadUsers.GetAwaiter().GetResult();
            var dbUsers = getDbUsers.GetAwaiter().GetResult();

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

        /// <summary>
        ///     Gets all Steward teams.
        /// </summary>
        [HttpGet("teams")]
        [SwaggerResponse(200, type: typeof(IDictionary<string, Team>))]
        public async Task<IActionResult> GetTeamsAsync()
        {
            var teams = await this.GetAllTeamsAsync().ConfigureAwait(true);
            return this.Ok(teams);
        }

        /// <summary>
        ///     Gets user team.
        /// </summary>
        [HttpGet("{userId}/team")]
        [SwaggerResponse(200, type: typeof(Team))]
        public async Task<IActionResult> GetTeamAsync(string userId)
        {
            var user = await this.stewardUserProvider.GetStewardUserAsync(userId).ConfigureAwait(true);
            if (user == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {userId})");
            }

            return this.Ok(user.DeserializeTeam());
        }

        /// <summary>
        ///     Sets user team.
        /// </summary>
        [HttpPost("{userId}/team")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(Team))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.StewardUser, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.None, StewardAction.Update, StewardSubject.UserTeam)]
        [Authorize(Policy = UserAttributeValues.AdminFeature)]
        public async Task<IActionResult> SetTeamAsync(string userId, [FromBody] Team team)
        {
            var internalUser = await this.stewardUserProvider.GetStewardUserAsync(userId).ConfigureAwait(true);
            if (internalUser == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {userId})");
            }

            var user = this.mapper.SafeMap<StewardUser>(internalUser);
            var updatedPerms = user.Attributes.AddManageTeamAttribute();
            user.Attributes = updatedPerms;
            user.Team = team;
            await this.stewardUserProvider.UpdateStewardUserAsync(user).ConfigureAwait(true);

            return await this.GetTeamAsync(userId).ConfigureAwait(true);
        }

        /// <summary>
        ///     Deletes user team.
        /// </summary>
        [HttpDelete("{userId}/team")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.StewardUser, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.None, StewardAction.Delete, StewardSubject.UserTeam)]
        [Authorize(Policy = UserAttributeValues.AdminFeature)]
        public async Task<IActionResult> DeleteTeamAsync(string userId)
        {
            var user = await this.stewardUserProvider.GetStewardUserAsync(userId).ConfigureAwait(true);
            if (user == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user was not found. (userId: {userId})");
            }

            var mappedUser = this.mapper.SafeMap<StewardUser>(user);
            if (mappedUser.Team == null)
            {
                throw new InvalidArgumentsStewardException($"Steward user does not have a team. (userId: {userId})");
            }

            var updatedPerms = mappedUser.Attributes.RemoveManageTeamAttribute();
            mappedUser.Attributes = updatedPerms;
            mappedUser.Team = null;
            await this.stewardUserProvider.UpdateStewardUserAsync(mappedUser).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets user's team lead.
        /// </summary>
        [HttpGet("{userId}/teamLead")]
        [SwaggerResponse(200, type: typeof(StewardUser))]
        public async Task<IActionResult> GetUsersTeamLeadAsync(string userId)
        {
            var parsedUserId = userId.TryParseGuidElseThrow("userId");
            var teams = await this.GetAllTeamsAsync().ConfigureAwait(true);

            foreach (var team in teams)
            {
                var members = team.Value.Members;
                var isUserMember = members.FirstOrDefault(member => member == parsedUserId) != default(Guid);
                if (isUserMember)
                {
                    var teamLead = await this.stewardUserProvider.GetStewardUserAsync(team.Key).ConfigureAwait(true);
                    var mappedTeamLead = this.mapper.SafeMap<StewardUser>(teamLead);

                    return this.Ok(mappedTeamLead);
                }
            }

            return this.Ok(null);
        }

        /// <summary>
        ///     Gets all Steward teams.
        /// </summary>
        private async Task<IDictionary<string, Team>> GetAllTeamsAsync()
        {
            var internalUsers = await this.stewardUserProvider.GetAllStewardUsersAsync().ConfigureAwait(true);
            var users = this.mapper.SafeMap<IList<StewardUser>>(internalUsers);

            var teams = new Dictionary<string, Team>();
            users.ForEach(user =>
            {
                if (user.Team != null)
                {
                    teams.Add(user.ObjectId, user.Team);
                }
            });

            return teams;
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
                await this.stewardUserProvider.UpdateStewardUserAsync(
                    userToUpdate.ObjectId,
                    userToUpdate.Name,
                    userToUpdate.EmailAddress,
                    userToUpdate.Role,
                    userToUpdate.Attributes,
                    userToUpdate.Team).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to updated AAD user to DB during sync. (aadUserId: {userToUpdate.ObjectId})", ex);
            }
        }
    }
}
