using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiScrutineer.Infrastructure
{
    /// <summary>
    /// Contains a list of all the Azure AD app roles this app depends on and works with.
    /// </summary>
    public static class AppRole
    {
        /// <summary>
        /// User readers can read basic profiles of all users in the directory.
        /// </summary>
        public const string LiveOpsAdmin = "LiveOpsAdmin";

        /// <summary>
        /// Directory viewers can view objects in the whole directory.
        /// </summary>
        public const string LiveOpsAgent = "LiveOpsAgent";
    }

    /// <summary>
    /// Wrapper class the contain all the authorization policies available in this application.
    /// </summary>
    public static class AuthorizationPolicies
    {
        public const string AssignmentToLiveOpsAdminRoleRequired = "AssignmentToLiveOpsAdminRoleRequired";
        public const string AssignmentToLiveOpsAgentRoleRequired = "AssignmentToLiveOpsAgentRoleRequired";
    }
}
