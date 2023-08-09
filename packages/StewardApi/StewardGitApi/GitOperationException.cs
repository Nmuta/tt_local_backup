namespace StewardGitApi
{
    /// <summary>
    ///     Represents a git operation exception.
    /// </summary>
    public class GitOperationException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="GitOperationException"/> class.
        /// </summary>
        public GitOperationException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="GitOperationException"/> class.
        /// </summary>
        public GitOperationException(string message, Exception inner)
            : base(message, inner)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="GitOperationException"/> class.
        /// </summary>
        public GitOperationException()
        {
        }
    }
}
