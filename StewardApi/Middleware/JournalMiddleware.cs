using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Filters;

namespace Turn10.LiveOps.StewardApi.Middleware
{
    /// <summary>
    ///     Represents a journal middleware.
    /// </summary>
    public sealed class JournalMiddleware
    {
        private readonly IKustoStreamingLogger kustoStreamingLogger;
        private readonly RequestDelegate requestDelegate;
        private readonly string kustoDatabase;

        /// <summary>
        ///     Initializes a new instance of the <see cref="JournalMiddleware"/> class.
        /// </summary>
        /// <param name="requestDelegate">The request delegate.</param>
        /// <param name="kustoStreamingLogger">The Kusto streaming logger.</param>
        /// <param name="configuration">The configuration.</param>
        public JournalMiddleware(RequestDelegate requestDelegate, IKustoStreamingLogger kustoStreamingLogger, IConfiguration configuration)
        {
            requestDelegate.ShouldNotBeNull(nameof(requestDelegate));
            kustoStreamingLogger.ShouldNotBeNull(nameof(kustoStreamingLogger));
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.GetSection("KustoLoggerConfiguration").ShouldNotBeNull("KustoLoggerConfiguration");

            var kustoLoggerConfiguration = new KustoConfiguration();
            configuration.Bind("KustoLoggerConfiguration", kustoLoggerConfiguration);

            this.requestDelegate = requestDelegate;
            this.kustoStreamingLogger = kustoStreamingLogger;
            this.kustoDatabase = kustoLoggerConfiguration.Database;
        }

        /// <summary>
        ///     Invoke the middleware.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        public async Task Invoke(HttpContext context)
        {
            context.ShouldNotBeNull(nameof(context));

            // Make sure the request body is buffered, read it out and then reset it so the next caller can read it as needed.
            context.Request.EnableBuffering();
            var requestBody = new StreamReader(context.Request.Body).ReadToEnd();
            context.Request.Body.Position = 0;

            // The rest of this code is to handle manually upgrading the response body to
            // a buffered stream so we can read it more that once as well.
            // hold onto the original response body
            var originalResponseBody = context.Response.Body;

            try
            {
                using (var newResponseBody = new MemoryStream())
                {
                    context.Response.Body = newResponseBody;

                    await this.requestDelegate(context).ConfigureAwait(false);

                    newResponseBody.Position = 0;
                    var responseBody = new StreamReader(newResponseBody).ReadToEnd();

                    newResponseBody.Position = 0;
                    await newResponseBody.CopyToAsync(originalResponseBody).ConfigureAwait(false);

                    await this.HandleRequest(context, requestBody, responseBody).ConfigureAwait(false);
                }
            }
            finally
            {
                context.Response.Body = originalResponseBody;
            }
        }

        /// <summary>
        ///     Handles a request.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="requestBody">The request body.</param>
        /// <param name="responseBody">The response body.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        public async Task HandleRequest(HttpContext context, string requestBody, string responseBody)
        {
            context.ShouldNotBeNull(nameof(context));

            var preferredUsername = context.User.Claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value;

            var requestJournalEntry = PopulateJournalEntry(context, preferredUsername, requestBody);
            var responseJournalEntry = PopulateJournalEntry(context, preferredUsername, responseBody);

            var kustoColumnMappings = responseJournalEntry.ToJsonColumnMappings();
            var journalEntries = new List<JournalEntry> { requestJournalEntry, responseJournalEntry };
            var tableName = typeof(JournalEntry).Name;

            await this.kustoStreamingLogger.IngestFromStreamAsync(journalEntries, this.kustoDatabase, tableName, kustoColumnMappings).ConfigureAwait(false);
        }

        private static Guid GetHeader(string header, IHeaderDictionary headerDictionary)
        {
            return headerDictionary.ContainsKey(header) ? new Guid(headerDictionary[header]) : Guid.Empty;
        }

        private static JournalEntry PopulateJournalEntry(HttpContext context, string preferredUsername, string body)
        {
            return new JournalEntry
            {
                HttpResponseCode = context.Response.StatusCode,
                Username = preferredUsername,
                Route = context.Request.Path,
                Body = body,
                RequestId = Guid.NewGuid(),
                QueryParameters = context.Request.Query.Select(q => new Tuple<string, string>(q.Key, q.Value)).ToList(),
                TimestampUtc = DateTime.UtcNow,
                SessionId = GetHeader(SessionIdHeaderParameterOperationFilter.SessionIdHeaderName, context.Request.Headers),
                Method = context.Request.Method
            };
        }
    }
}
