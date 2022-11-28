using Turn10.LiveOps.StewardApi.Authorization;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Steward User Authorization Attribute.
    ///     See <see cref="UserAttribute"/>.
    /// </summary>
    public class AuthorizationAttribute
    {
        /// <summary>
        ///     Gets or sets attribute.
        /// </summary>
        public string Attribute { get; set; }

        /// <summary>
        ///     Gets or sets environment.
        /// </summary>
        public string Environment { get; set; }

        /// <summary>
        ///     Gets or sets title.
        /// </summary>
        public string Title { get; set; }
    }
}
