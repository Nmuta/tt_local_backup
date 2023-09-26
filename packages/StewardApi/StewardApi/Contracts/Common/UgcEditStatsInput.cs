namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the modification to a Ugc stats.
    /// </summary>
    public class UgcEditStatsInput
    {
        public int Downloaded { get; set; }

        public int Liked { get; set; }

        public int Used { get; set; }

        public int Disliked { get; set; }
    }
}
