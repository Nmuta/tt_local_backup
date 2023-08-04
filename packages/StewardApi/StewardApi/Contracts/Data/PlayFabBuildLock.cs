using System;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a PlayFab Build Lock.
    /// </summary>
    public sealed class PlayFabBuildLock
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Reason { get; set; }

        public string UserId { get; set; }

        public string PlayFabEnvironment { get; set; }

        public string GameTitle { get; set; }

        public DateTimeOffset DateCreatedUtc { get; set; }

        public string MetaData { get; set; }
    }
}
