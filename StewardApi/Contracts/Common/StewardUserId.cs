using Microsoft.Azure.Cosmos.Table;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Live Ops user's id.
    /// </summary>
    public sealed class StewardUserId : TableEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserId"/> class.
        /// </summary>
        public StewardUserId()
        { }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserId"/> class.
        /// </summary>
        public StewardUserId(string userObjectId)
        {
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));

            this.RowKey = userObjectId;
        }

        /// <summary>
        ///     Gets the user's Azure object ID.
        /// </summary>
        public string ObjectId => this.RowKey;
    }
}