namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     Valid principal types.
    /// </summary>
    public static class PrincipalTypes
    {
        /// <summary>
        ///     A user principle is a single AAD user.
        /// </summary>
        public const string User = "aad_user";

        /// <summary>
        ///     A group principal includes all transitive members of an AAD group.
        /// </summary>
        public const string Group = "aad_group";
    }
}
