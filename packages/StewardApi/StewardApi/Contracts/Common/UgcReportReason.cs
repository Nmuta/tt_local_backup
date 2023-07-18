using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Ugc report reason.
    /// </summary>
    public sealed class UgcReportReason
    {
        /// <summary>
        ///     Id of the report reason from pegasus.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        ///     English description of the report reason.
        /// </summary>
        public string Description { get; set; }
    }
}
