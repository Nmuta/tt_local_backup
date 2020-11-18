using System;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Represents a Forza client exception.
    /// </summary>
    public sealed class ForzaClientException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ForzaClientException"/> class.
        /// </summary>
        /// <param name="resultCode">The result code.</param>
        /// <param name="errorCode">The error code.</param>
        /// <param name="responseBody">The response body.</param>
        public ForzaClientException(int resultCode, int errorCode, string responseBody)
            : base($"ResultCode: {resultCode} ErrorCode: {errorCode} ResponseBody {responseBody}")
        {
            this.ResultCode = resultCode;
            this.ErrorCode = errorCode;
            this.ResponseBody = responseBody;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForzaClientException"/> class.
        /// </summary>
        public ForzaClientException()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForzaClientException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public ForzaClientException(string message)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            throw new NotImplementedException();
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForzaClientException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public ForzaClientException(string message, Exception innerException)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));
            innerException.ShouldNotBeNull(nameof(innerException));

            throw new NotImplementedException();
        }

        /// <summary>
        ///     Gets the result code.
        /// </summary>
        public int ResultCode { get; }

        /// <summary>
        ///     Gets the error code.
        /// </summary>
        public int ErrorCode { get; }

        /// <summary>
        ///     Gets or sets the response body.
        /// </summary>
        public string ResponseBody { get; set; }
    }
}
