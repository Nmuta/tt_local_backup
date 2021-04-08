using Microsoft.Azure.Cosmos.Table;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts
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
        public StewardUserInternal(string userObjectId, string name, string emailAddress)
        {
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            emailAddress.ShouldNotBeNullEmptyOrWhiteSpace(nameof(emailAddress));

            this.RowKey = userObjectId;
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