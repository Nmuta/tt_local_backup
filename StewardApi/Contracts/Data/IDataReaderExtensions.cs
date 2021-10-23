using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using static System.FormattableString;

#nullable enable
namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     <para>Extensions for Data Reader that are helpful for translating Kusto data.</para>
    ///     <para>Supports all fields as nullable.</para>
    ///     <para>The primary entry point for this set of extensions is <see cref="Get{T}(IDataReader, string)"/>.</para>
    /// </summary>
    public static class IDataReaderExtensions
    {
        /// <summary>Gets the index of a named column.</summary>
        public static int GetColumnIndex(this IDataReader reader, string columnName)
        {
            try
            {
                return reader.GetOrdinal(columnName);
            }
            catch (ArgumentException ex) when (ex.Message.Contains("ColumnNotInTheTable", StringComparison.OrdinalIgnoreCase))
            {
                var columns = reader.GetColumnsErrorString();
                throw new InvalidOperationException(Invariant($"Column '{columnName}' not found.\n\nActual columns:\n{columns}"));
            }
        }

        /// <summary>Gets the full list of named columns.</summary>
        public static Dictionary<string, Type> GetColumns(this IDataReader reader)
        {
            var result = new Dictionary<string, Type>();
            for (var i = 0; i < reader.FieldCount; i++)
            {
                var fieldName = reader.GetName(i);
                var fieldType = reader.GetFieldType(i);
                result.Add(fieldName, fieldType);
            }

            return result;
        }

        /// <summary>Produces a CSV of named columns.</summary>
        public static string GetColumnsErrorString(this IDataReader reader)
        {
            var columns = reader.GetColumns();
            var columnNames = columns.Select(kvp => Invariant($"{kvp.Key}({kvp.Value.Name})"));
            return string.Join(",\n", columnNames);
        }

        /// <summary>Gets a boolean value from a named column.</summary>
        public static bool? GetBoolean(this IDataReader reader, string columnName)
        {
            var columnIndex = reader.GetColumnIndex(columnName);
            var fieldType = reader.GetFieldType(columnIndex);
            if (reader.IsDBNull(columnIndex))
            {
                return null;
            }

            switch (fieldType)
            {
                case Type sbyteType when sbyteType == typeof(sbyte):
                    return ((sbyte)reader.GetValue(columnIndex)) != 0;
                case Type booleanType when booleanType == typeof(bool):
                    return reader.GetBoolean(columnIndex);
                default:
                    throw new InvalidOperationException(Invariant($"Cannot convert to boolean from found type '{fieldType.Name}'. Add a new entry to this switch case."));
            }
        }

        /// <summary>Gets a DateTime value from a named column.</summary>
        public static DateTime? GetDateTime(this IDataReader reader, string columnName)
        {
            var columnIndex = reader.GetColumnIndex(columnName);
            var fieldType = reader.GetFieldType(columnIndex);
            if (reader.IsDBNull(columnIndex))
            {
                return null;
            }

            return reader.GetDateTime(columnIndex);
        }

        /// <summary>Gets a string value from a named column.</summary>
        public static string? GetString(this IDataReader reader, string columnName)
        {
            var columnIndex = reader.GetColumnIndex(columnName);
            var fieldType = reader.GetFieldType(columnIndex);
            if (reader.IsDBNull(columnIndex))
            {
                return null;
            }

            return reader.GetString(columnIndex);
        }

        /// <summary>Gets a raw (object) value from a named column.</summary>
        public static object? GetValue(this IDataReader reader, string columnName)
        {
            var columnIndex = reader.GetColumnIndex(columnName);
            var fieldType = reader.GetFieldType(columnIndex);
            if (reader.IsDBNull(columnIndex))
            {
                return null;
            }

            return reader.GetValue(columnIndex);
        }

        /// <summary>True if the column is null. You should not need to use this, as these extensions handle this by default.</summary>
        public static bool IsNull(this IDataReader reader, string columnName)
        {
            var columnIndex = reader.GetColumnIndex(columnName);
            var fieldType = reader.GetFieldType(columnIndex);
            return reader.IsDBNull(columnIndex);
        }

        #pragma warning disable CA1502 // High cyclomatic complexity (Seems necessary to make the type system happy; restructuring will not make it easier to read, anyway)
        /// <summary>Gets a specific number type from a named column.</summary>
        /// <typeparam name="T">The number type to try to read from the field.</typeparam>
        public static T? GetNumber<T>(this IDataReader reader, string columnName)
            where T : struct
        {
            var columnIndex = reader.GetColumnIndex(columnName);
            var fieldType = reader.GetFieldType(columnIndex);

            if (reader.IsDBNull(columnIndex))
            {
                return null;
            }

            if (fieldType == typeof(string))
            {
                var columnValue = reader.GetString(columnIndex);
                if (string.IsNullOrWhiteSpace(columnValue))
                {
                    return null;
                }

                try
                {
                    switch (typeof(T))
                    {
                        case Type byteType when byteType == typeof(byte):
                            return (T)(object)byte.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type shortType when shortType == typeof(short):
                            return (T)(object)short.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type ushortType when ushortType == typeof(ushort):
                            return (T)(object)ushort.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type intType when intType == typeof(int):
                            return (T)(object)int.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type uintType when uintType == typeof(uint):
                            return (T)(object)uint.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type longType when longType == typeof(long):
                            return (T)(object)long.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type ulongType when ulongType == typeof(ulong):
                            return (T)(object)ulong.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type floatType when floatType == typeof(float):
                            return (T)(object)float.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type doubleType when doubleType == typeof(double):
                            return (T)(object)double.Parse(columnValue, CultureInfo.InvariantCulture);
                        case Type decimalType when decimalType == typeof(decimal):
                            return (T)(object)decimal.Parse(columnValue, CultureInfo.InvariantCulture);
                        default:
                            throw new InvalidOperationException("Cannot convert to given number type. Add a new entry to this switch case.");
                    }
                }
                catch (Exception ex)
                {
                    throw new ArgumentException(Invariant($"Unable to convert value of '{columnName}' ('{columnValue}') to {typeof(T).Name}"), ex);
                }
            }

            switch (typeof(T))
            {
                case Type byteType when byteType == typeof(byte):
                    return (T)(object)reader.GetByte(columnIndex);
                case Type shortType when shortType == typeof(short):
                    return (T)(object)reader.GetInt16(columnIndex);
                case Type ushortType when ushortType == typeof(ushort):
                    return (T)(object)(uint)reader.GetInt16(columnIndex);
                case Type intType when intType == typeof(int):
                    return (T)(object)reader.GetInt32(columnIndex);
                case Type uintType when uintType == typeof(uint):
                    return (T)(object)(uint)reader.GetInt32(columnIndex);
                case Type longType when longType == typeof(long):
                    return (T)(object)reader.GetInt64(columnIndex);
                case Type ulongType when ulongType == typeof(ulong):
                    return (T)(object)(ulong)reader.GetInt64(columnIndex);
                case Type floatType when floatType == typeof(float):
                    return (T)(object)reader.GetFloat(columnIndex);
                case Type doubleType when doubleType == typeof(double):
                    return (T)(object)reader.GetInt64(columnIndex);
                case Type decimalType when decimalType == typeof(decimal):
                    return (T)(object)reader.GetDecimal(columnIndex);
                default:
                    throw new InvalidOperationException("Cannot convert to given number type. Add a new entry to this switch case.");
            }
        }
        #pragma warning restore CA1502

        /// <summary>Gets a specific type from a named column.</summary>
        /// <typeparam name="T">The type to try to read from the field.</typeparam>
        public static T? Get<T>(this IDataReader reader, string columnName)
        {
            if (reader.IsNull(columnName))
            {
                return default(T?);
            }

            object? result = null;
            switch (typeof(T))
            {
                case Type byteType when byteType == typeof(byte):
                    result = reader.GetNumber<byte>(columnName);
                    break;
                case Type shortType when shortType == typeof(short):
                    result = reader.GetNumber<short>(columnName);
                    break;
                case Type ushortType when ushortType == typeof(ushort):
                    result = reader.GetNumber<ushort>(columnName);
                    break;
                case Type intType when intType == typeof(int):
                    result = reader.GetNumber<int>(columnName);
                    break;
                case Type uintType when uintType == typeof(uint):
                    result = reader.GetNumber<uint>(columnName);
                    break;
                case Type longType when longType == typeof(long):
                    result = reader.GetNumber<long>(columnName);
                    break;
                case Type ulongType when ulongType == typeof(ulong):
                    result = reader.GetNumber<ulong>(columnName);
                    break;
                case Type floatType when floatType == typeof(float):
                    result = reader.GetNumber<float>(columnName);
                    break;
                case Type doubleType when doubleType == typeof(double):
                    result = reader.GetNumber<double>(columnName);
                    break;
                case Type decimalType when decimalType == typeof(decimal):
                    result = reader.GetNumber<decimal>(columnName);
                    break;
                case Type stringType when stringType == typeof(string):
                    result = reader.GetString(columnName);
                    break;
                case Type dateTimeType when dateTimeType == typeof(DateTime):
                    result = reader.GetDateTime(columnName);
                    break;
                case Type booleanType when booleanType == typeof(bool):
                    result = reader.GetBoolean(columnName);
                    break;
                default:
                    throw new InvalidOperationException("Cannot convert to given type. Add a new entry to this switch case.");
            }

            if (result == null)
            {
                // necessary because casting directly to T? from null fails
                return default(T?);
            }

            return (T?)result;
        }
    }
}
#nullable restore