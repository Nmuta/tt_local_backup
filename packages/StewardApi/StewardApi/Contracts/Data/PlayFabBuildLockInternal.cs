using System;
using Microsoft.Azure.Cosmos.Table;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a PlayFab Build Lock Cosmos table entity.
    /// </summary>
    public sealed class PlayFabBuildLockInternal : TableEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="PlayFabBuildLockInternal"/> class.
        /// </summary>
        public PlayFabBuildLockInternal()
        {
            this.PartitionKey = "0";
            this.RowKey = Guid.NewGuid().ToString();
        }

        public string Name { get; set; }

        public string Reason { get; set; }

        public string UserId { get; set; }

        public string ApiKeyName { get; set; }

        public string PlayFabEnvironment { get; set; }

        public string GameTitle { get; set; }

        public DateTimeOffset DateCreatedUtc { get; set; }

        public string MetaData { get; set; }
    }
}
