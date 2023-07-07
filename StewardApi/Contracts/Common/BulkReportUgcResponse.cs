using System;
using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    #pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
    #pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)
    #pragma warning disable SA1516 // Blank Lines (POCO mapped directly from LSP)
    public class BulkReportUgcResponse
    {
        /// <summary>
        ///     Gets or sets the UgcId.
        /// </summary>
        public Guid UgcId { get; set; }

        /// <summary>
        ///     Gets or sets the UGC report error.
        /// </summary>
        public StewardError? Error { get; set; }
    }
}
