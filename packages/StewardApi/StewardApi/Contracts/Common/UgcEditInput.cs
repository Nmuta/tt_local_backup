#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the modification to a Ugc.
    /// </summary>
    public class UgcEditInput
    {
        public string Title { get; set; }

        public string Description { get; set; }
    }
}
