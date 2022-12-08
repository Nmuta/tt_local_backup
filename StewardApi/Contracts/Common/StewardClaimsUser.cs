using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Errors;

// TODO: this type should probably wrap the ClaimsPrincipal rather than constructing a POCO, or this method should be a static-type method ctor like StewardUser.FromClaims(...). Either option will lend itself to easier extensibility in the future
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Steward user built by middleware claims.
    /// </summary>
    public sealed class StewardClaimsUser
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
    }
}
