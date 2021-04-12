using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents a Steward user.
    /// </summary>
    public sealed class StewardUser
    {
        /// <summary>
        ///     Gets the user's Azure object ID.
        /// </summary>
        public string ObjectId { get; set; }

        /// <summary>
        ///     Gets or sets the email address.
        /// </summary>
        public string EmailAddress { get; set; }

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the role.
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        ///     Gets or sets the error.
        /// </summary>
        public StewardError Error { get; set; }
    }
}
