namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Represents the AAD app user roles.
    /// </summary>
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

    }
}
