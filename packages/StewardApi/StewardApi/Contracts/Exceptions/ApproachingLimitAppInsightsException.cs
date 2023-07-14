using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error with size of retrieved response.
    /// </summary>
    public sealed class ApproachingLimitAppInsightsException : AppInsightsException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ApproachingLimitAppInsightsException"/> class.
        /// </summary>
        public ApproachingLimitAppInsightsException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApproachingLimitAppInsightsException"/> class.
        /// </summary>
        public ApproachingLimitAppInsightsException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApproachingLimitAppInsightsException"/> class.
        /// </summary>
        public ApproachingLimitAppInsightsException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
