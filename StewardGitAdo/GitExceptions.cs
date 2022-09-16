using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StewardGitClient
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
