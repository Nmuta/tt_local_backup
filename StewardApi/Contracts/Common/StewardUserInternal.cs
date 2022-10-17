using Microsoft.Azure.Cosmos.Table;
using System.Collections.Generic;
using System.Linq;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Live Ops user.
    /// </summary>
    public sealed class StewardUserInternal : TableEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserInternal"/> class.
        /// </summary>
        public StewardUserInternal()
        { }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserInternal"/> class.
        /// </summary>
        public StewardUserInternal(string userObjectId, string name, string emailAddress, string role, string attributes)
        {
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            emailAddress.ShouldNotBeNullEmptyOrWhiteSpace(nameof(emailAddress));
            emailAddress.ShouldNotBeNullEmptyOrWhiteSpace(nameof(role));

            this.RowKey = userObjectId;
            this.Name = name;
            this.PartitionKey = "Users";
            this.EmailAddress = emailAddress;
            this.Role = role;
            this.Attributes = AuthorizationAttribute.Deserialize(attributes);
        }

        /// <summary>
        ///     Gets the user's Azure object ID.
        /// </summary>
        public string ObjectId => this.RowKey;

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
        ///     Gets or sets the attributes.
        /// </summary>
        public IEnumerable<AuthorizationAttribute> Attributes { get; set; }

        /// <summary>
        /// Compare to StewardUserInternal.
        /// </summary>
        /// <param name="user">User for comparison.</param>
        /// <returns>True if they are equal.</returns>
        public bool Equals(string name, string email, string role, string attributes)
        {
            return this.Name != name || this.EmailAddress != email || this.Role != role ||
                !AuthorizationAttribute.Serialize(this.Attributes).Equals(attributes);
        }
    }
}