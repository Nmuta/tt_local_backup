using System;
using System.Data;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped from Kusto)
#pragma warning disable CS1591 // XML Comments (POCO mapped from Kusto)

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a save rollback.
    /// </summary>
    public sealed class SaveRollbackHistory
    {
        public DateTime EventTimeUtc { get; set; }

        // A ResultCode of 1 is success, all other codes are likely to be failures of varying kinds
        public long ResultCode { get; set; }

        /// <summary>
        ///     Makes a query for save rollback that this model can read.
        /// </summary>
        public static string MakeQuery(ulong xuid)
        {
            // Query params: xuid, afterDate
            // 9/28/2018 is FH4 release date
            return $"get_sunrise_profile_backup_save_loaded({xuid}, '9/28/2018')";
        }

        /// <summary>
        ///     Parses query results into a save rollback object.
        /// </summary>
        public static SaveRollbackHistory FromQueryResult(IDataReader reader)
        {
            return new SaveRollbackHistory
            {
                EventTimeUtc = reader.Get<DateTime>("Time"),
                ResultCode = reader.Get<long>("ResultCode"),
            };
        }
    }
}
