using System.Data;
using System.Security.Claims;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for use in Steward.
    /// </summary>
    public static class StewardExtensionMethods
    {
        /// <summary>
        ///     Generates a user model from claims principal.
        /// </summary>
        /// <param name="user">The user to generate the model for.</param>
        /// <returns>
        ///     The <see cref="StewardUser"/>.
        /// </returns>
        public static StewardUser UserModel(this ClaimsPrincipal user)
        {
            var stewardUser = new StewardUser
            {
                Name = user.HasClaimType("name")
                       ? user.GetClaimValue("name")
                       : null,
                Role = user.HasClaimType(ClaimTypes.Role)
                       ? user.GetClaimValue(ClaimTypes.Role)
                       : "none",
                EmailAddress = user.HasClaimType(ClaimTypes.Email)
                               ? user.GetClaimValue(ClaimTypes.Email)
                               : null,
                Id = user.HasClaimType("http://schemas.microsoft.com/identity/claims/objectidentifier")
                     ? user.GetClaimValue("http://schemas.microsoft.com/identity/claims/objectidentifier")
                     : null
            };

            return stewardUser;
        }

        /// <summary>
        ///    Puts a column's value into a JObject.
        /// </summary>
        /// <param name="column">The column we're reading.</param>
        /// <param name="jObj">The item which represents a row.</param>
        /// <param name="reader">Data reader from which values are extracted.</param>
        public static void ReadValue(this KustoColumn column, JObject jObj, IDataReader reader)
        {
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
