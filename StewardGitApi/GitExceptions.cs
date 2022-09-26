namespace StewardGitApi
{
    internal class VssCredentialsException : Exception
    {
        public VssCredentialsException(string message) : base(message)
        {
        }

        public VssCredentialsException(string message, Exception inner) : base(message, inner)
        {
        }
    }

    internal class NoItemFoundException : Exception
    {
    }

    internal class NoRepositoryFoundException : Exception
    {
        public NoRepositoryFoundException(string message) : base(message)
        {
        }
    }

    internal class ProjectNotFoundException : Exception
    {
        public ProjectNotFoundException(string message) : base(message)
        {
        }
    }
}
