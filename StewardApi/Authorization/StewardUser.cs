namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Represents a Live Ops user.
    /// </summary>
    public sealed class StewardUser
    {
        /// <summary>
        ///     Gets or sets the email address.
        /// </summary>
        public string EmailAddress { get; set; }

        /// <summary>
        ///     Gets or sets the role.
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public string Id { get; set; }
    }
}
