using System;
using Forza.LiveOps.FH4.Generated;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents player ugc search filters.
    /// </summary>
    public sealed class UGCFilters
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="UGCFilters"/> class.
        /// </summary>
        public UGCFilters()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="UGCFilters"/> class.
        /// </summary>
        public UGCFilters(ulong xuid, string shareCode, int carId, int makeId, string keyword, UGCAccessLevel accessLevel, UGCOrderBy sort)
        {
            this.Xuid = xuid;
            this.ShareCode = shareCode;
            this.CarId = carId;
            this.MakeId = makeId;
            this.ManualKeyword = keyword;
            this.AccessLevel = accessLevel;
            this.OrderBy = sort;
        }

        /// <summary>
        ///     Gets or sets the xuid filter.
        /// </summary>
        public ulong Xuid { get; set; } = ulong.MaxValue;

        /// <summary>
        ///     Gets or sets the make id filter.
        /// </summary>
        public int MakeId { get; set; }

        /// <summary>
        ///     Gets or sets the car id filter.
        /// </summary>
        public int CarId { get; set; }

        /// <summary>
        ///     Gets or sets the second keyword filter.
        /// </summary>
        public string ManualKeyword { get; set; } = null;

        /// <summary>
        ///     Gets or sets the share code filter.
        /// </summary>
        public string ShareCode { get; set; } = string.Empty;

        /// <summary>
        ///     Gets or sets the access level filter.
        /// </summary>
        public UGCAccessLevel AccessLevel { get; set; }

        /// <summary>
        ///     Gets or sets the order by filter.
        /// </summary>
        public UGCOrderBy OrderBy { get; set; }
    }
}
