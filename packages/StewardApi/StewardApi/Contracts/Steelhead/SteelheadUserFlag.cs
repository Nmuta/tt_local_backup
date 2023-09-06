namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead user flag.
    /// </summary>
    public sealed class SteelheadUserFlag
    {
        /// <summary>
        ///     True if user is member of a specific user group.
        /// </summary>
        public bool IsMember { get; set; }

        /// <summary>
        ///     True if multiple sources of 'user flags' don't agree.
        /// </summary>
        public bool HasConflict { get; set; }
    }
}
