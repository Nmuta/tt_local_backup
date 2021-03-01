using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Helpers;

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
        /// <summary>
        ///     Gets the user.
        /// </summary>
        /// <returns>
        ///     200 OK
        ///     The <see cref="StewardUser"/>.
        /// </returns>
        [HttpGet("me")]
        public IActionResult GetLiveOpsUser()
        {
            return this.Ok(this.User.UserModel());
        }
    }
}
