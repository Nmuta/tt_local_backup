using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents information about a blob file
    /// </summary>
    public sealed class BlobFileInfo
    {
        public DateTimeOffset? LastModifiedUtc { get; set; }

        public bool Exists { get; set; }
    }
}
