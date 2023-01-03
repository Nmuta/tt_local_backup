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
        public const string LiveOpsAdmin = "LiveOpsAdmin";

        public const string SupportAgentAdmin = "SupportAgentAdmin";

        public const string SupportAgent = "SupportAgent";

        public const string SupportAgentNew = "SupportAgentNew";

        public const string DataPipelineAdmin = "DataPipelineAdmin";

        public const string DataPipelineContributor = "DataPipelineContributor";

        public const string DataPipelineRead = "DataPipelineRead";

        public const string CommunityManager = "CommunityManager";

        public const string HorizonDesigner = "HorizonDesigner";

        public const string MotorsportDesigner = "MotorsportDesigner";

        public const string MediaTeam = "MediaTeam";

        /// <summary>
        ///     Auth V2 general user.
        /// </summary>
        /// <remarks>Access to all GET endpoints. Other endpoints are dynamic based on set attributes.</remarks>
        public const string GeneralUser = "GeneralUser";

        public static List<string> V1Roles()
        {
            return new List<string>()
            {
                LiveOpsAdmin,
                SupportAgentAdmin,
                SupportAgent,
                SupportAgentNew,
                DataPipelineAdmin,
                DataPipelineContributor,
                DataPipelineRead,
                CommunityManager,
                HorizonDesigner,
                MotorsportDesigner,
                MediaTeam
            };
        }
    }
}
