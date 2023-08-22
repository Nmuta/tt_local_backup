using System;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.External.PlayFab
{
    /// <summary>
    ///     Represents an external PlayFab Build Lock. PII has been removed.
    /// </summary>
    public sealed class ExternalPlayFabBuildLock
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Reason { get; set; }

        public string PlayFabEnvironment { get; set; }

        public string GameTitle { get; set; }

        public DateTimeOffset DateCreatedUtc { get; set; }
    }
}
