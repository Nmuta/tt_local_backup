using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Filters;

namespace Turn10.LiveOps.StewardApi.Controllers.Settings
{
    /// <summary>
    ///     Handles settings cache management for Steward.
    /// </summary>
    [Route("api/v1/settings/cache")]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    public sealed class CacheController : ControllerBase
    {
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="CacheController"/> class.
        /// </summary>
        public CacheController(IRefreshableCacheStore refreshableCacheStore)
        {
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <summary>
        ///     Gets the cached key value in memory.
        /// </summary>
        [HttpGet("{key}")]
        [SwaggerResponse(200, type: typeof(object))]
        public IActionResult GetCacheKey(string key)
        {
            var result = this.refreshableCacheStore.GetItem<object>(key);
            if (result == null)
            {
                return this.NotFound($"No cached content found with key: {key}");
            }

            return this.Ok(result);
        }

        /// <summary>
        ///     Deletes the cached key value in memory.
        /// </summary>
        [HttpDelete("{key}")]
        [SwaggerResponse(200)]
        public IActionResult DeleteCacheKey(string key)
        {
            if (this.refreshableCacheStore.GetItem<object>(key) == null)
            {
                return this.NotFound($"No cached content found with key: {key}");
            }

            this.refreshableCacheStore.ClearItem(key);
            return this.Ok();
        }
    }
}
