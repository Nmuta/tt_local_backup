using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Steward user.
    /// </summary>
    public sealed class StewardUser
    {
        /// <summary>
        ///     Gets or sets the user's Azure object ID.
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

        /// <summary>
        ///     Gets or sets the authorization attributes.
        /// </summary>
        public IEnumerable<AuthorizationAttribute> Attributes { get; set; }

        /// <summary>
        ///     Gets or sets the team.
        /// </summary>
        public Team Team { get; set; }
    }
}
