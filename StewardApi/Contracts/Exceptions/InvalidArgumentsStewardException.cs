﻿using System;
using System.Net;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents a 'friendly' invalid argument exception.
    /// </summary>
    public sealed class InvalidArgumentsStewardException : StewardBaseException
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardException"/> class.
        /// </summary>
        public InvalidArgumentsStewardException()
            : base()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardException"/> class.
        /// </summary>
        public InvalidArgumentsStewardException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="InvalidArgumentsStewardException"/> class.
        /// </summary>
        public InvalidArgumentsStewardException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        ///     Gets the status code.
        /// </summary>
        public override HttpStatusCode StatusCode => HttpStatusCode.BadRequest;

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public override StewardErrorCode ErrorCode => StewardErrorCode.RequiredParameterMissing;
    }
}