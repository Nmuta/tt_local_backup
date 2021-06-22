using System;
using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Errors
{
    /// <summary>
    ///     Represents a generic Steward error.
    /// </summary>
    public class StewardError
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
        public StewardError(string message)
        {
            this.Message = message;
            this.InnerException = null;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardError"/> class.
        /// </summary>
        public StewardError(string message, object innerException)
        {
            this.Message = message;
            this.InnerException = innerException;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardError"/> class.
        /// </summary>
        public StewardError(StewardErrorCode code, string message)
        {
            this.Code = code;
            this.Message = message;
            this.InnerException = null;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardError"/> class.
        /// </summary>
        public StewardError(StewardErrorCode code,  string message, object innerException)
        {
            this.Code = code;
            this.Message = message;
            this.InnerException = innerException;
        }

        /// <summary>
        ///     Gets the code.
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public virtual StewardErrorCode Code { get; }

        /// <summary>
        ///     Gets or sets the message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        ///     Gets or sets the inner exception.
        /// </summary>
        public object InnerException { get; set; }
    }
}
