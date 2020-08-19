#pragma warning disable CA1034 // Nested types should not be visible
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
namespace Turn10.LiveOps.ScrutineerApi
{
    /// <summary>
    ///     Central reference for application settings.
    /// </summary>
    public static class ApplicationSettings
    {
        /// <summary>
        ///     App roles.
        /// </summary>
        public static class AppRole
        {
            public const string LiveOpsAdmin = "LiveOpsAdmin";
            public const string LiveOpsAgent = "LiveOpsAgent";
        }

        /// <summary>
        ///     Authorization policies.
        /// </summary>
        public static class AuthorizationPolicy
        {
            public const string AssignmentToLiveOpsAdminRoleRequired = "AssignmentToLiveOpsAdminRoleRequired";
            public const string AssignmentToLiveOpsAgentRoleRequired = "AssignmentToLiveOpsAgentRoleRequired";
        }
    }
}
