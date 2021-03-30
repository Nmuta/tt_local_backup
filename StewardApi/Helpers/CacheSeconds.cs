using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Durations for caching.
    /// </summary>
    public sealed class CacheSeconds
    {
        /// <summary>
        ///     Used for Player Identity endpoints.
        /// </summary>
        public const int PlayerIdentity = 60 * 3;
    }
}
