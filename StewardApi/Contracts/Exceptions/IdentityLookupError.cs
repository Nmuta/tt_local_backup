using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     Represents an error in identity lookup.
    /// </summary>`
    public sealed class IdentityLookupError
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="IdentityLookupError"/> class.
        /// </summary>
        public IdentityLookupError()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="IdentityLookupError"/> class.
        /// </summary>
        public IdentityLookupError(StewardErrorCode code, string message)
        {
            code.ShouldNotBeNull(nameof(code));
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            this.Code = code;
            this.Message = message;
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
    }
}
