using System.Collections.Generic;
using System.Linq;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Represents the AAD app user roles.
    /// </summary>
    #pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    #pragma warning disable SA1600 // Elements should be documented
    public static class UserRole
    {
        /// <summary>
        ///     Auth V2 LiveOps admin user.
        /// </summary>
        public const string LiveOpsAdmin = "LiveOpsAdmin";

        /// <summary>
        ///     Auth V2 general user.
        /// </summary>
        /// <remarks>Access to all GET endpoints. Other endpoints are dynamic based on set attributes.</remarks>
        public const string GeneralUser = "GeneralUser";
    }
}
