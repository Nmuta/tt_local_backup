using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Exposes properties for logging Steward action.
    /// </summary>
    public sealed class ActionData
    {
        /// <summary>
        ///     Gets or sets the action.
        /// </summary>
        public StewardAction Action { get; set; }

        /// <summary>
        ///     Gets or sets the Subject.
        /// </summary>
        public StewardSubject Subject { get; set; }

        /// <summary>
        ///     Gets or sets the request path.
        /// </summary>
        public string RequestPath { get; set; }

        /// <summary>
        ///     Gets or sets the recipients.
        /// </summary>
        public List<string> RecipientList { get; set; }

        /// <summary>
        ///     Gets or sets the recipient type.
        /// </summary>
        public RecipientType RecipientType { get; set; }

        /// <summary>
        ///     Gets or sets the HTTP method.
        /// </summary>
        public string HttpMethod { get; set; }

        /// <summary>
        ///     Gets or sets the route data.
        /// </summary>
        public Dictionary<string, string> RouteData { get; set; }

        /// <summary>
        ///     Gets or sets the requester object ID.
        /// </summary>
        public string RequesterObjectId { get; set; }

        /// <summary>
        ///     Gets or sets the requester role.
        /// </summary>
        public string RequesterRole { get; set; }

        /// <summary>
        ///     Gets or sets the requester API key name.
        /// </summary>
        public string RequesterApiKeyName { get; set; }

        /// <summary>
        ///     Gets the request batch ID.
        /// </summary>
        public Guid RequestBatchId { get; } = Guid.NewGuid();

        /// <summary>
        ///     Gets or sets the title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        ///     Gets or sets the endpoint.
        /// </summary>
        public string Endpoint { get; set; }

        /// <summary>
        ///     Gets or sets the meta data.
        /// </summary>
        /// <remarks> Stringified request body.</remarks>
        public string Metadata { get; set; }
    }
}
