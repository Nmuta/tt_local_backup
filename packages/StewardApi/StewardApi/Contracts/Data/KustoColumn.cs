using System.Data;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a Kusto column.
    /// </summary>
    public class KustoColumn
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoColumn"/> class.
        /// </summary>
        /// <remarks>Property names were selected to accurately reflect the output of '| getSchema' calls in Kusto. </remarks>
        public KustoColumn(
            string columnName,
            int columnOrdinal,
            string dataType)
        {
            columnName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(columnName));
            dataType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(dataType));

            this.ColumnName = columnName;
            this.ColumnOrdinal = columnOrdinal;
            this.DataType = dataType;
        }

        /// <summary>
        ///     Gets or sets the column name.
        /// </summary>
        public string ColumnName { get; set; }

        /// <summary>
        ///     Gets or sets the Ordinal.
        /// </summary>
        public int ColumnOrdinal { get; set; }

        /// <summary>
        ///     Gets or sets the data type.
        /// </summary>
        public string DataType { get; set; }

        /// <summary>
        ///     Parses query results into a Kusto column object.
        /// </summary>
        public static KustoColumn FromQueryResult(IDataReader reader)
        {
            return new KustoColumn(
                reader.Get<string>(nameof(ColumnName)),
                reader.Get<int>(nameof(ColumnOrdinal)),
                reader.Get<string>(nameof(DataType)));
        }
    }
}
