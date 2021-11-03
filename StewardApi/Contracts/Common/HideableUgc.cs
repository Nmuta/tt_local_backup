using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO)
#pragma warning disable CS1591 // XML Comments (POCO)
#pragma warning disable SA1516 // Blank Lines (POCO)

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Models hide-able UGC from Sunrise and Woodstock.
    /// </summary>
    public class HideableUgc
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid UgcId { get; set; }
        public string Sharecode { get; set; }
        public string PreviewUrl { get; set; }
        public DateTime? SubmissionUtc { get; set; }
        public DateTime? HiddenUtc { get; set; }
    }
}
