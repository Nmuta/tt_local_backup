namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Pipeline roles.
    /// </summary>
    public static class Roles
    {
        /// <summary>
        ///     Principals with the reader role may view resources but not edit them.
        /// </summary>
        public const string Reader = "reader";

        /// <summary>
        ///     Principals with the admin role may view and edit resources.
        /// </summary>
        public const string Admin = "admin";
    }
}
