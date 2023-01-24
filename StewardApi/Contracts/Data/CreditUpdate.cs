using System;
using System.Data;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Kusto)
#pragma warning disable CS1591 // XML Comments (POCO mapped from Kusto)

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a Credit Update.
    /// </summary>
    public sealed class CreditUpdate
    {
        /// <summary>
        ///     Gets or sets the event time stamp in UTC.
        /// </summary>
        public DateTime EventTimestampUtc { get; set; }

        /// <summary>
        ///     Gets or sets the device type.
        /// </summary>
        public string DeviceType { get; set; }

        /// <summary>
        ///     Gets or sets the credits after.
        /// </summary>
        public long CreditsAfter { get; set; }

        /// <summary>
        ///     Gets or sets the credit amount.
        /// </summary>
        public long CreditAmount { get; set; }

        /// <summary>
        ///     Gets or sets the scene name.
        /// </summary>
        public string SceneName { get; set; }

        /// <summary>
        ///     Gets or sets the total XP.
        /// </summary>
        public long TotalXp { get; set; }

        /// <summary>
        ///     Makes a query for credit updates that this model can read.
        /// </summary>
        public static string MakeQuery(ulong xuid)
        {
            return $"Game_CreditsUpdate |  where UserId == {xuid} | project Timestamp, CreditsAfter, CreditAmount, SceneName, ActualPlatform, TotalXPEarned | lookup kind=leftouter (database('T10Analytics').actual_platform_mapping_sunrise | project tolong(ActualPlatform), MappedPlatform=PlatformDescription) on ActualPlatform | project Timestamp, CreditsAfter, CreditAmount, SceneName, MappedPlatform, TotalXPEarned | order by Timestamp asc";
        }

        /// <summary>
        ///     Parses query results into a credit update object.
        /// </summary>
        public static CreditUpdate FromQueryResult(IDataReader reader)
        {
            return new CreditUpdate
            {
                EventTimestampUtc = reader.Get<DateTime>("Timestamp"),
                CreditsAfter = reader.Get<long>("CreditsAfter"),
                CreditAmount = reader.Get<long>("CreditAmount"),
                SceneName = reader.Get<string>("SceneName"),
                DeviceType = reader.Get<string>("MappedPlatform"),
                TotalXp = reader.Get<long>("TotalXPEarned")
            };
        }
    }
}
