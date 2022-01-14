using System;
using System.Data;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Kusto)
#pragma warning disable CS1591 // XML Comments (POCO mapped from Kusto)

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a car class.
    /// </summary>
    public sealed class CarClass
    {
        public long Id { get; set; }

        public string DisplayName { get; set; }

        /// <summary>
        ///     Makes a query to get car classes.
        /// </summary>
        public static string MakeQuery()
        {
            return $"FH5_CarClasses | project Id, DisplayName";
        }

        /// <summary>
        ///     Parses query results into a notification history object.
        /// </summary>
        public static CarClass FromQueryResult(IDataReader reader)
        {
            return new CarClass
            {
                Id = reader.Get<long>(nameof(Id)),
                DisplayName = reader.Get<string>(nameof(DisplayName)),
            };
        }
    }
}
