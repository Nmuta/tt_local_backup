using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.Pegasus
{

    /// <summary>
    ///     Represents a locale supported for localization in Pegasus.
    /// </summary>
    public class SupportedLocale
    {
        /// <summary>
        ///     Gets or sets a value indicating whether the locale is enabled.
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary>
        ///     Gets or sets the locale.
        /// </summary>
        public string Locale { get; set; }
    }
}
