using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
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

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuthController"/> class.
        /// </summary>
        public AuthController(IStewardUserProvider stewardUserProvider)
        {
            stewardUserProvider.ShouldNotBeNull(nameof(stewardUserProvider));

            this.stewardUserProvider = stewardUserProvider;
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
        [HttpGet("/objectId({objectId})")]
        public async Task<IActionResult> GetLiveOpsUser(string objectId)
        {
            var result = await this.stewardUserProvider.GetStewardUserAsync(objectId).ConfigureAwait(true);

            return this.Ok(result);
        }
    }
}
