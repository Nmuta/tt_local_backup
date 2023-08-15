using System;
using System.Data;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Kusto)
#pragma warning disable CA1304 // Invariant Culture when using String.toLower()

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
        /// <remarks>
        ///     Despite having another title in the name, actual_platform_mapping_sunrise
        ///     is just a table that maps device type integer values to human-readable strings.
        /// </remarks>
        public static string MakeQuery(ulong xuid, TitleCodeName title, CreditUpdateColumn column, SortDirection sortDirection)
        {
            string unorderedQuery = string.Empty;

            switch (title)
            {
                case TitleCodeName.Woodstock:
                    unorderedQuery = $"Game_CreditsUpdate" +
                                    $"| where UserId == {xuid} | project Timestamp, CreditsAfter, CreditAmount, SceneName, ActualPlatform, TotalXPEarned " +
                                    $"| lookup kind=leftouter (database('T10Analytics').actual_platform_mapping_sunrise | project tolong(ActualPlatform), MappedPlatform=PlatformDescription) on ActualPlatform " +
                                    $"| project Timestamp, CreditsAfter, CreditAmount, SceneName, DeviceType = MappedPlatform , TotalXp = TotalXPEarned";
                    break;

                case TitleCodeName.Sunrise:
                    unorderedQuery = $"Game_CreditsUpdate " +
                                     $"|  where UserId == '{xuid}' " +
                                     $"| extend MappedPlatform=case(ActualPlatform==\"1\", \"Durango\", ActualPlatform==\"2\", \"Edmonton\", ActualPlatform==\"3\", \"Scorpio\", ActualPlatform==\"4\"," +
                                     $" \"x64\", ActualPlatform==\"5\", \"UWP\", ActualPlatform==\"6\", \"Xbox Series S\", ActualPlatform==\"7\", \"Xbox Series X\", ActualPlatform==\"8\", \"Steam\", \"Unknown\") " +
                                     $"| project Timestamp = Time, CreditsAfter = tolong(CreditsAfter), CreditAmount = tolong(CreditAmount), SceneName, DeviceType = MappedPlatform, TotalXp = TotalXPEarned";
                    break;

                default:
                    throw new ConversionFailedStewardException($"No credit update query available. (Title: {title})");
            }

            var ordering = $" | order by {column} {sortDirection.ToString().ToLowerInvariant()}";

            return unorderedQuery + ordering;
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
                DeviceType = reader.Get<string>("DeviceType"),
                TotalXp = reader.Get<long>("TotalXp"),
            };
        }
    }
}
