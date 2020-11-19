namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Represents information required for a PATCH operation.
    /// </summary>
    public sealed class PatchOperation
    {
        /// <summary>
        ///     Gets or sets the operation.
        /// </summary>
        public Operation Operation { get; set; }

        /// <summary>
        ///     Gets or sets the path.
        /// </summary>
        public string Path { get; set; }

        /// <summary>
        ///     Gets or sets the value.
        /// </summary>
        public string Value { get; set; }
    }
}
