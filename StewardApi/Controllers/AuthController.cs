using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;

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
        private readonly ILogger<AuthController> logger;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuthController"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        public AuthController(ILogger<AuthController> logger)
        {
            logger.ShouldNotBeNull(nameof(logger));

            this.logger = logger;
        }

        /// <summary>
        ///     Gets the user.
        /// </summary>
        /// <returns>
        ///     200 OK
        ///     The <see cref="LiveOpsUser"/>.
        /// </returns>
        [HttpGet("me")]
        public IActionResult GetLiveOpsUser()
        {
            var userIdentity = this.User;
            var role = "None";
            if (this.User.IsInRole(UserRole.LiveOpsAdmin))
            {
                role = UserRole.LiveOpsAdmin;
            }
            else if (this.User.IsInRole(UserRole.SupportAgentAdmin))
            {
                role = UserRole.SupportAgentAdmin;
            }
            else if (this.User.IsInRole(UserRole.SupportAgent))
            {
                role = UserRole.SupportAgent;
            }
            else if (this.User.IsInRole(UserRole.SupportAgentNew))
            {
                role = UserRole.SupportAgentNew;
            }

            var user = new LiveOpsUser
            {
                EmailAddress = userIdentity.Identity.Name,
                Role = role,
            };

            return this.Ok(user);
        }
    }
}
