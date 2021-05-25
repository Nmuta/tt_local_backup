namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Represents a Kusto function.
    /// </summary>
    public sealed class KustoFunction
    {
        /// <summary>
        ///     Gets or sets name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to make this query into a function call
        /// </summary>
        public bool MakeFunctionCall { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to use splitting.
        /// </summary>
        public bool UseSplitting { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to use an end date on the function.
        /// </summary>
        public bool UseEndDate { get; set; }

        /// <summary>
        ///     Gets or sets the number of buckets to suggest to Obligation.
        /// </summary>
        /// <remarks>
        ///     Not required, leaving it null will allow Obligation to figure it out for
        ///     itself. Even if a value is supplied, this Obligation may choose to ignore it.
        /// </remarks>
        public int? NumberOfBuckets { get; set; }
    }
}
