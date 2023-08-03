using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles auth requests.
    /// </summary>
    [ApiController]
    [Route("api/v1")]
    [Authorize]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    public sealed class AuthController : ControllerBase
    {
        private readonly IStewardUserProvider stewardUserProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuthController"/> class.
        /// </summary>
        public AuthController(IStewardUserProvider stewardUserProvider, IMapper mapper)
        {
            stewardUserProvider.ShouldNotBeNull(nameof(stewardUserProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.stewardUserProvider = stewardUserProvider;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the user.
        /// </summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetLiveOpsUser()
        {
            var userClaims = this.User.UserClaims();
            await this.stewardUserProvider.EnsureStewardUserAsync(userClaims).ConfigureAwait(true);

            return this.Ok(userClaims);
        }

        /// <summary>
        ///     Gets the user.
        /// </summary>
        [HttpPost("users")]
        public async Task<IActionResult> GetLiveOpsUser([FromBody] BulkUserLookup users)
        {
            users.ShouldNotBeNull(nameof(users));

            var results = new List<StewardUser>();

            foreach (var userObjectId in users.UserObjectIds)
            {
                StewardUserInternal user = null;

                try
                {
                    user = await this.stewardUserProvider.GetStewardUserAsync(userObjectId).ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    results.Add(new StewardUser
                    {
                        Error = new NotFoundStewardError($"Lookup failed for Azure object ID: {userObjectId}.", ex)
                    });
                }

                try
                {
                    results.Add(this.mapper.Map<StewardUser>(user));
                }
                catch (Exception ex)
                {
                    results.Add(new StewardUser
                    {
                        Error = new StewardError($"Mapping failed for user: {userObjectId}.", ex)
                    });
                }
            }

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets all available Steward users from caller's user context.
        /// </summary>
        [HttpGet("allUsers")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
        [Authorize(Policy = UserAttribute.ManageStewardTeam)]
        public async Task<IActionResult> GetAllStewardUsers()
        {
            var users = await this.stewardUserProvider.GetAllStewardUsersAsync().ConfigureAwait(true);
            var mappedUsers = this.mapper.SafeMap<IEnumerable<StewardUser>>(users);

            // If user is a GeneralUser & team lead, then only return Steward users a part of their team.
            // We know they are a team if they are able to bypass the auth policy attribute attached to this endpoint.
            var requestorInternal = await this.stewardUserProvider.GetStewardUserAsync(this.User.UserClaims().ObjectId).ConfigureAwait(true);
            var requestor = this.mapper.SafeMap<StewardUser>(requestorInternal);
            if (requestor.Role == UserRole.GeneralUser)
            {
                var teamMembers = requestor.Team?.Members ?? new List<Guid>();
                mappedUsers = mappedUsers.Where(user => teamMembers.FirstOrDefault(teamMember => teamMember.ToString() == user.ObjectId) != default(Guid));
            }

            return this.Ok(mappedUsers);
        }
    }
}
