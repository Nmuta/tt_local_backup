namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     UGC Profile JSON as well as metadata about the profile.
    /// </summary>
    public sealed class UgcProfileInfo
    {
        public string ProfileData { get; set; }

        public uint UpdateCount { get; set; }

        public UgcProfileDecompressionData DecompressionData { get; set; }
    }
}
