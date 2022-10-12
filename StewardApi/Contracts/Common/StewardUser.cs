using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.Data.Common;

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
        ///     Gets or sets the attributes.
        /// </summary>
        public string Attributes { get; set; }

        public AuthorizationAttribute[] AuthorizationAttributes()
        {
            if(string.IsNullOrEmpty(this.Attributes))
            {
                return new AuthorizationAttribute[]{ };
            }

            return JsonExtensions.FromJson<AuthorizationAttribute[]>(this.Attributes);
        }
    }

    public class AuthorizationAttribute
    {
        /// <summary>
        ///     Attribute.
        /// </summary>
        public string Attribute { get; set;  }

        /// <summary>
        ///     Environment.
        /// </summary>
        public string Environment { get; set;  }

        /// <summary>
        ///     Title.
        /// </summary>
        public string Title { get; set; }
    }
}
