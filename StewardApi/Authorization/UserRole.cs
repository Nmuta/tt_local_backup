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

        public const string User = "User";
    }

    /*
     * -	System attribute: Environment, title, tool, feature, cms slot (of person for gifting)
-	User attributes: admin, team, external vs. internal, hierarchical reports?...
*/
    public static class SystemAttribute
    {

        public const string Woodstock = "Woodstock";
        public const string Retail = "Retail";
    }

    public static class UserAttribute
    {
        public const string Admin = "Admin";
    }

    // Or enums?
    public enum AuthorizationTags
    {
        Woodstock,
        Retail, 
        Gifter
    }
}
