using Newtonsoft.Json.Linq;
using System.Data;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for <see cref="KustoColumn"/>.
    /// </summary>
    public static class KustoColumnExtensions
    {
        /// <summary>
        ///     Puts a column's value into a JObject.
        /// </summary>
        public static void ReadValue(this KustoColumn column, JObject jObj, IDataReader reader)
        {
            if (reader.IsDBNull(column.ColumnOrdinal))
            {
                jObj.Add(column.ColumnName, null);
                return;
            }

            switch (column.DataType)
            {
                case "System.String":
                    jObj.Add(column.ColumnName, reader.GetString(column.ColumnOrdinal));
                    break;
                case "System.Guid":
                    jObj.Add(column.ColumnName, reader.GetGuid(column.ColumnOrdinal));
                    break;
                case "System.Char":
                    jObj.Add(column.ColumnName, reader.GetChar(column.ColumnOrdinal));
                    break;
                case "System.Int16":
                    jObj.Add(column.ColumnName, reader.GetInt16(column.ColumnOrdinal));
                    break;
                case "System.Int32":
                    jObj.Add(column.ColumnName, reader.GetInt32(column.ColumnOrdinal));
                    break;
                case "System.Int64":
                    jObj.Add(column.ColumnName, reader.GetInt64(column.ColumnOrdinal));
                    break;
                case "System.Float":
                    jObj.Add(column.ColumnName, reader.GetFloat(column.ColumnOrdinal));
                    break;
                case "System.Decimal":
                    jObj.Add(column.ColumnName, reader.GetDecimal(column.ColumnOrdinal));
                    break;
                case "System.Double":
                    jObj.Add(column.ColumnName, reader.GetDouble(column.ColumnOrdinal));
                    break;
                case "System.DateTime":
                    jObj.Add(column.ColumnName, reader.GetDateTime(column.ColumnOrdinal));
                    break;
                case "System.Boolean":
                    jObj.Add(column.ColumnName, reader.GetBoolean(column.ColumnOrdinal));
                    break;
                case "System.Byte":
                    jObj.Add(column.ColumnName, reader.GetByte(column.ColumnOrdinal));
                    break;
                case "System.Object":
                    jObj.Add(column.ColumnName, JToken.FromObject(reader.GetValue(column.ColumnOrdinal)));
                    break;
                default:
                    throw new ConversionFailedStewardException(
                        $"Failed to parse query results for Column {column.ColumnName} of type {column.DataType}.");
            }
        }
    }
}
