namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     The kusto logger parameters.
    /// </summary>
    public sealed class KustoLoggerParameters
    {
        /// <summary>
        ///     Gets or sets the database.
        /// </summary>
        public string Database { get; set; }

        /// <summary>
        ///     Gets or sets the table.
        /// </summary>
        public string Table { get; set; }
    }
}
