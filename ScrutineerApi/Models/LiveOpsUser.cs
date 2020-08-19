namespace Turn10.LiveOps.ScrutineerApi.Models
{
    /// <summary>
    ///     Represents a Live Ops user.
    /// </summary>
    public sealed class LiveOpsUser
    {
        /// <summary>
        ///     Gets or sets the email address.
        /// </summary>
        public string EmailAddress { get; set; }

        /// <summary>
        ///     Gets or sets the role.
        /// </summary>
        public string Role { get; set; }
    }
}
