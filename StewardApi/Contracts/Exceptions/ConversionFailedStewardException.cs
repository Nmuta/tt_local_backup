﻿using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a conversion failed Steward exception.
    /// </summary>
    public sealed class ConversionFailedStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedStewardException"/> class.
        /// </summary>
        public ConversionFailedStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedStewardException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public ConversionFailedStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ConversionFailedStewardException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public ConversionFailedStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}