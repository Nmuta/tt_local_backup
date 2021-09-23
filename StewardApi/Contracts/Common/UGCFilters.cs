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
        public UGCFilters(ulong xuid, string shareCode)
        {
            this.Xuid = xuid;
            this.ShareCode = shareCode;
        }

        /// <summary>
        ///     Gets or sets the xuid filter.
        /// </summary>
        public ulong Xuid { get; set; } = ulong.MaxValue;

        /// <summary>
        ///     Gets or sets the share code filter.
        /// </summary>
        public string ShareCode { get; set; } = string.Empty;
    }
}
