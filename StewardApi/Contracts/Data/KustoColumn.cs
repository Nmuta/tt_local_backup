namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a Kusto column.
    /// </summary>
    public class KustoColumn
    {
        /// <summary>
        ///     Gets or sets the column name.
        /// </summary>
        public string ColumnName { get; set; }

        /// <summary>
        ///     Gets or sets the Ordinal.
        /// </summary>
        public int Ordinal { get; set; }

        /// <summary>
        ///     Gets or sets the data type.
        /// </summary>
        public string DataType { get; set; }
    }
}
