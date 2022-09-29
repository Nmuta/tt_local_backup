namespace StewardGitApi
{
    /// <summary>
    ///     Represents a credential error.
    /// </summary>
    public class VssCredentialException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="VssCredentialException"/> class.
        /// </summary>
        public VssCredentialException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="VssCredentialException"/> class.
        /// </summary>
        public VssCredentialException(string message, Exception inner)
            : base(message, inner)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="VssCredentialException"/> class.
        /// </summary>
        public VssCredentialException()
        {
        }
    }
}
