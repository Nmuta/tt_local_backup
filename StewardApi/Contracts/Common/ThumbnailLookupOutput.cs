using System;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a thumbnail lookup output
    /// </summary>
    public sealed class ThumbnailLookupOutput
    {
        public Guid Id { get; set; }

        public string Thumbnail { get; set; }
    }
}
