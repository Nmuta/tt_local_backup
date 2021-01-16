using System.Collections.Generic;

namespace Turn10.LiveOps.StewardTest.Utilities.TestingClient
{
    /// <summary>
    ///     Represents a response body and selected headers.
    /// </summary>
    /// <typeparam name="T">The type of the response.</typeparam>
    public sealed class ResponseWithHeaders<T>
    {
        /// <summary>
        ///     Gets or sets the response body.
        /// </summary>
        public T ResponseBody { get; set; }

        /// <summary>
        ///     Gets or sets the headers.
        /// </summary>
        public IDictionary<string, string> Headers { get; set; }
    }
}
