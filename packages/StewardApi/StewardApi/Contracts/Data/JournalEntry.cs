using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a journal entry.
    /// </summary>
    public sealed class JournalEntry
    {
        /// <summary>
        ///     Gets or sets the username.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        ///     Gets or sets the timestamp in UTC.
        /// </summary>
        public DateTime TimestampUtc { get; set; }

        /// <summary>
        ///     Gets or sets the route.
        /// </summary>
        public string Route { get; set; }

        /// <summary>
        ///     Gets or sets the method.
        /// </summary>
        public string Method { get; set; }

        /// <summary>
        ///     Gets or sets the query parameters.
        /// </summary>
        public IList<Tuple<string, string>> QueryParameters { get; set; }

        /// <summary>
        ///     Gets or sets the session ID.
        /// </summary>
        public Guid SessionId { get; set; }

        /// <summary>
        ///     Gets or sets the request ID.
        /// </summary>
        public Guid RequestId { get; set; }

        /// <summary>
        ///     Gets or sets the HTTP response code.
        /// </summary>
        public int HttpResponseCode { get; set; }

        /// <summary>
        ///     Gets or sets the body.
        /// </summary>
        public string Body { get; set; }
    }
}
