using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
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
        public IActionResult GetLiveOpsUser()
        {
            var userClaims = this.User.UserClaims();
            this.stewardUserProvider.EnsureStewardUserAsync(userClaims).ConfigureAwait(true);

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
                try
                {
                    var user = await this.stewardUserProvider.GetStewardUserAsync(userObjectId).ConfigureAwait(true);
                    results.Add(this.mapper.Map<StewardUser>(user));
                }
                catch (Exception ex)
                {
                    results.Add(new StewardUser
                    {
                        Error = new NotFoundStewardError($"Lookup failed for Azure object ID: {userObjectId}.", ex)
                    });
                }
            }

            return this.Ok(results);
        }
    }
}
