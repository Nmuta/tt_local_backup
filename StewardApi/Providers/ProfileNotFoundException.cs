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
        {
            this.Message = null;
            this.InnerException = null;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ProfileNotFoundException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public ProfileNotFoundException(string message)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            this.Message = message;
            this.InnerException = null;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ProfileNotFoundException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public ProfileNotFoundException(string message, Exception innerException)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));
            innerException.ShouldNotBeNull(nameof(innerException));

            this.Message = message;
            this.InnerException = innerException;
        }

        /// <summary>
        ///     Gets the message.
        /// </summary>
        public new string Message { get; }

        /// <summary>
        ///     Gets the inner exception.
        /// </summary>
        public new Exception InnerException { get; }
    }
}
