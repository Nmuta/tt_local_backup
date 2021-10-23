using System.Data;
using Newtonsoft.Json.Linq;
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
            if (reader.IsDBNull(column.Ordinal))
            {
                jObj.Add(column.ColumnName, null);
                return;
            }

            switch (column.DataType)
            {
                case "System.String":
                    jObj.Add(column.ColumnName, reader.GetString(column.Ordinal));
                    break;
                case "System.Guid":
                    jObj.Add(column.ColumnName, reader.GetGuid(column.Ordinal));
                    break;
                case "System.Char":
                    jObj.Add(column.ColumnName, reader.GetChar(column.Ordinal));
                    break;
                case "System.Int16":
                    jObj.Add(column.ColumnName, reader.GetInt16(column.Ordinal));
                    break;
                case "System.Int32":
                    jObj.Add(column.ColumnName, reader.GetInt32(column.Ordinal));
                    break;
                case "System.Int64":
                    jObj.Add(column.ColumnName, reader.GetInt64(column.Ordinal));
                    break;
                case "System.Float":
                    jObj.Add(column.ColumnName, reader.GetFloat(column.Ordinal));
                    break;
                case "System.Decimal":
                    jObj.Add(column.ColumnName, reader.GetDecimal(column.Ordinal));
                    break;
                case "System.Double":
                    jObj.Add(column.ColumnName, reader.GetDouble(column.Ordinal));
                    break;
                case "System.DateTime":
                    jObj.Add(column.ColumnName, reader.GetDateTime(column.Ordinal));
                    break;
                case "System.Boolean":
                    jObj.Add(column.ColumnName, reader.GetBoolean(column.Ordinal));
                    break;
                case "System.Byte":
                    jObj.Add(column.ColumnName, reader.GetByte(column.Ordinal));
                    break;
                case "System.Object":
                    jObj.Add(column.ColumnName, JToken.FromObject(reader.GetValue(column.Ordinal)));
                    break;
                default:
                    throw new ConversionFailedStewardException(
                        $"Failed to parse query results for Column {column.ColumnName} of type {column.DataType}.");
            }
        }
    }
}
