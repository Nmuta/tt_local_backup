using Microsoft.AspNetCore.Authorization;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    /// Used to propigate failures from policy checks to HTTP response code.
    /// </summary>
    public class AttributeFailureReason : AuthorizationFailureReason
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AttributeFailureReason"/> class.
        /// </summary>
        /// <param name="handler">handler.</param>
        /// <param name="message">message.</param>
        /// <param name="statusCode">statusCode.</param>
        public AttributeFailureReason(int statusCode, IAuthorizationHandler handler, string message)
            : base(handler, message)
        {
            this.StatusCode = statusCode;
        }

        /// <summary>
        /// Gets StatusCode.
        /// </summary>
        public int StatusCode { get; private set; }
    }
}