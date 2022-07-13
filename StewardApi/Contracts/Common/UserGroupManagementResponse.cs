using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a User Group management (add or remove user) response.
    /// </summary>
    public sealed class UserGroupManagementResponse
    {
        /// <summary>
        ///     Gets or sets the Xuid that was added or removed.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the error.
        /// </summary>
        public StewardError Error { get; set; }
    }
}
