using System;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Represents a profile not found exception.
    /// </summary>
    public sealed class ProfileNotFoundException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ProfileNotFoundException"/> class.
        /// </summary>
        public ProfileNotFoundException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ProfileNotFoundException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public ProfileNotFoundException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ProfileNotFoundException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public ProfileNotFoundException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
