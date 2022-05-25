namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error when converting data.
    /// </summary>
    public sealed class ConversionFailedAppInsightsException : AppInsightsException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedAppInsightsException"/> class.
        /// </summary>
        public ConversionFailedAppInsightsException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedAppInsightsException"/> class.
        /// </summary>
        public ConversionFailedAppInsightsException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedAppInsightsException"/> class.
        /// </summary>
        public ConversionFailedAppInsightsException(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
