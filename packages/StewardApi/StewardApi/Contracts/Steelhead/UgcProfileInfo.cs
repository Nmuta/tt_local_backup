namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    public sealed class UgcProfileInfo
    {
        public string ProfileData { get; set; }

        public uint UpdateCount { get; set; }

        public UgcProfileDecompressionData DecompressionData { get; set; }
    }
}
