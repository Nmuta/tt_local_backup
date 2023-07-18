namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error with an user group management action (add/remove).
    /// </summary>
    public sealed class UserGroupManagementAppInsightsException : AppInsightsException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupManagementAppInsightsException"/> class.
        /// </summary>
        public UserGroupManagementAppInsightsException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupManagementAppInsightsException"/> class.
        /// </summary>
        public UserGroupManagementAppInsightsException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupManagementAppInsightsException"/> class.
        /// </summary>
        public UserGroupManagementAppInsightsException(string message, System.Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
