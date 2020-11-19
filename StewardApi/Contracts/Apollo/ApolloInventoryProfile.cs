using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo inventory profile.
    /// </summary>
    public class ApolloInventoryProfile
    {
        /// <summary>
        ///     Gets or sets the profile ID.
        /// </summary>
        public int ProfileId { get; set; }

        /// <summary>
        ///     Gets or sets the external profile ID.
        /// </summary>
        public Guid ExternalProfileId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether profile is current.
        /// </summary>
        public bool IsCurrent { get; set; }
    }
}
