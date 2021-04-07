using Microsoft.Azure.Cosmos.Table;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents a Live Ops user.
    /// </summary>
    public sealed class StewardUser : TableEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUser"/> class.
        /// </summary>
        public StewardUser()
        { }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUser"/> class.
        /// </summary>
        public StewardUser(string objectId, string name, string emailAddress)
        {
            objectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(objectId));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            emailAddress.ShouldNotBeNullEmptyOrWhiteSpace(nameof(emailAddress));

            this.RowKey = objectId;
            this.Name = name;
            this.PartitionKey = "Users";
            this.EmailAddress = emailAddress;
        }

        /// <summary>
        ///     Gets the user's Azure object ID.
        /// </summary>
        public string ObjectId
        {
            get { return this.RowKey; }
        }

        /// <summary>
        ///     Gets or sets the email address.
        /// </summary>
        public string EmailAddress { get; set; }

        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }
    }
}