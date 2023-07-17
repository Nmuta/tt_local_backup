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

        /// <summary>
        /// Compare this attribute to another.
        /// </summary>
        /// <param name="b">Attribute to compare.</param>
        /// <returns>True if attributes match.</returns>
        public bool Matches(AuthorizationAttribute b)
        {
            return string.Compare(this.Attribute ?? string.Empty, b.Attribute ?? string.Empty, true, System.Globalization.CultureInfo.InvariantCulture) == 0 &&
                    string.Compare(this.Environment ?? string.Empty, b.Environment ?? string.Empty, true, System.Globalization.CultureInfo.InvariantCulture) == 0 &&
                    string.Compare(this.Title ?? string.Empty, b.Title ?? string.Empty, true, System.Globalization.CultureInfo.InvariantCulture) == 0;
        }
    }
}
