using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error when retrieving data from Pegasus.
    /// </summary>
    public sealed class PegasusAppInsightsException : AppInsightsException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="PegasusAppInsightsException"/> class.
        /// </summary>
        public PegasusAppInsightsException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="PegasusAppInsightsException"/> class.
        /// </summary>
        public PegasusAppInsightsException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="PegasusAppInsightsException"/> class.
        /// </summary>
        public PegasusAppInsightsException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
