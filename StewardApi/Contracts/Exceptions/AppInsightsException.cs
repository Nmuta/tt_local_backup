using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an Application Insight exception.
    /// </summary>
    public class AppInsightsException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="AppInsightsException"/> class.
        /// </summary>
        public AppInsightsException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="AppInsightsException"/> class.
        /// </summary>
        public AppInsightsException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="AppInsightsException"/> class.
        /// </summary>
        public AppInsightsException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
