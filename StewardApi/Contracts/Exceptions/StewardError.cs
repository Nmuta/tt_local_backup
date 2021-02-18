﻿using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error in Steward.
    /// </summary>
    public sealed class StewardError
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardError"/> class.
        /// </summary>
        public StewardError()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardError"/> class.
        /// </summary>
        /// <param name="code">The code.</param>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public StewardError(StewardErrorCode code, string message, Exception innerException)
        {
            code.ShouldNotBeNull(nameof(code));
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            this.Code = code;
            this.Message = message;
            this.InnerException = innerException;
        }

        /// <summary>
        ///     Gets or sets the code.
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public StewardErrorCode Code { get; set; }

        /// <summary>
        ///     Gets or sets the message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        ///     Gets or sets the inner exception.
        /// </summary>
        public Exception InnerException { get; set; }
    }
}
