namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error with uploading a log.
    /// </summary>
    public sealed class LoggingFailedAppInsightsException : AppInsightsException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="LoggingFailedAppInsightsException"/> class.
        /// </summary>
        public LoggingFailedAppInsightsException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="LoggingFailedAppInsightsException"/> class.
        /// </summary>
        public LoggingFailedAppInsightsException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="LoggingFailedAppInsightsException"/> class.
        /// </summary>
        public LoggingFailedAppInsightsException(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
