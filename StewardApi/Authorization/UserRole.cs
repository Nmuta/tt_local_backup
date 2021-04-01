using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Represents the AAD app user roles.
    /// </summary>
    public static class UserRole
    {
        /// <summary>
        ///     The live ops admin role.
        /// </summary>
        public const string LiveOpsAdmin = "LiveOpsAdmin";

        /// <summary>
        ///     The support agent admin role.
        /// </summary>
        public const string SupportAgentAdmin = "SupportAgentAdmin";

        /// <summary>
        ///     The support agent role.
        /// </summary>
        public const string SupportAgent = "SupportAgent";

        /// <summary>
        ///     The new support agent role.
        /// </summary>
        public const string SupportAgentNew = "SupportAgentNew";

        /// <summary>
        ///     The data pipeline admin role.
        /// </summary>
        public const string DataPipelineAdmin = "DataPipelineAdmin";

        /// <summary>
        ///     The data pipeline contributor role.
        /// </summary>
        public const string DataPipelineContributor = "DataPipelineContributor";

        /// <summary>
        ///     The data pipeline read role.
        /// </summary>
        public const string DataPipelineRead = "DataPipelineRead";

        /// <summary>
        ///     The community manager role.
        /// </summary>
        public const string CommunityManager = "CommunityManager";
    }
}
