namespace StewardGitApi
{
    internal class VssCredentialException : Exception
    {
        public VssCredentialException(string message) : base(message)
        {
        }

        public VssCredentialException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}
